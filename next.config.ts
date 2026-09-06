// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     dangerouslyAllowSVG: true,
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "*",
//       },
//       {
//         protocol: "https",
//         hostname: "api-dev-sti.dinus.id",
//         pathname: "/**",
//       },
//       {
//         protocol: 'http',
//         hostname: '127.0.0.1',
//         port: '8000',
//         pathname: '/storage/**',
//       },
//     ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
      {
        protocol: "https",
        hostname: "api-fik.jong.my.id",
      }
    ],
  },
};

export default nextConfig;
