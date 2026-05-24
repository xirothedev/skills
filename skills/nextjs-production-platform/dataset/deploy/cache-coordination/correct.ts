// CORRECT: Configure a shared cache handler for multi-instance self-hosting.
export const nextConfig = {
  cacheComponents: true,
  cacheHandler: require.resolve("./cache-handler.js"),
  cacheMaxMemorySize: 0,
};
