
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageList } from '@/components/messaging/MessageList';
import { MessageInput } from '@/components/messaging/MessageInput';
import { useMessages } from '@/hooks/useMessages';
import { useProjects } from '@/hooks/useProjects';
import { MessageSquare } from 'lucide-react';

const TeamMessages = () => {
  const { projectId: urlProjectId } = useParams();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(urlProjectId || '');
  const { projects } = useProjects();
  const { messages, isLoading, sendMessage, isSending } = useMessages(selectedProjectId);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Team Messages</h1>
        <p className="text-muted-foreground">
          Communicate with your team members on project updates and discussions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Select Project</span>
              </CardTitle>
              <CardDescription>
                Choose a project to view and send messages
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

              {selectedProject && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <h3 className="font-medium">{selectedProject.name}</h3>
                  {selectedProject.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedProject.description}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selectedProjectId ? (
            <>
              <MessageList messages={messages} loading={isLoading} />
              <Card>
                <CardHeader>
                  <CardTitle>Send Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <MessageInput 
                    onSendMessage={sendMessage} 
                    loading={isSending}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-96">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a project to start messaging</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMessages;
