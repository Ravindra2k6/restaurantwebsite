import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center dark:bg-surface-dark">
    <p className="font-display text-6xl font-bold text-primary-500">404</p>
    <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
    <p className="text-sm text-slate-500">This admin page doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary mt-3">
      <FiHome size={16} /> Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
