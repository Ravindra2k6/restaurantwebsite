import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import faqService from "../../services/faqService";
import SectionHeading from "../UI/SectionHeading";
import ErrorMessage from "../Error/ErrorMessage";
import { TextLineSkeleton } from "../Loading/Skeletons";

const FAQAccordion = () => {
  const [openId, setOpenId] = useState(null);
  const { data: faqs, loading, error, refetch } = useFetch(
    () => faqService.getAll({ limit: 50 }),
    []
  );

  if (!loading && !error && faqs?.length === 0) return null;

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Got Questions?"
          title="Frequently Asked Questions"
          subtitle="Everything you might want to know before your visit."
        />

        <div className="mt-12 space-y-3">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white p-4">
                <TextLineSkeleton width="w-3/4" />
              </div>
            ))}

          {error && <ErrorMessage message={error} onRetry={refetch} />}

          {!loading &&
            !error &&
            faqs?.map((faq) => {
              const isOpen = openId === faq._id;
              return (
                <div
                  key={faq._id}
                  className="overflow-hidden rounded-xl border border-charcoal-100 bg-white"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq._id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-charcoal-900">{faq.question}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-primary-500"
                    >
                      <FiChevronDown size={20} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-charcoal-500">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
