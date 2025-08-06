
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Building, ArrowLeft, Mail, Shield, Home, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import sadhishaLogo from '@/assets/sadhisha-logo.png';

const Auth = () => {
  const { signIn, loading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [currentView, setCurrentView] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
    companyName: '',
    isCompanyAdmin: true, // First user is always company admin
  });

  const [resetData, setResetData] = useState({
    email: '',
  });

  const [newPasswordData, setNewPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });

  // Check if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Handle password reset from email link
  useEffect(() => {
    const handlePasswordReset = async () => {
      const access_token = searchParams.get('access_token');
      const refresh_token = searchParams.get('refresh_token');
      const type = searchParams.get('type');

      if (access_token && refresh_token && type === 'recovery') {
        try {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          
          if (error) throw error;
          
          setCurrentView('reset-password');
          toast({
            title: 'Password Reset',
            description: 'Please enter your new password.',
          });
        } catch (error: any) {
          toast({
            title: 'Invalid Reset Link',
            description: 'The password reset link is invalid or has expired.',
            variant: 'destructive',
          });
        }
      }
    };

    handlePasswordReset();
  }, [searchParams, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'Login Failed',
            description: 'Invalid email or password. Please check your credentials and try again.',
            variant: 'destructive',
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: 'Email Not Verified',
            description: 'Please check your email and click the verification link.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Login Failed',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have been successfully logged in.',
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate password strength
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (signupData.password.length < 8) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(signupData.password);
    const hasLowerCase = /[a-z]/.test(signupData.password);
    const hasNumbers = /\d/.test(signupData.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(signupData.password);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      toast({
        title: 'Weak Password',
        description: 'Password must contain uppercase, lowercase, number, and special character.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/auth`;
      
      // First create the company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: signupData.companyName,
        })
        .select()
        .maybeSingle();

      if (companyError) {
        toast({
          title: 'Company Creation Failed',
          description: companyError.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: signupData.fullName,
            company_id: companyData.id,
            company_role: 'company_admin',
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: 'Account Already Exists',
            description: 'An account with this email already exists. Please sign in instead.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Signup Failed',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Account Created!',
          description: 'Please check your email to verify your account before signing in.',
        });
        
        // Clear form and switch to login
        setSignupData({ email: '', password: '', fullName: '', confirmPassword: '', companyName: '', isCompanyAdmin: true });
        setCurrentView('login');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetData.email, {
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
        setCurrentView('login');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Reset Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPasswordData.password !== newPasswordData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (newPasswordData.password.length < 8) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPasswordData.password,
      });

      if (error) {
        toast({
          title: 'Password Update Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Password Updated',
          description: 'Your password has been successfully updated.',
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast({
        title: 'Update Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (currentView === 'forgot-password') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src={sadhishaLogo} alt="Sadhisha" className="h-8 w-8 object-contain mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Sadhisha Real CRM</h1>
            </div>
            <p className="text-gray-600">Reset your password</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('login')}
                  className="p-0 h-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </div>
              <CardTitle className="text-center flex items-center justify-center">
                <Mail className="h-5 w-5 mr-2" />
                Forgot Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email to receive a password reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={resetData.email}
                    onChange={(e) => setResetData({ email: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === 'reset-password') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src={sadhishaLogo} alt="Sadhisha" className="h-8 w-8 object-contain mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Sadhisha Real CRM</h1>
            </div>
            <p className="text-gray-600">Set your new password</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center">
                <Shield className="h-5 w-5 mr-2" />
                Reset Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPasswordData.password}
                    onChange={(e) => setNewPasswordData({ ...newPasswordData, password: e.target.value })}
                    required
                  />
                  <p className="text-xs text-gray-600">
                    Must be 8+ characters with uppercase, lowercase, number, and special character
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={newPasswordData.confirmPassword}
                    onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src={sadhishaLogo} alt="Sadhisha" className="h-6 w-6 sm:h-8 sm:w-8 object-contain mr-2" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Sadhisha Real CRM</h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Experience AI-powered real estate management</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 mt-4">
              <p className="text-xs sm:text-sm text-green-700 font-medium">🎉 14 Days Free Trial • AI-Powered Excellence</p>
            </div>
            <div className="mt-4">
              <Link to="/home">
                <Button variant="outline" size="sm">
                  <Home className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-sm">Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentView} onValueChange={setCurrentView} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-right">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm p-0 h-auto"
                      onClick={() => setCurrentView('forgot-password')}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      type="text"
                      placeholder="Enter your company name"
                      value={signupData.companyName}
                      onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                    <p className="text-xs text-gray-600">
                      Must be 8+ characters with uppercase, lowercase, number, and special character
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Start Free Trial'}
                  </Button>
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Need enterprise features?
                    </p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/admin')} className="w-full">
                      <Crown className="mr-2 h-4 w-4" />
                      Request Enterprise Upgrade
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
