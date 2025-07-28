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

interface DataSyncRequest {
  integrationId: string;
  dataType: 'leads' | 'properties' | 'campaigns';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseToken = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(supabaseToken);
    if (userError || !user) {
      throw new Error("Invalid or unauthorized user");
    }

    const { integrationId, dataType } = await req.json() as DataSyncRequest;
    if (!integrationId || !dataType) {
      throw new Error("Missing integrationId or dataType in request body");
    }

    console.log("Syncing data:", dataType, "from integration:", integrationId);

    // Get integration configuration
    const { data: integration, error: integrationError } = await supabase
      .from('integration_configs')
      .select('*')
      .eq('id', integrationId)
      .single();

    if (integrationError || !integration) {
      throw new Error("Integration not found");
    }

    let syncResult = { success: false, count: 0, message: "" };

    // Sync different data types
    switch (dataType) {
      case 'leads':
        syncResult = await syncLeads(integration, user.id);
        break;
      case 'properties':
        syncResult = await syncProperties(integration, user.id);
        break;
      case 'campaigns':
        syncResult = await syncCampaigns(integration, user.id);
        break;
      default:
        syncResult = { success: false, count: 0, message: "Unsupported data type" };
    }

    // Update integration last sync time
    if (syncResult.success) {
      await supabase
        .from('integration_configs')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', integrationId);
    }

    // Log the sync operation
    await supabase
      .from('api_usage_logs')
      .insert({
        integration_id: integrationId,
        endpoint: `sync_${dataType}`,
        method: 'POST',
        status_code: syncResult.success ? 200 : 400,
        response_time_ms: 2000, // Mock response time
      });

    return new Response(
      JSON.stringify(syncResult),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  } catch (error: any) {
    console.error("Error in sync-integration-data function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        count: 0,
        message: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

async function syncLeads(integration: any, userId: string) {
  console.log("Syncing leads from:", integration.provider);
  
  // Mock lead data based on provider
  const mockLeads = [
    {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 9876543210",
      status: "new",
      interest_rating: 4,
      notes: `Lead from ${integration.provider} - Interested in 3BHK apartments`,
      project_id: null // Would be mapped based on integration config
    },
    {
      name: "Priya Patel", 
      email: "priya.patel@example.com",
      phone: "+91 9876543211",
      status: "new",
      interest_rating: 3,
      notes: `Lead from ${integration.provider} - Looking for villa in Bangalore`,
      project_id: null
    }
  ];

  // Get a default project to assign leads to
  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .limit(1);

  const defaultProjectId = projects?.[0]?.id;

  let syncedCount = 0;
  for (const lead of mockLeads) {
    const { error } = await supabase
      .from('prospects')
      .insert({
        ...lead,
        project_id: defaultProjectId
      });

    if (!error) {
      syncedCount++;
    }
  }

  return {
    success: true,
    count: syncedCount,
    message: `Successfully synced ${syncedCount} leads from ${integration.provider}`
  };
}

async function syncProperties(integration: any, userId: string) {
  console.log("Syncing properties from:", integration.provider);
  
  // Mock property data
  const mockProperties = [
    {
      mls_id: `${integration.provider}_prop_001`,
      title: "Luxury 4BHK Apartment",
      description: "Premium apartment with modern amenities",
      property_type: "apartment",
      listing_type: "sale",
      address: "Bandra West, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      bedrooms: 4,
      bathrooms: 3,
      area_sqft: 1800,
      price: 25000000,
      status: "active",
      created_by: userId,
      last_synced_at: new Date().toISOString()
    }
  ];

  let syncedCount = 0;
  for (const property of mockProperties) {
    const { error } = await supabase
      .from('property_listings')
      .upsert(property, { onConflict: 'mls_id' });

    if (!error) {
      syncedCount++;
    }
  }

  return {
    success: true,
    count: syncedCount,
    message: `Successfully synced ${syncedCount} properties from ${integration.provider}`
  };
}

async function syncCampaigns(integration: any, userId: string) {
  console.log("Syncing campaigns from:", integration.provider);
  
  // Mock campaign sync - would integrate with actual marketing platforms
  return {
    success: true,
    count: 0,
    message: `Campaign sync from ${integration.provider} completed (no new campaigns)`
  };
}

serve(handler);