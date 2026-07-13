/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
  },
  turbopack: {
    resolveAlias: {
      fs: { browser: "./src/empty-module.ts" },
      // @weng-lab/psychscreen-ui-components' compiled bundle still imports the old MUI v6 path; MUI v7 removed it, Grid is now the default
      "@mui/material/Unstable_Grid2": "@mui/material/Grid",
    },
  },
  allowedDevOrigins: ['arch.crane-tawny.ts.net']
};

export default nextConfig;
