import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  { text: "文档", link:  "/moyu/" },
  // { text: "前端框架", link:  "/moyu-antdv-admin/" },
  { text: "分离版", link:  "/moyu-boot/" },
  { text: "单体版", link:  "/moyu-admin/" },
  { text: "微前端", link:  "/moyu-micro/" },
  { text: "微服务", link:  "/moyu-cloud/" },
  "/demo/",
  {
    text: "V2 文档",
    icon: "book",
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);
