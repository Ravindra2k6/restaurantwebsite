import SEO from "../../components/SEO/SEO";
import PageHeader from "../../components/UI/PageHeader";
import OffersGrid from "../../components/Offers/OffersGrid";

const Offers = () => (
  <>
    <SEO
      title="Offers & Coupons"
      description="Current offers, festive deals and coupon codes at Bhojanams & Biryanis."
      url="/offers"
    />
    <PageHeader
      eyebrow="Save More"
      title="Offers & Coupons"
      subtitle="Festival specials, combo deals, and limited-time discounts."
    />
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <OffersGrid />
      </div>
    </section>
  </>
);

export default Offers;
