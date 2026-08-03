import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { NAV_SECTIONS } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";

const SidebarContent = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col bg-sidebar text-slate-300">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 font-display text-lg font-bold text-white">
          B
        </div>
        <div>
          <p className="font-display text-sm font-bold text-white">Bhojanams Admin</p>
          <p className="text-[11px] text-slate-500">Restaurant Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.roles || (user && item.roles.includes(user.role))
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {visibleItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary-500/15 text-primary-400"
                            : "text-slate-400 hover:bg-sidebar-hover hover:text-white"
                        }`
                      }
                    >
                      <item.icon size={17} />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

/**
 * Renders a fixed desktop sidebar (lg and up) and a slide-in mobile drawer
 * (below lg), sharing the same nav content so they never drift out of sync.
 */
const Sidebar = ({ mobileOpen, onCloseMobile }) => (
  <>
    {/* Desktop */}
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
      <SidebarContent />
    </aside>

    {/* Mobile drawer */}
    <AnimatePresence>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onCloseMobile}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="absolute inset-y-0 left-0 w-64"
          >
            <div className="flex justify-end px-3 pt-3">
              <button
                onClick={onCloseMobile}
                className="rounded-lg p-2 text-slate-400 hover:bg-sidebar-hover hover:text-white"
                aria-label="Close menu"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="h-[calc(100%-3rem)]">
              <SidebarContent onNavigate={onCloseMobile} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </>
);

export default Sidebar;
