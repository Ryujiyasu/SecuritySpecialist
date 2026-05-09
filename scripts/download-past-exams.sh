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
#
# 注意: IPA の URL は年度ごとに opaque な path が含まれており、突然の変更があり得る。
# 動かなくなったら https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html から
# 各年度ページの URL を確認し、本スクリプト内の BASE_* を更新する。

set -euo pipefail

OUT_DIR="public/past-exams"
mkdir -p "$OUT_DIR"

# 年度別 base path (IPA サイトの opaque token)
BASE_R05="https://www.ipa.go.jp/shiken/mondai-kaiotu/ps6vr70000010d6y-att"
BASE_R06="https://www.ipa.go.jp/shiken/mondai-kaiotu/m42obm000000afqx-att"
BASE_R07="https://www.ipa.go.jp/shiken/mondai-kaiotu/nl10bi0000009lh8-att"

declare -A EXAMS=(
  # R5 春期 (午後 I + 午後 II の旧形式)
  ["r05-haru"]="$BASE_R05/2023r05h_sc_am2_qs.pdf $BASE_R05/2023r05h_sc_am2_ans.pdf $BASE_R05/2023r05h_sc_pm1_qs.pdf $BASE_R05/2023r05h_sc_pm1_ans.pdf $BASE_R05/2023r05h_sc_pm1_cmnt.pdf $BASE_R05/2023r05h_sc_pm2_qs.pdf $BASE_R05/2023r05h_sc_pm2_ans.pdf $BASE_R05/2023r05h_sc_pm2_cmnt.pdf"

  # R5 秋期 (午後 4 問選択 2 問の現行形式に移行)
  ["r05-aki"]="$BASE_R05/2023r05a_sc_am2_qs.pdf $BASE_R05/2023r05a_sc_am2_ans.pdf $BASE_R05/2023r05a_sc_pm_qs.pdf $BASE_R05/2023r05a_sc_pm_ans.pdf $BASE_R05/2023r05a_sc_pm_cmnt.pdf"

  # R6 春期
  ["r06-haru"]="$BASE_R06/2024r06h_sc_am2_qs.pdf $BASE_R06/2024r06h_sc_am2_ans.pdf $BASE_R06/2024r06h_sc_pm_qs.pdf $BASE_R06/2024r06h_sc_pm_ans.pdf"

  # R6 秋期
  ["r06-aki"]="$BASE_R06/2024r06a_sc_am2_qs.pdf $BASE_R06/2024r06a_sc_am2_ans.pdf $BASE_R06/2024r06a_sc_pm_qs.pdf $BASE_R06/2024r06a_sc_pm_ans.pdf"

  # R7 春期 (最新)
  ["r07-haru"]="$BASE_R07/2025r07h_sc_am2_qs.pdf $BASE_R07/2025r07h_sc_am2_ans.pdf $BASE_R07/2025r07h_sc_pm_qs.pdf $BASE_R07/2025r07h_sc_pm_ans.pdf $BASE_R07/2025r07h_sc_pm_cmnt.pdf"
)

for year in "${!EXAMS[@]}"; do
  dir="$OUT_DIR/$year"
  mkdir -p "$dir"
  for url in ${EXAMS[$year]}; do
    fname=$(basename "$url")
    dest="$dir/$fname"
    if [ -f "$dest" ]; then
      echo "[skip] $dest"
      continue
    fi
    echo "[fetch] $url"
    if curl -sSfL --max-time 60 -o "$dest" "$url"; then
      size=$(stat -c '%s' "$dest" 2>/dev/null || stat -f '%z' "$dest")
      echo "  -> saved: $dest ($size bytes)"
    else
      echo "  -> FAILED: $url" >&2
    fi
    sleep 1  # IPA への負荷を避ける
  done
done

echo ""
echo "完了。出典明記の上で利用してください。"
echo "  例: 出典: IPA 情報処理安全確保支援士試験 令和X年Y期"
