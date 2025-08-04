import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Copy } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
}

const UpgradeRequestForm = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (selectedPlanId && user) {
      generateEmailTemplate();
    }
  }, [selectedPlanId, userName, companyName, requirements, user]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .neq('name', 'Free Trial');

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const generateEmailTemplate = () => {
    const selectedPlan = plans.find(p => p.id === selectedPlanId);
    if (!selectedPlan) return;

    const template = `Subject: Product Key Upgrade Request - ${selectedPlan.name}

Dear Sales Team,

I would like to request an upgrade to the ${selectedPlan.name} plan.

User Details:
- Name: ${userName || '[Your Name]'}
- Email: ${user?.email || '[Your Email]'}
- Company: ${companyName || '[Your Company]'}

Plan Details:
- Requested Plan: ${selectedPlan.name}
- Monthly Price: $${selectedPlan.price_monthly}
- Yearly Price: $${selectedPlan.price_yearly}

Requirements:
${requirements || '[Please describe your specific requirements and use case]'}

Please review my request and provide a product key for the upgrade. I understand that the product key will be valid for one year from the date of issuance.

Thank you for your time and consideration.

Best regards,
${userName || '[Your Name]'}`;

    setEmailTemplate(template);
  };

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || !userName.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('upgrade_requests')
        .insert({
          user_id: user?.id,
          user_email: user?.email,
          user_name: userName.trim(),
          company_name: companyName.trim() || null,
          requirements: requirements.trim() || null,
          requested_plan_id: selectedPlanId,
        });

      if (error) throw error;

      toast({
        title: 'Request Submitted',
        description: 'Your upgrade request has been submitted successfully',
      });

      // Reset form
      setUserName('');
      setCompanyName('');
      setRequirements('');
      setSelectedPlanId('');
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyEmailTemplate = () => {
    navigator.clipboard.writeText(emailTemplate);
    toast({
      title: 'Copied!',
      description: 'Email template copied to clipboard',
    });
  };

  const sendEmail = () => {
    const subject = encodeURIComponent(`Product Key Upgrade Request - ${plans.find(p => p.id === selectedPlanId)?.name || 'Plan'}`);
    const body = encodeURIComponent(emailTemplate);
    window.open(`mailto:sales@sadhisha.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Request Plan Upgrade</CardTitle>
          <CardDescription>
            Fill out the form below to request an upgrade. An email template will be generated for you to send to our sales team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitRequest} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Your Name *</Label>
                <Input
                  id="user-name"
                  type="text"
                  placeholder="John Doe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your Company Ltd."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Select Plan *</Label>
              <Select value={selectedPlanId} onValueChange={setSelectedPlanId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your desired plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - ${plan.price_monthly}/month (${plan.price_yearly}/year)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements & Use Case</Label>
              <Textarea
                id="requirements"
                placeholder="Please describe your specific requirements, expected usage, team size, etc."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={4}
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Generate Email Template'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {emailTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Email Template</CardTitle>
            <CardDescription>
              Copy this email template and send it to sales@sadhisha.com or click the button to open your email client.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  value={emailTemplate}
                  readOnly
                  rows={20}
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={copyEmailTemplate}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={sendEmail} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
                <Button variant="outline" onClick={copyEmailTemplate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Template
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p><strong>Email to:</strong> sales@sadhisha.com</p>
                <p>After sending the email, our sales team will review your request and provide you with a product key if approved.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UpgradeRequestForm;