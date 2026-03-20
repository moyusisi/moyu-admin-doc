import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "moyuAdmin",
  description: "大型企业后台管理系统开发文档",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
