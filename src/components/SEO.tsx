import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({ 
  title = "Uzbek Society | University of Birmingham", 
  description = "The heart of Uzbek culture at UoB. Join us for Navruz celebrations, plov nights, and more!", 
  image = "/og-image.jpg", 
  url = window.location.href, 
  type = "website" 
}: SEOProps) {
  const siteTitle = title === "Uzbek Society | University of Birmingham" ? title : `${title} | UzbekSoc UoB`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />

      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
