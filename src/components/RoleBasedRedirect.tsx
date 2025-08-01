import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    console.log('Redirection check:', { user, loading, error }); // Debug log
    
    if (loading) {
      console.log('Still loading...');
      return;
    }
    
    if (error) {
      console.error('Auth error:', error);
      navigate('/');
      return;
    }

    if (!user?.role) {
      console.log('No user role, redirecting to /');
      navigate('/');
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
      surgery: '/surgery-dashboard', // Fixed typo from previous version
      triage: '/triage-dashboard',
    };

    const route = roleRoutes[user.role] || '/';
    console.log(`Redirecting ${user.role} to ${route}`);
    navigate(route);
  }, [user, loading, error, navigate]);

  return null;
};

export default RoleBasedRedirect;