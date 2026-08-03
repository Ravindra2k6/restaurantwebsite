import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSettings } from "../../context/SettingsContext";
import { whatsappLink } from "../../utils/linkBuilders";
import { WHATSAPP_NUMBER } from "../../utils/constants";

/**
 * Persistent floating action button, mounted once in MainLayout so it's
 * available from every page without being re-fetched or re-rendered per route.
 */
const FloatingWhatsApp = () => {
  const { settings } = useSettings();
  const number = settings.contact?.whatsappNumber || WHATSAPP_NUMBER;

  return (
    <motion.a
      href={whatsappLink(number, "Hi! I'd like to get in touch.")}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl"
    >
      <FaWhatsapp size={26} />
    </motion.a>
  );
};

export default FloatingWhatsApp;
