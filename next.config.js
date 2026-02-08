/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        unoptimized: process.env.NODE_ENV === 'development',
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    transpilePackages: ['cheerio', 'undici'],
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push('undici');
        }
        return config;
    },
}

module.exports = nextConfig
