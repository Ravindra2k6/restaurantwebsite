import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ScrollToTop from "../components/UI/ScrollToTop";
import FloatingWhatsApp from "../components/UI/FloatingWhatsApp";

/**
 * Shared shell for every public page: sticky navbar, footer, floating
 * WhatsApp button, and a scroll-reset on navigation. `<Outlet />` renders
 * whichever page the router matched.
 */
const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default MainLayout;
