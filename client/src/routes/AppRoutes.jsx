import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Spinner from "../components/Loading/Spinner";

// Lazy-loaded pages: each route's code is split into its own chunk and only
// downloaded when the user actually navigates there.
const Home = lazy(() => import("../pages/Home/Home"));
const About = lazy(() => import("../pages/About/About"));
const Menu = lazy(() => import("../pages/Menu/Menu"));
const Branches = lazy(() => import("../pages/Branches/Branches"));
const Gallery = lazy(() => import("../pages/Gallery/Gallery"));
const Offers = lazy(() => import("../pages/Offers/Offers"));
const Reviews = lazy(() => import("../pages/Reviews/Reviews"));
const Reservation = lazy(() => import("../pages/Reservation/Reservation"));
const Careers = lazy(() => import("../pages/Careers/Careers"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const Privacy = lazy(() => import("../pages/Privacy/Privacy"));
const Terms = lazy(() => import("../pages/Terms/Terms"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

const SuspenseFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Spinner size={48} />
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<SuspenseFallback />}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="menu" element={<Menu />} />
        <Route path="branches" element={<Branches />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="offers" element={<Offers />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="reservation" element={<Reservation />} />
        <Route path="careers" element={<Careers />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
