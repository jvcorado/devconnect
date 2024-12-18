/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        serverActions: true,
    },
    images: {
        domains: ['files.stripe.com', 'res.cloudinary.com'],
    },

};

export default nextConfig;