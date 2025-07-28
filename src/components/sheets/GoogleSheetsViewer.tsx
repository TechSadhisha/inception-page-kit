
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ExternalLink, Plus, Trash2, FileText } from 'lucide-react'
import { useProjectSheets } from '@/hooks/useProjectSheets'
import { useNavigate } from 'react-router-dom'

interface GoogleSheetsViewerProps {
  projectId: string
}

export const GoogleSheetsViewer = ({ projectId }: GoogleSheetsViewerProps) => {
  const { projectSheets, isLoading, createProjectSheet, deleteProjectSheet } = useProjectSheets(projectId)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newSheet, setNewSheet] = useState({
    name: '',
    url: ''
  })
  const navigate = useNavigate()

  const handleAddSheet = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSheet.name && newSheet.url) {
      // Extract sheet ID from Google Sheets URL
      const sheetIdMatch = newSheet.url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
      const sheetId = sheetIdMatch ? sheetIdMatch[1] : ''
      
      createProjectSheet({
        project_id: projectId,
        sheet_name: newSheet.name,
        sheet_url: newSheet.url,
        sheet_id: sheetId
      })
      
      setNewSheet({ name: '', url: '' })
      setDialogOpen(false)
    }
  }

  const convertToEmbedUrl = (url: string) => {
    // Convert Google Sheets URL to embeddable format
    const sheetIdMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    if (sheetIdMatch) {
      const sheetId = sheetIdMatch[1]
      return `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing&rm=minimal&headers=false`
    }
    return url
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Sheets</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate('/scripts')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Create Script
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Sheet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Google Sheet</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSheet} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sheet-name">Sheet Name</Label>
                  <Input
                    id="sheet-name"
                    value={newSheet.name}
                    onChange={(e) => setNewSheet(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter sheet name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sheet-url">Google Sheets URL</Label>
                  <Input
                    id="sheet-url"
                    value={newSheet.url}
                    onChange={(e) => setNewSheet(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Sheet
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {projectSheets.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Sheets Added</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Add Google Sheets to this project for staff to access and update directly in the app.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => navigate('/scripts')}>
                <FileText className="mr-2 h-4 w-4" />
                Create Script Instead
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projectSheets.map((sheet) => (
            <Card key={sheet.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">{sheet.sheet_name}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(sheet.sheet_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteProjectSheet(sheet.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-50 rounded border overflow-hidden">
                  <iframe
                    src={convertToEmbedUrl(sheet.sheet_url)}
                    className="w-full h-full border-0"
                    title={sheet.sheet_name}
                    allow="clipboard-write"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
