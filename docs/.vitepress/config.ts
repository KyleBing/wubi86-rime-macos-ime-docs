import { defineConfig } from 'vitepress'

// 线上站挂在 /wubi/，GitHub Pages 挂在仓库子路径，本地预览用根路径。
const base = process.env.DOCS_BASE
  || (process.env.GITHUB_ACTIONS ? '/wubi86-rime-macos-ime-docs/' : '/')

export default defineConfig({
  title: '玫枫五笔',
  description: '基于 rime-wubi86-jidian 的五笔输入法：使用说明、下载，以及各系统上的做法。',
  lang: 'zh-CN',
  base,
  // 线上 nginx 不会把 /guide/install 映射到 install.html，部署到 /wubi/ 时保留后缀。
  cleanUrls: !process.env.DOCS_BASE,
  // 安装包在 public 里，不是 Markdown 页面。
  ignoreDeadLinks: [/^\/download\//],
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: `${base}logo.png`, type: 'image/png' }]
  ],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: '玫枫五笔',
    nav: [
      { text: '下载', link: '/download' },
      { text: 'macOS', link: '/macos' },
      { text: 'iOS', link: '/ios' },
      { text: 'Windows', link: '/windows' },
      { text: 'Android', link: '/android' },
      { text: '痛点解决', link: '/pain' },
      { text: '使用说明', link: '/guide/install' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '通用',
          items: [
            { text: '开始输入', link: '/guide/install' },
            { text: '自造词', link: '/guide/custom-words' },
            { text: '日期与时间', link: '/guide/date-time' },
            { text: '快捷键', link: '/guide/shortcuts' },
            { text: '词库与同步', link: '/guide/lexicon' }
          ]
        },
        {
          text: 'macOS',
          items: [
            { text: '安装', link: '/macos' },
            { text: '下载', link: '/download' },
            { text: '外观', link: '/guide/appearance' }
          ]
        }
      ]
    },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: { text: '更新于' },
    search: { provider: 'local' },
    footer: {
      message: '方案 <a href="https://github.com/KyleBing/rime-wubi86-jidian">rime-wubi86-jidian</a> · 引擎 <a href="https://github.com/rime/librime">librime</a>',
      copyright: '玫枫五笔 · <a href="mailto:kylebing@163.com">kylebing@163.com</a> · QQ 群 878750538'
    }
  }
})
