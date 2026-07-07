import { ImageResponse } from 'next/og';

// Static OG image for all pages under this region. Next.js generates this
// PNG at build time and wires <meta property="og:image"> + Twitter
// summary_large_image tags into every page's <head>. Per-page metadata in
// pages still controls og:title and og:description.

// Static export mode needs `dynamic = 'force-static'` so Next.js generates
// the PNG at build time instead of treating the route as on-demand.
// Twemoji 'test tube' (twemoji@14.0.2, CC-BY 4.0), inlined as a data URI —
// satori otherwise fetches emoji SVGs from cdn.jsdelivr.net at build time,
// which fails behind the pipeline runner's TLS proxy.
const FLASK_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNiAzNiI+PHBhdGggZmlsbD0iI0NDRDZERCIgZD0iTTE0LjU2MyAxNC40MTRMMjUuNDcgMy41MDVsNi45NjEgNi45NjItMTAuOTA4IDEwLjkwOHoiLz48cGF0aCBmaWxsPSIjNjhFMDkwIiBkPSJNOC4xMDMgMzQuMzk5QzIuNSAzNCAxLjUgMzAuMDYyIDEuNjM1IDI3LjkzMmMuMzIyLTUuMDcgMTUuNjAxLTE2LjU1MSAxNS42MDEtMTYuNTUxbDEyLjUxNyAxLjkzYy4wMDEgMC0xNy4zODkgMjEuMzkyLTIxLjY1IDIxLjA4OHoiLz48cGF0aCBmaWxsPSIjODg5OUE2IiBkPSJNMzIuMzI2IDMuNzA4QzI5LjQwNS43ODcgMjYuMTA0LS42NDkgMjQuOTU0LjUwMmMtLjAxMy4wMTMtLjAyMi4wMzEtLjAzNC4wNDQtLjAwNi4wMDYtLjAxNS4wMDgtLjAyMS4wMTRMMi4yOTUgMjMuMTY0Yy0xLjQxMiAxLjQxMi0yLjE5IDMuMjktMi4xOSA1LjI4OCAwIDEuOTk3Ljc3OCAzLjg3NSAyLjE5IDUuMjg3IDEuNDEzIDEuNDEzIDMuMjkxIDIuMTkgNS4yODggMi4xOSAxLjk5OCAwIDMuODc1LS43NzcgNS4yODctMi4xODlsMjIuNjA0LTIyLjYwNGMuMDA3LS4wMDcuMDA5LS4wMTYuMDE1LS4wMjMuMDEzLS4wMTIuMDMtLjAyLjA0My0uMDMzIDEuMTUxLTEuMTUtLjI4NS00LjQ1MS0zLjIwNi03LjM3MnpNMTAuNzUgMzEuNjE5Yy0uODQ2Ljg0Ni0xLjk3IDEuMzExLTMuMTY2IDEuMzExcy0yLjMyMS0uNDY2LTMuMTY3LTEuMzEyYy0uODQ2LS44NDYtMS4zMTItMS45Ny0xLjMxMi0zLjE2NyAwLTEuMTk2LjQ2Ni0yLjMyIDEuMzExLTMuMTY2TDI1LjQxMiA0LjI5Yy42MjIgMS4xNDQgMS41NiAyLjM5NCAyLjc0OSAzLjU4NCAxLjE4OSAxLjE4OSAyLjQ0IDIuMTI3IDMuNTg0IDIuNzQ5TDEwLjc1IDMxLjYxOXoiLz48cGF0aCBmaWxsPSIjMTdCRjYzIiBkPSJNMjkuMTk2IDEzLjE0NGMtLjA1OC4zNzktMi42MjcuNzUxLTUuNjkxLjM0My0zLjA2My0uNDA4LTUuNDgyLTEuMjIzLTUuNDAzLTEuODIuMDgtLjU5NyAyLjYyNy0uNzUxIDUuNjkxLS4zNDNzNS40OTUgMS4yMjQgNS40MDMgMS44MnpNMTAuODQgMjMuMjQ3Yy0uMzEuMzEtLjgxMy4zMS0xLjEyMyAwLS4zMS0uMzEtLjMxLS44MTMgMC0xLjEyMy4zMS0uMzEuODEzLS4zMSAxLjEyMyAwIC4zMS4zMS4zMS44MTMgMCAxLjEyM3ptMy4zMTcgMi42MTVjLS41MDcuNTA3LTEuMzI4LjUwNi0xLjgzNSAwLS41MDYtLjUwNi0uNTA2LTEuMzI4IDAtMS44MzQuNTA3LS41MDcgMS4zMjgtLjUwNiAxLjgzNCAwIC41MDcuNTA2LjUwOCAxLjMyNy4wMDEgMS44MzR6bTEuNjc3LTUuMzI0Yy0uNDc2LjQ3Ni0xLjI1LjQ3Ni0xLjcyNiAwcy0uNDc2LTEuMjQ5IDAtMS43MjZjLjQ3Ni0uNDc2IDEuMjQ5LS40NzcgMS43MjUgMCAuNDc4LjQ3Ny40NzggMS4yNS4wMDEgMS43MjZ6bS02Ljg2OCA4Ljg1OGMtLjU4MS41ODEtMS41MjQuNTgxLTIuMTA1IDAtLjU4Mi0uNTgyLS41ODEtMS41MjQgMC0yLjEwNXMxLjUyMy0uNTgxIDIuMTA1IDBjLjU4MS41ODEuNTgyIDEuNTIzIDAgMi4xMDV6bTExLjM5Ni05LjE1OGMtLjQxMy40MTMtMS4wODMuNDEzLTEuNDk2IDAtLjQxMy0uNDEzLS40MTItMS4wODMuMDAxLTEuNDk2LjQxNC0uNDE0IDEuMDgzLS40MTQgMS40OTYtLjAwMS40MTMuNDE0LjQxMyAxLjA4My0uMDAxIDEuNDk3em0tMS4yMDctNC4yODhjLS4yNy4yNy0uNzA4LjI3LS45NzkgMC0uMjctLjI3LS4yNy0uNzA4IDAtLjk3OS4yNy0uMjcuNzA4LS4yNzEuOTc5IDAgLjI3LjI3MS4yNy43MDkgMCAuOTc5eiIvPjxlbGxpcHNlIHRyYW5zZm9ybT0icm90YXRlKC00NS4wMDEgMzAuODE3IDUuMjIzKSIgZmlsbD0iI0NDRDZERCIgY3g9IjMwLjgxNyIgY3k9IjUuMjIzIiByeD0iMS4xODQiIHJ5PSI0Ljg0NyIvPjwvc3ZnPg==';

export const dynamic = 'force-static';

export const alt = 'The Nootropic Lab — Australia Edition';
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FLASK_ICON} width={32} height={32} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>The Nootropic Lab</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 980 }}>
            Independent cognitive supplement reviews
          </div>
          <div style={{ fontSize: 28, opacity: 0.85, fontWeight: 500 }}>
            Australia Edition · TGA-listed · Evidence-graded
          </div>
        </div>

        <div style={{ fontSize: 20, opacity: 0.7, letterSpacing: 0.3 }}>au.thenootropiclab.com</div>
      </div>
    ),
    { ...size },
  );
}
