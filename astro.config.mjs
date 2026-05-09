// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://ryujiyasu.github.io';
const BASE = '/SecuritySpecialist';
const FULL = `${SITE}${BASE}`;
const TITLE = '情報処理安全確保支援士 学習サイト';
const DESC = 'IPA 情報処理安全確保支援士試験 (SC) を最短で突破するための解説・過去問・類似テスト集。法令・暗号・ネットワーク・Web セキュリティ・マネジメントを図解で整理。';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: TITLE,
      description: DESC,
      defaultLocale: 'root',
      locales: { root: { label: '日本語', lang: 'ja' } },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/Ryujiyasu/SecuritySpecialist' },
      ],
      customCss: ['./src/styles/custom.css'],
      lastUpdated: true,
      pagination: true,
      head: [
        // Open Graph
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:title', content: TITLE } },
        { tag: 'meta', attrs: { property: 'og:description', content: DESC } },
        { tag: 'meta', attrs: { property: 'og:url', content: FULL + '/' } },
        { tag: 'meta', attrs: { property: 'og:image', content: FULL + '/og-image.svg' } },
        { tag: 'meta', attrs: { property: 'og:locale', content: 'ja_JP' } },
        { tag: 'meta', attrs: { property: 'og:site_name', content: TITLE } },
        // Twitter
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:title', content: TITLE } },
        { tag: 'meta', attrs: { name: 'twitter:description', content: DESC } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: FULL + '/og-image.svg' } },
        // SEO
        { tag: 'meta', attrs: { name: 'keywords', content: '情報処理安全確保支援士,セキスペ,SC試験,IPA,情報処理技術者試験,過去問,午後問題,合格対策,セキュリティ' } },
        { tag: 'meta', attrs: { name: 'author', content: 'Ryuji Yasukochi' } },
        { tag: 'meta', attrs: { name: 'robots', content: 'index,follow' } },
        // Theme color
        { tag: 'meta', attrs: { name: 'theme-color', content: '#0d7a8a' } },
        // JSON-LD
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          content: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: TITLE,
            description: DESC,
            url: FULL + '/',
            inLanguage: 'ja-JP',
            publisher: {
              '@type': 'Person',
              name: 'Ryuji Yasukochi',
              url: 'https://github.com/Ryujiyasu',
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: `${FULL}/?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }),
        },
      ],
      sidebar: [
        {
          label: 'はじめに',
          items: [
            { label: 'このサイトについて', link: '/' },
            { label: '試験概要 (SC とは)', slug: 'intro/about-exam' },
            { label: '学習ロードマップ', slug: 'intro/roadmap' },
          ],
        },
        {
          label: '解説 (技術領域)',
          items: [
            { label: '暗号と認証', slug: 'topics/crypto-auth' },
            { label: 'ネットワーク', slug: 'topics/network' },
            { label: 'Web セキュリティ', slug: 'topics/web' },
          ],
        },
        {
          label: '解説 (法令・規格)',
          items: [
            { label: '個人情報保護法', slug: 'topics/law-pipa' },
            { label: '不正アクセス禁止法 / 関連法', slug: 'topics/law-nal' },
            { label: 'ISMS / NIST / 各種規格', slug: 'topics/standards' },
          ],
        },
        {
          label: '解説 (マネジメント)',
          items: [
            { label: 'CSIRT とインシデント対応', slug: 'topics/csirt' },
            { label: 'リスクアセスメント / 監査', slug: 'topics/risk-audit' },
          ],
        },
        {
          label: '午後問題対策',
          items: [
            { label: '時間配分と解法戦略', slug: 'afternoon/strategy' },
            { label: '記述式の書き方', slug: 'afternoon/writing' },
          ],
        },
        {
          label: '過去問',
          items: [{ autogenerate: { directory: 'past-exams' } }],
        },
        {
          label: '類似テスト',
          items: [{ autogenerate: { directory: 'practice' } }],
        },
      ],
    }),
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'ja', locales: { ja: 'ja-JP' } },
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
