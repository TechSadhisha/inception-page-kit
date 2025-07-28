
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import { useAuth } from '@/hooks/useAuth'
import { Prospect } from '@/types/prospect'

interface WhatsAppMessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prospects: Prospect[]
  selectedProspect?: Prospect | null
}

const templates = [
  {
    name: 'Introduction',
    content: 'Hi {name}, I hope this message finds you well. I wanted to reach out regarding our recent discussion about {project}.'
  },
  {
    name: 'Follow Up',
    content: 'Hello {name}, following up on our conversation. Do you have any questions about our proposal?'
  },
  {
    name: 'Meeting Reminder',
    content: 'Hi {name}, this is a friendly reminder about our meeting scheduled for tomorrow. Looking forward to speaking with you!'
  }
]

export const WhatsAppMessageDialog = ({ 
  open, 
  onOpenChange, 
  prospects, 
  selectedProspect 
}: WhatsAppMessageDialogProps) => {
  const [selectedProspectId, setSelectedProspectId] = useState(selectedProspect?.id || '')
  const [phoneNumber, setPhoneNumber] = useState(selectedProspect?.phone || '')
  const [message, setMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  
  const { sendMessage, isSending } = useWhatsApp()
  const { user } = useAuth()

  const handleProspectChange = (prospectId: string) => {
    setSelectedProspectId(prospectId)
    const prospect = prospects.find(p => p.id === prospectId)
    if (prospect?.phone) {
      setPhoneNumber(prospect.phone)
    }
  }

  const handleTemplateChange = (templateName: string) => {
    setSelectedTemplate(templateName)
    const template = templates.find(t => t.name === templateName)
    if (template) {
      const selectedProspectData = prospects.find(p => p.id === selectedProspectId)
      let content = template.content
      if (selectedProspectData) {
        content = content.replace(/\{name\}/g, selectedProspectData.name)
        content = content.replace(/\{project\}/g, 'your project') // Could be enhanced with actual project name
      }
      setMessage(content)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProspectId || !phoneNumber || !message || !user) {
      return
    }

    sendMessage({
      prospect_id: selectedProspectId,
      phone_number: phoneNumber,
      message: message,
      sent_by: user.id
    })

    // Reset form
    setMessage('')
    setSelectedTemplate('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send WhatsApp Message</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSend} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prospect">Select Prospect</Label>
            <Select value={selectedProspectId} onValueChange={handleProspectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a prospect" />
              </SelectTrigger>
              <SelectContent>
                {prospects
                  .filter(p => p.phone)
                  .map((prospect) => (
                    <SelectItem key={prospect.id} value={prospect.id}>
                      {prospect.name} - {prospect.phone}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Message Template (Optional)</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.name} value={template.name}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your WhatsApp message..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
