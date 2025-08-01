import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Home, 
  FolderOpen, 
  Users, 
  CheckSquare, 
  MessageSquare, 
  BarChart3, 
  FileText,
  Files,
  BookOpen,
  Building2,
  Workflow,
  Plug,
  Shield,
  Mail,
  MessageCircle,
  Target,
  MapPin,
  Zap,
  Settings
} from 'lucide-react'

const UserManual = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Manual</h1>
          <p className="text-muted-foreground">Complete guide to using the Real Estate CRM</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Version 1.0
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Overview</span>
            </CardTitle>
            <CardDescription>
              This Real Estate CRM is a comprehensive lead generation and management platform designed specifically for real estate professionals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The platform combines project management, lead generation, campaign management, and team collaboration tools in a unified interface to streamline your real estate operations from lead generation to deal closure.
            </p>
          </CardContent>
        </Card>

        {/* Core Features */}
        <Card>
          <CardHeader>
            <CardTitle>Core Features</CardTitle>
            <CardDescription>Main modules and their capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Dashboard */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Home className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Dashboard</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Overview of your CRM with quick statistics, recent projects, activity feed, and quick actions for common tasks.
                </p>
              </div>

              {/* Project Management */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Project Management</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create and manage real estate projects with different statuses, team assignments, and integrated sheets and lead centres.
                </p>
              </div>

              {/* Prospect Management */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Prospect Management</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage potential clients with scoring, contact tracking, Google Maps scraping, and bulk import capabilities.
                </p>
              </div>

              {/* Campaign Management */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Campaign Management</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create and manage Meta/Facebook advertising campaigns with targeting, budget management, and direct publishing.
                </p>
              </div>

              {/* Task Management */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Task Management</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create, assign, and track tasks with calendar integration and team collaboration features.
                </p>
              </div>

              {/* Communication Tools */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Communication Tools</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Team messaging, WhatsApp integration, and email management with Gmail connectivity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Feature Guide</CardTitle>
            <CardDescription>Step-by-step guides for key features</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-6">
                {/* Campaign Creation */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>Campaign Creation Workflow</span>
                  </h3>
                  <div className="space-y-2 ml-6">
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline" className="text-xs">1</Badge>
                      <p className="text-sm">Configure basic campaign details: name, platform, budget, and objectives</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline" className="text-xs">2</Badge>
                      <p className="text-sm">Add creative elements: headlines, descriptions, and image uploads</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline" className="text-xs">3</Badge>
                      <p className="text-sm">Set targeting options: geographic, demographic, and interest-based</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline" className="text-xs">4</Badge>
                      <p className="text-sm">Save as draft or publish directly to Meta/Facebook</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Lead Integration */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Lead Integration Process</span>
                  </h3>
                  <div className="space-y-2 ml-6">
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline" className="text-xs">1</Badge>
                      <p className="text-sm">Configure API credentials for lead sources (MagicBricks, 99acres, Housing.com)</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline" className="text-xs">2</Badge>
                      <p className="text-sm">Set up Facebook Lead Forms integration</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline" className="text-xs">3</Badge>
                      <p className="text-sm">Configure automatic lead assignment rules</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline" className="text-xs">4</Badge>
                      <p className="text-sm">Monitor and sync leads regularly</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Prospect Discovery */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Prospect Discovery</span>
                  </h3>
                  <div className="space-y-2 ml-6">
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline" className="text-xs">1</Badge>
                      <p className="text-sm">Use Google Maps scraping for business discovery by category and location</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline" className="text-xs">2</Badge>
                      <p className="text-sm">Leverage Apify integration for automated contact collection</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline" className="text-xs">3</Badge>
                      <p className="text-sm">Import prospects in bulk with data validation</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plug className="h-5 w-5" />
              <span>Integration Capabilities</span>
            </CardTitle>
            <CardDescription>Connect with external platforms and services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Social Media</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Facebook/Meta Ads</li>
                  <li>• WhatsApp Business</li>
                  <li>• Instagram campaigns</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Real Estate Portals</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• MagicBricks</li>
                  <li>• 99acres</li>
                  <li>• Housing.com</li>
                  <li>• Callyzer</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Google Services</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Gmail integration</li>
                  <li>• Google Sheets</li>
                  <li>• Google Maps</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>User Roles & Permissions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 p-3 border rounded">
                <Badge variant="default">Admin</Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Full system access</li>
                  <li>• User management</li>
                  <li>• Integration configuration</li>
                  <li>• System settings</li>
                </ul>
              </div>
              <div className="space-y-2 p-3 border rounded">
                <Badge variant="secondary">Manager</Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Team management</li>
                  <li>• Lead assignment</li>
                  <li>• Report access</li>
                  <li>• Project oversight</li>
                </ul>
              </div>
              <div className="space-y-2 p-3 border rounded">
                <Badge variant="outline">Staff</Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Basic CRM functions</li>
                  <li>• Assigned leads/prospects</li>
                  <li>• Task management</li>
                  <li>• Limited reporting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Best Practices</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Project Organization</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Create projects for each real estate development or campaign</li>
                  <li>• Use consistent naming conventions</li>
                  <li>• Assign team members appropriately</li>
                  <li>• Regularly update project status</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Lead Management</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Configure integrations before starting campaigns</li>
                  <li>• Set up automated assignment rules</li>
                  <li>• Regularly sync lead sources</li>
                  <li>• Maintain clean contact data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Campaign Optimization</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Start with small budgets for testing</li>
                  <li>• Monitor performance regularly</li>
                  <li>• A/B test creative elements</li>
                  <li>• Use targeting insights for optimization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Quick Reference</CardTitle>
            <CardDescription>Quick access to all features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 text-sm">
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Home className="h-4 w-4 text-primary" />
                <span>Dashboard: /</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <FolderOpen className="h-4 w-4 text-primary" />
                <span>Projects: /projects</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Users className="h-4 w-4 text-primary" />
                <span>Prospects: /prospects</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Target className="h-4 w-4 text-primary" />
                <span>Campaigns: /campaigns</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <CheckSquare className="h-4 w-4 text-primary" />
                <span>Tasks: /tasks</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>Messages: /messages</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span>WhatsApp: /whatsapp</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Mail className="h-4 w-4 text-primary" />
                <span>Emails: /emails</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>Reports: /reports</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <FileText className="h-4 w-4 text-primary" />
                <span>Scripts: /scripts</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Files className="h-4 w-4 text-primary" />
                <span>Files: /files</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Knowledge: /knowledge</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Building2 className="h-4 w-4 text-primary" />
                <span>Properties: /properties</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Workflow className="h-4 w-4 text-primary" />
                <span>Workflows: /workflows</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Plug className="h-4 w-4 text-primary" />
                <span>Integrations: /integrations</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Shield className="h-4 w-4 text-primary" />
                <span>Admin: /admin</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserManual