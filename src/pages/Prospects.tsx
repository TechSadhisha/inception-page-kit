
import { useState } from 'react'
import { useProspects } from '@/hooks/useProspects'
import { useProjects } from '@/hooks/useProjects'
import { ProspectDialog } from '@/components/prospects/ProspectDialog'
import { Prospect } from '@/types/prospect'
import { WhatsAppMessageDialog } from '@/components/whatsapp/WhatsAppMessageDialog'
import { ProspectsHeader } from '@/components/prospects/ProspectsHeader'
import { ProspectsFilters } from '@/components/prospects/ProspectsFilters'
import { ProspectsEmptyState } from '@/components/prospects/ProspectsEmptyState'
import { ProspectsList } from '@/components/prospects/ProspectsList'

const Prospects = () => {
  const { projects } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all')
  const { prospects, isLoading, createProspect, updateProspect, deleteProspect, isCreating, isUpdating } = useProspects(selectedProjectId === 'all' ? undefined : selectedProjectId)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [bulkImportOpen, setBulkImportOpen] = useState(false)
  const [leadIntegrationOpen, setLeadIntegrationOpen] = useState(false)
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null)
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false)
  const [selectedProspectForWhatsApp, setSelectedProspectForWhatsApp] = useState<Prospect | null>(null)

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prospect.email && prospect.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prospect.phone && prospect.phone.includes(searchTerm))
    
    const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleCreateProspect = (data: any) => {
    console.log('Creating prospect with data:', data)
    createProspect(data)
    setDialogOpen(false)
  }

  const handleBulkImport = async (prospects: any[]) => {
    console.log('Bulk importing prospects:', prospects)
    
    // Import prospects one by one to handle validation
    for (const prospectData of prospects) {
      try {
        createProspect(prospectData)
      } catch (error) {
        console.error('Error importing prospect:', error)
      }
    }
    
    setBulkImportOpen(false)
  }

  const handleUpdateProspect = (data: any) => {
    if (editingProspect) {
      console.log('Updating prospect with data:', data)
      updateProspect(editingProspect.id, data)
      setEditingProspect(null)
      setDialogOpen(false)
    }
  }

  const handleEditProspect = (prospect: Prospect) => {
    setEditingProspect(prospect)
    setDialogOpen(true)
  }

  const handleDeleteProspect = (id: string) => {
    console.log('Deleting prospect with id:', id)
    deleteProspect(id)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingProspect(null)
  }

  const handleNewProspectClick = () => {
    console.log('New prospect clicked, selectedProjectId:', selectedProjectId)
    if (selectedProjectId === 'all' && projects.length > 0) {
      const firstProject = projects[0]
      setSelectedProjectId(firstProject.id)
      console.log('Auto-selected first project:', firstProject.id)
    }
    setDialogOpen(true)
  }

  const handleWhatsAppMessage = (prospect: Prospect) => {
    setSelectedProspectForWhatsApp(prospect)
    setWhatsappDialogOpen(true)
  }

  const canCreateProspect = projects.length > 0
  const effectiveProjectId = selectedProjectId === 'all' && projects.length > 0 ? projects[0].id : selectedProjectId

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const showEmptyState = selectedProjectId === 'all' && projects.length > 0 || filteredProspects.length === 0
  const showProspectsList = !showEmptyState

  return (
    <div className="space-y-6">
      <ProspectsHeader
        canCreateProspect={canCreateProspect}
        effectiveProjectId={effectiveProjectId}
        bulkImportOpen={bulkImportOpen}
        setBulkImportOpen={setBulkImportOpen}
        leadIntegrationOpen={leadIntegrationOpen}
        setLeadIntegrationOpen={setLeadIntegrationOpen}
        handleNewProspectClick={handleNewProspectClick}
        handleBulkImport={handleBulkImport}
        isCreating={isCreating}
      />

      <ProspectsFilters
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        projects={projects}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {showEmptyState && (
        <ProspectsEmptyState
          selectedProjectId={selectedProjectId}
          projects={projects}
          filteredProspectsLength={filteredProspects.length}
          totalProspectsLength={prospects.length}
          canCreateProspect={canCreateProspect}
          handleNewProspectClick={handleNewProspectClick}
          setBulkImportOpen={setBulkImportOpen}
        />
      )}

      {showProspectsList && (
        <ProspectsList
          prospects={filteredProspects}
          onEdit={handleEditProspect}
          onDelete={handleDeleteProspect}
          onWhatsApp={handleWhatsAppMessage}
        />
      )}

      {canCreateProspect && (
        <ProspectDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          prospect={editingProspect}
          projectId={effectiveProjectId}
          onSubmit={editingProspect ? handleUpdateProspect : handleCreateProspect}
          isLoading={isCreating || isUpdating}
        />
      )}

      <WhatsAppMessageDialog
        open={whatsappDialogOpen}
        onOpenChange={setWhatsappDialogOpen}
        prospects={filteredProspects.filter(p => p.phone)}
        selectedProspect={selectedProspectForWhatsApp}
      />
    </div>
  )
}

export default Prospects
