#!/bin/bash
# 构建 VitePress 站点，同步到线上 /var/www/html/wubi，并删掉旧的 macos 目录。
#
#   ./scripts/update_site.sh
#
# 可覆盖：
#   DEPLOY_HOST=root@kylebing.cn
#   DEPLOY_DIR=/var/www/html/wubi
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/docs/.vitepress/dist"
HOST="${DEPLOY_HOST:-root@kylebing.cn}"
DEST="${DEPLOY_DIR:-/var/www/html/wubi}"
OLD_MACOS="${DEST}/macos"

if ! command -v npm >/dev/null 2>&1; then
  echo "需要本机已安装 Node.js / npm"
  exit 1
fi

cd "$ROOT"
if [[ ! -d node_modules/vitepress ]]; then
  echo "正在安装依赖…"
  npm install
fi

echo "正在构建站点（base=/wubi/）…"
DOCS_BASE=/wubi/ npm run docs:build

if [[ ! -f "$DIST/index.html" ]]; then
  echo "构建产物不存在: $DIST"
  exit 1
fi

echo "同步到 ${HOST}:${DEST}"
ssh "$HOST" "mkdir -p '$DEST' && rm -rf '$OLD_MACOS'"
# 用本次构建替换站点目录，旧的 macos 子目录已先删掉。
rsync -avz --delete "$DIST/" "${HOST}:${DEST}/"

echo "已更新 https://kylebing.cn/wubi/"
