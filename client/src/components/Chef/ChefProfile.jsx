import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";
import SectionHeading from "../UI/SectionHeading";

const chefImage =
  "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=500&q=70";

const ChefProfile = () => (
  <section className="bg-charcoal-950 py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Meet the Kitchen"
        title={<span className="text-white">Our Head Chef</span>}
        subtitle="The hands behind every biryani layer and simmered curry."
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-8 rounded-3xl bg-white/5 p-8 text-center sm:flex-row sm:text-left"
      >
        <img
          src={chefImage}
          alt="Head chef portrait"
          loading="lazy"
          className="h-40 w-40 shrink-0 rounded-full object-cover ring-4 ring-primary-500/40"
        />
        <div>
          <h3 className="font-display text-2xl font-bold text-white">Chef Ramesh Rao</h3>
          <p className="mt-1 text-sm font-semibold text-primary-400">Head Chef, 20+ Years of Experience</p>
          <p className="mt-4 text-charcoal-300">
            Trained in traditional Andhra and Hyderabadi cooking, Chef Ramesh leads every
            kitchen with a focus on slow-cooked flavor and consistency — from the first dum
            biryani of the day to the last.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-primary-300 sm:justify-start">
            <FiAward size={16} /> Featured in regional culinary showcases
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ChefProfile;
