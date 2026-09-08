import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // Build-time region tag read by shared chrome (FPFooter) to drop links to
  // pages this host does not have (GSC 404 cleanup, 2026-09).
  env: { NEXT_PUBLIC_REGION: 'ca' },
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
