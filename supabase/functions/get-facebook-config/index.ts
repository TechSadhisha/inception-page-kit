import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const facebookAppId = Deno.env.get('FACEBOOK_APP_ID');
    
    if (!facebookAppId) {
      throw new Error('Facebook App ID not configured');
    }

    return new Response(
      JSON.stringify({ 
        appId: facebookAppId,
        redirectUri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/facebook-auth-redirect`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error getting Facebook config:', error);
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});