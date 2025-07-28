import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Edit, Trash2, Zap, Users, Bell, TrendingUp } from 'lucide-react'
import { AutomationRule } from '@/types/workflow'

interface AutomationRuleCardProps {
  rule: AutomationRule
  onToggle: (isActive: boolean) => void
}

const ruleTypeIcons = {
  lead_routing: Users,
  follow_up: Bell,
  escalation: TrendingUp,
  notification: Bell,
}

const ruleTypeColors = {
  lead_routing: 'bg-blue-100 text-blue-800',
  follow_up: 'bg-green-100 text-green-800',
  escalation: 'bg-red-100 text-red-800',
  notification: 'bg-purple-100 text-purple-800',
}

export const AutomationRuleCard = ({ rule, onToggle }: AutomationRuleCardProps) => {
  const IconComponent = ruleTypeIcons[rule.rule_type]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {rule.name}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={ruleTypeColors[rule.rule_type]}>
              {rule.rule_type.replace('_', ' ')}
            </Badge>
            <Badge variant="outline">
              Priority: {rule.priority}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={rule.is_active}
            onCheckedChange={onToggle}
          />
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {rule.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {rule.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Conditions: </span>
            <span className="text-muted-foreground">
              {Object.keys(rule.conditions).length} condition(s) defined
            </span>
          </div>
          
          <div className="text-sm">
            <span className="font-medium">Actions: </span>
            <span className="text-muted-foreground">
              {Object.keys(rule.actions).length} action(s) configured
            </span>
          </div>
        </div>

        {/* Sample condition/action preview */}
        <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
          <div className="font-medium">Rule Logic:</div>
          <div className="text-muted-foreground">
            IF {rule.rule_type === 'lead_routing' ? 'new lead created' :
                rule.rule_type === 'follow_up' ? 'no response for 24h' :
                rule.rule_type === 'escalation' ? 'deal stuck for 7 days' :
                'notification trigger'}
          </div>
          <div className="text-muted-foreground">
            THEN {rule.rule_type === 'lead_routing' ? 'assign to best agent' :
                  rule.rule_type === 'follow_up' ? 'send follow-up email' :
                  rule.rule_type === 'escalation' ? 'notify manager' :
                  'send notification'}
          </div>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Created: {new Date(rule.created_at).toLocaleDateString()}
          <span className="ml-2">• Status: {rule.is_active ? 'Active' : 'Inactive'}</span>
        </div>
      </CardContent>
    </Card>
  )
}