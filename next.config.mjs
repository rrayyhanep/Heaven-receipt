/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // keep server functions for OpenNext
  experimental: {
    outputFileTracingRoot: __dirname, // ensures all necessary files are traced
  },
  reactStrictMode: true,
}

module.exports = nextConfig