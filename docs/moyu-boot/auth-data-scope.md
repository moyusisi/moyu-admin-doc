---
title: 数据权限
---
# 数据权限
数据权限是一种行级安全控制机制，用于限制用户只能访问其权限范围内的数据行。  
与`功能权限`（控制用户能执行哪些操作）不同，数据权限控制用户能看到哪些数据，如只能看`自己/本部门/本部门及以下`的数据，防止数据越权。

权限模型中介绍的权限标识`perm`仅控制**接口鉴权**，即是否有访问接口的权限，针对需要控制接口数据范围的接口(`hasScope`)，可以控制数据权限。

## 数据范围
数据权限控制用户能看到哪些数据，当用户拥有某个接口访问权限的前提下，对数据的范围进行的限制，与接口的返回数据直接相关，本系统中可以设置每个接口的数据范围，数据范围说明如下：

| 值  | 数据范围       | 说明                                                      |
| --- | -------------- | --------------------------------------------------------- |
| 0   | `不限制`       | 即全部数据，可访问系统所有数据                            |
| 1   | `本人数据`     | 仅可访问本人创建的数据                                    |
| 2   | `本机构数据`   | 仅可以访问本节点 (公司/部门) 的数据，不包括下级节点的数据 |
| 3   | `本机构及以下` | 可以访问本节点 (公司/部门) 及其下级节点的所有数据         |
| 4   | `本公司及以下` | 可访问本节点所属公司节点下的所有数据                      |
| 5   | `自定义`       | 可访问指定节点的数据（需节点列表，查询效率较低）          |

* `本公司及以下`与`本机构及以下`类似，当节点为公司时两者相同；当节点为部门时，会通过组织树向上找到公司节点作为本节点并遍历所有下级节点，常用于许多子公司的集团型公司。

## 数据权限设计
通常其他系统的数据权限直接通过角色进行控制，即用户对于不同接口的数据范围是一样的，这导致了实际使用时非常不灵活。  
本系统的数据权限是针对**接口**进行控制的，同一个角色中也支持**不同接口设置不同的数据范围**。

对于需要控制数据范围的接口，需在接口管理中配置此接口，并且设置为有数据范围`hasScope`。在为角色授权数据范围时，可以为每个有访问权限的接口设置数据范围。

## 数据权限存储
角色拥有的数据权限通过关联关系表(`sys_relation`)存储，关系类型为`role_has_perm`，在关系表中存储角色拥有的数据权限时，存储格式为：`角色 - 接口权限标识 - 数据范围`，数据范围通过`ext_json`表示，其内容说明如下：

```java title="角色权限关系的数据范围"
// 表sys_relation中的ext_json字段对应结构，表示数据范围信息
public static class ScopeExt {
    /**
     * 数据权限(字典 0无限制 1仅本人数据 2仅本机构 3本机构及以下 4本公司及以下 5自定义)
     */
    private Integer dataScope;
    /**
     * 自定义scope集合
     */
    private List<String> scopeList;
}
```

## 数据权限合并
当用户拥有多个角色时，采用并集（OR）策略合并数据权限。

### 合并规则
1. 不同接口采用并集策略合并数据权限。
2. 相同接口采用并集策略合并数据范围。

### 数据范围合并
多角色拥有相同接口但设置了不同数据范围时，数据范围会进行合并，按如下优先级进行： `1仅本人数据 < 2仅本机构 < 3本机构及以下 < 4本公司及以下 < 5自定义 < 0无限制`

具体说明如下：
1. 有无限制则最终为无限制
2. 有自定义则最终为自定义，只是需要两项范围列表合并
3. 其他按照优先级返回大的

代码实现参考项目中的方法：`SysRoleServiceImpl#mergeDataScope`

## 数据权限获取
用户登陆时会查询用户所有的数据权限，并经过合并后存入用户信息缓存。
当用户访问某接口时，通过登陆鉴权之后，系统会根据**当前访问的接口**获取该用户针对当前接口的数据范围，并放入当前用户对象`LoginUser`。

如需获取户针对当前接口数据范围，可通过用户工具`LoginUserUtils`获取相关数据:
```java
    // 用户信息
    String username = LoginUserUtils.getUsername();
    String orgCode = LoginUserUtils.getOrgCode();
    // 数据范围
    Integer dataScope = LoginUserUtils.getDataScope();
    Set<String> scopeSet = LoginUserUtils.getScopes();
```

需要注意的是，用户所有的数据权限是存放在用户信息缓存中的，用户登陆有效期内都会存在。用户针对当前接口的数据范围，是在当前用户对象`LoginUser`中，**只在本次请求范围内生效**。

## 数据范围控制
不同的数据范围通过不同的数据字段控制，无论哪种数据范围，本质上都是通过SQL的条件过滤语句进行控制的。

 | 数据范围       | 处理逻辑                                      |
 | -------------- | --------------------------------------------- |
 | `不限制`       | 无过滤条件                                    |
 | `本人数据`     | `WHERE`条件中拼接`create_by = #{username}`    |
 | `本机构数据`   | `WHERE`条件中拼接`orgCode = #{orgCode}`       |
 | `本机构及以下` | `WHERE`条件中拼接`orgCode = in (#{scopeSet})` |
 | `本公司及以下` | `WHERE`条件中拼接`orgCode = in (#{scopeSet})` |
 | `自定义`       | `WHERE`条件中拼接`orgCode = in (#{scopeSet})` |

## 使用指南

### 方式一：数据范围工具
本系统使用`MyBatis-Flex`框架，在`authZ`模块提供了一个适用于此框架的数据范围处理工具`DataScopeHelper`，只需在业务查询条件处理之后，对`queryWrapper`进行处理即可：

```java
// 控制数据范围，需要将表中进行用户控制和部门控制的字段传入即可
DataScopeHelper.dataScopeFilter(queryWrapper, SysUser::getCreateBy, SysUser::getOrgCode);
```

### 方式二：编码控制
也可自行编码进行控制，示例如下：

```java
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserService {
    
    public PageData<SysUserVO> pageList(SysUserParam param) {
        // 查询条件
        QueryWrapper queryWrapper = QueryWrapper.create();
        // 指定userId查询
        queryWrapper.eq(SysUser::getUserId, param.getUserId(), ObjectUtil.isNotEmpty(param.getUserId()));
        // 指定name查询
        queryWrapper.like(SysUser::getName, param.getName(), ObjectUtil.isNotEmpty(param.getName()));

        // 获取数据范围，根据不同范围设置不同的筛选条件
        if (!LoginUserUtils.isRoot()) {
            // 数据范围
            Integer dataScope = LoginUserUtils.getDataScope();
            Set<String> scopeSet = LoginUserUtils.getScopes();

            if (DataScopeEnum.SELF.getCode().equals(dataScope)) {
                String username = LoginUserUtils.getUsername();
                queryWrapper.eq(userColumn, username);
            } else if (DataScopeEnum.ORG.getCode().equals(dataScope)) {
                String orgCode = LoginUserUtils.getOrgCode();
                queryWrapper.eq(orgColumn, orgCode);
            } else if (DataScopeEnum.ORG_CHILD.getCode().equals(dataScope)) {
                // 通过 scopeSet 处理
                queryWrapper.in(orgColumn, scopeSet, ObjectUtil.isNotEmpty(scopeSet));
            } else if (DataScopeEnum.COMPANY.getCode().equals(dataScope)) {
                // 通过 scopeSet 处理
                queryWrapper.in(orgColumn, scopeSet, ObjectUtil.isNotEmpty(scopeSet));
            } else if (DataScopeEnum.ORG_DEFINE.getCode().equals(dataScope)) {
                // 通过 scopeSet 处理
                queryWrapper.in(orgColumn, scopeSet, ObjectUtil.isNotEmpty(scopeSet));
            }
        }
        // 分页查询
        Page<SysUserVO> page = Page.of(param.getPageNum(), param.getPageSize());
        Page<SysUserVO> voPage = this.pageAs(page, queryWrapper, SysUserVO.class);
        return new PageData<>(voPage.getTotalRow(), voPage.getRecords());
    }
}
```

## 最佳实践

 | 场景           | 建议方案                                                              |
 | -------------- | --------------------------------------------------------------------- |
 | `业务表单据表` | 表结构中要有用于控制数据范围的字段，如 `org_code` 和 `create_by` 字段 |
 | `性能考量`     | 不要开放`自定义`数据范围的选择                                        |


## 相关文件

| 文件                      | 说明                                             |
| ------------------------- | ------------------------------------------------ |
| `SysRoleServiceImpl.java` | `mergeDataScope`方法合并数据范围                 |
| `SaTokenConfigure.java`   | 获取当前请求的接口，设置数据范围，存入请求作用域 |
| `LoginUserUtils.java`     | 从当前请求作用域获取登录用户信息                 |
| `DataScopeHelper.java`    | 数据范围拼接处理工具                             |
