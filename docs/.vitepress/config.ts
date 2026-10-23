import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-mermaid-viewer'

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: "moyuAdmin",
    description: "moyuAdmin文档",
    // 部署到github页面，需要设置为 '/<repository>/'
    base: '/moyu-admin-doc/',
    // 构建输出位置
    outDir: '../public',

    // 主题相关配置
    themeConfig: {
      logo: '/logo.png',

      nav: [
        { text: '首页', link: '/' },
        {
          text: '前端文档',
          link: '/moyu-admin/'
        },
        {
          text: '后端文档',
          link: '/moyu-boot/'
        },
        // {
        //   text: '后端文档',
        //   items: [
        //     { text: 'moyuBoot后端', link: '/moyu-boot/' },
        //     { text: '单体版', link: '...' },
        //     { text: '多模块版', link: '...' }
        //   ]
        // },
      ],

      sidebar: {
        '/moyu-admin/': [
          {
            text: '入门',
            base: '/moyu-admin/',
            items: [
              { text: '项目介绍', link: '/index' },
              { text: '快速开始', link: '/quick-start' },
            ]
          },
          {
            text: '操作指南',
            base: '/moyu-admin/guide/',
            items: [
              { text: '资源管理', link: '/guide-menu' },
              { text: '权限管理', link: '/guide-perm' },
            ]
          },
          // {
          //   text: '开发指南',
          //   base: '/moyu-admin/dev/',
          //   items: [
          //     { text: '动态路由', link: '/guide-menu' },
          //     { text: 'Mock数据', link: '/guide-menu' },
          //   ]
          // },
          {
            text: '微应用',
            base: '/moyu-admin/micro/',
            items: [
              { text: '项目介绍', link: '/index' },
              { text: '无界', link: '/micro-wujie' },
            ]
          },
        ],
        '/moyu-boot/': [
          {
            text: 'moyu-boot',
            base: '/moyu-boot/',
            items: [
              { text: '项目介绍', link: '/index' },
              { text: '快速开始', link: '/quick-start' },
              {
                text: '开发指南',
                items: [
                  { text: '开发规范', link: '/dev-standard' },
                  { text: '代码生成', link: '/dev-codegen' },
                ]
              },
              {
                text: '认证鉴权',
                items: [
                  { text: '登陆认证', link: '/auth-login' },
                  { text: '接口鉴权', link: '/auth-perm' },
                  { text: '数据权限', link: '/auth-data-scope' },
                ]
              },
              {
                text: '功能模块',
                items: [
                  { text: '日志管理', link: '/module-log' },
                ]
              },
            ]
          }
        ],
      },
      // 右侧页面大纲配置
      outline: {
        // 显示的标题层级：默认 2（只显示 h1、h2）
        level: [2, 3], // 从 h2 到 h3 都展示
        label: '页内导航' // 自定义大纲标题文字，默认是 "On this page"
      },
      docFooter: {
        prev: false,
        next: false
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
      ]
    },

    // mermaid 配置
    mermaid: {
      theme: 'default',
    },
    mermaidPlugin: {
      class: 'mermaid',
    },
  })
)
