
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectReports } from '@/components/reports/ProjectReports'
import { ProspectReports } from '@/components/reports/ProspectReports'
import { TeamReports } from '@/components/reports/TeamReports'
import { EnhancedOverviewReports } from '@/components/reports/EnhancedOverviewReports'
import { BarChart3, TrendingUp, Users, FolderOpen } from 'lucide-react'

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights with Google Sheets integration for real-time data analysis
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4" />
            <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger value="prospects" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Prospects</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Team</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <EnhancedOverviewReports />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectReports />
        </TabsContent>

        <TabsContent value="prospects">
          <ProspectReports />
        </TabsContent>

        <TabsContent value="team">
          <TeamReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Reports
