import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  return import.meta.env.VITE_SITE_URL || "";
};

const toAbsoluteUrl = (value?: string) => {
  if (!value) return undefined;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const base = getBaseUrl();
  return base ? `${base}${value}` : value;
};

export function SEO({
  title = "Uzbek Society at University of Birmingham | Cultural Hub",
  description = "Join the Uzbek Society at the University of Birmingham. Experience authentic culture, traditional food events, networking, and a vibrant student community.",
  image = "/og-image.jpg",
  url = typeof window !== "undefined" ? window.location.href : "",
  type = "website",
}: SEOProps) {
  const siteTitle = title === "Uzbek Society at University of Birmingham | Cultural Hub" ? title : `${title} | UzbekSoc UoB`;
  const absoluteImage = toAbsoluteUrl(image) || "/og-image.jpg";
  const absoluteUrl = url || getBaseUrl();

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      {absoluteUrl && <link rel="canonical" href={absoluteUrl} />}

      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      {absoluteUrl && <meta property="og:url" content={absoluteUrl} />}

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
    </Helmet>
  );
}
