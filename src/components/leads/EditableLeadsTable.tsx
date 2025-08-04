import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { format } from 'date-fns'
import { Calendar, ChevronDown, Plus, X, Save, Download, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Prospect, FollowUp, ProspectUpdate } from '@/types/prospect'
import { useToast } from '@/hooks/use-toast'

interface EditableLeadsTableProps {
  leads: Prospect[]
  onUpdateLead: (id: string, updates: ProspectUpdate) => void
  onExport: () => void
  isLoading?: boolean
}

interface EditableCell {
  leadId: string
  field: string
  value: any
}

const sourceOptions = [
  'Manual', 'Facebook Ad', 'Google', 'WhatsApp', 'Website', 'Referral', 'Cold Call', 'Email Campaign'
]

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-blue-500' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
  { value: 'qualified', label: 'Qualified', color: 'bg-green-500' },
  { value: 'converted', label: 'Converted', color: 'bg-purple-500' },
  { value: 'dropped', label: 'Dropped', color: 'bg-gray-500' },
  { value: 'lost', label: 'Lost', color: 'bg-red-500' }
]

const followUpStatusOptions = [
  'contacted', 'no_response', 'meeting_scheduled', 'callback_requested', 'not_interested', 'follow_up_later'
]

// Memoized FollowUpRow component to prevent unnecessary re-renders
const FollowUpRow = memo(({ followUp, index, onUpdate, onRemove }: {
  followUp: FollowUp
  index: number
  onUpdate: (index: number, field: keyof FollowUp, value: string) => void
  onRemove: (index: number) => void
}) => {
  return (
    <div className="grid grid-cols-4 gap-4 items-end border p-4 rounded">
      <div>
        <Label>Date</Label>
        <Input
          type="date"
          value={followUp.date}
          onChange={(e) => onUpdate(index, 'date', e.target.value)}
        />
      </div>
      <div>
        <Label>Status</Label>
        <Select
          value={followUp.status}
          onValueChange={(value) => onUpdate(index, 'status', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {followUpStatusOptions.map(status => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Notes</Label>
        <Input
          value={followUp.notes || ''}
          onChange={(e) => onUpdate(index, 'notes', e.target.value)}
          placeholder="Optional notes..."
          className="w-full"
          autoComplete="off"
        />
      </div>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onRemove(index)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
})

export const EditableLeadsTable = ({ leads, onUpdateLead, onExport, isLoading }: EditableLeadsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null)
  const [editingFollowUps, setEditingFollowUps] = useState<{ leadId: string; followUps: FollowUp[] } | null>(null)
  const { toast } = useToast()

  // Filter leads based on search term
  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status)
    return statusConfig || { value: status, label: status, color: 'bg-gray-500' }
  }

  const calculateDaysInFollowUp = (lead: Prospect) => {
    if (!lead.follow_ups || lead.follow_ups.length === 0) {
      const dateAdded = new Date(lead.date_added)
      const today = new Date()
      return Math.floor((today.getTime() - dateAdded.getTime()) / (1000 * 60 * 60 * 24))
    }

    const latestFollowUp = lead.follow_ups
      .map(f => new Date(f.date))
      .sort((a, b) => b.getTime() - a.getTime())[0]
    
    const dateAdded = new Date(lead.date_added)
    return Math.floor((latestFollowUp.getTime() - dateAdded.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleCellEdit = (leadId: string, field: string, value: any) => {
    setEditingCell({ leadId, field, value })
  }

  const handleCellSave = async () => {
    if (!editingCell) return

    try {
      await onUpdateLead(editingCell.leadId, {
        [editingCell.field]: editingCell.value
      })
      setEditingCell(null)
      toast({
        title: "Success",
        description: "Lead updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      })
    }
  }

  const handleCellCancel = () => {
    setEditingCell(null)
  }

  const handleFollowUpEdit = (leadId: string, followUps: FollowUp[]) => {
    setEditingFollowUps({ leadId, followUps: [...followUps] })
  }

  const handleFollowUpSave = async () => {
    if (!editingFollowUps) return

    try {
      await onUpdateLead(editingFollowUps.leadId, {
        follow_ups: editingFollowUps.followUps
      })
      setEditingFollowUps(null)
      toast({
        title: "Success",
        description: "Follow-ups updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow-ups",
        variant: "destructive",
      })
    }
  }

  const addFollowUp = () => {
    if (!editingFollowUps) return

    const newFollowUp: FollowUp = {
      id: `temp-${Date.now()}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'contacted',
      notes: ''
    }

    setEditingFollowUps({
      ...editingFollowUps,
      followUps: [...editingFollowUps.followUps, newFollowUp]
    })
  }

  const removeFollowUp = (index: number) => {
    if (!editingFollowUps) return

    const updatedFollowUps = editingFollowUps.followUps.filter((_, i) => i !== index)
    setEditingFollowUps({
      ...editingFollowUps,
      followUps: updatedFollowUps
    })
  }

  const updateFollowUp = useCallback((index: number, field: keyof FollowUp, value: string) => {
    console.log(`Updating followUp ${index}, field: ${field}, value: ${value}`)
    setEditingFollowUps(current => {
      if (!current) return current
      
      const updatedFollowUps = current.followUps.map((followUp, i) => 
        i === index ? { ...followUp, [field]: value } : followUp
      )
      
      return {
        ...current,
        followUps: updatedFollowUps
      }
    })
  }, [])

  const EditableCell = ({ lead, field, value, type = 'text' }: {
    lead: Prospect
    field: string
    value: any
    type?: 'text' | 'email' | 'phone' | 'select' | 'date'
  }) => {
    const isEditing = editingCell?.leadId === lead.id && editingCell?.field === field
    const displayValue = value || '—'

    if (isEditing) {
      if (type === 'select') {
        if (field === 'source') {
          return (
            <div className="flex items-center gap-2">
              <Select
                value={editingCell.value || ''}
                onValueChange={(val) => setEditingCell({ ...editingCell, value: val })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleCellSave} className="h-6 w-6 p-0">
                <Save className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCellCancel} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          )
        } else if (field === 'status') {
          return (
            <div className="flex items-center gap-2">
              <Select
                value={editingCell.value || ''}
                onValueChange={(val) => setEditingCell({ ...editingCell, value: val })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleCellSave} className="h-6 w-6 p-0">
                <Save className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCellCancel} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          )
        }
      } else if (type === 'date') {
        return (
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {editingCell.value ? format(new Date(editingCell.value), 'PPP') : 'Pick date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={editingCell.value ? new Date(editingCell.value) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setEditingCell({ ...editingCell, value: format(date, 'yyyy-MM-dd') })
                    }
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <Button size="sm" onClick={handleCellSave} className="h-6 w-6 p-0">
              <Save className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCellCancel} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        )
      } else {
        return (
          <div className="flex items-center gap-2">
            <Input
              type={type}
              value={editingCell.value || ''}
              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
              className="h-8 text-xs"
              autoFocus
            />
            <Button size="sm" onClick={handleCellSave} className="h-6 w-6 p-0">
              <Save className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCellCancel} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        )
      }
    }

    return (
      <div
        className="cursor-pointer hover:bg-muted/50 p-1 rounded text-xs"
        onClick={() => handleCellEdit(lead.id, field, value)}
      >
        {field === 'status' ? (
          <Badge variant="secondary" className={cn('text-white', getStatusBadge(value).color)}>
            {getStatusBadge(value).label}
          </Badge>
        ) : field === 'date_added' || field === 'first_contact_date' ? (
          value ? format(new Date(value), 'MMM dd, yyyy') : '—'
        ) : (
          displayValue
        )}
      </div>
    )
  }

  const FollowUpCell = ({ lead }: { lead: Prospect }) => {
    const followUps = lead.follow_ups || []
    const isDialogOpen = editingFollowUps?.leadId === lead.id

    const handleEditClick = () => {
      handleFollowUpEdit(lead.id, followUps)
    }

    const handleSaveAndClose = async () => {
      await handleFollowUpSave()
    }

    const handleDialogClose = () => {
      setEditingFollowUps(null)
    }

    return (
      <div className="space-y-1">
        {followUps.length > 0 ? (
          followUps.map((followUp, index) => (
            <div key={index} className="text-xs">
              <span className="font-medium">{format(new Date(followUp.date), 'yyyy-MM-dd')}</span>
              <span className="text-muted-foreground"> · {followUp.status.replace('_', ' ')}</span>
            </div>
          ))
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )}
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleDialogClose()}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs"
              onClick={handleEditClick}
            >
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Follow-ups - {lead.name}</DialogTitle>
            </DialogHeader>
            {editingFollowUps && editingFollowUps.leadId === lead.id && (
              <div className="space-y-4">
                {editingFollowUps.followUps.map((followUp, index) => (
                  <FollowUpRow
                    key={`${followUp.id || index}-${editingFollowUps.leadId}`}
                    followUp={followUp}
                    index={index}
                    onUpdate={updateFollowUp}
                    onRemove={removeFollowUp}
                  />
                ))}
                <div className="flex gap-2">
                  <Button size="sm" onClick={addFollowUp}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Follow-up
                  </Button>
                  <Button size="sm" onClick={handleSaveAndClose}>
                    Save Changes
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lead Management ({filteredLeads.length} leads)</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button onClick={onExport} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>First Contact</TableHead>
                  <TableHead>Follow-ups</TableHead>
                  <TableHead>Days in Follow-up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead, index) => (
                  <TableRow key={lead.id} className={cn(
                    lead.status === 'qualified' && 'bg-green-50',
                    lead.status === 'converted' && 'bg-purple-50'
                  )}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="name" value={lead.name} />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="email" value={lead.email} type="email" />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="phone" value={lead.phone} type="phone" />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="source" value={lead.source} type="select" />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="status" value={lead.status} type="select" />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="date_added" value={lead.date_added} type="date" />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="first_contact_date" value={lead.first_contact_date} type="date" />
                    </TableCell>
                    <TableCell>
                      <FollowUpCell lead={lead} />
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline">
                            {calculateDaysInFollowUp(lead)} days
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Days between date added and latest follow-up</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
