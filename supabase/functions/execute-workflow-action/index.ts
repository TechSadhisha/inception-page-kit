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

interface WorkflowActionRequest {
  instanceId: string;
  action: string;
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

    const { instanceId, action } = await req.json() as WorkflowActionRequest;
    if (!instanceId || !action) {
      throw new Error("Missing instanceId or action in request body");
    }

    console.log("Executing workflow action:", action, "for instance:", instanceId);

    // Get workflow instance
    const { data: instance, error: instanceError } = await supabase
      .from('workflow_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (instanceError || !instance) {
      throw new Error("Workflow instance not found");
    }

    let updateData: any = {};

    switch (action) {
      case 'pause':
        updateData = { status: 'paused' };
        break;
      case 'resume':
        updateData = { status: 'running' };
        break;
      case 'stop':
        updateData = { status: 'completed', completed_at: new Date().toISOString() };
        break;
      case 'restart':
        updateData = { 
          status: 'running', 
          current_step: 1, 
          started_at: new Date().toISOString(),
          completed_at: null 
        };
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Update workflow instance
    const { error: updateError } = await supabase
      .from('workflow_instances')
      .update(updateData)
      .eq('id', instanceId);

    if (updateError) {
      throw updateError;
    }

    // Execute specific workflow logic based on action
    if (action === 'resume' || action === 'restart') {
      // In a real implementation, this would trigger the next workflow step
      console.log("Triggering workflow execution for instance:", instanceId);
      
      // Mock workflow step execution
      if (instance.entity_type === 'prospect') {
        // Example: Send follow-up email, assign to agent, etc.
        console.log("Executing prospect workflow step");
      } else if (instance.entity_type === 'property') {
        // Example: Update listing status, notify interested prospects, etc.
        console.log("Executing property workflow step");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Workflow action '${action}' executed successfully`
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  } catch (error: any) {
    console.error("Error in execute-workflow-action function:", error);
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