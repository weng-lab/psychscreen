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
      // MUI v7 removed Unstable_Grid2; it's now the default Grid
      "@mui/material/Unstable_Grid2": path.resolve(
        process.cwd(),
        "node_modules/@mui/material/Grid"
      ),
    };

    return config;
  },
};

export default nextConfig;
