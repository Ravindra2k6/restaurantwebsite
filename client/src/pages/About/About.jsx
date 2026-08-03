import { motion } from "framer-motion";
import { FiTarget, FiEye, FiShield, FiAward } from "react-icons/fi";
import SEO from "../../components/SEO/SEO";
import PageHeader from "../../components/UI/PageHeader";
import RestaurantStory from "../../components/About/RestaurantStory";
import ChefProfile from "../../components/Chef/ChefProfile";
import SectionHeading from "../../components/UI/SectionHeading";

const PILLARS = [
  {
    icon: FiTarget,
    title: "Our Mission",
    text: "To bring the authentic, soulful flavors of Andhra cuisine to every table we serve, without ever compromising on quality or hospitality.",
  },
  {
    icon: FiEye,
    title: "Our Vision",
    text: "To be the most loved multi-branch dining destination for regional Indian cuisine, known as much for consistency as for flavor.",
  },
  {
    icon: FiShield,
    title: "Quality Promise",
    text: "Every ingredient is hand-picked, every recipe tested for consistency, and every dish plated with the same care as the last.",
  },
  {
    icon: FiAward,
    title: "Hygiene Standards",
    text: "Our kitchens follow strict food-safety protocols — from sourcing to storage to service — audited regularly across every branch.",
  },
];

const AWARDS = [
  { year: "2023", title: "Best Andhra Restaurant — City Food Awards" },
  { year: "2022", title: "Excellence in Hospitality — Regional Dining Guild" },
  { year: "2021", title: "Top Rated on Zomato & Google — 4+ Star Average" },
];

const About = () => (
  <>
    <SEO
      title="About Us"
      description="Learn about Bhojanams & Biryanis — our story, mission, quality promise, hygiene standards, and the chef behind our signature dishes."
      url="/about"
    />
    <PageHeader
      eyebrow="Our Journey"
      title="About Bhojanams & Biryanis"
      subtitle="A story rooted in tradition, hospitality, and consistently great food."
    />

    <RestaurantStory />

    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="What Drives Us" title="Mission, Vision & Promise" />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-charcoal-100 p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <pillar.icon size={22} />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-charcoal-900">
                {pillar.title}
              </h3>
              <p className="text-sm text-charcoal-500">{pillar.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <ChefProfile />

    <section className="bg-cream py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Recognition" title="Awards & Achievements" />
        <div className="mt-12 space-y-4">
          {AWARDS.map((award, index) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-5 rounded-xl bg-white p-5 shadow-sm"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-gradient font-display text-sm font-bold text-charcoal-900">
                {award.year}
              </span>
              <p className="font-medium text-charcoal-800">{award.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default About;
