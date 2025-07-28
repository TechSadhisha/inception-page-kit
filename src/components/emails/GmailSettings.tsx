
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Plus, Trash2, Mail, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGmailAccounts } from '@/hooks/useGmailAccounts';
import { useGmailAuth } from '@/hooks/useGmailAuth';

interface GmailSettingsProps {
  onAccountAdded?: () => void;
  onAccountRemoved?: () => void;
}

const GmailSettings: React.FC<GmailSettingsProps> = ({ onAccountAdded, onAccountRemoved }) => {
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const { toast } = useToast();
  const { 
    accounts, 
    isLoading, 
    addAccount, 
    isAddingAccount: isSubmitting, 
    updateConnection, 
    isUpdatingConnection, 
    removeAccount, 
    isRemovingAccount 
  } = useGmailAccounts();
  const clientId = '138902426572-6r4mh1e8a195tcvbtveach637elc63pi.apps.googleusercontent.com';
  const { signInWithGoogle, signOut } = useGmailAuth(clientId);

  const form = useForm({
    defaultValues: {
      email: '',
      clientId: '',
      clientSecret: '',
    }
  });

  const handleAddAccount = (data: any) => {
    addAccount({
      email: data.email,
      client_id: data.clientId,
      client_secret: data.clientSecret,
    });
    setIsAddingAccount(false);
    form.reset();
    onAccountAdded?.();
  };

  const handleRemoveAccount = (accountId: string) => {
    removeAccount(accountId);
    onAccountRemoved?.();
  };

  const handleConnectAccount = async (accountId: string) => {
  const account = accounts.find(acc => acc.id === accountId);
  
  if (!account?.client_id) {
    toast({
      title: "Error",
      description: "Client ID is required to connect this account.",
      variant: "destructive",
    });
    return;
  }

  try {
    // Call signInWithGoogle without arguments since clientId is passed to hook already
    await signInWithGoogle(account.client_id);

    // The OAuth flow should handle updating the authorized user/token internally

    // Update connection status in your app state/db
    updateConnection({
      accountId,
      isConnected: true,
    });
  } catch (error: any) {
    toast({
      title: "Connection Failed",
      description: error.message || "Failed to connect Gmail account.",
      variant: "destructive",
    });
  }
};

const handleDisconnectAccount = async (accountId: string) => {
  const account = accounts.find(acc => acc.id === accountId);

  if (account?.email) {
    // Pass email to signOut to disconnect specific account
    await signOut(account.email);
  }

  // Update connection status locally or in backend
  updateConnection({
    accountId,
    isConnected: false,
  });
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gmail Settings</h2>
          <p className="text-muted-foreground">Manage your Gmail account connections and OAuth settings</p>
        </div>
        <Dialog open={isAddingAccount} onOpenChange={setIsAddingAccount}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Gmail Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Gmail Account</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddAccount)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gmail Address</FormLabel>
                      <FormControl>
                        <Input placeholder="user@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OAuth Client ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Google OAuth Client ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OAuth Client Secret</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Your Google OAuth Client Secret" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddingAccount(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Account
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList>
          <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
          <TabsTrigger value="oauth">OAuth Configuration</TabsTrigger>
          <TabsTrigger value="sync">Sync Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="text-center py-8">
                <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Loading Gmail accounts...</p>
              </CardContent>
            </Card>
          ) : accounts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No Gmail accounts configured</p>
                <Button className="mt-4" onClick={() => setIsAddingAccount(true)}>
                  Add Your First Gmail Account
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {accounts.map((account) => (
                <Card key={account.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{account.email}</p>
                          {account.last_sync_at && (
                            <p className="text-sm text-muted-foreground">
                              Last sync: {new Date(account.last_sync_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={account.is_connected ? 'default' : 'secondary'}>
                          {account.is_connected ? (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Connected
                            </>
                          ) : (
                            <>
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Disconnected
                            </>
                          )}
                        </Badge>
                        {account.is_connected ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isUpdatingConnection}
                            onClick={() => handleDisconnectAccount(account.id)}
                          >
                            {isUpdatingConnection && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                            Disconnect
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            disabled={isUpdatingConnection}
                            onClick={() => handleConnectAccount(account.id)}
                          >
                            {isUpdatingConnection && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                            Connect
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isRemovingAccount}
                          onClick={() => handleRemoveAccount(account.id)}
                        >
                          {isRemovingAccount ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="oauth" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              To connect Gmail accounts, you need to set up OAuth credentials in Google Cloud Console.
              Visit the <a href="https://console.cloud.google.com/apis/credentials" className="underline" target="_blank" rel="noopener noreferrer">
                Google Cloud Console
              </a> to create OAuth 2.0 credentials.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>OAuth Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">1. Create OAuth 2.0 Credentials</h4>
                <p className="text-sm text-muted-foreground">
                  Go to Google Cloud Console → APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client IDs
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">2. Configure Authorized Domains</h4>
                <p className="text-sm text-muted-foreground">
                  Add your domain to the OAuth consent screen under "Authorized domains"
                </p>
                <code className="block p-2 bg-muted rounded text-sm">
                  {window.location.hostname}
                </code>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">3. Set Authorized Redirect URIs</h4>
                <p className="text-sm text-muted-foreground">
                  Add this URL to your OAuth client configuration:
                </p>
                <code className="block p-2 bg-muted rounded text-sm">
                  {window.location.origin}/emails
                </code>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">4. Required Scopes</h4>
                <p className="text-sm text-muted-foreground">
                  Your OAuth client should request these scopes:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>https://www.googleapis.com/auth/gmail.readonly</li>
                  <li>https://www.googleapis.com/auth/userinfo.email</li>
                  <li>https://www.googleapis.com/auth/userinfo.profile</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Sync</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync emails every 15 minutes
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sync History</p>
                  <p className="text-sm text-muted-foreground">
                    How far back to sync emails (default: 30 days)
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Filters</p>
                  <p className="text-sm text-muted-foreground">
                    Only sync emails matching specific criteria
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GmailSettings;
