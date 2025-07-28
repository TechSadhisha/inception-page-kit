
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileUpload } from '@/components/files/FileUpload'
import { FileList } from '@/components/files/FileList'
import { useProjects } from '@/hooks/useProjects'
import { useProspects } from '@/hooks/useProspects'
import { useTranscripts } from '@/hooks/useTranscripts'
import { useSiteMedia } from '@/hooks/useSiteMedia'
import { FolderOpen, Upload } from 'lucide-react'

const FileManagement = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [selectedProspectId, setSelectedProspectId] = useState<string>('')
  const { projects } = useProjects()
  const { prospects } = useProspects()
  const { transcripts, refetch: refetchTranscripts } = useTranscripts(selectedProspectId)
  const { siteMedia, refetch: refetchSiteMedia } = useSiteMedia(selectedProjectId)

  const selectedProject = projects.find(p => p.id === selectedProjectId)
  const projectProspects = prospects.filter(p => p.project_id === selectedProjectId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">File Management</h1>
        <p className="text-muted-foreground">
          Upload and manage transcripts and site media files
        </p>
      </div>

      <Tabs defaultValue="transcripts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transcripts" className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4" />
            <span>Transcripts</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Site Media</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transcripts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Project & Prospect</CardTitle>
                <CardDescription>
                  Choose a project and prospect to manage transcripts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
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
                </div>

                {selectedProjectId && (
                  <div>
                    <Select value={selectedProspectId} onValueChange={setSelectedProspectId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a prospect" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectProspects.map((prospect) => (
                          <SelectItem key={prospect.id} value={prospect.id}>
                            {prospect.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedProspectId && (
                  <FileUpload
                    type="transcript"
                    prospectId={selectedProspectId}
                    onUploadComplete={refetchTranscripts}
                  />
                )}
              </CardContent>
            </Card>

            {selectedProspectId && (
              <FileList
                files={transcripts}
                type="transcript"
                onRefresh={refetchTranscripts}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Project</CardTitle>
                <CardDescription>
                  Choose a project to manage site media files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
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
                </div>

                {selectedProjectId && (
                  <FileUpload
                    type="media"
                    projectId={selectedProjectId}
                    onUploadComplete={refetchSiteMedia}
                  />
                )}
              </CardContent>
            </Card>

            {selectedProjectId && (
              <FileList
                files={siteMedia}
                type="media"
                onRefresh={refetchSiteMedia}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FileManagement
