---
title: 项目介绍
order: 0
---

<div align="center">
    <h3>moyu-boot</h3>
    <p>基于SpringBoot、SpringSecurity、MybatisPlus的后台管理系统</p>
</div>

## 项目简介

`moyu-boot`基于`JDK 8`、`Spring Boot 2.7`、`Spring Security 6`、`Mybatis-Plus`构建的前后端分离的后台管理系统。本项目为后端框架，可结合前端框架`moyu-antdv-admin`搭配使用。

## 项目特色

- **开发框架**: 使用 `Spring Boot 2.7`、`Spring Security 6`、`Mybatis-Plus` 等主流技术栈。

- **认证鉴权**: 提供`无状态(通过JWT实现)`和`有状态(通过Redis实现)`两种形式的认证；同时支持`Spring Security`和`SaToken`两种框架鉴权，两种注解任选，方便使用。

- **权限管理**: 基于 RBAC 模型，实现细粒度的权限控制，涵盖接口方法和按钮级别。精准控制功能权限和数据权限。

- **功能模块**: 包括组织机构、用户管理、岗位管理、角色管理、菜单管理、接口管理等多个功能。
 
- **独创功能**: 提供兼职岗位功能，不同岗位对应不同的权限，允许用户进行岗位切换。


## 项目地址

在线演示：[https://vue.moyu.com](https://vue.moyu.com)


## 项目截图
![](/assets/img/screenshot.png)
