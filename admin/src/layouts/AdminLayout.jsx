import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import { NAV_SECTIONS } from "../utils/constants";

const findPageTitle = (pathname) => {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      const isMatch = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
      if (isMatch) return item.label;
    }
  }
  return "Admin Panel";
};

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onOpenMobileMenu={() => setMobileOpen(true)} pageTitle={findPageTitle(location.pathname)} />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
