import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Key, Calendar, Check, X, Clock } from 'lucide-react';

interface ProductKey {
  id: string;
  product_key: string;
  user_id: string;
  plan_id: string;
  expires_at: string;
  is_active: boolean;
  issued_at: string;
  subscription_plans: {
    name: string;
  } | null;
  profiles: {
    email: string;
    full_name: string;
  } | null;
}

interface UpgradeRequest {
  id: string;
  user_email: string;
  user_name: string;
  company_name: string;
  requirements: string;
  status: string;
  created_at: string;
  requested_plan_id: string;
  subscription_plans: {
    name: string;
  } | null;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
}

const ProductKeyManagement = () => {
  const [productKeys, setProductKeys] = useState<ProductKey[]>([]);
  const [upgradeRequests, setUpgradeRequests] = useState<UpgradeRequest[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [expiryMonths, setExpiryMonths] = useState('12');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch product keys
      const { data: keysData, error: keysError } = await supabase
        .from('product_keys')
        .select(`
          *,
          subscription_plans (name),
          profiles (email, full_name)
        `)
        .order('issued_at', { ascending: false });

      if (keysError) throw keysError;
      setProductKeys((keysData as unknown as ProductKey[]) || []);

      // Fetch upgrade requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('upgrade_requests')
        .select(`
          *,
          subscription_plans (name)
        `)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;
      setUpgradeRequests((requestsData as unknown as UpgradeRequest[]) || []);

      // Fetch subscription plans
      const { data: plansData, error: plansError } = await supabase
        .from('subscription_plans')
        .select('id, name, description')
        .eq('is_active', true);

      if (plansError) throw plansError;
      setSubscriptionPlans(plansData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      });
    }
  };

  const generateProductKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];
    for (let i = 0; i < 4; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    return segments.join('-');
  };

  const createProductKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || !userEmail.trim()) return;

    setLoading(true);
    try {
      // Get user by email
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail.trim())
        .single();

      if (profileError) {
        throw new Error('User not found with this email');
      }

      const productKey = generateProductKey();
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + parseInt(expiryMonths));

      const { error } = await supabase
        .from('product_keys')
        .insert({
          product_key: productKey,
          user_id: profileData.id,
          plan_id: selectedPlanId,
          expires_at: expiresAt.toISOString(),
          issued_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (error) throw error;

      toast({
        title: 'Product Key Created',
        description: `Product key ${productKey} created successfully`,
      });

      setUserEmail('');
      setSelectedPlanId('');
      fetchData();
    } catch (error: any) {
      console.error('Error creating product key:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product key',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const processUpgradeRequest = async (requestId: string, planId: string) => {
    setLoading(true);
    try {
      const request = upgradeRequests.find(r => r.id === requestId);
      if (!request) throw new Error('Request not found');

      // Get user by email
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', request.user_email)
        .single();

      if (profileError) {
        throw new Error('User not found with this email');
      }

      const productKey = generateProductKey();
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year validity

      // Create product key
      const { error: keyError } = await supabase
        .from('product_keys')
        .insert({
          product_key: productKey,
          user_id: profileData.id,
          plan_id: planId,
          expires_at: expiresAt.toISOString(),
          issued_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (keyError) throw keyError;

      // Update request status
      const { error: updateError } = await supabase
        .from('upgrade_requests')
        .update({
          status: 'approved',
          processed_by: (await supabase.auth.getUser()).data.user?.id,
          processed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast({
        title: 'Request Processed',
        description: `Product key ${productKey} created and sent to ${request.user_email}`,
      });

      fetchData();
    } catch (error: any) {
      console.error('Error processing request:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deactivateProductKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('product_keys')
        .update({ is_active: false })
        .eq('id', keyId);

      if (error) throw error;

      toast({
        title: 'Product Key Deactivated',
        description: 'Product key has been deactivated',
      });

      fetchData();
    } catch (error: any) {
      console.error('Error deactivating key:', error);
      toast({
        title: 'Error',
        description: 'Failed to deactivate product key',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Product Key */}
      <Card>
        <CardHeader>
          <CardTitle>Create Product Key</CardTitle>
          <CardDescription>
            Create a new product key for user upgrade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createProductKey} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-email">User Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="user@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Subscription Plan</Label>
                <Select value={selectedPlanId} onValueChange={setSelectedPlanId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptionPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Validity (Months)</Label>
              <Select value={expiryMonths} onValueChange={setExpiryMonths}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product Key'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Upgrade Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Requests</CardTitle>
          <CardDescription>
            Review and process user upgrade requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upgradeRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No upgrade requests
            </p>
          ) : (
            <div className="space-y-4">
              {upgradeRequests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{request.user_name || request.user_email}</h3>
                      <p className="text-sm text-muted-foreground">{request.user_email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        request.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {request.status === 'approved' && <Check className="h-3 w-3 mr-1" />}
                        {request.status === 'rejected' && <X className="h-3 w-3 mr-1" />}
                        {request.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Company:</span> {request.company_name || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Requested Plan:</span> {request.subscription_plans?.name}
                    </div>
                  </div>

                  {request.requirements && (
                    <div>
                      <span className="font-medium text-sm">Requirements:</span>
                      <p className="text-sm text-muted-foreground mt-1">{request.requirements}</p>
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <div className="flex items-center space-x-2 pt-2">
                      <Select 
                        value={selectedRequestId === request.id ? selectedPlanId : ''} 
                        onValueChange={(value) => {
                          setSelectedRequestId(request.id);
                          setSelectedPlanId(value);
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {subscriptionPlans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() => processUpgradeRequest(request.id, selectedPlanId)}
                        disabled={!selectedPlanId || selectedRequestId !== request.id || loading}
                      >
                        Approve & Create Key
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Keys List */}
      <Card>
        <CardHeader>
          <CardTitle>Product Keys</CardTitle>
          <CardDescription>
            Manage existing product keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          {productKeys.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No product keys created yet
            </p>
          ) : (
            <div className="space-y-3">
              {productKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-mono font-medium">{key.product_key}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{key.profiles?.email}</span>
                        <span>{key.subscription_plans?.name}</span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Expires: {new Date(key.expires_at).toLocaleDateString()}
                          </span>
                        </span>
                        <span className={`flex items-center space-x-1 ${
                          key.is_active ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {key.is_active ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          <span>{key.is_active ? 'Active' : 'Inactive'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {key.is_active && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deactivateProductKey(key.id)}
                    >
                      Deactivate
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductKeyManagement;