import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  requiredRole: 'admin' | 'employee';
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  requiredRole,
  title,
  subtitle,
  headerActions
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kmrl_token');
    const userData = localStorage.getItem('kmrl_user');

    if (!token || !userData) {
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('kmrl_token');
      localStorage.removeItem('kmrl_user');
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== requiredRole) {
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user.role} userName={user.name} />
      
      <div className="ml-64">
        <Header
          title={title}
          subtitle={subtitle}
          userName={user.name}
          userRole={user.role}
          notificationCount={2}
          actions={headerActions}
        />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;