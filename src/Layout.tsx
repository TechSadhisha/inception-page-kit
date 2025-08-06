
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
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
  LogOut,
  Shield,
  Mail,
  MessageCircle,
  Target,
  HelpCircle
} from 'lucide-react'

const Layout = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Prospects', href: '/prospects', icon: Users },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'WhatsApp', href: '/whatsapp', icon: MessageCircle },
    { name: 'Campaigns', href: '/campaigns', icon: Target },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Scripts', href: '/scripts', icon: FileText },
    { name: 'Files', href: '/files', icon: Files },
    { name: 'Knowledge Base', href: '/knowledge', icon: BookOpen },
    { name: 'Emails', href: '/emails', icon: Mail },
    { name: 'Properties', href: '/properties', icon: Building2 },
    { name: 'Workflows', href: '/workflows', icon: Workflow },
    { name: 'Integrations', href: '/integrations', icon: Plug },
    { name: 'User Manual', href: '/manual', icon: HelpCircle },
  ]

  if (!user) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h1 className="text-xl font-bold text-foreground">Real Estate CRM</h1>
            </div>
            
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
              
              {/* Admin link - accessible to all authenticated users */}
              <Link
                to="/admin"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Shield className="mr-3 h-5 w-5" />
                Admin
              </Link>
            </nav>

            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout
