
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Download, Mic, Volume2, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { VoiceToTextRecorder } from './VoiceToTextRecorder'
import { TextToVoicePlayer } from './TextToVoicePlayer'
import { useScripts } from '@/hooks/useScripts'

interface ScriptCreatorProps {
  projectId: string
  onSave?: (script: any) => void
}

interface Script {
  title: string
  content: string
  type: 'presentation' | 'video' | 'audio' | 'document'
  notes: string
}

export const ScriptCreator = ({ projectId, onSave }: ScriptCreatorProps) => {
  const [script, setScript] = useState<Script>({
    title: '',
    content: '',
    type: 'document',
    notes: ''
  })
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [showTextToVoice, setShowTextToVoice] = useState(false)
  const { toast } = useToast()
  const { createScript, isCreating } = useScripts()

  const handleContentChange = (content: string) => {
    setScript(prev => ({ ...prev, content }))
  }

  const handleVoiceTranscription = (transcription: string) => {
    setScript(prev => ({ 
      ...prev, 
      content: prev.content + (prev.content ? '\n\n' : '') + transcription 
    }))
    setShowVoiceRecorder(false)
    toast({
      title: "Voice transcribed",
      description: "Your speech has been added to the script",
    })
  }

  const downloadAsWord = () => {
    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${script.title || 'Script'}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .metadata { background: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #007cba; }
            .content { margin: 20px 0; }
            .notes { background: #fff3cd; padding: 15px; border: 1px solid #ffeaa7; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>${script.title || 'Untitled Script'}</h1>
          <div class="metadata">
            <p><strong>Type:</strong> ${script.type.charAt(0).toUpperCase() + script.type.slice(1)}</p>
            <p><strong>Created:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="content">
            <h2>Script Content</h2>
            ${script.content.split('\n').map(line => `<p>${line}</p>`).join('')}
          </div>
          ${script.notes ? `
            <div class="notes">
              <h2>Notes</h2>
              ${script.notes.split('\n').map(line => `<p>${line}</p>`).join('')}
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
    a.download = `${script.title || 'script'}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Script downloaded",
      description: "Your script has been saved as a Word document",
    })
  }

  const saveScript = () => {
    if (!script.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your script",
        variant: "destructive",
      })
      return
    }

    if (!script.content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your script",
        variant: "destructive",
      })
      return
    }

    createScript({
      project_id: projectId,
      title: script.title,
      content: script.content,
      type: script.type,
      notes: script.notes || undefined,
    })

    // Reset form after successful save
    setScript({
      title: '',
      content: '',
      type: 'document',
      notes: ''
    })

    onSave?.(script)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Script Creator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Script Title</Label>
              <Input
                id="title"
                value={script.title}
                onChange={(e) => setScript(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter script title"
              />
            </div>
            <div>
              <Label htmlFor="type">Script Type</Label>
              <Select value={script.type} onValueChange={(value: any) => setScript(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select script type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="video">Video Script</SelectItem>
                  <SelectItem value="audio">Audio Script</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="content">Script Content</Label>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                >
                  <Mic className="h-4 w-4 mr-1" />
                  Voice Input
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTextToVoice(!showTextToVoice)}
                  disabled={!script.content.trim()}
                >
                  <Volume2 className="h-4 w-4 mr-1" />
                  Play Audio
                </Button>
              </div>
            </div>
            <Textarea
              id="content"
              value={script.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Enter your script content here..."
              rows={12}
              className="font-mono"
            />
          </div>

          {showVoiceRecorder && (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <VoiceToTextRecorder onTranscription={handleVoiceTranscription} />
              </CardContent>
            </Card>
          )}

          {showTextToVoice && (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <TextToVoicePlayer text={script.content} />
              </CardContent>
            </Card>
          )}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={script.notes}
              onChange={(e) => setScript(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any notes or instructions..."
              rows={3}
            />
          </div>

          <div className="flex justify-between pt-4">
            <div className="flex space-x-2">
              <Button 
                onClick={saveScript} 
                disabled={!script.title.trim() || !script.content.trim() || isCreating}
              >
                <Save className="h-4 w-4 mr-2" />
                {isCreating ? 'Saving...' : 'Save Script'}
              </Button>
              <Button 
                variant="outline" 
                onClick={downloadAsWord}
                disabled={!script.title.trim() || !script.content.trim()}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Word
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
