import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface RootRedirectProps {
  children: React.ReactNode;
}

const RootRedirect = ({ children }: RootRedirectProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to home page
  if (!user) {
    return <Navigate to="/home" replace />;
  }

  // If user is authenticated, show the protected content
  return <>{children}</>;
};

export default RootRedirect;