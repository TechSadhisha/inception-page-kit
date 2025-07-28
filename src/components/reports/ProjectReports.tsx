
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/hooks/useProjects';
import { useProspects } from '@/hooks/useProspects';
import { useState } from 'react';
import { ActivityChart } from './ActivityChart';
import { MetricCard } from './MetricCard';
import { FolderOpen, Users, Calendar, Target } from 'lucide-react';
import { format } from 'date-fns';

export function ProjectReports() {
  const { projects } = useProjects();
  const { prospects } = useProspects();
  const [selectedProject, setSelectedProject] = useState<string>('all');

  const filteredProspects = selectedProject === 'all' 
    ? prospects 
    : prospects.filter(p => p.project_id === selectedProject);

  const projectStatusData = [
    { name: 'Planning', value: projects.filter(p => p.status === 'planning').length, color: '#FFBB28' },
    { name: 'Active', value: projects.filter(p => p.status === 'active').length, color: '#00C49F' },
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: '#0088FE' },
    { name: 'On Hold', value: projects.filter(p => p.status === 'on_hold').length, color: '#FF8042' },
  ];

  const prospectsByProject = projects.map(project => ({
    name: project.name,
    value: prospects.filter(p => p.project_id === project.id).length,
  }));

  const selectedProjectData = selectedProject !== 'all' 
    ? projects.find(p => p.id === selectedProject)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Analytics</h2>
          <p className="text-muted-foreground">Detailed insights into project performance</p>
        </div>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select project" />
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Projects"
          value={projects.length}
          description="All projects in system"
          icon={FolderOpen}
        />
        
        <MetricCard
          title="Active Projects"
          value={projects.filter(p => p.status === 'active').length}
          description="Currently in progress"
          icon={Target}
        />
        
        <MetricCard
          title="Project Prospects"
          value={filteredProspects.length}
          description={selectedProject === 'all' ? 'All prospects' : 'Project prospects'}
          icon={Users}
        />
        
        <MetricCard
          title="Avg. Project Age"
          value={`${Math.round(projects.reduce((acc, p) => {
            const days = Math.floor((Date.now() - new Date(p.created_at!).getTime()) / (1000 * 60 * 60 * 24));
            return acc + days;
          }, 0) / projects.length) || 0}d`}
          description="Average project duration"
          icon={Calendar}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>Current status of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart data={projectStatusData} type="pie" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prospects by Project</CardTitle>
            <CardDescription>Number of prospects per project</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart data={prospectsByProject} />
          </CardContent>
        </Card>
      </div>

      {selectedProjectData && (
        <Card>
          <CardHeader>
            <CardTitle>Project Details: {selectedProjectData.name}</CardTitle>
            <CardDescription>
              Created {format(new Date(selectedProjectData.created_at!), 'PPP')} • 
              Status: {selectedProjectData.status}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">
                  {selectedProjectData.description || 'No description provided'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{filteredProspects.length}</div>
                  <div className="text-sm text-muted-foreground">Total Prospects</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {filteredProspects.filter(p => p.interest_rating && p.interest_rating >= 4).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Hot Prospects</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {Math.round((filteredProspects.filter(p => p.interest_rating && p.interest_rating >= 4).length / filteredProspects.length) * 100) || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Conversion Rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
