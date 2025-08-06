
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Settings, UserPlus, Key, Mail } from 'lucide-react';
import { RoleManagement } from '@/components/admin/RoleManagement';
import UserInvitations from '@/components/admin/UserInvitations';
import ProductKeyManagement from '@/components/admin/ProductKeyManagement';
import UpgradeRequestForm from '@/components/admin/UpgradeRequestForm';
import SystemSettings from '@/components/admin/SystemSettings';

const Admin = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage system settings and user permissions
        </p>
      </div>

      <Tabs defaultValue="invitations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="invitations" className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>User Invitations</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Role Management</span>
          </TabsTrigger>
          <TabsTrigger value="product-keys" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>Product Keys</span>
          </TabsTrigger>
          <TabsTrigger value="upgrade-requests" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Upgrade Requests</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>System Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invitations">
          <UserInvitations />
        </TabsContent>

        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>

        <TabsContent value="product-keys">
          <ProductKeyManagement />
        </TabsContent>

        <TabsContent value="upgrade-requests">
          <UpgradeRequestForm />
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
