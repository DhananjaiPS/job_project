import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    // your webpack tweaks here
    return config;
  },
};

export default nextConfig;
