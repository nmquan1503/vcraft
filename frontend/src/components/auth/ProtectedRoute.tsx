import { Navigate, useLocation } from 'react-router-dom';
import { getAccessToken, getUser } from '@/utils/tokenStorage';
import type { Role } from '@/types';

interface Props {
  roles?: Role[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ roles, children }: Props) {
  const location = useLocation();
  const token = getAccessToken();
  const user = getUser();

  if (!token) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}