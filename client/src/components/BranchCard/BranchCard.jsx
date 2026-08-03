import { motion } from "framer-motion";
import { FiMapPin, FiPhone, FiClock, FiNavigation } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { telLink, whatsappLink, directionsLink, mapsSearchLink } from "../../utils/linkBuilders";
import { formatAddress, formatTime, capitalize } from "../../utils/formatters";

const placeholderImage =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=65";

const BranchCard = ({ branch }) => {
  const [lng, lat] = branch.location?.coordinates || [];
  const hasCoords = lat && lng && !(lat === 0 && lng === 0);

  const directions = hasCoords
    ? directionsLink(lat, lng)
    : mapsSearchLink(`${branch.branchName} ${formatAddress(branch.address)}`);

  const todayName = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const todayHours = branch.openingHours?.find((h) => h.day === todayName);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="card-premium flex flex-col"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={branch.banner?.url || branch.images?.[0]?.url || placeholderImage}
          alt={branch.branchName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {!branch.isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-charcoal-900">
              Temporarily Closed
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold text-charcoal-900">{branch.branchName}</h3>

        <p className="mt-2 flex items-start gap-2 text-sm text-charcoal-500">
          <FiMapPin className="mt-0.5 shrink-0 text-primary-500" size={16} />
          {formatAddress(branch.address)}
        </p>

        {branch.phoneNumbers?.[0] && (
          <p className="mt-2 flex items-center gap-2 text-sm text-charcoal-500">
            <FiPhone className="shrink-0 text-primary-500" size={16} />
            {branch.phoneNumbers[0]}
          </p>
        )}

        {todayHours && (
          <p className="mt-2 flex items-center gap-2 text-sm text-charcoal-500">
            <FiClock className="shrink-0 text-primary-500" size={16} />
            Today: {todayHours.isClosed ? "Closed" : `${formatTime(todayHours.open)} - ${formatTime(todayHours.close)}`}
          </p>
        )}

        {branch.facilities?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {branch.facilities.slice(0, 4).map((facility) => (
              <span
                key={facility}
                className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700"
              >
                {capitalize(facility)}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2 pt-2">
          <a href={directions} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2 !px-4 text-xs">
            <FiNavigation size={14} /> Directions
          </a>
          {branch.phoneNumbers?.[0] && (
            <a href={telLink(branch.phoneNumbers[0])} className="btn-secondary !py-2 !px-4 text-xs">
              <FiPhone size={14} /> Call
            </a>
          )}
          {branch.phoneNumbers?.[0] && (
            <a
              href={whatsappLink(branch.phoneNumbers[0], `Hi! I'd like to know more about the ${branch.branchName} branch.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-105"
            >
              <FaWhatsapp size={14} /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default BranchCard;
