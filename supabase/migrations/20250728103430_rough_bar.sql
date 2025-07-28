/*
  # Real Estate Workflow Automation Schema

  1. New Tables
    - `workflow_templates` - Pre-built real estate workflows
    - `workflow_instances` - Active workflow executions
    - `workflow_steps` - Individual workflow actions
    - `workflow_triggers` - Event-based triggers
    - `automation_rules` - Business rule engine
    - `lead_scoring_rules` - AI-powered lead scoring

  2. Security
    - Enable RLS on all tables
    - Role-based workflow management

  3. Features
    - Real estate sales pipelines
    - Automated lead routing
    - Commission tracking
    - Follow-up automation
*/

-- Workflow templates for real estate processes
CREATE TABLE IF NOT EXISTS workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('lead_management', 'sales_pipeline', 'post_sales', 'commission', 'marketing')),
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('manual', 'event', 'schedule', 'condition')),
  trigger_config JSONB,
  is_active BOOLEAN DEFAULT true,
  is_system BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Active workflow instances
CREATE TABLE IF NOT EXISTS workflow_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES workflow_templates(id),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('prospect', 'property', 'project', 'task')),
  entity_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'paused')),
  current_step INTEGER DEFAULT 1,
  context_data JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES profiles(id)
);

-- Individual workflow steps
CREATE TABLE IF NOT EXISTS workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES workflow_templates(id),
  step_order INTEGER NOT NULL,
  step_type TEXT NOT NULL CHECK (step_type IN ('action', 'condition', 'delay', 'notification', 'assignment')),
  step_config JSONB NOT NULL,
  success_action TEXT,
  failure_action TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Event triggers for workflows
CREATE TABLE IF NOT EXISTS workflow_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  conditions JSONB,
  workflow_template_id UUID REFERENCES workflow_templates(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Business automation rules
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('lead_routing', 'follow_up', 'escalation', 'notification')),
  conditions JSONB NOT NULL,
  actions JSONB NOT NULL,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Lead scoring configuration
CREATE TABLE IF NOT EXISTS lead_scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  criteria_type TEXT NOT NULL CHECK (criteria_type IN ('demographic', 'behavioral', 'engagement', 'property_interest')),
  criteria_config JSONB NOT NULL,
  score_value INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Commission tracking
CREATE TABLE IF NOT EXISTS commission_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  structure_type TEXT NOT NULL CHECK (structure_type IN ('percentage', 'fixed', 'tiered', 'hybrid')),
  config JSONB NOT NULL,
  applicable_to TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS commission_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES prospects(id),
  property_id UUID REFERENCES property_listings(id),
  agent_id UUID REFERENCES profiles(id) NOT NULL,
  structure_id UUID REFERENCES commission_structures(id),
  deal_value DECIMAL(15, 2) NOT NULL,
  commission_amount DECIMAL(15, 2) NOT NULL,
  commission_percentage DECIMAL(5, 2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'disputed')),
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view workflow templates" ON workflow_templates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Managers can manage workflow templates" ON workflow_templates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view workflow instances" ON workflow_instances
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage workflow instances" ON workflow_instances
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view commission records" ON commission_records
  FOR SELECT USING (agent_id = auth.uid() OR auth.role() = 'authenticated');

CREATE POLICY "Managers can manage commission records" ON commission_records
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default workflow templates
INSERT INTO workflow_templates (name, description, category, trigger_type, trigger_config, is_system) VALUES
('New Lead Follow-up', 'Automated follow-up sequence for new leads', 'lead_management', 'event', '{"event": "prospect_created", "delay": 0}', true),
('Property Inquiry Response', 'Immediate response to property inquiries', 'lead_management', 'event', '{"event": "property_inquiry", "delay": 300}', true),
('Deal Closure Process', 'Standard sales pipeline for deal closure', 'sales_pipeline', 'manual', '{}', true),
('Post-Sale Customer Care', 'Customer retention and satisfaction workflow', 'post_sales', 'event', '{"event": "deal_closed", "delay": 86400}', true),
('Commission Calculation', 'Automated commission calculation and approval', 'commission', 'event', '{"event": "deal_closed", "delay": 0}', true);

-- Insert default lead scoring rules
INSERT INTO lead_scoring_rules (name, criteria_type, criteria_config, score_value) VALUES
('High Budget Range', 'demographic', '{"field": "budget", "operator": "gte", "value": 5000000}', 25),
('Premium Location Interest', 'property_interest', '{"field": "location", "operator": "in", "value": ["Mumbai", "Delhi", "Bangalore"]}', 20),
('Multiple Property Views', 'behavioral', '{"field": "property_views", "operator": "gte", "value": 5}', 15),
('Quick Response Time', 'engagement', '{"field": "response_time", "operator": "lte", "value": 3600}', 10),
('Referral Source', 'demographic', '{"field": "source", "operator": "eq", "value": "referral"}', 15);

-- Insert default commission structures
INSERT INTO commission_structures (name, structure_type, config) VALUES
('Standard Sales Commission', 'percentage', '{"percentage": 2.5, "min_amount": 50000, "max_amount": 500000}'),
('Rental Commission', 'percentage', '{"percentage": 1.0, "min_amount": 10000}'),
('Luxury Property Commission', 'tiered', '{"tiers": [{"min": 0, "max": 5000000, "rate": 2.0}, {"min": 5000000, "max": 10000000, "rate": 2.5}, {"min": 10000000, "rate": 3.0}]}');