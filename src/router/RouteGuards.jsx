import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../utils/constants';

export function HomeRedirect() {
  const { user, token } = useSelector((s) => s.auth);
  if (!token) return <Navigate to={ROUTES.LOGIN} replace />;
  return (
    <Navigate to={user?.role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD} replace />
  );
}

export function ProtectedRoute({ adminOnly = false }) {
  const { user, token } = useSelector((s) => s.auth);

  if (!token || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
