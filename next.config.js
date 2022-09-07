/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  nextConfig,
  images: {
    domains: ["cur8-images.s3.us-east-2.amazonaws.com"],
    allowFutureImage: true,
  },
};
