import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiBookOpen } from "react-icons/fi";
import SEO from "../../components/SEO/SEO";

const NotFound = () => (
  <>
    <SEO title="Page Not Found" noIndex />
    <section className="flex min-h-[80vh] flex-col items-center justify-center bg-cream px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-display text-8xl font-bold text-primary-500">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-charcoal-900">
          Page Not Found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-charcoal-500">
          Looks like this dish isn't on our menu. Let's get you back to something delicious.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">
            <FiHome size={18} /> Back to Home
          </Link>
          <Link to="/menu" className="btn-secondary">
            <FiBookOpen size={18} /> View Menu
          </Link>
        </div>
      </motion.div>
    </section>
  </>
);

export default NotFound;
