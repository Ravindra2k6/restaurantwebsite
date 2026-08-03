import SEO from "../../components/SEO/SEO";
import PageHeader from "../../components/UI/PageHeader";
import { useSettings } from "../../context/SettingsContext";

const Privacy = () => {
  const { settings } = useSettings();

  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for Bhojanams & Biryanis — how we collect, use, and protect your information."
        url="/privacy"
        noIndex
      />
      <PageHeader eyebrow="Legal" title="Privacy Policy" />

      <section className="bg-cream py-16">
        <div className="prose prose-charcoal mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 rounded-3xl bg-white p-8 text-sm leading-relaxed text-charcoal-600 shadow-md sm:p-10">
            <p>
              This Privacy Policy explains how {settings.siteName || "Bhojanams & Biryanis"}{" "}
              ("we", "our", "us") collects, uses, and protects information you provide when you
              use our website, make a reservation, submit a review, apply for a job, or contact
              us.
            </p>

            <h2 className="font-display text-xl font-bold text-charcoal-900">
              Information We Collect
            </h2>
            <p>
              We collect information you provide directly — such as your name, email, phone
              number, reservation details, review content, and resume/application details when
              applying for a job. We do not collect payment information through this website.
            </p>

            <h2 className="font-display text-xl font-bold text-charcoal-900">
              How We Use Your Information
            </h2>
            <p>
              We use the information you provide to process reservations, respond to inquiries,
              moderate and display reviews, manage job applications, and — if you opt in — send
              newsletter updates about offers and events. We do not sell your personal
              information to third parties.
            </p>

            <h2 className="font-display text-xl font-bold text-charcoal-900">Cookies</h2>
            <p>
              Our website may use cookies to keep you signed in (for admin users) and to
              understand aggregate visitor trends. You can disable cookies in your browser
              settings, though some features may not function as expected.
            </p>

            <h2 className="font-display text-xl font-bold text-charcoal-900">
              Third-Party Services
            </h2>
            <p>
              We use Google's services to display ratings and reviews associated with our Google
              Business Profile, and Cloudinary to host images. These providers may process data
              according to their own privacy policies.
            </p>

            <h2 className="font-display text-xl font-bold text-charcoal-900">Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal information
              at any time by contacting us using the details on our Contact page.
            </p>

            <h2 className="font-display text-xl font-bold text-charcoal-900">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated revision date.
            </p>

            <p className="text-xs text-charcoal-400">Last updated: January 2026</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;
