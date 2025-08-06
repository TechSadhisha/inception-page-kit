
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Users, FileText, MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import sadhishaLogo from '@/assets/sadhisha-logo.png';

const Index = () => {
  const { user } = useAuth();

  const quickStats = [
    { title: 'Active Projects', value: '0', icon: Building, color: 'text-blue-600' },
    { title: 'Total Prospects', value: '0', icon: Users, color: 'text-green-600' },
    { title: 'Reports Generated', value: '0', icon: FileText, color: 'text-purple-600' },
    { title: 'Messages', value: '0', icon: MessageSquare, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Sadhisha Real CRM Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back, {user?.user_metadata?.full_name || user?.email}
          </p>
        </div>
        <Link to="/projects">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">{stat.title}</CardTitle>
              <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color} flex-shrink-0`} />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Projects</CardTitle>
            <CardDescription className="text-sm">Your latest real estate projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 sm:py-6 text-muted-foreground text-sm sm:text-base">
              No projects yet. Create your first project to get started.
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
            <CardDescription className="text-sm">Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 sm:py-6 text-muted-foreground text-sm sm:text-base">
              No recent activity to display.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-sm">Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            <Link to="/projects">
              <Button variant="outline" className="h-16 sm:h-20 flex-col space-y-1 sm:space-y-2 w-full hover:bg-accent hover:text-accent-foreground transition-colors">
                <Building className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Create Project</span>
              </Button>
            </Link>
            <Link to="/prospects">
              <Button variant="outline" className="h-16 sm:h-20 flex-col space-y-1 sm:space-y-2 w-full hover:bg-accent hover:text-accent-foreground transition-colors">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Add Prospect</span>
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="outline" className="h-16 sm:h-20 flex-col space-y-1 sm:space-y-2 w-full hover:bg-accent hover:text-accent-foreground transition-colors">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Generate Report</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
