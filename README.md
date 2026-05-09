# 情報処理安全確保支援士 学習サイト

IPA 情報処理安全確保支援士試験 (SC) の合格を目指す、解説・過去問・類似問題のサイトです。

公開先: https://ryujiyasu.github.io/SecuritySpecialist/

## 構成

```
SecuritySpecialist/
├── src/
│   ├── content/docs/
│   │   ├── index.mdx              # トップページ
│   │   ├── intro/                 # 試験概要・ロードマップ
│   │   ├── topics/                # 解説 (技術 / 法令 / マネジメント)
│   │   ├── afternoon/             # 午後問題対策
│   │   ├── past-exams/            # 過去問解説
│   │   └── practice/              # 類似テスト
│   ├── components/
│   │   └── Mermaid.astro          # クライアントサイド Mermaid 図
│   └── styles/custom.css
├── public/past-exams/             # IPA 過去問 PDF (download スクリプトで取得)
├── scripts/
│   └── download-past-exams.sh     # IPA 過去問 PDF 一括ダウンロード
└── .github/workflows/deploy.yml   # GitHub Pages 自動デプロイ
```

## 開発

```bash
npm install
npm run dev      # http://localhost:4321/SecuritySpecialist/
npm run build    # 本番ビルド (dist/)
npm run preview  # ビルド後の確認
```

## 過去問 PDF の取得

IPA は過去問を「許諾・使用料不要」で公開しています ([公式](https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html))。
本リポジトリには PDF 自体は含めず、必要に応じて以下で取得してください。

```bash
bash scripts/download-past-exams.sh
```

`scripts/download-past-exams.sh` 内の URL は IPA サイト構造の更新で動かなくなる可能性があります。
失敗したら IPA 公式から手動で URL を控えてスクリプトを編集してください。

## コンテンツ拡張ガイド

### 新しい過去問解説を追加する

1. `src/content/docs/past-exams/<年度>-<期>-<区分>-<問番号>.mdx` を作成
2. テンプレートとして `r6-aki-pm1-q1.mdx` をコピー
3. 出典 (年度・期) を必ず明記
4. 図は Mermaid を `<Mermaid code={...} />` で埋め込み

### 新しい類似テストを追加する

1. `src/content/docs/practice/set-XX-<topic>.mdx` を作成
2. `set-01-web.mdx` をテンプレートに
3. 過去問・市販書籍からの複製は禁止 (オリジナル作成のみ)

### 図の追加

Mermaid 公式: https://mermaid.js.org/

このリポジトリでは `src/components/Mermaid.astro` でクライアントサイド描画を実装しています。
`flowchart`, `sequenceDiagram`, `quadrantChart`, `pie`, `gantt`, `mindmap` 等が利用可能。

## デプロイ

`main` ブランチへの push で GitHub Actions が自動デプロイします。
初回のみ、リポジトリ Settings > Pages で **Source: GitHub Actions** を選択してください。

## ライセンス・出典

- 本サイトの解説・図・類似テストは独自作成 (再利用は CC BY 4.0 を想定)
- IPA 過去問・解答例・採点講評は IPA 著作物 (許諾・使用料不要、出典明記)
- 過去問再構成ページには必ず「出典: IPA 情報処理安全確保支援士試験 令和X年Y期」を明記しています
