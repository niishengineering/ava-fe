/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // 🚫 disables ESLint checks at build time
  },
};

export default nextConfig;
