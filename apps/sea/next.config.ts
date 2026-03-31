import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['@nootropic/ui', '@nootropic/data'],
};

export default nextConfig;
