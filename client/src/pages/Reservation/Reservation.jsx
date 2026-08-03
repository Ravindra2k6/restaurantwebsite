import SEO from "../../components/SEO/SEO";
import PageHeader from "../../components/UI/PageHeader";
import ReservationForm from "../../components/Reservation/ReservationForm";

const Reservation = () => (
  <>
    <SEO
      title="Reserve a Table"
      description="Book your table at Bhojanams & Biryanis in just a few clicks."
      url="/reservation"
    />
    <PageHeader
      eyebrow="Book Ahead"
      title="Reserve Your Table"
      subtitle="Skip the wait — let us have your table ready when you arrive."
    />
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ReservationForm />
      </div>
    </section>
  </>
);

export default Reservation;
