export const dynamic = 'force-static';
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://thenootropiclab.com';

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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...aiBots.map(userAgent => ({ userAgent, allow: '/' })),
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
