
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { to, message, messageId } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Sending WhatsApp message via WATI:', { to, messageId })

    // WATI API integration
    const watiApiToken = Deno.env.get('WATI_API_TOKEN')
    const watiApiUrl = Deno.env.get('WATI_API_URL')
    
    if (!watiApiToken || !watiApiUrl) {
      console.error('WATI credentials not configured')
      
      // Update message as failed
      await supabase
        .from('whatsapp_messages')
        .update({ status: 'failed' })
        .eq('id', messageId)

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'WATI credentials not configured. Please add WATI_API_TOKEN and WATI_API_URL to your secrets.' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Clean phone number (remove any spaces, dashes, etc.)
    const cleanPhoneNumber = to.replace(/[\s\-\(\)]/g, '')
    
    // Ensure phone number has country code
    let formattedPhone = cleanPhoneNumber
    if (!cleanPhoneNumber.startsWith('+')) {
      // If it's an Indian number without country code, add +91
      if (cleanPhoneNumber.length === 10 && cleanPhoneNumber.match(/^[6-9]/)) {
        formattedPhone = `+91${cleanPhoneNumber}`
      } else {
        formattedPhone = `+${cleanPhoneNumber}`
      }
    }

    console.log('Formatted phone number:', formattedPhone)

    // Send message via WATI API
    const watiResponse = await fetch(`${watiApiUrl}/api/v1/sendSessionMessage/${formattedPhone}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${watiApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageText: message
      }),
    })

    const watiResult = await watiResponse.json()
    console.log('WATI API response:', watiResult)

    if (watiResponse.ok && watiResult.result) {
      // Update message status as sent
      const { error: updateError } = await supabase
        .from('whatsapp_messages')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', messageId)

      if (updateError) {
        console.error('Error updating message status:', updateError)
        throw updateError
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          messageId: watiResult.id || `wati_${Date.now()}`,
          status: 'sent',
          watiResponse: watiResult
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      console.error('WATI API error:', watiResult)
      
      // Update message as failed
      await supabase
        .from('whatsapp_messages')
        .update({ status: 'failed' })
        .eq('id', messageId)

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: watiResult.info || 'Failed to send message via WATI',
          watiError: watiResult
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
  } catch (error) {
    console.error('Error in send-whatsapp function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
