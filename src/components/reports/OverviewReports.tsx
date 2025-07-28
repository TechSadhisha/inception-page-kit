
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjects } from '@/hooks/useProjects';
import { useProspects } from '@/hooks/useProspects';
import { useReports } from '@/hooks/useReports';
import { TrendingUp, TrendingDown, FolderOpen, Users, MessageSquare, Target } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ActivityChart } from './ActivityChart';

export function OverviewReports() {
  const { projects } = useProjects();
  const { prospects } = useProspects();
  const { overviewMetrics, isLoading } = useReports();

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalProspects = prospects.length;
  const hotProspects = prospects.filter(p => p.interest_rating && p.interest_rating >= 4).length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Projects"
          value={activeProjects}
          description="Currently in progress"
          icon={FolderOpen}
          trend={overviewMetrics?.projectsTrend}
        />
        
        <MetricCard
          title="Completed Projects"
          value={completedProjects}
          description="Successfully finished"
          icon={Target}
          trend={overviewMetrics?.completedTrend}
        />
        
        <MetricCard
          title="Total Prospects"
          value={totalProspects}
          description="All prospects in system"
          icon={Users}
          trend={overviewMetrics?.prospectsTrend}
        />
        
        <MetricCard
          title="Hot Prospects"
          value={hotProspects}
          description="High interest rating (4-5)"
          icon={TrendingUp}
          trend={overviewMetrics?.hotProspectsTrend}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>Current status of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart data={overviewMetrics?.projectStatusData || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prospect Interest Levels</CardTitle>
            <CardDescription>Distribution of prospect interest ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart data={overviewMetrics?.prospectInterestData || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
