
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEnhancedReports } from '@/hooks/useEnhancedReports'
import { MetricCard } from './MetricCard'
import { ActivityChart } from './ActivityChart'
import { 
  TrendingUp, 
  TrendingDown, 
  FolderOpen, 
  Users, 
  Target, 
  RefreshCw,
  ExternalLink,
  BarChart3,
  FileSpreadsheet,
  Download,
  UserCheck
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function EnhancedOverviewReports() {
  const { enhancedMetrics, isLoading, sheetsData, prospectClients, refreshData, exportProspectClients } = useEnhancedReports()
  const navigate = useNavigate()

  const handleNavigateToProjects = () => {
    navigate('/projects')
  }

  const handleNavigateToProspects = () => {
    navigate('/prospects')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!enhancedMetrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Reports</CardTitle>
          <CardDescription>Unable to load enhanced metrics</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    return direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : BarChart3
  }

  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    return direction === 'up' ? 'text-green-500' : direction === 'down' ? 'text-red-500' : 'text-muted-foreground'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Overview</h2>
          <p className="text-muted-foreground">
            Real-time insights with Google Sheets integration
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          {prospectClients.length > 0 && (
            <Button onClick={exportProspectClients} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Prospects
            </Button>
          )}
        </div>
      </div>

      {/* Key Metrics with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                {enhancedMetrics.projectStatusData.reduce((sum, item) => sum + item.value, 0)}
              </div>
              <div className={`flex items-center text-sm ${getTrendColor(enhancedMetrics.projectsTrend.direction)}`}>
                {React.createElement(getTrendIcon(enhancedMetrics.projectsTrend.direction), { className: "h-4 w-4 mr-1" })}
                {enhancedMetrics.projectsTrend.value}%
              </div>
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs mt-2"
              onClick={handleNavigateToProjects}
            >
              View Projects <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                {enhancedMetrics.projectStatusData.find(item => item.name === 'Completed')?.value || 0}
              </div>
              <div className={`flex items-center text-sm ${getTrendColor(enhancedMetrics.completedTrend.direction)}`}>
                {React.createElement(getTrendIcon(enhancedMetrics.completedTrend.direction), { className: "h-4 w-4 mr-1" })}
                {enhancedMetrics.completedTrend.value}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sheet Prospects</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                {prospectClients.length}
              </div>
              <div className="flex items-center text-sm text-green-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                From Sheets
              </div>
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs mt-2"
              onClick={handleNavigateToProspects}
            >
              View All Prospects <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Sheets</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                {sheetsData.length}
              </div>
              <div className="flex items-center text-sm text-blue-500">
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                Active
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sheets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sheets">Google Sheets</TabsTrigger>
          <TabsTrigger value="prospects">Prospect Clients</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Charts</TabsTrigger>
          <TabsTrigger value="integration">Integration Status</TabsTrigger>
        </TabsList>

        <TabsContent value="sheets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="mr-2 h-5 w-5" />
                Connected Google Sheets ({sheetsData.length})
              </CardTitle>
              <CardDescription>
                Real-time data from your connected Google Sheets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sheetsData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileSpreadsheet className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No Google Sheets connected yet</p>
                  <p className="text-sm">Connect sheets in your project settings to see live data here</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleNavigateToProjects}
                  >
                    Go to Projects <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sheetsData.map((sheet, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{sheet.sheetName}</h4>
                          {sheet.isProspectSheet && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Prospect Sheet
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline">{sheet.lastUpdated.toLocaleString()}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Rows</div>
                          <div className="font-medium">{sheet.data.length}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Columns</div>
                          <div className="font-medium">{sheet.headers.length}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Headers</div>
                          <div className="font-medium text-xs">{sheet.headers.slice(0, 3).join(', ')}{sheet.headers.length > 3 ? '...' : ''}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Status</div>
                          <Badge variant="default">Connected</Badge>
                        </div>
                      </div>
                      {sheet.data.length > 0 && (
                        <div className="mt-4">
                          <div className="text-sm text-muted-foreground mb-2">Sample Data:</div>
                          <div className="bg-muted p-2 rounded text-xs">
                            <div className="font-medium mb-1">{sheet.headers.join(' | ')}</div>
                            {sheet.data.slice(0, 2).map((row, rowIndex) => (
                              <div key={rowIndex} className="text-muted-foreground">
                                {row.join(' | ')}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prospects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Prospect Clients from Sheets ({prospectClients.length})
                </div>
                {prospectClients.length > 0 && (
                  <Button onClick={exportProspectClients} size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Clients extracted from green-colored prospect sheets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prospectClients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserCheck className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No prospect clients found</p>
                  <p className="text-sm">Connect Google Sheets with prospect data to see clients here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {prospectClients.slice(0, 9).map((client, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{client.name}</h4>
                            <Badge variant={
                              client.status === 'Converted' ? 'default' :
                              client.status === 'Qualified' ? 'secondary' :
                              client.status === 'Contacted' ? 'outline' : 'secondary'
                            }>
                              {client.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>{client.email}</div>
                            <div>{client.phone}</div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Interest: {client.interestLevel}</span>
                            <span className="text-muted-foreground">Source: {client.source}</span>
                          </div>
                          {client.notes && (
                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                              {client.notes}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                  {prospectClients.length > 9 && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Showing 9 of {prospectClients.length} prospect clients. Export CSV to see all.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
                <CardDescription>Current status of all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityChart data={enhancedMetrics.projectStatusData} type="pie" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prospect Interest Levels</CardTitle>
                <CardDescription>Distribution of prospect ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityChart data={enhancedMetrics.prospectInterestData} type="bar" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Google Sheets Integration Overview</CardTitle>
              <CardDescription>Project connectivity with Google Sheets</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityChart data={enhancedMetrics.sheetsIntegrationData} type="pie" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
