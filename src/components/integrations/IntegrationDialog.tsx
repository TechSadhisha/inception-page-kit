import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { IntegrationConfig } from '@/types/integration'

interface IntegrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<IntegrationConfig, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => void
  isLoading: boolean
}

export const IntegrationDialog = ({ open, onOpenChange, onSubmit, isLoading }: IntegrationDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    integration_type: 'portal' as const,
    config: '{}',
    credentials: '{}',
    sync_frequency: '3600',
    is_active: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const submitData = {
        name: formData.name,
        provider: formData.provider,
        integration_type: formData.integration_type,
        config: JSON.parse(formData.config),
        credentials: JSON.parse(formData.credentials),
        sync_frequency: parseInt(formData.sync_frequency),
        is_active: formData.is_active,
        last_sync_at: undefined,
      }
      
      onSubmit(submitData)
    } catch (error) {
      console.error('Invalid JSON in config or credentials:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Integration</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Integration Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., MagicBricks API"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="provider">Provider *</Label>
              <Input
                id="provider"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g., magicbricks"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="integration_type">Integration Type *</Label>
              <Select value={formData.integration_type} onValueChange={(value: any) => setFormData({ ...formData, integration_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portal">Real Estate Portal</SelectItem>
                  <SelectItem value="marketing">Marketing Platform</SelectItem>
                  <SelectItem value="communication">Communication Channel</SelectItem>
                  <SelectItem value="telephony">Telephony Service</SelectItem>
                  <SelectItem value="analytics">Analytics Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sync_frequency">Sync Frequency (seconds)</Label>
              <Input
                id="sync_frequency"
                type="number"
                value={formData.sync_frequency}
                onChange={(e) => setFormData({ ...formData, sync_frequency: e.target.value })}
                placeholder="3600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="config">Configuration (JSON)</Label>
            <Textarea
              id="config"
              value={formData.config}
              onChange={(e) => setFormData({ ...formData, config: e.target.value })}
              placeholder='{"api_version": "v1", "rate_limit": 1000}'
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credentials">Credentials (JSON)</Label>
            <Textarea
              id="credentials"
              value={formData.credentials}
              onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
              placeholder='{"api_key": "your_api_key", "secret": "your_secret"}'
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Integration'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}