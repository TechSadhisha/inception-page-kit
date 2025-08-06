
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Building, LogOut, User, Home, FolderOpen, Users, Files, MessageSquare, BarChart3, FileText, CheckSquare, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import sadhishaLogo from '@/assets/sadhisha-logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

// AppSidebar Component
const AppSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
    { path: '/prospects', label: 'Prospects', icon: Users },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/files', label: 'Files', icon: Files },
    { path: '/scripts', label: 'Scripts', icon: FileText },
    { path: '/messages', label: 'Messages', icon: MessageSquare },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <Sidebar className={`${state === "collapsed" ? "w-14" : "w-64"} transition-all duration-300`} collapsible="icon">
      <SidebarContent className="bg-sidebar-background">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src={sadhishaLogo} alt="Sadhisha" className="h-6 w-6 object-contain flex-shrink-0" />
            {state !== "collapsed" && (
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-sidebar-foreground truncate">Sadhisha Real CRM</h1>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className={`${state === "collapsed" ? 'sr-only' : ''} text-sidebar-foreground/70`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      asChild 
                      className={`w-full justify-start ${
                        active 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <Link to={item.path} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {state !== "collapsed" && <span className="truncate">{item.label}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`w-full justify-start p-2 h-auto hover:bg-sidebar-accent/50 ${state === "collapsed" ? 'px-2' : 'px-3'}`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                    {user?.user_metadata?.full_name 
                      ? getInitials(user.user_metadata.full_name)
                      : user?.email?.charAt(0).toUpperCase() || 'U'
                    }
                  </AvatarFallback>
                </Avatar>
                {state !== "collapsed" && (
                  <div className="flex flex-col items-start ml-3 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user?.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-sidebar-foreground/70 truncate">
                      {user?.email}
                    </p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" side="right">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Global header with hamburger trigger */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border shadow-sm z-50 flex items-center px-4">
          <SidebarTrigger className="mr-4 hover:bg-accent hover:text-accent-foreground" />
          <div className="flex items-center space-x-2">
            <img src={sadhishaLogo} alt="Sadhisha" className="h-5 w-5 object-contain md:hidden" />
            <span className="font-semibold text-foreground text-sm md:hidden">Sadhisha CRM</span>
          </div>
        </header>

        <AppSidebar />
        
        <main className="flex-1 pt-14 overflow-auto">
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
