import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLoader from "../Loader/Loader";

/**
 * Gates every admin route behind authentication, and optionally behind a
 * specific set of roles (e.g. Settings/Users pages restricted to
 * superadmin/admin). Redirects to /login (preserving the intended
 * destination) if not authenticated, or to the dashboard with a message
 * if authenticated but insufficient role.
 */
const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, initializing, hasRole } = useAuth();
  const location = useLocation();

  if (initializing) return <PageLoader label="Restoring your session..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !hasRole(...roles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
