import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  role: string;
}

interface RoleBasedRedirectProps {
  user: User | null | undefined;
}

const RoleBasedRedirect = ({ user }: RoleBasedRedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case 'admin':
          navigate('/dashboard');
          break;
        case 'doctor':
          navigate('/doctor-dashboard');
          break;
        case 'patient':
          navigate('/patient-dashboard');
          break;
        case 'receptionist':
          navigate('/reception-dashboard');
          break;
        case 'pharmacist':
          navigate('/pharmacy-dashboard');
          break;
        case 'lab':
          navigate('/lab-dashboard');
          break;
        case 'radiology':
          navigate('/radiology-dashboard');
          break;
        case 'emergency':
          navigate('/emergency-dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [user, navigate]);

  return null;
};

export default RoleBasedRedirect;