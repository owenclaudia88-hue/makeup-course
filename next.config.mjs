/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  // Ensure the gated course files in /protected ship with the download function
  // when deployed (e.g. Vercel). For real production prefer object storage
  // (Vercel Blob / S3) — see README.
  experimental: {
    outputFileTracingIncludes: {
      "/api/download": ["./protected/**"],
      "/api/kurs-pdf": ["./protected/**"],
    },
  },
  // Permanent 301 redirects from the legacy Swedish paths to the new English
  // ones. Keeps any pre-existing ad clicks, emailed links, Stripe success URLs,
  // bookmarks, etc. working forever.
  async redirects() {
    return [
      { source: "/plattform/logga-in", destination: "/platform/login", permanent: true },
      { source: "/plattform/konto", destination: "/platform/account", permanent: true },
      { source: "/plattform/kurs/:slug", destination: "/platform/course/:slug", permanent: true },
      { source: "/plattform", destination: "/platform", permanent: true },
      { source: "/plattform/:path*", destination: "/platform/:path*", permanent: true },
      { source: "/kassa", destination: "/checkout", permanent: true },
      { source: "/kassa/:path*", destination: "/checkout/:path*", permanent: true },
      { source: "/tack", destination: "/thanks", permanent: true },
      { source: "/tack/:path*", destination: "/thanks/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
