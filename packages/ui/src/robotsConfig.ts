// Shared robots.txt configuration used by all 8 region apps. Each region's
// `apps/{region}/src/app/robots.ts` is a 3-line wrapper that imports
// `buildRobotsConfig` and passes its `RegionCode`.

import type { MetadataRoute } from 'next';
import { REGIONS } from './seo';
import type { RegionCode } from './seo';

// Explicit per-AI-bot allow rules. Per Stage 7 + Stage 9 portfolio audit:
// ai_stance is allow_all — LLM citations are a primary traffic channel for
// this affiliate-comparison vertical. Wildcard `*` rule retained as fallback.
const aiBots = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'Applebot-Extended',
  'cohere-ai',
  'meta-externalagent',
  'DuckAssistBot',
  'YouBot',
  'MistralAI-User',
  'Diffbot',
];

export function buildRobotsConfig(regionCode: RegionCode): MetadataRoute.Robots {
  const siteUrl = REGIONS[regionCode].siteUrl;
  return {
    rules: [
      ...aiBots.map((userAgent) => ({ userAgent, allow: '/' })),
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
