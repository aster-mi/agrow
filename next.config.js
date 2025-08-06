/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_HOSTNAME, "lh3.googleusercontent.com"],
  },
  webpack: (config, { isServer }) => {
    // Suppress optional native modules from ws in server bundle
    if (isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        bufferutil: false,
        "utf-8-validate": false,
      };
    }
    return config;
  },
};

module.exports = nextConfig
