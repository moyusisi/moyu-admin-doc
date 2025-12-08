---
title: 单体版框架
order: 0
---

<center>
    <h3>moyu-admin</h3>
    <p>后端基于moyu-boot，前端基于moyu-antdv-admin，将前后端一起打包部署的单体架构系统</p>
</center>

## 项目简介

`moyu-admin`是将后端[moyu-boot]()和前端[moyu-antdv-admin]()的基础上，通过打包插件将前后端一起打包部署的**前后端一体**系统，即**前后端不分离**的系统，部署简单，适用于快速部署服务的场景。

## 目录结构
项目由后端代码和前端代码组成，编译打包时通过maven插件将前后端代码一起打包成可执行的jar包。

```
├── moyu-admin
│   ├── .mvn            # mvnw 配置
│   ├── sql             # 数据库脚本
│   ├── src             # 后端项目代码
│   ├── web             # 前端项目代码
│   ├── mvnw            # mvnw 执行文件
│   ├── mvnw.cmd        # mvnw 执行文件
│   ├── pom.xml         # maven pom文件
│   └── ...
```

## history模式适配
前后端不分离的项目中，`vue-router`使用`history`模式，刷新页面会404。
为了解决此问题，需要后端配置一个针对`vue-router`中的`history`模式拦截器，url匹配不到任何控制器时，则应该返回`index.html`，这样前端路由就会接管，加载对应的页面。

* 拦截器`Interceptor`

```java
@Component
public class VueHistoryInterceptor implements HandlerInterceptor {

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {
        if (request.getMethod().equals(HttpMethod.GET.name()) && response.getStatus() == HttpStatus.NOT_FOUND.value()) {
            if (null == modelAndView) {
                modelAndView = new ModelAndView();
            }
            // 保证浏览器不报错，如果是404则更改为200
            modelAndView.setStatus(HttpStatus.OK);
            modelAndView.setViewName("index.html");
        }
    }

}
```
* 配置类`WebMvcConfig`

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Resource
    private VueHistoryInterceptor vueHistoryInterceptor;

    /**
     * 添加拦截器
     * addPathPatterns 用于添加拦截规则, excludePathPatterns 排除拦截
     * /**： 匹配所有路径
     * /admin/**：匹配 /admin/ 下的所有路径
     * /secure/*：只匹配 /secure/user，不匹配 /secure/user/info
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 添加用户vue后处理拦截器
        registry.addInterceptor(vueHistoryInterceptor).addPathPatterns("/**")
                .excludePathPatterns("/api/**", "/static/**", "/public/**", "/assets/**");
    }
}
```

## 打包插件
在`pom.xml`中配置了两个插件，用于编译构建前端资源和复制移动的前端资源。后端项目编译构建打包的过程中，会自动执行前端资源的编译构建和复制移动，最终打包到一个可执行jar包中。

```xml
<plugins>
    ...
    <!--该插件主要用途：编译构建前端项目 -->
    <plugin>
        <groupId>com.github.eirslett</groupId>
        <artifactId>frontend-maven-plugin</artifactId>
        ...
    </plugin>
    <!--该插件主要用途：复制打包的前端资源 -->
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-resources-plugin</artifactId>
        ...
    </plugin>
</plugins>
```
