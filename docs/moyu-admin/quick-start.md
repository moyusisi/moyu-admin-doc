---
title: 快速开始
---
# 快速开始

本文档介绍如何快速从本地运行`moyu-adntdv-admin`项目。

## 环境要求

| 环境 | 版本要求    | 说明          |
| ---- | ----------- | ------------- |
| node | `>=22.18.0` | 推荐 LTS 版本 |
| npm  | `>=10.9.3`  | 包管理工具    |
### 安装Node
> `Node.js` 是一个基于`Chrome V8 引擎`的 `JavaScript` 运行时环境，包含默认的包管理器 `npm`。
> 不同版本的 `Node` 都有配套的 `npm` 版本。

打开 [`Node.js` 官方页面](https://nodejs.org/zh-cn/download)，根据你的操作系统选择合适的版本进行下载安装，推荐 `LTS` 版本，这是长期支持版本，适合开发环境，比如选择 `v22.18.0(LTS)` 版本。

下载安装之后，通过以下命令检查是否成功安装：

```shell
# 验证 Node.js 版本:
node -v # Should print "v22.18.0".
# 验证 npm 版本:
npm -v # Should print "10.9.3".
```

使用npm包管理工具安装依赖时可设置镜像源来加速

```shell
# 可以通过如下操作解决 npm 依赖下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

```

### 多个Node版本
开发中可能经常使用不同版本的`node`，可以通过`n`模块来管理`node`版本

首先使用默认的包管理工具`npm`安装`n`模块

```shell
# 全局安装n模块
npm instlal -g n

## 常用的n命令
# 查看已安装的node版本 (可上下选择进行版本切换，最好带上sudo)
n
# 安装指定版本的node (若已安装则表示切换)
sudo n v22.18.0
# 安装当前稳定版本
sudo n stable
# 安装最新版本的
sudo n latest
# 卸载指定的node版本
n rm v16.16.0
```
虽然 `n`模块是先下载`node`然后通过`npm`安装的，但通过`n`模块管理多个版本的`node`之后可以把最开始下载的那个`node`卸载掉，完全通过`n`模块对`node`进行版本管理。

## 项目结构

```
moyu-boot/
├── mock/                     # mock数据，可用于本地测试
├── public/                   # 静态资源目录(直接copy到dist，一般通过/xxx引用)
│   └── img/                  # 图片资源
├── src/
│   └── api/                  # 后端接口api
│   └── assets/               # 源码静态资源，会被打包处理(一般通过@/assets/xxx引用)
│   └── components/           # 全局公共组件，全项目可复用
│   └── config/               # 全局配置，如接项目标题等
│   └── layout/               # 布局文件，后台管理系统框架（侧边栏、头部、主内容区）
│   └── locale/               # 国际化目录
│   └── plugin/               # 全局插件，全局注册第三方库（antdv、、vxe-table等）
│   └── router/               # 路由，路由表、路由守卫、动态路由、权限路由
│   └── store/                # 状态存储，pinia全局状态（用户信息、token）
│   └── types/                # ts类型定义目录
│   └── utils/                # 工具类
│   └── views/                # 页面视图目录，业务页面存放位置
│       ├── auth/             # 登陆认证模块
│       └── system/           # 系统模块
│           ├── components/   # 模块内局部组件，仅模块内部使用
│           ├── user/         # 用户业务
│           └── ...
├── App.vue                   # 根组件，所有页面的入口容器，全局挂载点
├── main.ts                   # 项目入口ts文件，创建vue实例、注册插件、挂载全局方法
├── env.prod                  # 环境变量配置
├── index.html                # Vite入口html模板，打包的html模板，引入项目入口
├── package.json              # 项目依赖、脚本命令
├── vite.config.ts            # Vite构建配置，打包配置、插件配置
└── README.md
```

## 获取项目

```sh
git clone https://gitee.com/youlaiorg/vue3-element-admin.git
cd moyu-antdv-admin
```


## 启动项目

```sh
# 克隆项目
git clone https://github.com/moyusisi/moyu-antdv-admin.git

# 进入项目目录
cd moyu-antdv-admin

# 安装依赖
npm install

# 可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev
```


## 编译打包

```sh
# 进入项目目录
cd moyu-antdv-admin

# 编译打包(默认生成dist目录)
npm run buid
```