import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiSun, FiMoon, FiLogOut, FiUser, FiChevronDown, FiSettings } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import useClickOutside from "../../hooks/useClickOutside";

const Topbar = ({ onOpenMobileMenu, pageTitle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-surface-dark/80 sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMobileMenu} className="btn-icon lg:hidden" aria-label="Open menu">
          <FiMenu size={20} />
        </button>
        <h1 className="font-display text-lg font-bold text-slate-900 dark:text-white">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="btn-icon"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-expanded={dropdownOpen}
          >
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
            )}
            <span className="hidden text-sm font-semibold text-slate-700 dark:text-slate-200 sm:block">
              {user?.name}
            </span>
            <FiChevronDown size={14} className="hidden text-slate-400 sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 animate-fade-in rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg dark:border-slate-800 dark:bg-surface-dark">
              <div className="border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {user?.name}
                </p>
                <p className="truncate text-xs capitalize text-slate-400">{user?.role}</p>
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <FiUser size={15} /> My Profile
              </button>
              {(user?.role === "superadmin" || user?.role === "admin") && (
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/settings");
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <FiSettings size={15} /> Settings
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <FiLogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
