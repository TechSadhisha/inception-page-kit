import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Target, Upload, Users, BarChart3, Filter, Download, Plus } from 'lucide-react'
import { LeadList } from '@/components/leads/LeadList'
import { BulkLeadUpload } from '@/components/leads/BulkLeadUpload'
import { LeadSourceIntegrations } from '@/components/leads/LeadSourceIntegrations'
import { LeadAnalytics } from '@/components/leads/LeadAnalytics'
import { LeadAssignment } from '@/components/leads/LeadAssignment'
import { ManualLeadEntry } from '@/components/leads/ManualLeadEntry'
import { useProspects } from '@/hooks/useProspects'
import { useProjects } from '@/hooks/useProjects'

export default function LeadCentre() {
  const { projectId } = useParams<{ projectId: string }>()
  const [activeTab, setActiveTab] = useState('overview')
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)

  console.log('LeadCentre - projectId from params:', projectId)
  console.log('LeadCentre - current URL:', window.location.href)
  console.log('LeadCentre - useParams result:', useParams())

  const { prospects: leads, isLoading, createProspect, createBulkProspects, updateProspect, deleteProspect } = useProspects(projectId)
  const { projects } = useProjects()
  
  const currentProject = projects?.find(p => p.id === projectId)

  // Lead statistics
  const totalLeads = leads?.length || 0
  const newLeads = leads?.filter(lead => lead.status === 'new').length || 0
  const qualifiedLeads = leads?.filter(lead => lead.status === 'qualified').length || 0
  const convertedLeads = leads?.filter(lead => lead.status === 'converted').length || 0

  const handleManualLeadCreate = async (leadData: any) => {
    console.log('Creating lead with projectId:', projectId, 'leadData:', leadData)
    if (!projectId) {
      console.error('No projectId available')
      return
    }
    await createProspect({
      project_id: projectId,
      ...leadData
    })
    setShowManualEntry(false)
  }

  const handleBulkLeadUpload = async (leadsData: any[]) => {
    console.log('Bulk uploading leads with projectId:', projectId, 'leadsData:', leadsData)
    if (!projectId) {
      console.error('No projectId available for bulk upload')
      return
    }
    const formattedLeads = leadsData.map(lead => ({
      project_id: projectId,
      ...lead
    }))
    await createBulkProspects(formattedLeads)
    setShowBulkUpload(false)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8" />
            Lead Centre
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentProject?.name} - Centralized lead management and tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowManualEntry(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
          <Button onClick={() => setShowBulkUpload(true)} variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{newLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Qualified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{qualifiedLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Converted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{convertedLeads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            All Leads
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Sources
          </TabsTrigger>
          <TabsTrigger value="assignment" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Assignment
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <LeadList projectId={projectId} leads={leads} onUpdateLead={(id, updates) => updateProspect(id, updates)} onDeleteLead={(id) => deleteProspect(id)} />
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <LeadSourceIntegrations projectId={projectId} />
        </TabsContent>

        <TabsContent value="assignment" className="space-y-4">
          <LeadAssignment projectId={projectId} leads={leads} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <LeadAnalytics projectId={projectId} leads={leads} />
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <BulkLeadUpload projectId={projectId} onUpload={handleBulkLeadUpload} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showManualEntry && (
        <ManualLeadEntry
          open={showManualEntry}
          onClose={() => setShowManualEntry(false)}
          onSubmit={handleManualLeadCreate}
        />
      )}

      {showBulkUpload && (
        <BulkLeadUpload
          projectId={projectId}
          onUpload={handleBulkLeadUpload}
          open={showBulkUpload}
          onClose={() => setShowBulkUpload(false)}
        />
      )}
    </div>
  )
}