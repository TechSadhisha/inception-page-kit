import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScriptCreator } from '@/components/scripts/ScriptCreator'
import { SavedScripts } from '@/components/scripts/SavedScripts'
import { OpenAIChat } from '@/components/scripts/OpenAIChat'
import { useProjects } from '@/hooks/useProjects'
import { FileText, Mic, Volume2, MessageCircle, Archive } from 'lucide-react'

const ScriptManagement = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all')
  const { projects } = useProjects()

  const handleScriptSave = (script: any) => {
    console.log('Script saved:', script)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Script Management</h1>
        <p className="text-muted-foreground">
          Create, edit, and manage scripts with voice-to-text, text-to-voice, and AI assistance
        </p>
      </div>

      <Tabs defaultValue="creator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="creator" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Script Creator</span>
          </TabsTrigger>
          <TabsTrigger value="saved-scripts" className="flex items-center space-x-2">
            <Archive className="h-4 w-4" />
            <span>Saved Scripts</span>
          </TabsTrigger>
          <TabsTrigger value="voice-input" className="flex items-center space-x-2">
            <Mic className="h-4 w-4" />
            <span>Voice Input</span>
          </TabsTrigger>
          <TabsTrigger value="voice-output" className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4" />
            <span>Voice Output</span>
          </TabsTrigger>
          <TabsTrigger value="ai-chat" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>AI Assistant</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="creator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Project</CardTitle>
              <CardDescription>
                Choose a project to create scripts for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedProjectId && selectedProjectId !== 'all' && (
            <ScriptCreator
              projectId={selectedProjectId}
              onSave={handleScriptSave}
            />
          )}
        </TabsContent>

        <TabsContent value="saved-scripts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Project</CardTitle>
              <CardDescription>
                Choose a project to view scripts for, or leave empty to see all scripts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <SavedScripts projectId={selectedProjectId === 'all' ? undefined : selectedProjectId} />
        </TabsContent>

        <TabsContent value="voice-input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voice to Text</CardTitle>
              <CardDescription>
                Convert spoken words into text for your scripts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Use the voice input feature in the Script Creator tab to convert speech to text
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice-output" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Text to Voice</CardTitle>
              <CardDescription>
                Convert your scripts into spoken audio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Volume2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Use the voice output feature in the Script Creator tab to convert text to speech
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-chat" className="space-y-6">
          <OpenAIChat />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ScriptManagement
