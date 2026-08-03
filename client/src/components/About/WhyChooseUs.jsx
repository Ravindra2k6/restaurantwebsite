import { motion } from "framer-motion";
import { FiFeather, FiThumbsUp, FiTruck, FiUsers } from "react-icons/fi";
import SectionHeading from "../UI/SectionHeading";

const FEATURES = [
  {
    icon: FiFeather,
    title: "Authentic Recipes",
    description: "Traditional Andhra recipes passed down through generations, made fresh daily.",
  },
  {
    icon: FiThumbsUp,
    title: "Quality Ingredients",
    description: "Locally sourced, hand-picked ingredients with no compromise on freshness.",
  },
  {
    icon: FiTruck,
    title: "Fast Delivery",
    description: "Hot, fresh meals delivered quickly to your doorstep across the city.",
  },
  {
    icon: FiUsers,
    title: "Loved by Thousands",
    description: "Thousands of happy guests across every branch, and counting.",
  },
];

const WhyChooseUs = () => (
  <section className="bg-white py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Our Promise"
        title="Why Choose Us"
        subtitle="What makes every visit to Bhojanams & Biryanis worth coming back for."
      />
      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group rounded-2xl border border-charcoal-100 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-gradient text-charcoal-900 shadow-gold transition-transform group-hover:scale-110">
              <feature.icon size={28} />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold text-charcoal-900">
              {feature.title}
            </h3>
            <p className="text-sm text-charcoal-500">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
