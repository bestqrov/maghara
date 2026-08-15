import type { NextConfig } from "next";
import path from "path";

const OLD_SEO_SLUGS = [
  'zawaj-casablanca',
  'zawaj-rabat',
  'zawaj-marrakech',
  'zawaj-tangier',
  'zawaj-agadir',
  'zawaj-morocco-france',
  'zawaj-morocco-spain',
  'zawaj-morocco-canada',
  'zawaj-morocco-uae',
  'zawaj-morocco-belgium',
];

const OLD_APP_ROUTES = ['login', 'register', 'feed', 'matches', 'settings', 'store', 'verification', 'visitors'];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      // These SEO pages used to live unprefixed (/zawaj-casablanca); they now
      // live under /ar/... alongside the new fr/en/es translations.
      ...OLD_SEO_SLUGS.map((slug) => ({
        source: `/${slug}`,
        destination: `/ar/${slug}`,
        permanent: true,
      })),
      // The whole authenticated app moved under /[locale]/... too. Old
      // bookmarks/links default to Arabic; the in-app language switcher
      // takes it from there.
      ...OLD_APP_ROUTES.map((route) => ({
        source: `/${route}`,
        destination: `/ar/${route}`,
        permanent: true,
      })),
      {
        source: '/chat/:conversationId',
        destination: '/ar/chat/:conversationId',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
