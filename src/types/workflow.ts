export interface WorkflowTemplate {
  id: string
  name: string
  description?: string
  category: 'lead_management' | 'sales_pipeline' | 'post_sales' | 'commission' | 'marketing'
  trigger_type: 'manual' | 'event' | 'schedule' | 'condition'
  trigger_config: Record<string, any>
  is_active: boolean
  is_system: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface WorkflowInstance {
  id: string
  template_id: string
  entity_type: 'prospect' | 'property' | 'project' | 'task'
  entity_id: string
  status: 'running' | 'completed' | 'failed' | 'paused'
  current_step: number
  context_data: Record<string, any>
  started_at: string
  completed_at?: string
  created_by?: string
}

export interface WorkflowStep {
  id: string
  template_id: string
  step_order: number
  step_type: 'action' | 'condition' | 'delay' | 'notification' | 'assignment'
  step_config: Record<string, any>
  success_action?: string
  failure_action?: string
  created_at: string
}

export interface AutomationRule {
  id: string
  name: string
  description?: string
  rule_type: 'lead_routing' | 'follow_up' | 'escalation' | 'notification'
  conditions: Record<string, any>
  actions: Record<string, any>
  priority: number
  is_active: boolean
  created_by?: string
  created_at: string
}

export interface LeadScoringRule {
  id: string
  name: string
  criteria_type: 'demographic' | 'behavioral' | 'engagement' | 'property_interest'
  criteria_config: Record<string, any>
  score_value: number
  is_active: boolean
  created_at: string
}

export interface CommissionStructure {
  id: string
  name: string
  structure_type: 'percentage' | 'fixed' | 'tiered' | 'hybrid'
  config: Record<string, any>
  applicable_to: string[]
  is_active: boolean
  created_by?: string
  created_at: string
}

export interface CommissionRecord {
  id: string
  prospect_id?: string
  property_id?: string
  agent_id: string
  structure_id?: string
  deal_value: number
  commission_amount: number
  commission_percentage?: number
  status: 'pending' | 'approved' | 'paid' | 'disputed'
  payment_date?: string
  notes?: string
  created_at: string
}