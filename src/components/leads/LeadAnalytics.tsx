import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, TrendingDown, Users, Target, CheckCircle, XCircle } from 'lucide-react'
import { Prospect } from '@/types/prospect'

interface LeadAnalyticsProps {
  projectId?: string
  leads?: Prospect[]
}

export function LeadAnalytics({ projectId, leads = [] }: LeadAnalyticsProps) {
  // Calculate analytics data
  const totalLeads = leads.length
  const newLeads = leads.filter(lead => lead.status === 'new').length
  const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length
  const convertedLeads = leads.filter(lead => lead.status === 'converted').length
  const lostLeads = leads.filter(lead => lead.status === 'lost').length

  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0'
  const qualificationRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0'

  // Status distribution data for pie chart
  const statusData = [
    { name: 'New', value: newLeads, color: '#3b82f6' },
    { name: 'Qualified', value: qualifiedLeads, color: '#10b981' },
    { name: 'Converted', value: convertedLeads, color: '#8b5cf6' },
    { name: 'Lost', value: lostLeads, color: '#ef4444' }
  ].filter(item => item.value > 0)

  // Leads by month data
  const getLeadsByMonth = () => {
    const monthData: Record<string, number> = {}
    
    leads.forEach(lead => {
      const month = new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      monthData[month] = (monthData[month] || 0) + 1
    })

    return Object.entries(monthData)
      .map(([month, count]) => ({ month, leads: count }))
      .slice(-6) // Last 6 months
  }

  const monthlyData = getLeadsByMonth()

  // Source analysis (mock data since source field doesn't exist yet)
  const sourceData = [
    { source: 'Website', leads: Math.floor(totalLeads * 0.3), converted: Math.floor(convertedLeads * 0.4) },
    { source: 'Facebook', leads: Math.floor(totalLeads * 0.25), converted: Math.floor(convertedLeads * 0.3) },
    { source: 'MagicBricks', leads: Math.floor(totalLeads * 0.2), converted: Math.floor(convertedLeads * 0.2) },
    { source: 'Referral', leads: Math.floor(totalLeads * 0.15), converted: Math.floor(convertedLeads * 0.1) },
    { source: 'Other', leads: Math.floor(totalLeads * 0.1), converted: 0 }
  ].filter(item => item.leads > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Analytics</h2>
          <p className="text-muted-foreground">Insights and performance metrics</p>
        </div>
        <Select defaultValue="30days">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {convertedLeads} of {totalLeads} leads
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Qualification Rate</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualificationRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {qualifiedLeads} qualified leads
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Leads</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newLeads + qualifiedLeads}</div>
            <div className="text-xs text-muted-foreground mt-1">
              In pipeline
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Leads contacted
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Lead Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Generation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Source Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Sources Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#3b82f6" name="Total Leads" />
                <Bar dataKey="converted" fill="#10b981" name="Converted" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-semibold">Website</div>
              <div className="text-sm text-muted-foreground">
                {Math.floor(totalLeads * 0.3)} leads • 40% conversion rate
              </div>
              <Badge className="bg-green-100 text-green-800">Best Converter</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Highest Volume Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-semibold">Facebook</div>
              <div className="text-sm text-muted-foreground">
                {Math.floor(totalLeads * 0.25)} leads • 25% of total
              </div>
              <Badge className="bg-blue-100 text-blue-800">High Volume</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Improvement Opportunity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-semibold">MagicBricks</div>
              <div className="text-sm text-muted-foreground">
                Low conversion rate • Needs optimization
              </div>
              <Badge className="bg-orange-100 text-orange-800">Needs Attention</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}