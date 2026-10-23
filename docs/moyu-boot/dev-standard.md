---
title: 开发规范
---
# 开发规范

::: tip
本项目遵循的一些开发约定
:::
## 接口格式约定

通过`Result`、`PageData`、`PageParam`定义了接口进行数据交互的基本格式

### 响应结果格式
```js
{
    "code": "00000",
    "message": "成功",
    "data": null
}
```

### 分页请求格式
```js
{
    "pageNum": 1,
    "pageSize": 10
}
```

### 分页结果格式
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

## 响应码规范
本系统的响应码参考[阿里巴巴《Java 开发手册》嵩山版](https://developer.aliyun.com/topic/java20)中的**错误码列表**设计，由5位的字符串组成。


### 错误码分类

| 划分    | 说明                 |
| ------- | -------------------- |
| `00000` | 成功                 |
| `A****` | 用户端错误           |
| `B****` | 系统错误             |
| `C****` | 调用第三方服务       |
| `D****` | 自定义提示错误(扩展) |



### 常用错误码

| 划分    | 说明               | 场景               |
| ------- | ------------------ | ------------------ |
| `00000` | 成功               | 正常执行           |
| `A0001` | 用户端错误         | 一级宏观           |
| `A0200` | 用户登录异常       | 登录失败           |
| `A0230` | Token无效或过期    | 认证失败           |
| `A0301` | 访问未授权         | 权限不足、鉴权失败 |
| `A0400` | 请求参数错误       | 参数校验失败       |
| `B0001` | 系统执行出错       | 一级宏观           |
| `C0001` | 调用第三方服务出错 | 一级宏观           |

系统中通过`ResultCodeEnum`定义了一些常用的错误码，若需扩展错误码，可通过实现`ResultCode`接口进行扩展

## 参数校验规范

### Bean Validation 简介
`Bean Validation`是一套基于注解的数据校验规范，如`JSR303、JSR349、JSR380`等，支持`@Null、@NotNull、@Pattern`等，它们位于`javax.validation.constraints`这个包下。

`Hibernate Validator`是对这个规范的实现，并增加了一些其他校验注解，如 `@NotBlank、@NotEmpty、@Length`等，它们位于`org.hibernate.validator.constraints`这个包下。

Spring Boot提供了`spring-boot-starter-validation`模块，已经集成了`Hibernate Validator`，并且Spring验证框架对参数的验证机制提供了`@Validated`注解，对`@Valid`进行了二次封装，支持分组等功能。
更多使用详情可参考[这里](https://developer.aliyun.com/article/1670620)

### 如何使用
使用时直接在需要校验的参数上添加`@Validated`注解即可，如下所示。

```java
    // 使用普通断言校验
    @PostMapping("/delete")
    public Result<?> delete(@RequestBody SysUserParam param) {
        Assert.notEmpty(param.getIds(), "删除列表ids不能为空");
        sysUserService.deleteByIds(param);
        return Result.success();
    }
    // 使用@Validated注解校验
    @PostMapping("/add")
    public Result<?> add(@Validated @RequestBody SysUserParam param) {
        sysUserService.add(param);
        return Result.success();
    }
    @Data
    public class SysUserParam {
        @NotBlank(message = "用户姓名name不能为空")
        private String name;

        @NotNull(message = "性别gender不能为空")
        @Min(value = 0, message = "性别(字典 0未知 1男 2女)")
        @Max(value = 1, message = "性别(字典 0未知 1男 2女)")
        private Integer gender;

        @Email(message = "邮箱格式不正确")
        private String email;
        ...
    }
```

### 快速失败
默认情况下，参数校验会把所有规则都检查一遍，若要发现错误立刻失败返回(快速失败模式)，可通过`ValidatorConfig`进行配置：

```java
@Configuration
public class ValidatorConfig {

    @Bean
    public Validator validator() {
        ValidatorFactory validatorFactory = Validation.byProvider(HibernateValidator.class).configure()
                // 快速失败模式
                .failFast(true)
                .buildValidatorFactory();
        return validatorFactory.getValidator();
    }
}
```

## 权限标识规范

### 命名格式

```
模块:资源:操作
```

### 常用操作说明

| 操作     | 标识              | 说明       |
| -------- | ----------------- | ---------- |
| 全部列表 | `list`            | 列表查询   |
| 分页查询 | `page`            | 分页查询   |
| 查看详情 | `detail`          | 单个查询   |
| 新增     | `add` / `create`  | 新增资源   |
| 修改     | `edit` / `update` | 编辑、修改 |
| 删除     | `delete`          | 删除资源   |
| 导入     | `import`          | 批量导入   |
| 导出     | `export`          | 数据导出   |


## 包结构

```
com.moyu.boot
├── auth/                    # 认证模块(authN)
├── common/                  # 公共组件包（注解、切面、基类、枚举、异常、结果封装）
│   ├── authZ/               # 鉴权组件（认证过滤器、登陆用户信息对象、令牌处理）
│   ├── core/                # 核心组件（基本对象、通用异常类、错误码、日志）
│   ├── mybatis/             # 数据访问组件（MybatisFlex实现，数据填充、数据权限处理）
│   ├── web/                 # web组件（全局异常处理器、链路追踪过滤器等）
├── plugin/                  # 插件包，用于完善系统功能的可选组件
│   ├── authSession/         # 会话管理
│   ├── codeGen/             # 代码生产
│   ├── pbe/                 # Jasypt加解密工具
│   ├── seq/                 # 序列号工具
│   ├── thirdPartyApi/       # 三方接口集成工具(在线调用接口)
│   ├── thirdPartyApp/       # 三方应用管理
└── system/                  # 系统管理模块
│   ├── aop/                 # 切面
│   ├── config/              # 配置
│   ├── constant/            # 常量
│   ├── controller/          # 控制层
│   ├── enums/               # 枚举
│   ├── interceptor/         # 拦截器
│   ├── mapper/              # 数据访问层
│   └── model/               # 数据模型
│   │   ├── entity/          # 实体类
│   │   ├── param/           # 请求对象
│   │   ├── vo/              # 视图对象
│   ├── service/             # 业务层
│   │   └── impl/            # 业务实现
│   ├── util/                # 工具
└── you-module/              # 你自己的业务模块
```

## 类命名

| 类型         | 规则                        | 示例                          |
| ------------ | --------------------------- | ----------------------------- |
| 控制器       | `XxxController`             | `SysUserController`           |
| 业务接口     | `XxxService`                | `SysUserService`              |
| 业务实现     | `XxxServiceImpl`            | `SysUserServiceImpl`          |
| 数据访问     | `XxxMapper`                 | `SysUserMapper`               |
| 实体类       | `Xxx`                       | `SysUser`                     |
| 参数对象     | `XxxParam`                  | `SysUserParam`                |
| 视图对象     | `XxxVO`                     | `SysUserVO`                   |
| 数据传输对象 | `XxxDTO`                    | `UserDTO`                     |
| 配置类       | `XxxConfig`/`XxxProperties` | `AuthConfig`/`AuthProperties` |
| 枚举类       | `XxxEnum`                   | `DataScopeEnum`               |
| 常量类       | `XxxConstants`              | `SystemConstants`             |

## 基础实体对象
* 基础的数据库实体对象`BaseEntity`包括`createTime`/`createBy`/`updateTime`/`updateBy`等公共字段。
* `BaseEntity`中不包括`id`字段，定义实体对象时可自行定义。