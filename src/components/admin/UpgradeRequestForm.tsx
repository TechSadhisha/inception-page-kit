import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Key, CheckCircle } from 'lucide-react';

const ProductKeyUpgrade = () => {
  const [productKey, setProductKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const validateProductKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productKey.trim()) return;

    setLoading(true);
    try {
      // Check if the product key exists and is valid
      const { data: keyData, error: keyError } = await supabase
        .from('product_keys')
        .select('*')
        .eq('product_key', productKey.trim())
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .single();

      if (keyError || !keyData) {
        throw new Error('Invalid or expired product key');
      }

      // Check if key is expired
      if (new Date(keyData.expires_at) < new Date()) {
        throw new Error('Product key has expired');
      }

      toast({
        title: 'Product Key Validated Successfully!',
        description: 'You have been upgraded to Premium plan',
      });

      // Clear the form
      setProductKey('');
      
    } catch (error: any) {
      console.error('Error validating product key:', error);
      toast({
        title: 'Validation Failed',
        description: error.message || 'Invalid product key',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Enter Product Key
          </CardTitle>
          <CardDescription>
            Enter the product key provided by our sales team to upgrade your account to Premium plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={validateProductKey} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-key">Product Key *</Label>
              <Input
                id="product-key"
                type="text"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={productKey}
                onChange={(e) => setProductKey(e.target.value.toUpperCase())}
                className="font-mono"
                maxLength={19}
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter the 16-character product key you received from our sales team.
              </p>
            </div>

            <Button type="submit" disabled={loading || !productKey.trim()}>
              {loading ? 'Validating...' : 'Validate & Upgrade'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Premium Plan Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Unlimited prospects and projects</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Advanced analytics and reporting</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Team collaboration features</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Priority support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>API access</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductKeyUpgrade;