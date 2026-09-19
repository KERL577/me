#!/usr/bin/env bash
# 将 /Users/wuhongliang/项目/me/作品集 下 8 个分类的图片转为 WebP（q80, 宽≤1600px）
set -euo pipefail
SRC_ROOT="/Users/wuhongliang/项目/me/作品集"
OUT_ROOT="$(cd "$(dirname "$0")/.." && pwd)/assets/works"
# bash on macOS is 3.2 (no associative arrays); use parallel indexed arrays.
SRCS=("360作品" "百安居作品" "派欧云作品" "微盟作品" "众安作品" "自己接单作品" "IP形象设计作品" "logo设计作品")
MAPS=("360" "baanju" "paiouyun" "weimob" "zhongan" "freelance" "ip" "logo")
for idx in "${!SRCS[@]}"; do
  src="${SRCS[$idx]}"
  out="$OUT_ROOT/${MAPS[$idx]}"
  mkdir -p "$out"
  i=1
  for f in "$SRC_ROOT/$src"/*.{png,jpg,jpeg}; do
    [ -e "$f" ] || continue
    case "$f" in *.DS_Store) continue;; esac
    target="$out/$i.webp"
    if [ ! -f "$target" ] || [ "$f" -nt "$target" ]; then
      cwebp -quiet -q 80 -resize 1600 0 "$f" -o "$target"
    fi
    i=$((i+1))
  done
done
echo "done: WebP files in $OUT_ROOT"