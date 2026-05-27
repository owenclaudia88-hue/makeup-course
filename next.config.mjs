/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  // Ensure the gated course files in /protected ship with the download function
  // when deployed (e.g. Vercel). For real production prefer object storage
  // (Vercel Blob / S3) — see README.
  experimental: {
    outputFileTracingIncludes: {
      "/api/download": ["./protected/**"],
    },
  },
};

export default nextConfig;
