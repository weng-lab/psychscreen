import path from "path";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      fs: path.resolve(process.cwd(), "src/empty-module.ts"),
    };

    return config;
  },
};

export default nextConfig;
