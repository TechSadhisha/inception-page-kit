import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

interface GmailSyncRequest {
  accessToken: string;
  pageToken?: string;
  maxResults?: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate Authorization header expected by Supabase auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }
    const supabaseToken = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(supabaseToken);
    if (userError || !user) {
      throw new Error("Invalid or unauthorized user");
    }

    // Parse JSON body from client
    const { accessToken, pageToken, maxResults = 50 } = await req.json() as GmailSyncRequest;
    if (!accessToken) {
      throw new Error("Missing Gmail accessToken in request body");
    }

    // Build Gmail API URL for listing messages
    let url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`;
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }

    console.log("Fetching Gmail messages from:", url);
    console.log("Using access token prefix:", accessToken.substring(0, 10));

    const gmailResponse = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!gmailResponse.ok) {
      const errorText = await gmailResponse.text();
      console.error("Gmail API error response:", errorText);
      throw new Error(`Gmail API error: ${gmailResponse.status} ${gmailResponse.statusText}`);
    }

    const gmailData = await gmailResponse.json();

    console.log(`Gmail messages received: ${gmailData.messages?.length ?? 0}`);
    // Log the whole response when debugging:
    // console.log(JSON.stringify(gmailData, null, 2));

    const messages = gmailData.messages || [];

    for (const message of messages) {
      const detailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`;
      const messageDetailResponse = await fetch(detailUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!messageDetailResponse.ok) {
        console.error(`Failed to fetch message detail ${message.id}:`, await messageDetailResponse.text());
        continue; // skip errors on individual messages
      }

      const messageDetail = await messageDetailResponse.json();

      // Extract headers safely
      const headers = messageDetail.payload?.headers || [];
      const subject = headers.find((h: any) => h.name === "Subject")?.value || "";
      const from = headers.find((h: any) => h.name === "From")?.value || "";
      const to = headers.find((h: any) => h.name === "To")?.value || "";
      const date = headers.find((h: any) => h.name === "Date")?.value || "";

      // Decode body content safely
      let bodyText = "";
      let bodyHtml = "";

      try {
        if (messageDetail.payload?.parts) {
          for (const part of messageDetail.payload.parts) {
            if (part.mimeType === "text/plain" && part.body?.data) {
              bodyText = atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
            } else if (part.mimeType === "text/html" && part.body?.data) {
              bodyHtml = atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
            }
          }
        } else if (messageDetail.payload?.body?.data) {
          if (messageDetail.payload.mimeType === "text/plain") {
            bodyText = atob(messageDetail.payload.body.data.replace(/-/g, "+").replace(/_/g, "/"));
          } else if (messageDetail.payload.mimeType === "text/html") {
            bodyHtml = atob(messageDetail.payload.body.data.replace(/-/g, "+").replace(/_/g, "/"));
          }
        }
      } catch (decodeError) {
        console.warn("Error decoding email body for message", message.id, decodeError);
      }

      // Upsert into Supabase
      const { data, error: upsertError } = await supabase.from("emails").upsert({
        user_id: user.id,
        gmail_message_id: messageDetail.id,
        thread_id: messageDetail.threadId,
        subject,
        sender: from,
        recipient: to,
        body_text: bodyText,
        body_html: bodyHtml,
        received_date: date ? new Date(date).toISOString() : null,
        is_read: !messageDetail.labelIds?.includes("UNREAD"),
        labels: messageDetail.labelIds || [],
      }, {
        onConflict: "gmail_message_id",
      });

      if (upsertError) {
        console.error(`Failed to upsert message ${message.id}:`, upsertError);
      } else {
        console.log(`Upserted message ${message.id} successfully.`);
      }
    }

    // Update sync status record
    const { error: syncError } = await supabase.from("gmail_sync_status").upsert({
      user_id: user.id,
      last_sync_at: new Date().toISOString(),
      sync_token: gmailData.nextPageToken,
      is_enabled: true,
    }, {
      onConflict: "user_id",
    });

    if (syncError) {
      console.error("Failed to update gmail_sync_status:", syncError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        messagesProcessed: messages.length,
        nextPageToken: gmailData.nextPageToken,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  } catch (error: any) {
    console.error("Error in gmail-sync function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

serve(handler);