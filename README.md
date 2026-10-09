# 玫枫五笔

基于 [rime-wubi86-jidian](https://github.com/KyleBing/rime-wubi86-jidian) 的说明和下载站，用 VitePress 构建。

| 页面 | 内容 |
| --- | --- |
| `docs/index.md` | 首页和打字示意 |
| `docs/macos.md` | macOS 输入法与 1.0.2 安装包 |
| `docs/ios.md` | iOS 键盘 |
| `docs/windows.md` | Windows 后续版本 |
| `docs/android.md` | Android 可能会做 |
| `docs/pain.md` | 各端都会有的造词、同步、标点和日期 |
| `docs/guide/` | 从 macOS 输入法仓库迁来的使用说明 |

```bash
npm install
npm run docs:dev
```

推到 `main` 后，GitHub Actions 会构建并部署到 GitHub Pages。

同步到线上网站：

```bash
./scripts/update_site.sh
```

脚本会构建站点并放到 `https://kylebing.cn/wubi/`，同时删掉旧的 `/var/www/html/wubi/macos`。
