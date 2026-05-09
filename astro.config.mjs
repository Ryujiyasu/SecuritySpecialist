// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://ryujiyasu.github.io',
  base: '/SecuritySpecialist',
  integrations: [
    starlight({
      title: '情報処理安全確保支援士 学習サイト',
      description: 'IPA 情報処理安全確保支援士試験 (SC) の解説・過去問・類似問題集',
      defaultLocale: 'root',
      locales: { root: { label: '日本語', lang: 'ja' } },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/Ryujiyasu/SecuritySpecialist' },
      ],
      customCss: ['./src/styles/custom.css'],
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
      components: {},
    }),
    mdx(),
  ],
});
