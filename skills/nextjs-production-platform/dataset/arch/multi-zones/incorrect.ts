// INCORRECT: A zone deployed under /dashboard still uses default asset paths.
export const nextConfig = {
  async rewrites() {
    return [{ source: "/dashboard/:path*", destination: "https://dashboard.example.com/:path*" }];
  },
};
