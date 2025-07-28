
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertCircle, CheckCircle, Clock, Download, Plus, Trash2, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FacebookLeadForm {
  id: string
  name: string
  pageId: string
  pageName: string
  enabled: boolean
  lastSync: string | null
  totalLeads: number
  newLeads: number
  status: 'connected' | 'disconnected' | 'syncing' | 'error'
}

interface FacebookLeadFormsTabProps {
  facebookLeadForms: FacebookLeadForm[]
  syncing: string | null
  selectedProject: string
  onSync: (formId: string, projectId: string) => void
  onToggle: (formId: string, enabled: boolean) => void
  onAdd: (formData: { name: string; pageId: string; pageName: string }) => void
  onRemove: (formId: string) => void
}

export const FacebookLeadFormsTab = ({
  facebookLeadForms,
  syncing,
  selectedProject,
  onSync,
  onToggle,
  onAdd,
  onRemove
}: FacebookLeadFormsTabProps) => {
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    pageId: '',
    pageName: ''
  })

  const getStatusIcon = (status: FacebookLeadForm['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'syncing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: FacebookLeadForm['status']) => {
    const variants = {
      connected: 'default',
      disconnected: 'secondary',
      syncing: 'outline',
      error: 'destructive'
    } as const

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleSync = (formId: string) => {
    if (!selectedProject) {
      toast({
        title: "Project Required",
        description: "Please select a project to sync leads to",
        variant: "destructive",
      })
      return
    }
    onSync(formId, selectedProject)
  }

  const handleAddForm = () => {
    if (!formData.name || !formData.pageId || !formData.pageName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    onAdd(formData)
    setFormData({ name: '', pageId: '', pageName: '' })
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Facebook Lead Forms</h3>
          <p className="text-sm text-muted-foreground">
            Connect and sync leads from your Facebook lead ad forms
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead Form
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Facebook Lead Form</DialogTitle>
              <DialogDescription>
                Connect a new Facebook lead form to sync leads automatically
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-name">Form Name</Label>
                <Input
                  id="form-name"
                  placeholder="e.g., Premium Apartments Lead Form"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-id">Facebook Page ID</Label>
                <Input
                  id="page-id"
                  placeholder="e.g., 123456789012345"
                  value={formData.pageId}
                  onChange={(e) => setFormData(prev => ({ ...prev, pageId: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-name">Page Name</Label>
                <Input
                  id="page-name"
                  placeholder="e.g., Real Estate Pro"
                  value={formData.pageName}
                  onChange={(e) => setFormData(prev => ({ ...prev, pageName: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddForm}>
                  Add Form
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {facebookLeadForms.map((form) => (
          <Card key={form.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{form.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {form.pageName} • {form.pageId}
                  </CardDescription>
                </div>
                {getStatusIcon(form.status)}
              </div>
              <div className="flex items-center justify-between">
                {getStatusBadge(form.status)}
                <Switch 
                  checked={form.enabled} 
                  onCheckedChange={(enabled) => onToggle(form.id, enabled)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Leads:</span>
                <span className="font-medium">{form.totalLeads}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">New Leads:</span>
                <Badge variant="outline" className="text-xs">
                  {form.newLeads}
                </Badge>
              </div>
              {form.lastSync && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Sync:</span>
                  <span className="text-xs">
                    {new Date(form.lastSync).toLocaleString()}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSync(form.id)}
                  disabled={!form.enabled || syncing === form.id || !selectedProject}
                  className="flex-1"
                >
                  {syncing === form.id ? (
                    <>
                      <Clock className="mr-2 h-3 w-3 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-3 w-3" />
                      Sync Now
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemove(form.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {facebookLeadForms.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ExternalLink className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Facebook Lead Forms</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your Facebook lead forms to start syncing leads automatically
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Form
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>
            How to connect your Facebook lead forms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Get Facebook Access Token</h4>
            <p className="text-sm text-muted-foreground">
              Go to Facebook Developers Console and create an app with leads_retrieval permission
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">2. Find Your Page ID</h4>
            <p className="text-sm text-muted-foreground">
              Visit your Facebook page, go to About section, and copy the Page ID
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">3. Configure Webhooks</h4>
            <p className="text-sm text-muted-foreground">
              Set up webhook subscriptions for leadgen events to receive real-time leads
            </p>
          </div>
          <Button variant="outline" className="w-full">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Facebook Setup Guide
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
