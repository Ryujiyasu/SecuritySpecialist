#!/bin/bash
# IPA 情報処理安全確保支援士試験 (SC) の過去問 PDF を一括ダウンロード
#
# IPA 公式: https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html
# 利用条件: 「法令に特別の定めがある場合を除き許諾や使用料は必要ありません。」
#
# 使い方:
#   bash scripts/download-past-exams.sh
#
# 出力先: public/past-exams/<year>/<file>.pdf

set -euo pipefail

OUT_DIR="public/past-exams"
mkdir -p "$OUT_DIR"

# 年度ディレクトリと、IPA 上のパスのマッピング
# IPA の URL は年度ごとに微妙に異なるため、実際の構造に応じて編集すること
# 確認方法: https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html を開き、
# 各年度のリンクから個別 PDF の URL を控える

declare -A EXAMS=(
  # 形式: ["保存先ディレクトリ"]="URL1 URL2 URL3 URL4"
  # 各 URL は「午前I / 午前II / 午後I / 午後II 問題冊子 + 解答例 + 採点講評」
  ["r07-haru"]="https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07h/2025r07h_sc_am1_qs.pdf https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07h/2025r07h_sc_am2_qs.pdf https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07h/2025r07h_sc_pm1_qs.pdf https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07h/2025r07h_sc_pm2_qs.pdf"
  ["r06-aki"]="https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06a/2024r06a_sc_am1_qs.pdf https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06a/2024r06a_sc_am2_qs.pdf https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06a/2024r06a_sc_pm_qs.pdf"
  ["r06-haru"]="https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06h/2024r06h_sc_am1_qs.pdf https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06h/2024r06h_sc_am2_qs.pdf https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06h/2024r06h_sc_pm_qs.pdf"
  ["r05-aki"]="https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05a/2023r05a_sc_am1_qs.pdf https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05a/2023r05a_sc_am2_qs.pdf https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05a/2023r05a_sc_pm_qs.pdf"
  ["r05-haru"]="https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05h/2023r05h_sc_am1_qs.pdf https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05h/2023r05h_sc_am2_qs.pdf https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05h/2023r05h_sc_pm1_qs.pdf https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05h/2023r05h_sc_pm2_qs.pdf"
  # H21〜R4 については後述の「URL 確認手順」に従って手動で追加してください
  # 参考: 古い年度は https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html の「年度別過去問題」リンク
)

for year in "${!EXAMS[@]}"; do
  dir="$OUT_DIR/$year"
  mkdir -p "$dir"
  for url in ${EXAMS[$year]}; do
    fname=$(basename "$url")
    dest="$dir/$fname"
    if [ -f "$dest" ]; then
      echo "[skip] $dest (already exists)"
      continue
    fi
    echo "[fetch] $url"
    if curl -sSfL --max-time 60 -o "$dest" "$url"; then
      echo "  -> saved: $dest"
    else
      echo "  -> FAILED: $url" >&2
    fi
    sleep 1  # IPA への負荷を避ける
  done
done

echo ""
echo "完了。出典明記の上で利用してください。"
echo "  例: 出典: IPA 情報処理安全確保支援士試験 令和X年Y期"
