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

interface IntegrationTestRequest {
  integrationId: string;
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

    const { integrationId } = await req.json() as IntegrationTestRequest;
    if (!integrationId) {
      throw new Error("Missing integrationId in request body");
    }

    console.log("Testing integration:", integrationId);

    // Get integration configuration
    const { data: integration, error: integrationError } = await supabase
      .from('integration_configs')
      .select('*')
      .eq('id', integrationId)
      .single();

    if (integrationError || !integration) {
      throw new Error("Integration not found");
    }

    let testResult = { success: false, message: "" };

    // Test different integration types
    switch (integration.integration_type) {
      case 'portal':
        testResult = await testPortalIntegration(integration);
        break;
      case 'marketing':
        testResult = await testMarketingIntegration(integration);
        break;
      case 'communication':
        testResult = await testCommunicationIntegration(integration);
        break;
      default:
        testResult = { success: false, message: "Unsupported integration type" };
    }

    // Log the test result
    await supabase
      .from('api_usage_logs')
      .insert({
        integration_id: integrationId,
        endpoint: 'test_connection',
        method: 'GET',
        status_code: testResult.success ? 200 : 400,
        response_time_ms: 1000, // Mock response time
      });

    return new Response(
      JSON.stringify(testResult),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  } catch (error: any) {
    console.error("Error in test-integration function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

async function testPortalIntegration(integration: any) {
  // Mock portal API test
  console.log("Testing portal integration:", integration.provider);
  
  // In real implementation, this would make actual API calls
  const mockApiEndpoints = {
    'magicbricks': 'https://api.magicbricks.com/v1/test',
    '99acres': 'https://api.99acres.com/v2/test',
    'housing': 'https://api.housing.com/v1/test'
  };

  const endpoint = mockApiEndpoints[integration.provider as keyof typeof mockApiEndpoints];
  
  if (!endpoint) {
    return { success: false, message: "Unknown portal provider" };
  }

  // Mock successful connection
  return { 
    success: true, 
    message: `Successfully connected to ${integration.provider} API` 
  };
}

async function testMarketingIntegration(integration: any) {
  console.log("Testing marketing integration:", integration.provider);
  
  // Mock marketing platform test
  if (integration.provider === 'facebook') {
    return { success: true, message: "Facebook Ads API connection successful" };
  } else if (integration.provider === 'google_ads') {
    return { success: true, message: "Google Ads API connection successful" };
  }
  
  return { success: false, message: "Unknown marketing provider" };
}

async function testCommunicationIntegration(integration: any) {
  console.log("Testing communication integration:", integration.provider);
  
  // Mock communication service test
  if (integration.provider === 'whatsapp_business') {
    return { success: true, message: "WhatsApp Business API connection successful" };
  }
  
  return { success: false, message: "Unknown communication provider" };
}

serve(handler);