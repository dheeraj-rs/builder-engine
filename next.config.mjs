/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  swcMinify: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        path: false,
        buffer: false,
      };
    }

    return config;
  },

  transpilePackages: ['@webcontainer/api'],

  experimental: {
    optimizePackageImports: ['@codemirror/state', '@codemirror/view', '@xterm/xterm'],
  },

  env: {
    NEXT_PUBLIC_APP_NAME: 'D Admin',
  },
};

export default nextConfig;
