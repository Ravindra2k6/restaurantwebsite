import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBriefcase, FiMapPin, FiClock, FiCheckCircle, FiUpload } from "react-icons/fi";
import SEO from "../../components/SEO/SEO";
import PageHeader from "../../components/UI/PageHeader";
import useFetch from "../../hooks/useFetch";
import careerService from "../../services/careerService";
import { CardSkeletonGrid } from "../../components/Loading/Skeletons";
import ErrorMessage from "../../components/Error/ErrorMessage";
import { useToast } from "../../context/ToastContext";
import { capitalize } from "../../utils/formatters";

const inputClass =
  "w-full rounded-xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30";

const ApplicationForm = ({ jobId, onDone }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", coverNote: "" });
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      showToast("Please attach your resume (PDF or Word)", "error");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("resume", resume);
      await careerService.apply(jobId, formData);
      setSubmitted(true);
      showToast("Application submitted!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-700">
        <FiCheckCircle size={20} /> Application received — we'll be in touch!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl bg-charcoal-50 p-5" noValidate>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
        />
        <input
          required
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass}
        />
      </div>
      <input
        required
        type="email"
        placeholder="Email address"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={inputClass}
      />
      <textarea
        rows={3}
        placeholder="Brief cover note (optional)"
        value={form.coverNote}
        onChange={(e) => setForm({ ...form, coverNote: e.target.value })}
        className={inputClass}
      />
      <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-charcoal-300 px-4 py-3 text-sm text-charcoal-500 hover:border-primary-400">
        <FiUpload size={16} />
        {resume ? resume.name : "Attach resume (PDF or Word)"}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
        />
      </label>
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="btn-primary text-sm">
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
        <button type="button" onClick={onDone} className="btn-secondary text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
};

const Careers = () => {
  const [applyingTo, setApplyingTo] = useState(null);
  const { data: jobs, loading, error, refetch } = useFetch(() => careerService.getAll(), []);

  return (
    <>
      <SEO
        title="Careers"
        description="Join the Bhojanams & Biryanis team — explore open positions across our kitchen, service and management staff."
        url="/careers"
      />
      <PageHeader
        eyebrow="Join Our Team"
        title="Careers at Bhojanams & Biryanis"
        subtitle="Build a career in hospitality with a team that treats you like family."
      />

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {loading && <CardSkeletonGrid count={4} columns="sm:grid-cols-1 lg:grid-cols-1" />}
          {error && <ErrorMessage message={error} onRetry={refetch} />}
          {!loading && !error && jobs?.length === 0 && (
            <p className="text-center text-charcoal-400">
              No open positions right now — check back soon!
            </p>
          )}

          <div className="space-y-4">
            {jobs?.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-2xl bg-white p-6 shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-charcoal-900">
                      {job.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-charcoal-500">
                      <span className="flex items-center gap-1.5">
                        <FiBriefcase size={14} /> {capitalize(job.department)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FiClock size={14} /> {capitalize(job.employmentType?.replace("-", " "))}
                      </span>
                      {job.branch?.branchName && (
                        <span className="flex items-center gap-1.5">
                          <FiMapPin size={14} /> {job.branch.branchName}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setApplyingTo(applyingTo === job._id ? null : job._id)}
                    className="btn-secondary text-sm"
                  >
                    {applyingTo === job._id ? "Close" : "Apply Now"}
                  </button>
                </div>

                <p className="mt-4 text-sm text-charcoal-600">{job.description}</p>

                <AnimatePresence>
                  {applyingTo === job._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-5 overflow-hidden"
                    >
                      <ApplicationForm jobId={job._id} onDone={() => setApplyingTo(null)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Careers;
