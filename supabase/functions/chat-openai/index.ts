
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request to chat-openai function');
    
    // Get the OpenAI API key from environment
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
      console.error('Available env vars:', Object.keys(Deno.env.toObject()));
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured. Please add your OPENAI_API_KEY in the Supabase Edge Function secrets.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('OpenAI API key found, proceeding with request');

    const { message, context } = await req.json();
    console.log('Request data:', { message: message?.substring(0, 100), context });

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let systemPrompt = 'You are a helpful AI assistant.';
    
    if (context === 'script_management') {
      systemPrompt = `You are an AI assistant specialized in helping with script writing and management. You can help with:
      - Writing and improving scripts for presentations, videos, audio content, and documents
      - Providing creative ideas and suggestions for content
      - Helping with script structure and formatting
      - Offering tips for voice delivery and presentation
      - Suggesting improvements for clarity and engagement
      - Answering questions about scriptwriting best practices
      
      Keep your responses helpful, concise, and focused on script-related topics.`;
    }

    console.log('Making request to OpenAI API...');
    console.log('Using API key starting with:', openAIApiKey.substring(0, 7) + '...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', errorText);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      
      let errorMessage = 'Failed to get response from OpenAI';
      if (response.status === 401) {
        errorMessage = 'Invalid OpenAI API key. Please verify your API key is correct and has sufficient credits.';
      } else if (response.status === 429) {
        errorMessage = 'OpenAI API rate limit exceeded. Please try again later.';
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden. Please check your OpenAI API key permissions.';
      } else {
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response as JSON');
        }
      }
      
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('OpenAI API response received successfully');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response format from OpenAI:', data);
      return new Response(JSON.stringify({ 
        error: 'Invalid response format from OpenAI' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-openai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
