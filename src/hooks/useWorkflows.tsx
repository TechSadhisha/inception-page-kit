import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { WorkflowTemplate, WorkflowInstance, AutomationRule } from '@/types/workflow'
import { useToast } from '@/hooks/use-toast'

export const useWorkflows = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch workflow templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['workflow-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as WorkflowTemplate[]
    },
    enabled: !!user,
  })

  // Fetch active workflow instances
  const { data: instances, isLoading: instancesLoading } = useQuery({
    queryKey: ['workflow-instances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_instances')
        .select(`
          *,
          workflow_templates(name, category)
        `)
        .order('started_at', { ascending: false })

      if (error) throw error
      return data as WorkflowInstance[]
    },
    enabled: !!user,
  })

  // Fetch automation rules
  const { data: automationRules, isLoading: rulesLoading } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('priority', { ascending: false })

      if (error) throw error
      return data as AutomationRule[]
    },
    enabled: !!user,
  })

  // Start workflow instance
  const startWorkflowMutation = useMutation({
    mutationFn: async ({ 
      templateId, 
      entityType, 
      entityId, 
      contextData 
    }: { 
      templateId: string
      entityType: 'prospect' | 'property' | 'project' | 'task'
      entityId: string
      contextData?: Record<string, any>
    }) => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('workflow_instances')
        .insert([{
          template_id: templateId,
          entity_type: entityType,
          entity_id: entityId,
          context_data: contextData || {},
          created_by: user.id
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-instances'] })
      toast({
        title: "Workflow Started",
        description: "Workflow has been initiated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start workflow",
        variant: "destructive",
      })
      console.error('Error starting workflow:', error)
    },
  })

  // Create automation rule
  const createRuleMutation = useMutation({
    mutationFn: async (rule: Omit<AutomationRule, 'id' | 'created_at' | 'created_by'>) => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('automation_rules')
        .insert([{ ...rule, created_by: user.id }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] })
      toast({
        title: "Rule Created",
        description: "Automation rule created successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create automation rule",
        variant: "destructive",
      })
      console.error('Error creating rule:', error)
    },
  })

  // Execute workflow action
  const executeActionMutation = useMutation({
    mutationFn: async ({ 
      instanceId, 
      action 
    }: { 
      instanceId: string
      action: string
    }) => {
      const { data, error } = await supabase.functions.invoke('execute-workflow-action', {
        body: { instanceId, action }
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-instances'] })
      toast({
        title: "Action Executed",
        description: "Workflow action completed successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: "Failed to execute workflow action",
        variant: "destructive",
      })
      console.error('Error executing action:', error)
    },
  })

  const startWorkflow = (
    templateId: string,
    entityType: 'prospect' | 'property' | 'project' | 'task',
    entityId: string,
    contextData?: Record<string, any>
  ) => {
    startWorkflowMutation.mutate({ templateId, entityType, entityId, contextData })
  }

  const createRule = (rule: Omit<AutomationRule, 'id' | 'created_at' | 'created_by'>) => {
    createRuleMutation.mutate(rule)
  }

  const executeAction = (instanceId: string, action: string) => {
    executeActionMutation.mutate({ instanceId, action })
  }

  return {
    templates: templates || [],
    instances: instances || [],
    automationRules: automationRules || [],
    isLoading: templatesLoading || instancesLoading || rulesLoading,
    startWorkflow,
    createRule,
    executeAction,
    isStarting: startWorkflowMutation.isPending,
    isCreatingRule: createRuleMutation.isPending,
    isExecuting: executeActionMutation.isPending,
  }
}