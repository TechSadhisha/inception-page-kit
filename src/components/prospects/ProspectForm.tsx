import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RatingStars } from './RatingStars'
import { Prospect, ProspectInsert, ProspectUpdate } from '@/types/prospect'

interface ProspectFormProps {
  prospect?: Prospect | null
  projectId: string
  onSubmit: (data: ProspectInsert | ProspectUpdate) => void
  isLoading: boolean
  initialData?: {
    name: string
    email: string
    phone: string
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
    interest_rating: number
    notes: string
  }
}

export const ProspectForm = ({ prospect, projectId, onSubmit, isLoading, initialData }: ProspectFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'new' as 'new' | 'contacted' | 'qualified' | 'converted' | 'dropped' | 'lost',
    interest_rating: 0,
    notes: '',
  })

  useEffect(() => {
    if (prospect) {
      setFormData({
        name: prospect.name || '',
        email: prospect.email || '',
        phone: prospect.phone || '',
        status: prospect.status || 'new',
        interest_rating: prospect.interest_rating || 0,
        notes: prospect.notes || '',
      })
    } else if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'new',
        interest_rating: 0,
        notes: '',
      })
    }
  }, [prospect, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData = {
      ...formData,
      interest_rating: formData.interest_rating || null,
      ...(prospect ? {} : { project_id: projectId }),
    }

    onSubmit(submitData)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter prospect name"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="dropped">Dropped</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Interest Rating</Label>
        <RatingStars
          rating={formData.interest_rating}
          onRatingChange={(rating) => handleInputChange('interest_rating', rating)}
          size="lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Add any additional notes..."
          rows={3}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : prospect ? 'Update Prospect' : 'Create Prospect'}
      </Button>
    </form>
  )
}
