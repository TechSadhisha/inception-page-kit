import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Mail, Settings, AlertCircle } from 'lucide-react';
import { useGmailAuth } from '@/hooks/useGmailAuth';
import { useEmails, Email } from '@/hooks/useEmails';
import EmailList from '@/components/emails/EmailList';
import EmailViewer from '@/components/emails/EmailViewer';
import GmailSettings from '@/components/emails/GmailSettings';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Emails = () => {
  const clientId = '138902426572-6r4mh1e8a195tcvbtveach637elc63pi.apps.googleusercontent.com';
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const { isAuthenticated, signInWithGoogle, signOut, isLoading, accessToken } = useGmailAuth(clientId);
  const { emails, emailsLoading, syncStatus, syncEmails, isSyncing, markAsRead, deleteEmail } = useEmails();

  const unreadCount = emails.filter(email => !email.is_read).length;

  const handleSyncEmails = () => {
    if (accessToken) {
      syncEmails(accessToken);
    }
  };

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    if (!email.is_read) {
      markAsRead(email.id);
    }
  };

  const handleDeleteEmail = (emailId: string) => {
    deleteEmail(emailId);
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    }
  };

  // If viewing a specific email, show the email viewer
  if (selectedEmail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/lovable-uploads/50b094d9-5ab3-47e8-ae1d-a4820f6ec638.png" alt="Sadhisha Logo" className="h-8 w-8" />
            <h1 className="text-3xl font-bold text-foreground">Sadhisha Real CRM - Email Management</h1>
          </div>
          <Button variant="outline" onClick={() => signOut()}>
            Disconnect Gmail
          </Button>
        </div>

        <EmailViewer
          email={selectedEmail}
          onBack={() => setSelectedEmail(null)}
          onMarkAsRead={markAsRead}
          onDeleteEmail={handleDeleteEmail}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-3">
            <img src="/lovable-uploads/50b094d9-5ab3-47e8-ae1d-a4820f6ec638.png" alt="Sadhisha Logo" className="h-8 w-8" />
            <h1 className="text-3xl font-bold text-foreground">Sadhisha Real CRM - Email Management</h1>
          </div>
          {unreadCount > 0 && (
            <Badge variant="default" className="px-3 py-1">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSyncEmails}
              disabled={isSyncing || !accessToken}
              variant="outline"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Emails
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => signOut()}>
              <Settings className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="inbox">
            <Mail className="mr-2 h-4 w-4" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Gmail Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          {!isAuthenticated ? (
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Connect Your Gmail Account</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Connect your Gmail account to monitor and manage your emails directly from this app.
                </p>
                <Button 
                  onClick={() => signInWithGoogle(clientId)}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect Gmail Account'
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {syncStatus && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Last sync: {syncStatus.last_sync_at 
                          ? new Date(syncStatus.last_sync_at).toLocaleString()
                          : 'Never'
                        }
                      </span>
                      <Badge variant={syncStatus.is_enabled ? 'default' : 'secondary'}>
                        {syncStatus.is_enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Inbox ({emails.length} emails)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {emailsLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Loading emails...</p>
                    </div>
                  ) : emails.length === 0 ? (
                    <div className="text-center py-8">
                      <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No emails found. Try syncing your Gmail account.</p>
                    </div>
                  ) : (
                    <EmailList
                      emails={emails}
                      onEmailSelect={handleEmailSelect}
                      onMarkAsRead={markAsRead}
                      onDeleteEmail={handleDeleteEmail}
                    />
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {!isAuthenticated && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                To get started, configure your Gmail settings in the "Gmail Settings" tab, then connect your account.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <GmailSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Emails;
