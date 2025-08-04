import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { User, Building2, Shield, Mail, Phone, MapPin, Save, Key, RefreshCw } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  youtube_api_key: string | null;
  company_id: string | null;
  company_role: string | null;
}

interface CompanyDetails {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  description: string | null;
}

const SystemSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: '',
  });

  // Load user profile and company data
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      try {
        // Load user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error loading profile:', profileError);
        } else {
          setProfile(profileData);
          
          // Load company details if user has a company
          if (profileData.company_id) {
            const { data: companyData, error: companyError } = await supabase
              .from('companies')
              .select('*')
              .eq('id', profileData.company_id)
              .single();

            if (companyError) {
              console.error('Error loading company:', companyError);
            } else {
              setCompanyDetails(companyData);
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Update user profile
  const updateFullName = async (fullName: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user?.id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update full name',
          variant: 'destructive',
        });
      } else {
        setProfile(prev => prev ? { ...prev, full_name: fullName } : null);
        toast({
          title: 'Success',
          description: 'Full name updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating full name:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Update YouTube API key
  const updateYouTubeKey = async (youtubeApiKey: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ youtube_api_key: youtubeApiKey })
        .eq('id', user?.id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update YouTube API key',
          variant: 'destructive',
        });
      } else {
        setProfile(prev => prev ? { ...prev, youtube_api_key: youtubeApiKey } : null);
        toast({
          title: 'Success',
          description: 'YouTube API key updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating YouTube API key:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Update company details
  const updateCompanyDetails = async (updatedDetails: Partial<CompanyDetails>) => {
    if (!profile?.company_id || profile.company_role !== 'company_admin') {
      toast({
        title: 'Access Denied',
        description: 'Only company administrators can update company details.',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update(updatedDetails)
        .eq('id', profile.company_id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update company details',
          variant: 'destructive',
        });
      } else {
        setCompanyDetails(prev => prev ? { ...prev, ...updatedDetails } : null);
        toast({
          title: 'Success',
          description: 'Company details updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating company:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Change password
  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) {
        toast({
          title: 'Password Update Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast({
          title: 'Password Updated',
          description: 'Your password has been successfully changed.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Password Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Change email
  const changeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: emailData.newEmail,
      });

      if (error) {
        toast({
          title: 'Email Update Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Email Update Initiated',
          description: 'Please check both your old and new email addresses to confirm the change.',
        });
        setEmailData({ newEmail: '', password: '' });
      }
    } catch (error: any) {
      toast({
        title: 'Email Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset password via email
  const resetPasswordViaEmail = async () => {
    if (!user?.email) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        toast({
          title: 'Reset Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Reset Email Sent',
          description: 'Check your email for the password reset link.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Reset Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Unable to load profile data.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            System Settings
          </CardTitle>
          <CardDescription>
            Manage your profile, security settings, and company information
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="full-name"
                      value={profile.full_name || ''}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                    <Button
                      onClick={() => updateFullName(profile.full_name || '')}
                      disabled={isUpdating}
                      size="sm"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Use the Security tab to change your email address
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-role">Company Role</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="company-role"
                      value={profile.company_role || 'employee'}
                      disabled
                      className="bg-muted"
                    />
                    <Badge variant={profile.company_role === 'company_admin' ? 'default' : 'secondary'}>
                      {profile.company_role === 'company_admin' ? 'Admin' : 'Employee'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-name">Company</Label>
                  <Input
                    id="company-name"
                    value={companyDetails?.name || 'No company assigned'}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your account password for better security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={changePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Must be at least 8 characters long
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Change Email Address
                </CardTitle>
                <CardDescription>
                  Update your email address (requires verification)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={changeEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-email">Current Email</Label>
                    <Input
                      id="current-email"
                      value={profile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-email">New Email Address</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={emailData.newEmail}
                      onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                      placeholder="Enter new email address"
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update Email'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Password Reset
                </CardTitle>
                <CardDescription>
                  Send a password reset link to your email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={resetPasswordViaEmail} disabled={isUpdating} variant="outline">
                  {isUpdating ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="company">
          {companyDetails ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Company Information
                </CardTitle>
                <CardDescription>
                  {profile.company_role === 'company_admin' 
                    ? 'Manage your company details and contact information'
                    : 'View your company information (contact admin to make changes)'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="company-name"
                        value={companyDetails.name}
                        onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                        placeholder="Enter company name"
                        disabled={profile.company_role !== 'company_admin'}
                      />
                      {profile.company_role === 'company_admin' && (
                        <Button
                          onClick={() => updateCompanyDetails({ name: companyDetails.name })}
                          disabled={isUpdating}
                          size="sm"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-email">Company Email</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="company-email"
                        type="email"
                        value={companyDetails.email || ''}
                        onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })}
                        placeholder="Enter company email"
                        disabled={profile.company_role !== 'company_admin'}
                      />
                      {profile.company_role === 'company_admin' && (
                        <Button
                          onClick={() => updateCompanyDetails({ email: companyDetails.email })}
                          disabled={isUpdating}
                          size="sm"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Phone Number</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="company-phone"
                        value={companyDetails.phone || ''}
                        onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                        placeholder="Enter phone number"
                        disabled={profile.company_role !== 'company_admin'}
                      />
                      {profile.company_role === 'company_admin' && (
                        <Button
                          onClick={() => updateCompanyDetails({ phone: companyDetails.phone })}
                          disabled={isUpdating}
                          size="sm"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-website">Website</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="company-website"
                        value={companyDetails.website || ''}
                        onChange={(e) => setCompanyDetails({ ...companyDetails, website: e.target.value })}
                        placeholder="https://example.com"
                        disabled={profile.company_role !== 'company_admin'}
                      />
                      {profile.company_role === 'company_admin' && (
                        <Button
                          onClick={() => updateCompanyDetails({ website: companyDetails.website })}
                          disabled={isUpdating}
                          size="sm"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-address">Address</Label>
                  <div className="flex space-x-2">
                    <Textarea
                      id="company-address"
                      value={companyDetails.address || ''}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })}
                      placeholder="Enter company address"
                      disabled={profile.company_role !== 'company_admin'}
                      className="min-h-[80px]"
                    />
                    {profile.company_role === 'company_admin' && (
                      <Button
                        onClick={() => updateCompanyDetails({ address: companyDetails.address })}
                        disabled={isUpdating}
                        size="sm"
                        className="self-start"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-description">Description</Label>
                  <div className="flex space-x-2">
                    <Textarea
                      id="company-description"
                      value={companyDetails.description || ''}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, description: e.target.value })}
                      placeholder="Enter company description"
                      disabled={profile.company_role !== 'company_admin'}
                      className="min-h-[100px]"
                    />
                    {profile.company_role === 'company_admin' && (
                      <Button
                        onClick={() => updateCompanyDetails({ description: companyDetails.description })}
                        disabled={isUpdating}
                        size="sm"
                        className="self-start"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No company information available.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage your API keys for external services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="youtube-api-key">YouTube Data API Key</Label>
                <div className="flex space-x-2">
                  <Input
                    id="youtube-api-key"
                    type="password"
                    value={profile.youtube_api_key || ''}
                    onChange={(e) => setProfile({ ...profile, youtube_api_key: e.target.value })}
                    placeholder="Enter your YouTube Data API key"
                  />
                  <Button
                    onClick={() => updateYouTubeKey(profile.youtube_api_key || '')}
                    disabled={isUpdating}
                    size="sm"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Required for YouTube video search functionality. Get your key from{' '}
                  <a 
                    href="https://console.developers.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Cloud Console
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;