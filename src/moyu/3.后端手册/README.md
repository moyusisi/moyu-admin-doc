---
title: 后端手册
dir:
  collapsible: true
  expanded: true
  link: true
  order: 3
---

## 简介
`moyu-boot` 是 `moyu-antdv-admin` 的 Java 后端实现，基于 Spring Boot 2.7 开发框架，采用 RBAC 权限模型，集成 Redis / MyBatis-Plus 的企业级前后端分离管理系统。

## 技术栈

| 分类     | 技术选型           | 说明                 |
| -------- | ------------------ | -------------------- |
| 运行时   | JDK 8              | 推荐使用 LTS 版本    |
| 构建工具 | maven / mvnw       | pom.xml              |
| 开发框架 | Spring Boot 2.7.18 |                      |
| 权限认证 | Sa-Token           |                      |
| 数据访问 | MyBatis-Plus       | 版本以 pom.xml 为准  |
| 数据库   | MySQL 5.7 ~ 8.x    | 后续会支持其他数据库 |
| 缓存     | Redis 7.x          |                      |

## 必需服务
* MySQL
* Redis

## 响应码
本系统的响应码严格按照[阿里巴巴《Java 开发手册》嵩山版](https://developer.aliyun.com/topic/java20)中的**错误码列表**设计。

> 00000 成功
> A**** 用户端错误
> B**** 系统执行出错
> C**** 调用第三方服务出错
> D**** 自定义提示异常(扩展)

系统中通过`ResultCodeEnum`定义了**错误码列表**中一些常用的错误码，若需扩展错误码，可通过实现`ResultCode`接口进行扩展

## 基本对象

通过`Result`、`PageData`、`PageParam`定义了数据交互的基本相应格式

::: code-tabs

@tab 基本响应
```js
{
    "code": "00000",
    "message": "成功",
    "data": null
}
```

@tab 分页响应
```js
{
    "code": "00000",
    "message": "成功",
    "data": {
        "total": 20,
        "records": []
    },
}
```

@tab 分页请求
```js
{
    "pageNum": 1,
    "pageSize": 10
}
```
:::
