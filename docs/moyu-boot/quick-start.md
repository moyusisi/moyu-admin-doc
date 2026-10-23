---
title: 快速开始
---
# 快速开始

本文档介绍如何快速从本地运行项目。

## 前置条件

| 环境  | 版本要求 | 下载地址                                                                          |
| ----- | -------- | --------------------------------------------------------------------------------- |
| JDK   | 8+       | [Adoptium](https://adoptium.net/zh-CN/temurin/releases?version=8&os=any&arch=any) |
| Maven | 3.9.11+  | [Maven官网](https://maven.apache.org/download.cgi)                                |
| MySQL | 8.x      |                                                                                   |
| Redis | 7.x      |                                                                                   |

## 项目结构

```
moyu-boot/
├── .mvn/                     # 统一项目 Maven 版本
├── sql/
│   └── youlai-admin.sql      # 初始化脚本
├── src/
│   └── main/
│       ├── java/             # 源代码
│       └── resources/
│           ├── application.yml              # 主配置
│           ├── application-local.yml        # 本地环境配置
│           └── application-prod.yml         # 生产环境配置
├── mvnw                      # Maven wraper linux 命令
├── mvnw.cmd                  # Maven wraper windows 命令
├── pom.xml                   # Maven依赖
└── README.md
```

## 安装步骤

### 数据库初始化
执行数据库脚本：

```sh
# 表结构
mysql -u root -p < sql/moyu_mysql.sql
# 初始化数据
mysql -u root -p < sql/init_data.sql
```

或通过数据库管理工具导入 sql/moyu_mysql.sql等sql脚本。

### 配置修改
修改 `src/main/resources/application-local.yml`：

#### 数据库配置：

```yml
spring:
  # 数据源配置
  datasource:
    url: jdbc:mysql://localhost:3306/moyu?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
    username: your_name
    password: your_password
```

#### Redis配置：

```yml
spring:
    # 业务redis配置
  redis:
    # Redis服务器地址
    host: 127.0.0.1
    # Redis服务器连接端口,默认6379
    port: 6379
    # Redis服务器连接密码（如有密码则填写）
    password: 
```

### 启动服务
#### IDE 方式：

运行启动类：`src/main/java/com/moyu/boot/SystemApplication.java`

#### 命令行方式：


```sh
mvn clean install
mvn spring-boot:run

# 或 在项目目录(moyu-boot)下：
.mvnw spring-boot:run
```