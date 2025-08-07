import { EditableLeadsTable } from './EditableLeadsTable'
import { Prospect, ProspectUpdate } from '@/types/prospect'

interface LeadListProps {
  projectId?: string
  leads?: Prospect[]
  onUpdateLead: (id: string, updates: ProspectUpdate) => void
  onDeleteLead: (id: string) => void
}

export function LeadList({ projectId, leads = [], onUpdateLead, onDeleteLead }: LeadListProps) {
  const exportLeads = () => {
    if (leads.length === 0) return

    const headers = [
      'S.No', 'Name', 'Email', 'Phone', 'Source', 'Status', 
      'Date Added', 'First Contact', 'Follow-ups', 'Days in Follow-up', 
      'Interest Rating', 'Notes'
    ]
    
    const csvContent = [
      headers.join(','),
      ...leads.map((lead, index) => {
        const followUpsText = lead.follow_ups?.map(f => 
          `${f.date} - ${f.status}${f.notes ? ': ' + f.notes : ''}`
        ).join('; ') || ''
        
        const daysInFollowUp = lead.follow_ups?.length > 0 
          ? Math.floor((new Date().getTime() - new Date(lead.date_added).getTime()) / (1000 * 60 * 60 * 24))
          : Math.floor((new Date().getTime() - new Date(lead.date_added).getTime()) / (1000 * 60 * 60 * 24))

        return [
          index + 1,
          `"${lead.name}"`,
          `"${lead.email || ''}"`,
          `"${lead.phone || ''}"`,
          `"${lead.source || ''}"`,
          `"${lead.status}"`,
          `"${lead.date_added ? new Date(lead.date_added).toLocaleDateString() : ''}"`,
          `"${lead.first_contact_date ? new Date(lead.first_contact_date).toLocaleDateString() : ''}"`,
          `"${followUpsText}"`,
          daysInFollowUp,
          lead.interest_rating || '',
          `"${lead.notes || ''}"`
        ].join(',')
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `leads-detailed-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <EditableLeadsTable
      leads={leads}
      onUpdateLead={onUpdateLead}
      onDeleteLead={onDeleteLead}
      onExport={exportLeads}
    />
  )
}