import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FacebookTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface FacebookUserResponse {
  id: string
  name: string
  email: string
}

interface FacebookAdAccount {
  id: string
  name: string
  account_status: number
}

interface FacebookPage {
  id: string
  name: string
  access_token: string
  category: string
}

interface FacebookAdAccountsResponse {
  data: FacebookAdAccount[]
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state'); // Contains user_id
    const error = url.searchParams.get('error');
    const errorMessage = url.searchParams.get('error_message');

    console.log('Facebook OAuth callback received:', { code: !!code, state, error, errorMessage });

    // Check for Facebook OAuth errors first
    if (error || errorMessage) {
      const fbError = error || errorMessage;
      console.error('Facebook OAuth error:', fbError);
      return new Response(`
        <html>
          <body>
            <script>
              window.opener?.postMessage({ type: 'FACEBOOK_AUTH_ERROR', error: 'Facebook OAuth failed: ${fbError}' }, '*');
              window.close();
            </script>
          </body>
        </html>
      `, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      });
    }

    if (!code || !state) {
      throw new Error('Missing authorization code or state parameter');
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v20.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: Deno.env.get('FACEBOOK_APP_ID') ?? '',
        client_secret: Deno.env.get('FACEBOOK_APP_SECRET') ?? '',
        redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/facebook-auth-redirect`,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      throw new Error('Failed to exchange code for access token');
    }

    const tokenData: FacebookTokenResponse = await tokenResponse.json();
    console.log('Token exchange successful. Token data:', {
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      expires_in_type: typeof tokenData.expires_in
    });

    // Get user information
    const userResponse = await fetch(`https://graph.facebook.com/v20.0/me?fields=id,name,email&access_token=${tokenData.access_token}`);
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user information');
    }

    const userData: FacebookUserResponse = await userResponse.json();
    console.log('User data fetched:', { id: userData.id, name: userData.name });

    // Get ad accounts and pages
    const [adAccountsResponse, pagesResponse] = await Promise.all([
      fetch(`https://graph.facebook.com/v20.0/me/adaccounts?fields=id,name,account_status&access_token=${tokenData.access_token}`),
      fetch(`https://graph.facebook.com/v20.0/me/accounts?fields=id,name,access_token,category&access_token=${tokenData.access_token}`)
    ])
    
    let adAccounts: FacebookAdAccount[] = [];
    let pages: FacebookPage[] = [];
    
    if (adAccountsResponse.ok) {
      const adAccountsData: FacebookAdAccountsResponse = await adAccountsResponse.json();
      adAccounts = adAccountsData.data || [];
      console.log('Ad accounts fetched:', adAccounts.length);
    }

    if (pagesResponse.ok) {
      const pagesData = await pagesResponse.json();
      pages = pagesData.data || [];
      console.log('Pages fetched:', pages.length);
    }

    // Calculate token expiration with validation
    const expiresInSeconds = Number(tokenData.expires_in);
    let tokenExpiresAt: Date | null = null;

    if (!expiresInSeconds || isNaN(expiresInSeconds) || expiresInSeconds <= 0) {
      console.warn('Invalid expires_in value received from Facebook:', tokenData.expires_in);
      // Use a fallback of 60 days for long-lived tokens (Facebook's typical behavior)
      tokenExpiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
      console.log('Using fallback expiration (60 days)');
    } else {
      tokenExpiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    }

    console.log('Token expires at:', tokenExpiresAt);

    // Prepare upsert payload
    const upsertPayload = {
      user_id: state,
      facebook_user_id: userData.id,
      access_token: tokenData.access_token,
      token_expires_at: tokenExpiresAt ? tokenExpiresAt.toISOString() : null,
      ad_account_id: adAccounts.length > 0 ? adAccounts[0].id : null,
      ad_account_name: adAccounts.length > 0 ? adAccounts[0].name : null,
      permissions: ['ads_management', 'ads_read', 'business_management'],
      is_active: true,
    };

    console.log('Upsert payload:', upsertPayload);

    // Store the integration in database
    const { error: dbError } = await supabase
      .from('facebook_integrations')
      .upsert(upsertPayload, {
        onConflict: 'user_id,facebook_user_id'
      });

    if (dbError) {
      console.error('Supabase upsert error details:', dbError);
      throw new Error(`Failed to save integration: ${dbError.message}`);
    }

    console.log('Integration saved successfully');

    // Return success page that notifies the parent window
    return new Response(`
      <html>
        <body>
          <script>
            window.opener?.postMessage({ 
              type: 'FACEBOOK_AUTH_SUCCESS', 
              data: {
                user: ${JSON.stringify(userData)},
                adAccounts: ${JSON.stringify(adAccounts)},
                pages: ${JSON.stringify(pages)}
              }
            }, '*');
            window.close();
          </script>
        </body>
      </html>
    `, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    });

  } catch (error) {
    console.error('Error in Facebook OAuth callback:', error);
    
    return new Response(`
      <html>
        <body>
          <script>
            window.opener?.postMessage({ 
              type: 'FACEBOOK_AUTH_ERROR', 
              error: '${error instanceof Error ? error.message : 'Unknown error'}' 
            }, '*');
            window.close();
          </script>
        </body>
      </html>
    `, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    });
  }
});