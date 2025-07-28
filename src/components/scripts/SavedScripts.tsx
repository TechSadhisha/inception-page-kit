
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useScripts } from '@/hooks/useScripts'
import { FileText, Eye, Trash2, Download, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface SavedScriptsProps {
  projectId?: string
}

export const SavedScripts = ({ projectId }: SavedScriptsProps) => {
  const { scripts, isLoading, deleteScript, isDeleting } = useScripts(projectId)
  const [selectedScript, setSelectedScript] = useState<any>(null)

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'presentation':
        return 'bg-blue-100 text-blue-800'
      case 'video':
        return 'bg-red-100 text-red-800'
      case 'audio':
        return 'bg-green-100 text-green-800'
      case 'document':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const downloadScript = (script: any) => {
    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${script.title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .metadata { background: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #007cba; }
            .content { margin: 20px 0; }
            .notes { background: #fff3cd; padding: 15px; border: 1px solid #ffeaa7; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>${script.title}</h1>
          <div class="metadata">
            <p><strong>Type:</strong> ${script.type.charAt(0).toUpperCase() + script.type.slice(1)}</p>
            <p><strong>Created:</strong> ${format(new Date(script.created_at), 'PPP')}</p>
            <p><strong>Last Updated:</strong> ${format(new Date(script.updated_at), 'PPP')}</p>
          </div>
          <div class="content">
            <h2>Script Content</h2>
            ${script.content.split('\n').map((line: string) => `<p>${line}</p>`).join('')}
          </div>
          ${script.notes ? `
            <div class="notes">
              <h2>Notes</h2>
              ${script.notes.split('\n').map((line: string) => `<p>${line}</p>`).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `

    const blob = new Blob([docContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${script.title}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading scripts...</div>
        </CardContent>
      </Card>
    )
  }

  if (scripts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Saved Scripts</span>
          </CardTitle>
          <CardDescription>
            Scripts you've created will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No scripts saved yet. Create your first script in the Script Creator tab.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {scripts.map((script) => (
          <Card key={script.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{script.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(script.type)}>
                      {script.type.charAt(0).toUpperCase() + script.type.slice(1)}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(script.updated_at), 'PPP')}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedScript(script)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>{selectedScript?.title}</DialogTitle>
                        <DialogDescription>
                          {selectedScript?.type.charAt(0).toUpperCase() + selectedScript?.type.slice(1)} Script
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Content</h4>
                          <ScrollArea className="h-64 w-full rounded-md border p-4">
                            <pre className="whitespace-pre-wrap font-mono text-sm">
                              {selectedScript?.content}
                            </pre>
                          </ScrollArea>
                        </div>
                        {selectedScript?.notes && (
                          <div>
                            <h4 className="font-medium mb-2">Notes</h4>
                            <div className="bg-muted p-3 rounded-md">
                              <pre className="whitespace-pre-wrap text-sm">
                                {selectedScript.notes}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadScript(script)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Script</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{script.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteScript(script.id)}
                          disabled={isDeleting}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {script.content.substring(0, 200)}...
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
