---
title: 微前端应用
---
# 微前端应用
## 项目简介

`moyu-micro-admin`是在`moyu-antdv-admin`的基础上，采用微前端架构设计，支持将多个独立的前端应用有机结合成一个整体的系统。特别适用于多团队、多技术栈的大型项目。

项目由主应用和多个子应用共同组成，每个微应用都是一个独立的项目，可以独立开发、独立部署、独立访问，并可作为一个有机整体呈现。

下图展示了一个由主应用`mainApp`和子应用`subApp`组成的系统，图中的左侧菜单栏和上部导航栏是主应用提供的，红框标记的内容是子应用提供的，效果看起来像是主应用将子应用的一部分内容内嵌了进去。

![](/assets/img/main_sub.png)

## 项目特色
微前端架构能够解决多个应用的有机组合问题，微前端的特点本项目均具备：

- **技术栈无关**: 主框架不限制接入应用的技术栈，微应用具备完全自主权。
- **独立开发、独立部署**: 微应用仓库独立，可独立开发，部署完成后主框架自动完成同步更新。
- **样式隔离**: 能够确保微应用之间样式互相不干扰。
- **JS 沙箱**: 确保微应用之间 全局变量/事件 不冲突。

## 目录结构
项目包含了一个主应用`mainApp`和一个子应用`subApp`的代码示例，每个应用都可以是独立的代码仓，由不同的团队独立开发、独立部署。
项目目录结构如下：(主应用比子应用多一个微前端配置文件`microApp.ts`)

```
├── moyu-micro-admin
│   │── mainApp
│   │   ├── public          # 静态资源
│   │   ├── src
│   │   │   ├── api         # API 请求相关
│   │   │   ├── layout      # 布局文件
│   │   │   ├── router      # 路由
│   │   │   └── ...
│   │   │   ├── views       # 页面视图文件
│   │   │   ├── App.vue     # vue应用入口组件
│   │   │   ├── main.ts     # 入口 TS 文件
│   │   │   └── microApp.ts # 主应用的微前端配置文件
│   │   ├── index.html      # 入口 HTML 文件
│   │   ├── package.json    # 项目配置文件
│   │   ├── vite.config.js  # Vite 配置文件
│   │   └── ...
│   │
│   │── subApp
│   │   ├── public          # 静态资源
│   │   ├── src
│   │   │   ├── api         # API 请求相关
│   │   │   ├── layout      # 布局文件
│   │   │   ├── router      # 路由
│   │   │   └── ...
│   │   │   ├── views       # 页面视图文件
│   │   │   ├── App.vue     # vue应用入口组件
│   │   │   └── main.ts     # 入口 TS 文件
│   │   ├── index.html      # 入口 HTML 文件
│   │   ├── package.json    # 项目配置文件
│   │   ├── vite.config.js  # Vite 配置文件
│   │   └── ...
├── README.md               # 说明文档
└── ...

```

## 运行项目

### 拉取代码

```shell
git clone https://github.com/moyusisi/moyu-micro-admin.git
cd moyu-micro-admin
```

### 启动主应用

```shell
# 进入主应用目录
cd mainApp
# 安装依赖
npm install
# 启动项目
npm run dev
```

### 启动子应用

```shell
# 进入子应用目录
cd subApp
# 安装依赖
npm install
# 启动项目
npm run dev
```

### 后端数据
因为接口调用依赖于后端数据，可以使用mock数据进行模拟，或者使用真实数据进行测试。
  
* 若要使用mock数据，需将配置文件中`VITE_API_BASEURL`设置为`""`或`"/"`，不可配置域名，否则会直接请求后端，不经过本地mock服务


### 菜单路由配置
若有相应的后端服务，通过系统管理添加子应用菜单的步骤如下：

1. 在`资源管理->菜单管理`中，选择一个目录(如`系统运维`)，在其下增加一个菜单名为`子应用菜单`菜单，路由地址为`/subApp1/ops/sys/log`，注意`/subApp1`为子应用的激活路径，`/ops/sys/log`为子应用独立运行模式时的访问路径。
2. 在`权限控制->角色管理`中，给对应的角色分配菜单`子应用菜单`的权限。
3. 重新登录即可看到新增的菜单

若要直接使用mock数据添加子应用菜单，可在`/api/sys/userCenter/userMenu`接口返回数据中，"系统运维"目录下增加菜单配置，然后重新登录即可。

```ts title="mock/system/userCenterApi.js"
  // 在系统运维目录下增加子应用菜单
  "children": [
    ...
      {
        "code": "6921c13293123a2d0d7131f0",
        "parentCode": "biz_module",
        "weight": 99,
        "name": "子应用菜单",
        "path": "/subApp1/ops/sys/log",
        "component": "log",
        "meta": {
          "title": "子应用菜单",
          "type": "menu"
        }
      },
  ],
```

### 效果展示
主应用运行在`http://localhost:81`，子应用运行在`http://localhost:82`(需要与主应用中注册时配置的入口一致)。
子应用独立访问之外，通过主应用点击`子应用菜单`访问子应用页面(`http://localhost:81/subApp1/ops/sys/log`)效果如下：

![](/assets/img/main_sub.png)
