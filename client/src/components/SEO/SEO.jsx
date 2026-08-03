import { Helmet } from "react-helmet-async";
import { SITE_URL } from "../../utils/constants";
import { useSettings } from "../../context/SettingsContext";

/**
 * Drop this into any page with page-specific title/description/image to
 * override the default tags set in index.html. Also handles canonical URLs
 * and structured data (JSON-LD) injection.
 *
 * `structuredData` accepts either a single schema object or an array of
 * them (e.g. Restaurant + BreadcrumbList on the same page) -- each renders
 * as its own <script type="application/ld+json"> block, which is valid
 * per Google's structured data guidelines (multiple blocks > one array).
 */
const SEO = ({
  title,
  description,
  image,
  url,
  type = "website",
  structuredData,
  noIndex = false,
}) => {
  const { settings } = useSettings();
  const siteName = settings?.siteName || "Bhojanams & Biryanis";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const ogImage = image || settings?.seoDefaults?.ogImage || `${SITE_URL}/og-default.jpg`;
  const schemaBlocks = Array.isArray(structuredData)
    ? structuredData.filter(Boolean)
    : structuredData
    ? [structuredData]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {schemaBlocks.map((block, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
