---
title: 后端手册
dir:
  collapsible: true
  expanded: true
  link: true
  order: 3
---

## 简介

* 系统基于`JDK 8`构建
* 系统框架使用[`Spring Boot 2.7`](https://spring.io/projects/spring-boot)+[`Mybatis-Plus 3`](https://baomidou.com)
* 系统同时集成了[`Spring Security`](https://spring.io/projects/spring-security)和[`SaToken`](https://sa-token.cc)。
* 部分插件依赖redis实现

## 响应码
本系统的响应码严格按照`阿里巴巴《Java 开发手册》嵩山版`中的**错误码列表**设计。

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
