import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, TrendingUp, Users, Activity, Target } from 'lucide-react'

export const LeadScoringConfig = () => {
  const scoringRules = [
    {
      id: '1',
      name: 'High Budget Range',
      category: 'demographic',
      criteria: 'Budget >= ₹50L',
      score: 25,
      isActive: true
    },
    {
      id: '2',
      name: 'Premium Location Interest',
      category: 'property_interest',
      criteria: 'Interested in Mumbai/Delhi/Bangalore',
      score: 20,
      isActive: true
    },
    {
      id: '3',
      name: 'Multiple Property Views',
      category: 'behavioral',
      criteria: 'Viewed 5+ properties',
      score: 15,
      isActive: true
    },
    {
      id: '4',
      name: 'Quick Response Time',
      category: 'engagement',
      criteria: 'Responds within 1 hour',
      score: 10,
      isActive: true
    },
    {
      id: '5',
      name: 'Referral Source',
      category: 'demographic',
      criteria: 'Came through referral',
      score: 15,
      isActive: true
    }
  ]

  const categoryIcons = {
    demographic: Users,
    behavioral: Activity,
    engagement: TrendingUp,
    property_interest: Target,
  }

  const categoryColors = {
    demographic: 'bg-blue-100 text-blue-800',
    behavioral: 'bg-green-100 text-green-800',
    engagement: 'bg-purple-100 text-purple-800',
    property_interest: 'bg-orange-100 text-orange-800',
  }

  const totalPossibleScore = scoringRules.reduce((sum, rule) => sum + rule.score, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI-Powered Lead Scoring</h2>
          <p className="text-muted-foreground">
            Automatically prioritize leads based on behavioral and demographic data
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Scoring Rule
        </Button>
      </div>

      {/* Scoring Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Score Range</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 - {totalPossibleScore}</div>
            <p className="text-xs text-muted-foreground">Maximum possible score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scoringRules.filter(r => r.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Currently scoring leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Lead Threshold</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">70+</div>
            <p className="text-xs text-muted-foreground">High priority leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Current average</p>
          </CardContent>
        </Card>
      </div>

      {/* Scoring Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Scoring Rules Configuration</CardTitle>
          <CardDescription>
            Define criteria and weights for automatic lead scoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scoringRules.map((rule) => {
              const IconComponent = categoryIcons[rule.category as keyof typeof categoryIcons]
              return (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4 flex-1">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{rule.name}</h3>
                        <Badge className={categoryColors[rule.category as keyof typeof categoryColors]}>
                          {rule.category.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rule.criteria}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">+{rule.score}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                    
                    <div className="w-24">
                      <Progress value={(rule.score / totalPossibleScore) * 100} className="h-2" />
                    </div>
                    
                    <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Score Distribution</CardTitle>
          <CardDescription>
            Current distribution of lead scores in your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { range: '80-100', count: 12, label: 'Hot Leads', color: 'bg-red-500' },
              { range: '60-79', count: 28, label: 'Warm Leads', color: 'bg-orange-500' },
              { range: '40-59', count: 45, label: 'Medium Leads', color: 'bg-yellow-500' },
              { range: '20-39', count: 32, label: 'Cold Leads', color: 'bg-blue-500' },
              { range: '0-19', count: 18, label: 'Low Priority', color: 'bg-gray-500' },
            ].map((segment) => (
              <div key={segment.range} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium">{segment.range}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${segment.color}`}
                        style={{ width: `${(segment.count / 135) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground w-12">{segment.count}</div>
                  </div>
                </div>
                <div className="w-24 text-sm text-muted-foreground">{segment.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}