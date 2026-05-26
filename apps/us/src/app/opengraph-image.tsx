import { ImageResponse } from 'next/og';

// Static OG image for all pages under this region. Next.js generates this
// PNG at build time and wires <meta property="og:image"> + Twitter
// summary_large_image tags into every page's <head>. Per-page metadata in
// pages still controls og:title and og:description.

// Static export mode needs `dynamic = 'force-static'` so Next.js generates
// the PNG at build time instead of treating the route as on-demand.
export const dynamic = 'force-static';

export const alt = 'The Nootropic Lab — Independent Cognitive Supplement Reviews';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0E5A2E 0%, #15803D 50%, #1FA34D 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
            }}
          >
            🧪
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>The Nootropic Lab</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 980 }}>
            Independent cognitive supplement reviews
          </div>
          <div style={{ fontSize: 28, opacity: 0.85, fontWeight: 500 }}>
            United States Edition · Evidence-graded · Clinical dose audits
          </div>
        </div>

        <div style={{ fontSize: 20, opacity: 0.7, letterSpacing: 0.3 }}>thenootropiclab.com</div>
      </div>
    ),
    { ...size },
  );
}
