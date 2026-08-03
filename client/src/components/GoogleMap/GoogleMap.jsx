/**
 * Renders a Google Maps embed. Prefers a branch's stored `googleMapsEmbedUrl`
 * (set by the admin) and falls back to building one from lat/lng coordinates
 * so the map still works even if the embed URL hasn't been configured yet.
 */
const GoogleMap = ({ embedUrl, lat, lng, title = "Restaurant location", height = 320 }) => {
  const src =
    embedUrl ||
    (lat && lng
      ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
      : null);

  if (!src) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl bg-charcoal-100 text-sm text-charcoal-400"
        style={{ height }}
      >
        Map unavailable
      </div>
    );
  }

  return (
    <iframe
      title={title}
      src={src}
      width="100%"
      height={height}
      style={{ border: 0 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="rounded-2xl"
    />
  );
};

export default GoogleMap;
