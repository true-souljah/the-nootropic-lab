import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['@nootropic/ui', '@nootropic/data'],
  // Tree-shake barrel imports from internal packages so a page that uses
  // only one template from @nootropic/ui doesn't pull in the whole
  // index.ts re-export tree. Native Next.js optimization, no behavior
  // change beyond smaller per-route JS chunks.
  experimental: {
    optimizePackageImports: ['@nootropic/ui', '@nootropic/data'],
  },
};

export default nextConfig;
