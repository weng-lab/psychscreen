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
      "genomebrowser-test": path.resolve(
        process.cwd(),
        "src/shims/genomebrowser-test.tsx"
      ),
    };

    return config;
  },
};

export default nextConfig;
