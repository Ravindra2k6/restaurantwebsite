import SEO from "../../components/SEO/SEO";
import PageHeader from "../../components/UI/PageHeader";
import GalleryGrid from "../../components/Gallery/GalleryGrid";

const Gallery = () => (
  <>
    <SEO
      title="Gallery"
      description="Take a visual tour of Bhojanams & Biryanis — our food, ambience, events and more."
      url="/gallery"
    />
    <PageHeader
      eyebrow="Take a Look"
      title="Photo Gallery"
      subtitle="A glimpse into our kitchen, our dining rooms, and the moments in between."
    />
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GalleryGrid />
      </div>
    </section>
  </>
);

export default Gallery;
