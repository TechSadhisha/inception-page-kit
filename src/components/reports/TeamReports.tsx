
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProspects } from '@/hooks/useProspects';
import { useMessages } from '@/hooks/useMessages';
import { useProjects } from '@/hooks/useProjects';
import { ActivityChart } from './ActivityChart';
import { MetricCard } from './MetricCard';
import { Users, MessageSquare, UserCheck, Clock } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TeamReports() {
  const { prospects } = useProspects();
  const { projects } = useProjects();

  // Mock team data - in a real app, this would come from a team members query
  const teamMembers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', assignedProspects: 12, createdProjects: 3 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', assignedProspects: 8, createdProjects: 2 },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', assignedProspects: 15, createdProjects: 4 },
  ];

  const assignedProspects = prospects.filter(p => p.assigned_to).length;
  const unassignedProspects = prospects.filter(p => !p.assigned_to).length;

  const workloadData = teamMembers.map(member => ({
    name: member.name.split(' ')[0],
    value: member.assignedProspects,
  }));

  const projectCreationData = teamMembers.map(member => ({
    name: member.name.split(' ')[0],
    value: member.createdProjects,
  }));

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Team Performance</h2>
        <p className="text-muted-foreground">Insights into team productivity and workload distribution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Team Members"
          value={teamMembers.length}
          description="Active team members"
          icon={Users}
        />
        
        <MetricCard
          title="Assigned Prospects"
          value={assignedProspects}
          description="Prospects with owners"
          icon={UserCheck}
        />
        
        <MetricCard
          title="Unassigned"
          value={unassignedProspects}
          description="Prospects needing assignment"
          icon={Clock}
        />
        
        <MetricCard
          title="Avg. Workload"
          value={Math.round(assignedProspects / teamMembers.length)}
          description="Prospects per team member"
          icon={MessageSquare}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workload Distribution</CardTitle>
            <CardDescription>Assigned prospects per team member</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart data={workloadData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Creation</CardTitle>
            <CardDescription>Projects created by team members</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart data={projectCreationData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Member Details</CardTitle>
          <CardDescription>Individual performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-lg font-bold">{member.assignedProspects}</div>
                    <div className="text-xs text-muted-foreground">Assigned Prospects</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{member.createdProjects}</div>
                    <div className="text-xs text-muted-foreground">Created Projects</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Status</CardTitle>
            <CardDescription>Prospect assignment distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart 
              data={[
                { name: 'Assigned', value: assignedProspects, color: '#00C49F' },
                { name: 'Unassigned', value: unassignedProspects, color: '#FF8042' },
              ]} 
              type="pie" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productivity Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average prospects per member</span>
                <span className="font-medium">{Math.round(assignedProspects / teamMembers.length)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average projects per member</span>
                <span className="font-medium">{Math.round(projects.length / teamMembers.length)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Team assignment rate</span>
                <span className="font-medium">
                  {Math.round((assignedProspects / prospects.length) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Most active member</span>
                <span className="font-medium">
                  {teamMembers.reduce((prev, current) => 
                    prev.assignedProspects > current.assignedProspects ? prev : current
                  ).name.split(' ')[0]}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
