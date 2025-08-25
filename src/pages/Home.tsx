import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Star, 
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Crown,
  Mail
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Building,
      title: 'Project Management',
      description: 'Organize and track your real estate projects from start to finish.',
    },
    {
      icon: Users,
      title: 'Lead Management',
      description: 'Capture, nurture, and convert prospects into customers.',
    },
    {
      icon: Calendar,
      title: 'Task Scheduling',
      description: 'Never miss a follow-up with automated task management.',
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description: 'Centralize all client communications in one place.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Get insights into your sales performance and team productivity.',
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security to protect your sensitive data.',
    },
  ];

  const benefits = [
    'Increase conversion rates by up to 40%',
    'Save 10+ hours per week on admin tasks',
    'Never lose a lead again',
    'Automate follow-ups and nurturing',
    'Real-time performance tracking',
    'Mobile-responsive design',
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Top Real Estate Agent',
      content: 'Sadhisha Real CRM revolutionized my business. The AI insights helped me increase my conversion rate by 45% in just 3 months.',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Property Development Director',
      content: 'The intelligent project management features are game-changing. I can now manage multiple developments seamlessly.',
      rating: 5,
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Real Estate Broker',
      content: 'Finally, a CRM that understands real estate. The automation features save me hours every day.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/lovable-uploads/50b094d9-5ab3-47e8-ae1d-a4820f6ec638.png" alt="Sadhisha Logo" className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-lg sm:text-xl font-bold text-foreground">Sadhisha Real CRM</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm">
                <span className="hidden sm:inline">Start Free Trial</span>
                <span className="sm:hidden">Trial</span>
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 sm:mb-6">
            <Crown className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            14-Day Free Trial Available
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            The Complete CRM Solution for
            <span className="text-primary"> Real Estate Excellence</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
            Experience the future of real estate management with Sadhisha Real CRM. 
            Our AI-powered platform streamlines your business operations, enhances client relationships, and drives unprecedented growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
            <Link to="/auth">
              <Button size="lg" className="px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto">
                <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Start Your Free Trial
              </Button>
            </Link>
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
              <Clock className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              No credit card required • 14 days free
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">25,000+</div>
              <div className="text-muted-foreground">Satisfied Real Estate Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">40%</div>
              <div className="text-muted-foreground">Average Conversion Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">AI-Powered</div>
              <div className="text-muted-foreground">Intelligent Business Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Sadhisha Real CRM Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive AI-powered platform includes all the tools real estate professionals need to excel in today's competitive market.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-primary/5 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Transform Your Real Estate Business with AI
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of successful real estate professionals who have revolutionized their business with Sadhisha Real CRM's intelligent platform.
              </p>
              <div className="space-y-4">
                {[
                  'Increase conversion rates by up to 60% with AI insights',
                  'Save 15+ hours per week with intelligent automation',
                  'Never lose a lead with smart follow-up systems',
                  'Predictive analytics for market trends',
                  'Real-time performance dashboards',
                  'Mobile-first responsive design',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="p-8 shadow-2xl">
                <div className="text-center">
                  <Target className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Experience Excellence?</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your 14-day free trial today and discover the power of AI-driven real estate management.
                  </p>
                  <Link to="/auth">
                    <Button size="lg" className="w-full">
                      Start Free Trial Now
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-3">
                    Cancel anytime • No setup fees • Instant access
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Trusted by Real Estate Leaders
            </h2>
            <p className="text-lg text-muted-foreground">
              See what industry leaders have to say about their success with Sadhisha Real CRM.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing/Trial CTA Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Start Your Success Journey Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the future of real estate management with our AI-powered platform. No credit card required.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-xl">Free Trial</CardTitle>
                <CardDescription className="text-white/80">
                  Experience AI-powered excellence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">$0</div>
                <div className="text-sm mb-6 opacity-80">14 days • Full access</div>
                <Link to="/auth">
                  <Button variant="secondary" size="lg" className="w-full">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  Enterprise Solutions
                  <Crown className="ml-2 h-5 w-5" />
                </CardTitle>
                <CardDescription className="text-white/80">
                  Advanced AI features & dedicated support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">Custom</div>
                <div className="text-sm mb-6 opacity-80">AI-powered features • Premium support</div>
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="w-full bg-white text-primary hover:bg-white/90">
                    <Mail className="mr-2 h-4 w-4" />
                    Request Upgrade
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
                <TrendingUp className="mr-2 h-5 w-5" />
                Get Started Now
              </Button>
            </Link>
            <p className="text-sm opacity-80">
              Join 25,000+ real estate professionals already transforming their business
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/lovable-uploads/50b094d9-5ab3-47e8-ae1d-a4820f6ec638.png" alt="Sadhisha Logo" className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Sadhisha Real CRM</span>
              </div>
              <p className="text-slate-400 text-sm">
                AI-powered CRM solution for real estate excellence.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/auth" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Free Trial</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/manual" className="hover:text-white transition-colors">User Manual</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/data-deletion" className="hover:text-white transition-colors">Data Deletion</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 Sadhisha Real CRM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;