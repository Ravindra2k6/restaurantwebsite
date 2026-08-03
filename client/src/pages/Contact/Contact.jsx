import { FiPhone, FiMail, FiClock, FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import SEO from "../../components/SEO/SEO";
import PageHeader from "../../components/UI/PageHeader";
import ContactForm from "../../components/Contact/ContactForm";
import GoogleMap from "../../components/GoogleMap/GoogleMap";
import useFetch from "../../hooks/useFetch";
import branchService from "../../services/branchService";
import { useSettings } from "../../context/SettingsContext";
import { telLink, whatsappLink } from "../../utils/linkBuilders";
import { formatTime, capitalize } from "../../utils/formatters";

const SOCIAL_ICON_MAP = {
  facebook: FiFacebook,
  instagram: FiInstagram,
  twitter: FiTwitter,
  youtube: FiYoutube,
};

const Contact = () => {
  const { settings } = useSettings();
  const { data: branches } = useFetch(() => branchService.getAll({ active: true }), []);
  const mainBranch = branches?.[0];

  const socialEntries = Object.entries(settings.socialLinks || {}).filter(
    ([key, value]) => value && SOCIAL_ICON_MAP[key]
  );

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Bhojanams & Biryanis — phone, email, WhatsApp, and business hours."
        url="/contact"
      />
      <PageHeader
        eyebrow="We'd Love to Hear From You"
        title="Contact Us"
        subtitle="Questions, feedback, or group bookings — reach out any time."
      />

      <section className="bg-cream py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <ContactForm />
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <GoogleMap
                embedUrl={mainBranch?.googleMapsEmbedUrl}
                lat={mainBranch?.location?.coordinates?.[1]}
                lng={mainBranch?.location?.coordinates?.[0]}
                title="Restaurant location"
                height={280}
              />
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-md">
              <h3 className="mb-4 font-display text-lg font-bold text-charcoal-900">
                Get in Touch
              </h3>
              <div className="space-y-3 text-sm text-charcoal-600">
                {settings.contact?.primaryPhone && (
                  <a
                    href={telLink(settings.contact.primaryPhone)}
                    className="flex items-center gap-3 hover:text-primary-600"
                  >
                    <FiPhone className="text-primary-500" /> {settings.contact.primaryPhone}
                  </a>
                )}
                {settings.contact?.primaryEmail && (
                  <a
                    href={`mailto:${settings.contact.primaryEmail}`}
                    className="flex items-center gap-3 hover:text-primary-600"
                  >
                    <FiMail className="text-primary-500" /> {settings.contact.primaryEmail}
                  </a>
                )}
                {(settings.contact?.whatsappNumber || mainBranch?.phoneNumbers?.[0]) && (
                  <a
                    href={whatsappLink(
                      settings.contact?.whatsappNumber || mainBranch?.phoneNumbers?.[0]
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-green-600"
                  >
                    <FaWhatsapp className="text-green-500" /> Chat on WhatsApp
                  </a>
                )}
              </div>

              {socialEntries.length > 0 && (
                <div className="mt-5 flex gap-3 border-t border-charcoal-100 pt-5">
                  {socialEntries.map(([key, url]) => {
                    const Icon = SOCIAL_ICON_MAP[key];
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={key}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-100 text-charcoal-600 transition-colors hover:bg-primary-500 hover:text-white"
                      >
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {mainBranch?.openingHours?.length > 0 && (
              <div className="rounded-3xl bg-white p-6 shadow-md">
                <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-charcoal-900">
                  <FiClock className="text-primary-500" /> Business Hours
                </h3>
                <ul className="space-y-1.5 text-sm text-charcoal-600">
                  {mainBranch.openingHours.map((h) => (
                    <li key={h.day} className="flex justify-between">
                      <span>{capitalize(h.day)}</span>
                      <span>
                        {h.isClosed ? "Closed" : `${formatTime(h.open)} - ${formatTime(h.close)}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
