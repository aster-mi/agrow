/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_HOSTNAME,"lh3.googleusercontent.com"],
  },
}

module.exports = nextConfig
