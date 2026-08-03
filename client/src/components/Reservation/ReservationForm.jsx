import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiCalendar, FiClock, FiUsers } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import branchService from "../../services/branchService";
import reservationService from "../../services/reservationService";
import { useToast } from "../../context/ToastContext";
import Spinner from "../Loading/Spinner";

const OCCASIONS = [
  { value: "none", label: "None" },
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "business", label: "Business" },
  { value: "date", label: "Date Night" },
  { value: "family", label: "Family Gathering" },
  { value: "other", label: "Other" },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  branch: "",
  partySize: 2,
  reservationDate: "",
  reservationTime: "",
  occasion: "none",
  specialRequest: "",
};

const inputClass =
  "w-full rounded-xl border border-charcoal-200 bg-white px-4 py-3 text-sm text-charcoal-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30";
const labelClass = "mb-1.5 block text-sm font-semibold text-charcoal-700";

const ReservationForm = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const { showToast } = useToast();

  const { data: branches, loading: branchesLoading } = useFetch(
    () => branchService.getAll({ active: true }),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await reservationService.create(form);
      setSuccess(res.data);
      setForm(INITIAL_FORM);
      showToast("Reservation request sent!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl"
      >
        <FiCheckCircle className="mx-auto mb-4 text-green-500" size={56} />
        <h3 className="font-display text-2xl font-bold text-charcoal-900">
          Reservation Requested!
        </h3>
        <p className="mt-3 text-charcoal-500">
          Thank you, {success.name}. We've received your request for {success.partySize} guest(s)
          on {new Date(success.reservationDate).toLocaleDateString()} at {success.reservationTime}.
          Our team will confirm shortly.
        </p>
        <button onClick={() => setSuccess(null)} className="btn-primary mt-6">
          Book Another Table
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-xl sm:p-10"
      noValidate
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone Number *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="10-digit mobile number"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="email" className={labelClass}>
          Email (optional)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="branch" className={labelClass}>
          Branch *
        </label>
        {branchesLoading ? (
          <Spinner size={24} />
        ) : (
          <select
            id="branch"
            name="branch"
            required
            value={form.branch}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select a branch</option>
            {branches
              ?.filter((b) => b.reservationAvailable)
              .map((b) => (
                <option key={b._id} value={b._id}>
                  {b.branchName} — {b.address?.city}
                </option>
              ))}
          </select>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="reservationDate" className={labelClass}>
            <FiCalendar className="mr-1 inline" size={14} /> Date *
          </label>
          <input
            id="reservationDate"
            name="reservationDate"
            type="date"
            required
            min={todayStr}
            value={form.reservationDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="reservationTime" className={labelClass}>
            <FiClock className="mr-1 inline" size={14} /> Time *
          </label>
          <input
            id="reservationTime"
            name="reservationTime"
            type="time"
            required
            value={form.reservationTime}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="partySize" className={labelClass}>
            <FiUsers className="mr-1 inline" size={14} /> Guests *
          </label>
          <input
            id="partySize"
            name="partySize"
            type="number"
            min={1}
            max={50}
            required
            value={form.partySize}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="occasion" className={labelClass}>
          Occasion
        </label>
        <select
          id="occasion"
          name="occasion"
          value={form.occasion}
          onChange={handleChange}
          className={inputClass}
        >
          {OCCASIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="specialRequest" className={labelClass}>
          Special Request (optional)
        </label>
        <textarea
          id="specialRequest"
          name="specialRequest"
          rows={3}
          value={form.specialRequest}
          onChange={handleChange}
          className={inputClass}
          placeholder="Window seat, dietary needs, celebration setup, etc."
        />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary mt-8 w-full">
        {submitting ? "Submitting..." : "Reserve Table"}
      </button>
    </form>
  );
};

export default ReservationForm;
