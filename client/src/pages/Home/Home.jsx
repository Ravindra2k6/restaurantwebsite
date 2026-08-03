import SEO from "../../components/SEO/SEO";
import Hero from "../../components/Hero/Hero";
import TodaysSpecial from "../../components/TodaysSpecial/TodaysSpecial";
import FeaturedDishes from "../../components/FeaturedDishes/FeaturedDishes";
import WhyChooseUs from "../../components/About/WhyChooseUs";
import ChefSpecial from "../../components/Chef/ChefSpecial";
import RestaurantStory from "../../components/About/RestaurantStory";
import Testimonials from "../../components/Testimonials/Testimonials";
import GalleryPreview from "../../components/Gallery/GalleryPreview";
import BranchesPreview from "../../components/BranchCard/BranchesPreview";
import LatestOffers from "../../components/Offers/LatestOffers";
import FAQAccordion from "../../components/FAQ/FAQAccordion";
import NewsletterBanner from "../../components/Newsletter/NewsletterBanner";
import { useSettings } from "../../context/SettingsContext";
import useFetch from "../../hooks/useFetch";
import branchService from "../../services/branchService";
import faqService from "../../services/faqService";
import { buildRestaurantSchema, buildOrganizationSchema, buildFAQSchema } from "../../utils/schemas";

const Home = () => {
  const { settings } = useSettings();
  const { data: branches } = useFetch(() => branchService.getAll({ active: true }), []);
  const { data: faqs } = useFetch(() => faqService.getAll({ limit: 20 }), []);

  const structuredData = [
    buildOrganizationSchema(settings),
    buildRestaurantSchema({ settings, branches: branches || [] }),
    faqs?.length ? buildFAQSchema(faqs) : null,
  ];

  return (
    <>
      <SEO
        title="Home"
        description="Bhojanams & Biryanis — relaxed, premium dining serving biryanis and Andhra staples alongside thali meals. Reserve your table online today."
        url="/"
        structuredData={structuredData}
      />
      <Hero />
      <TodaysSpecial />
      <FeaturedDishes />
      <WhyChooseUs />
      <ChefSpecial />
      <RestaurantStory />
      <Testimonials />
      <GalleryPreview />
      <BranchesPreview />
      <LatestOffers />
      <FAQAccordion />
      <NewsletterBanner />
    </>
  );
};

export default Home;
