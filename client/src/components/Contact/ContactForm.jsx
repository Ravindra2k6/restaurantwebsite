import { useState } from "react";
import { FiSend, FiCheckCircle } from "react-icons/fi";
import contactService from "../../services/contactService";
import { useToast } from "../../context/ToastContext";

const INITIAL_FORM = { name: "", email: "", phone: "", subject: "", message: "" };

const inputClass =
  "w-full rounded-xl border border-charcoal-200 bg-white px-4 py-3 text-sm text-charcoal-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30";
const labelClass = "mb-1.5 block text-sm font-semibold text-charcoal-700";

const ContactForm = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactService.send(form);
      setSent(true);
      setForm(INITIAL_FORM);
      showToast("Message sent successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
        <FiCheckCircle className="mx-auto mb-4 text-green-500" size={48} />
        <h3 className="font-display text-xl font-bold text-charcoal-900">Message Sent!</h3>
        <p className="mt-2 text-charcoal-500">
          Thanks for reaching out — we'll get back to you as soon as possible.
        </p>
        <button onClick={() => setSent(false)} className="btn-secondary mt-6">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-xl sm:p-8" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name *
          </label>
          <input
            id="contact-name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone (optional)
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-subject" className={labelClass}>
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className={inputClass}
            placeholder="General Inquiry"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className={labelClass}>
          Message *
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          value={form.message}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
        {submitting ? "Sending..." : (
          <>
            <FiSend size={16} /> Send Message
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
