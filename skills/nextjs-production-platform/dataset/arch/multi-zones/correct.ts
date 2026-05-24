// CORRECT: Zone routing includes a separate static asset prefix.
export const nextConfig = {
  assetPrefix: "/dashboard-static",
  async rewrites() {
    return [
      { source: "/dashboard-static/_next/:path*", destination: "https://dashboard.example.com/_next/:path*" },
      { source: "/dashboard/:path*", destination: "https://dashboard.example.com/dashboard/:path*" },
    ];
  },
};
