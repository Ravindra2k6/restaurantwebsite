import { useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { AnimatePresence, motion } from "framer-motion";
import SEO from "../../components/SEO/SEO";
import PageHeader from "../../components/UI/PageHeader";
import WebsiteReviews from "../../components/Reviews/WebsiteReviews";
import GoogleReviews from "../../components/Reviews/GoogleReviews";
import WriteReviewForm from "../../components/Reviews/WriteReviewForm";
import useFetch from "../../hooks/useFetch";
import branchService from "../../services/branchService";
import reviewService from "../../services/reviewService";
import { useSettings } from "../../context/SettingsContext";
import { buildBreadcrumbSchema, buildReviewSchema } from "../../utils/schemas";

const TABS = [
  { id: "website", label: "Website Reviews" },
  { id: "google", label: "Google Reviews", icon: FcGoogle },
];

const Reviews = () => {
  const [activeTab, setActiveTab] = useState("website");
  const [showForm, setShowForm] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const { settings } = useSettings();

  const { data: branches } = useFetch(() => branchService.getAll({ active: true }), []);
  const { data: approvedReviews, meta: reviewMeta } = useFetch(
    () => reviewService.getApproved({ limit: 10 }),
    []
  );

  useEffect(() => {
    if (branches?.length && !selectedBranch) {
      setSelectedBranch(branches.find((b) => b.googlePlaceId)?._id || branches[0]._id);
    }
  }, [branches, selectedBranch]);

  const structuredData = [
    buildBreadcrumbSchema([
      { label: "Home", path: "/" },
      { label: "Reviews", path: "/reviews" },
    ]),
    buildReviewSchema({
      siteName: settings.siteName,
      reviews: approvedReviews || [],
      averageRating: reviewMeta?.averageRating,
      totalReviews: reviewMeta?.totalApproved,
    }),
  ];

  return (
    <>
      <SEO
        title="Reviews"
        description="See what our guests are saying — Google reviews and website reviews for Bhojanams & Biryanis."
        url="/reviews"
        structuredData={structuredData}
      />
      <PageHeader
        eyebrow="Guest Feedback"
        title="Reviews & Ratings"
        subtitle="Honest feedback from real guests, across Google and our website."
      />

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2 rounded-full bg-white p-1.5 shadow-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    activeTab === tab.id
                      ? "bg-charcoal-900 text-white"
                      : "text-charcoal-600 hover:bg-charcoal-50"
                  }`}
                >
                  {tab.icon && <tab.icon size={16} />}
                  {tab.label}
                </button>
              ))}
            </div>

            <button onClick={() => setShowForm((prev) => !prev)} className="btn-primary text-sm">
              <FiEdit3 size={16} /> Write a Review
            </button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-10 overflow-hidden"
              >
                <WriteReviewForm onSubmitted={() => setShowForm(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === "website" && <WebsiteReviews />}

          {activeTab === "google" && (
            <div>
              {branches?.length > 1 && (
                <div className="mb-6 flex justify-center">
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="rounded-full border border-charcoal-200 bg-white px-5 py-2.5 text-sm outline-none focus:border-primary-500"
                  >
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.branchName} — {b.address?.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <GoogleReviews branchId={selectedBranch} />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Reviews;
