import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  role: string;
}

interface RoleBasedRedirectProps {
  user: User | null | undefined;
  loading?: boolean;
  error?: Error | null;
}

const RoleBasedRedirect = ({ user, loading = false, error = null }: RoleBasedRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Redirection check:', { user, loading, error, pathname: location.pathname });

    if (loading) {
      console.log('Still loading...');
      return;
    }

    if (error) {
      console.error('Auth error:', error);
      navigate('/');
      return;
    }

    // ✅ Only redirect if we're currently on the home page
    if (location.pathname !== '/' || !user?.role) {
      return;
    }

    const roleRoutes: Record<string, string> = {
      admin: '/admin-dashboard',
      doctor: '/doctor-dashboard',
      patient: '/patient-dashboard',
      receptionist: '/reception-dashboard',
      pharmacist: '/pharmacy-dashboard',
      lab: '/lab-dashboard',
      radiology: '/radiology-dashboard',
      emergency: '/emergency-dashboard',
      billing: '/billing-dashboard',
      surgery: '/surgery-dashboard',
      triage: '/triage-dashboard',
    };

    const route = roleRoutes[user.role] || '/';
    console.log(`Redirecting ${user.role} to ${route}`);
    navigate(route);
  }, [user, loading, error, navigate, location.pathname]);

  return null;
};

export default RoleBasedRedirect;
