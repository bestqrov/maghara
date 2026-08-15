import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

const PRIVATE_APP_ROUTES = [
  '/feed',
  '/matches',
  '/chat',
  '/visitors',
  '/store',
  '/settings',
  '/onboarding',
  '/verification',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_APP_ROUTES,
      },
      // AI / generative-engine crawlers — explicitly allowed for GEO
      { userAgent: 'GPTBot', allow: '/', disallow: PRIVATE_APP_ROUTES },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: PRIVATE_APP_ROUTES },
      { userAgent: 'ClaudeBot', allow: '/', disallow: PRIVATE_APP_ROUTES },
      { userAgent: 'Claude-Web', allow: '/', disallow: PRIVATE_APP_ROUTES },
      { userAgent: 'anthropic-ai', allow: '/', disallow: PRIVATE_APP_ROUTES },
      { userAgent: 'PerplexityBot', allow: '/', disallow: PRIVATE_APP_ROUTES },
      { userAgent: 'Perplexity-User', allow: '/', disallow: PRIVATE_APP_ROUTES },
      { userAgent: 'Google-Extended', allow: '/', disallow: PRIVATE_APP_ROUTES },
      { userAgent: 'Applebot-Extended', allow: '/', disallow: PRIVATE_APP_ROUTES },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
