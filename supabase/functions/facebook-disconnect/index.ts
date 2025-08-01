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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    )

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Set the auth token
    const token = authHeader.substring(7);
    supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Deactivate all Facebook integrations for the user
    const { error: updateError } = await supabase
      .from('facebook_integrations')
      .update({ is_active: false })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error deactivating Facebook integrations:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to disconnect Facebook integration' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Delete all Facebook-related campaign and lead data
    const deleteOperations = [
      supabase.from('meta_campaigns').delete().eq('user_id', user.id),
      supabase.from('meta_leads').delete().eq('user_id', user.id),
      supabase.from('campaign_settings').delete().eq('user_id', user.id)
    ];

    const deleteResults = await Promise.allSettled(deleteOperations);
    
    // Log any delete errors but don't fail the operation
    deleteResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        const tables = ['meta_campaigns', 'meta_leads', 'campaign_settings'];
        console.error(`Error deleting from ${tables[index]}:`, result.reason);
      }
    });

    console.log('Facebook integration disconnected for user:', user.id);

    return new Response(
      JSON.stringify({ success: true, message: 'Facebook integration disconnected successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in Facebook disconnect:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});