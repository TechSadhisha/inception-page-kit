
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProspects } from '@/hooks/useProspects';
import { useProjects } from '@/hooks/useProjects';
import { ActivityChart } from './ActivityChart';
import { MetricCard } from './MetricCard';
import { Users, TrendingUp, Star, Mail } from 'lucide-react';

export function ProspectReports() {
  const { prospects } = useProspects();
  const { projects } = useProjects();

  const prospectStatusData = [
    { name: 'New', value: prospects.filter(p => p.status === 'new').length, color: '#FFBB28' },
    { name: 'Contacted', value: prospects.filter(p => p.status === 'contacted').length, color: '#00C49F' },
    { name: 'Qualified', value: prospects.filter(p => p.status === 'qualified').length, color: '#0088FE' },
    { name: 'Converted', value: prospects.filter(p => p.status === 'converted').length, color: '#8884D8' },
    { name: 'Lost', value: prospects.filter(p => p.status === 'lost').length, color: '#FF8042' },
  ];

  const interestRatingData = [
    { name: '1 Star', value: prospects.filter(p => p.interest_rating === 1).length, color: '#FF8042' },
    { name: '2 Stars', value: prospects.filter(p => p.interest_rating === 2).length, color: '#FFBB28' },
    { name: '3 Stars', value: prospects.filter(p => p.interest_rating === 3).length, color: '#00C49F' },
    { name: '4 Stars', value: prospects.filter(p => p.interest_rating === 4).length, color: '#0088FE' },
    { name: '5 Stars', value: prospects.filter(p => p.interest_rating === 5).length, color: '#8884D8' },
  ];

  const prospectsByMonth = prospects.reduce((acc, prospect) => {
    const month = new Date(prospect.created_at!).toLocaleString('default', { month: 'short', year: '2-digit' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = Object.entries(prospectsByMonth).map(([month, count]) => ({
    name: month,
    value: count,
  }));

  const conversionRate = prospects.length > 0 
    ? Math.round((prospects.filter(p => p.status === 'converted').length / prospects.length) * 100)
    : 0;

  const avgInterestRating = prospects.length > 0
    ? (prospects.reduce((acc, p) => acc + (p.interest_rating || 0), 0) / prospects.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Prospect Analytics</h2>
        <p className="text-muted-foreground">Insights into prospect engagement and conversion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Prospects"
          value={prospects.length}
          description="All prospects in system"
          icon={Users}
        />
        
        <MetricCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          description="Prospects to customers"
          icon={TrendingUp}
        />
        
        <MetricCard
          title="Avg. Interest Rating"
          value={avgInterestRating}
          description="Out of 5 stars"
          icon={Star}
        />
        
        <MetricCard
          title="With Contact Info"
          value={prospects.filter(p => p.email || p.phone).length}
          description="Prospects with email/phone"
          icon={Mail}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prospect Status Distribution</CardTitle>
            <CardDescription>Current status of all prospects</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart data={prospectStatusData} type="pie" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interest Rating Distribution</CardTitle>
            <CardDescription>Prospect interest levels (1-5 stars)</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart data={interestRatingData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prospects Over Time</CardTitle>
            <CardDescription>Monthly prospect acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart data={monthlyData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Projects</CardTitle>
            <CardDescription>Projects with most qualified prospects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects
                .map(project => ({
                  ...project,
                  qualifiedCount: prospects.filter(p => p.project_id === project.id && p.status === 'qualified').length,
                  totalCount: prospects.filter(p => p.project_id === project.id).length,
                }))
                .sort((a, b) => b.qualifiedCount - a.qualifiedCount)
                .slice(0, 5)
                .map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {project.qualifiedCount} qualified out of {project.totalCount} total
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{project.qualifiedCount}</div>
                      <div className="text-xs text-muted-foreground">
                        {project.totalCount > 0 ? Math.round((project.qualifiedCount / project.totalCount) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
