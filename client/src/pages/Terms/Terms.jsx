import SEO from "../../components/SEO/SEO";
import PageHeader from "../../components/UI/PageHeader";
import { useSettings } from "../../context/SettingsContext";

const Terms = () => {
  const { settings } = useSettings();

  return (
    <>
      <SEO
        title="Terms & Conditions"
        description="Terms and Conditions for using the Bhojanams & Biryanis website and services."
        url="/terms"
        noIndex
      />
      <PageHeader eyebrow="Legal" title="Terms & Conditions" />

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 rounded-3xl bg-white p-8 text-sm leading-relaxed text-charcoal-600 shadow-md sm:p-10">
            <p>
              By using the {settings.siteName || "Bhojanams & Biryanis"} website, you agree to the
              following terms and conditions. Please read them carefully.
            </p>

            <h2 className="font-display text-xl font-bold text-charcoal-900">Reservations</h2>
            <p>
              Table reservations made through this website are requests and are subject to
              confirmation by the branch. We recommend arriving on time; tables may be released
              after a grace period if you're significantly delayed without notice.
            </p>

            <h2 className="font-display text-xl font-bold text-charcoal-900">
              Menu & Pricing
            </h2>
            <p>
              Menu items, prices, and availability are subject to change without prior notice.
              Images are for illustrative purposes and actual presentation may vary.
            </p>

            <h2 className="font-display text-xl font-bold text-charcoal-900">
              Reviews & User Content
            </h2>
            <p>
              By submitting a review, you confirm it reflects your genuine experience and grant
              us permission to display it on our website. We reserve the right to moderate,
              edit for length, or decline to publish reviews that are abusive, fraudulent, or
              violate applicable law.
            </p>

            <h2 className="font-display text-xl font-bold text-charcoal-900">Offers & Coupons</h2>
            <p>
              Offers and coupon codes are valid only for the period stated and may not be
              combined with other promotions unless explicitly noted. We reserve the right to
              modify or withdraw an offer at any time.
            </p>

            <h2 className="font-display text-xl font-bold text-charcoal-900">
              Job Applications
            </h2>
            <p>
              Submitting a job application does not guarantee an interview or offer of
              employment. Resume files are retained only for recruitment purposes.
            </p>

            <h2 className="font-display text-xl font-bold text-charcoal-900">
              Limitation of Liability
            </h2>
            <p>
              We strive for accuracy across this website but do not guarantee it is free of
              errors at all times. We are not liable for indirect or consequential loss arising
              from use of this website.
            </p>

            <p className="text-xs text-charcoal-400">Last updated: January 2026</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Terms;
