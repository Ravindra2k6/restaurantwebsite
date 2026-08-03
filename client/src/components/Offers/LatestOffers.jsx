import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import SectionHeading from "../UI/SectionHeading";
import OffersGrid from "./OffersGrid";

const LatestOffers = () => (
  <section className="bg-white py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Don't Miss Out"
        title="Latest Offers"
        subtitle="Festive deals, combo discounts, and limited-time coupons."
      />
      <div className="mt-12">
        <OffersGrid limit={3} />
      </div>
      <div className="mt-10 text-center">
        <Link
          to="/offers"
          className="inline-flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700"
        >
          View All Offers <FiArrowRight />
        </Link>
      </div>
    </div>
  </section>
);

export default LatestOffers;
