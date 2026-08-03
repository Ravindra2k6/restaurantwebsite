import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import PageLoader from "../components/Loader/Loader";

const Login = lazy(() => import("../pages/Login/Login"));
const ForgotPassword = lazy(() => import("../pages/Login/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/Login/ResetPassword"));

const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const MenuManagement = lazy(() => import("../pages/Menu/MenuManagement"));
const CategoryManagement = lazy(() => import("../pages/Categories/CategoryManagement"));
const BranchManagement = lazy(() => import("../pages/Branches/BranchManagement"));
const GalleryManagement = lazy(() => import("../pages/Gallery/GalleryManagement"));
const ReviewManagement = lazy(() => import("../pages/Reviews/ReviewManagement"));
const ReservationManagement = lazy(() => import("../pages/Reservations/ReservationManagement"));
const ContactManagement = lazy(() => import("../pages/Contact/ContactManagement"));
const OfferManagement = lazy(() => import("../pages/Offers/OfferManagement"));
const FAQManagement = lazy(() => import("../pages/FAQs/FAQManagement"));
const CareerManagement = lazy(() => import("../pages/Careers/CareerManagement"));
const UserManagement = lazy(() => import("../pages/Users/UserManagement"));
const SEOManagement = lazy(() => import("../pages/SEO/SEOManagement"));
const HomepageManagement = lazy(() => import("../pages/Homepage/HomepageManagement"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const Analytics = lazy(() => import("../pages/Analytics/Analytics"));
const Notifications = lazy(() => import("../pages/Notifications/Notifications"));
const Reports = lazy(() => import("../pages/Reports/Reports"));
const AuditLogs = lazy(() => import("../pages/AuditLogs/AuditLogs"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

const SuspenseFallback = () => <PageLoader />;

const AppRoutes = () => (
  <Suspense fallback={<SuspenseFallback />}>
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected -- any authenticated staff role */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="branches" element={<BranchManagement />} />
          <Route path="gallery" element={<GalleryManagement />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="reservations" element={<ReservationManagement />} />
          <Route path="contact" element={<ContactManagement />} />
          <Route path="offers" element={<OfferManagement />} />
          <Route path="faqs" element={<FAQManagement />} />
          <Route path="careers" element={<CareerManagement />} />
          <Route path="seo" element={<SEOManagement />} />
          <Route path="homepage" element={<HomepageManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />

          {/* Protected -- superadmin/admin only */}
          <Route element={<ProtectedRoute roles={["superadmin", "admin"]} />}>
            <Route path="users" element={<UserManagement />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
