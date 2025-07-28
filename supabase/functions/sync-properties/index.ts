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

interface PropertySyncRequest {
  sourceId: string;
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

    const { sourceId } = await req.json() as PropertySyncRequest;
    if (!sourceId) {
      throw new Error("Missing sourceId in request body");
    }

    console.log("Syncing properties from source:", sourceId);

    // Get source configuration
    const { data: source, error: sourceError } = await supabase
      .from('listing_sources')
      .select('*')
      .eq('id', sourceId)
      .single();

    if (sourceError || !source) {
      throw new Error("Invalid source ID");
    }

    // Mock property data for demo - in real implementation, this would call external APIs
    const mockProperties = [
      {
        mls_id: `${sourceId}_001`,
        source_id: sourceId,
        title: "3BHK Apartment in Bandra West",
        description: "Spacious 3BHK apartment with sea view in prime Bandra location",
        property_type: "apartment",
        listing_type: "sale",
        address: "Carter Road, Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
        bedrooms: 3,
        bathrooms: 2,
        area_sqft: 1200,
        price: 12500000,
        price_per_sqft: 10417,
        status: "active",
        possession_status: "ready",
        created_by: user.id,
        last_synced_at: new Date().toISOString()
      },
      {
        mls_id: `${sourceId}_002`,
        source_id: sourceId,
        title: "2BHK Villa in Whitefield",
        description: "Modern villa with garden in IT hub Whitefield",
        property_type: "villa",
        listing_type: "rent",
        address: "ITPL Road, Whitefield",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560066",
        bedrooms: 2,
        bathrooms: 2,
        area_sqft: 1500,
        price: 45000,
        status: "active",
        possession_status: "ready",
        created_by: user.id,
        last_synced_at: new Date().toISOString()
      }
    ];

    // Insert/update properties
    let syncedCount = 0;
    for (const property of mockProperties) {
      const { error: upsertError } = await supabase
        .from('property_listings')
        .upsert(property, {
          onConflict: 'mls_id'
        });

      if (!upsertError) {
        syncedCount++;
      } else {
        console.error("Error upserting property:", upsertError);
      }
    }

    // Update source last sync time
    await supabase
      .from('listing_sources')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', sourceId);

    // Log sync operation
    await supabase
      .from('listing_sync_logs')
      .insert({
        source_id: sourceId,
        operation_type: 'import',
        status: 'success',
        records_processed: mockProperties.length,
        records_success: syncedCount,
        records_failed: mockProperties.length - syncedCount,
        completed_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({
        success: true,
        count: syncedCount,
        message: `Successfully synced ${syncedCount} properties`
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  } catch (error: any) {
    console.error("Error in sync-properties function:", error);
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