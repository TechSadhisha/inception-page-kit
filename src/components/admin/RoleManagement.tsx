
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Shield, Trash2, Search } from 'lucide-react';
import { useUserRoles, AppRole } from '@/hooks/useUserRoles';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const roleColors = {
  admin: 'bg-red-100 text-red-800',
  manager: 'bg-blue-100 text-blue-800',
  staff: 'bg-green-100 text-green-800',
};

const roleLabels = {
  admin: 'Admin',
  manager: 'Manager',
  staff: 'Staff',
};

export const RoleManagement = () => {
  const { allUserRoles, allRolesLoading, assignRole, removeRole, isAssigningRole, isRemovingRole } = useUserRoles();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('staff');
  const [dialogOpen, setDialogOpen] = useState(false);

  console.log('RoleManagement render - allUserRoles:', allUserRoles, 'loading:', allRolesLoading);

  // Get all users for role assignment
  const { data: allUsers, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      console.log('RoleManagement - fetching all users');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email');
      
      if (error) {
        console.error('RoleManagement - users fetch error:', error);
        throw error;
      }
      console.log('RoleManagement - fetched users:', data);
      return data;
    },
  });

  const filteredRoles = allUserRoles?.filter(role => {
    const user = role.profiles as any;
    const searchLower = searchTerm.toLowerCase();
    return (
      user?.full_name?.toLowerCase().includes(searchLower) ||
      user?.email?.toLowerCase().includes(searchLower) ||
      role.role.toLowerCase().includes(searchLower)
    );
  });

  const handleAssignRole = () => {
    if (selectedUserId && selectedRole) {
      assignRole({ userId: selectedUserId, role: selectedRole });
      setSelectedUserId('');
      setSelectedRole('staff');
      setDialogOpen(false);
    }
  };

  if (allRolesLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-2">Loading role management...</p>
      </div>
    );
  }

  if (usersError) {
    console.error('RoleManagement - users error:', usersError);
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-96">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
            <CardTitle>Error Loading Users</CardTitle>
            <CardDescription>
              Unable to load users data. Please try refreshing the page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Role Management</h2>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Assign Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign User Role</DialogTitle>
              <DialogDescription>
                Select a user and assign them a role in the system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user">User</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {allUsers?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleAssignRole} 
                disabled={!selectedUserId || isAssigningRole}
                className="w-full"
              >
                {isAssigningRole ? 'Assigning...' : 'Assign Role'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users or roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>User Roles</span>
          </CardTitle>
          <CardDescription>
            Current role assignments in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRoles && filteredRoles.length > 0 ? (
            <div className="space-y-4">
              {filteredRoles.map((userRole) => {
                const user = userRole.profiles as any;
                return (
                  <div key={userRole.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{user?.full_name || 'Unknown User'}</div>
                      <div className="text-sm text-muted-foreground">{user?.email}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={roleColors[userRole.role]}>
                        {roleLabels[userRole.role]}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRole(userRole.id)}
                        disabled={isRemovingRole}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : allUserRoles === undefined ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <div className="text-muted-foreground">Loading roles...</div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No user roles found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
