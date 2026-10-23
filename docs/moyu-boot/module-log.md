---
title: 日志管理
---
# 日志管理

::: tip
本系统的日志进行了分层设计，提供了两个与日志记录相关的功能，分为`文件日志`和`持久化日志`。
:::

## 文件日志
文件日志是指输入到日志系统的日志，通过日志门面`Slf4j`统一进行管理输出。  
本系统在`common`模块提供了`@Log`注解，可以把请求参数等打印到文件或控制台。

### 使用方式

在类或方法上添加`@Log`注解即可。若类与方法同时出现，则方法上的注解将覆盖类上的注解

```java
@Log(jsonLog = true)
@RestController
@RequestMapping("/api/sys/org")
public class SysOrgController {

    @Log(jsonLog = true, response = false)
    @PostMapping("/page")
    public Result<PageData<SysOrg>> pageList(@RequestBody SysOrgParam orgParam) {
        ...
    }
}
```

### 注解参数说明

| 参数          | 类型    | 默认值  | 描述                         |
| ------------- | ------- | ------- | ---------------------------- |
| request       | boolean | `true`  | 是否打印请求参数             |
| response      | boolean | `true`  | 是否打印响应结果             |
| runTime       | boolean | `true`  | 是否打印运行时间             |
| jsonLog       | boolean | `false` | 打印日志是否为 json 格式     |
| exceptionOnly | boolean | `false` | 是否只有抛异常时打印请求日志 |

## 持久化日志
持久日志是指以结构化形式存储在数据库中的日志记录。  
通常`访问日志/操作日志`等需要满足审计需求的业务场景的日志需要持久化存储。  
本系统在`system`模块中提供了用于存储持久化日志的表`sys_log`及对应的服务类(Service)，并且提供了`@SysLog`注解方便记录持久化日志。


### 使用方式

在方法上添加`@SysLog`注解即可。

```java
    @SysLog(module = "auth", logType = 2, value = "用户登录")
    @PostMapping("/login")
    public Result<String> userLogin(@Validated UserLoginParam loginParam) {
        ...
    }
```

### 日志属性说明
全部的日志属性可参考`sys_log`表结构定义。  
使用`@SysLog`注解记录持久日志时，会自动填充，其默认参数，如下表。

| 参数     | 类型    | 默认值  | 描述                                               |
| -------- | ------- | ------- | -------------------------------------------------- |
| value    | String  | `""`    | 日志名称，对应日志的name                           |
| logType  | int     | `0`     | 日志类型(字典 0默认 1访问日志 2操作日志 3交互日志) |
| module   | String  | `""`    | 一级分类，如系统/模块                              |
| business | String  | `""`    | 二级分类，如业务，默认会赋值**短类名**             |
| operate  | String  | `""`    | 三级分类，如操作，默认会赋值**方法名**             |
| content  | String  | `""`    | 自定义内容                                         |
| request  | boolean | `true`  | 是否记录请求参数                                   |
| response | boolean | `false` | 是否记录响应结果                                   |


## MDC 链路追踪
本系统在`common`模块的`web`组件中添加了MDC链路追踪过滤器，每个请求在进入系统时生成唯一 TraceId，贯穿整个调用链。


### 使用方式

在日志配置文件中，日志格式中添加`%X{traceId}`即可，如下：。

```xml
<pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%X{traceId}] %-5level [%t] %-40.40logger{39} : %m%n</pattern>
```

输出效果：
```
2026-09-28 17:56:59.384 [6aba39eb60b23d06d9f6d532] INFO  [qtp454305524-14] c.m.b.s.controller.SysLogController      : SysLogController.pageList(..)运行时间为:76ms
```