---
title: "DOCKERFILE构建最佳实践"
date: 2020-07-15T16:36:58+08:00
categories: ["Container"]
hero: docker-bp.webp
tags: ["docker"]
menu:
  sidebar:
    name: "DOCKERFILE构建最佳实践"
    identifier: dockerfile-best 
    parent: container-tech
    weight: 10
---

在进行应用容器化的实践中，我们可以使用多种方式来创建容器镜像，而使用[Dockerfile](https://docs.docker.com/engine/reference/builder/)是我们最常用的方式。
而且在实现CI/CD Pipeline的过程中，使用Dockerfile来构建应用容器也是必须的。  

本文不具体介绍Dockerfile的指令和写法，仅仅是在实践中积累的一些写好一个Dockerfile的小提示，体现在一下几个方面：  

- 减少构建时间
- 减小镜像大小
- 镜像可维护性
- 重复构建一致性
- 安全性

<!-- more -->

## 减小构建时间

首先来看看下面这个Dockerfile  

```Dockerfile
FROM ubuntu:18.04
COPY . /app
RUN apt-get update
RUN apt-get -y install ssh vim openjdk-8-jdk
CMD [“java”,”-jar”,”/app/target/app.jar”]
```

要减小构建的时间，那我们可以例如Docker构建的缓存特性，尽量保留不经常改变的层，而在Dockerfile的指令中， `COPY`和`RUN`都会产生新的层，而且缓存的有效是与命令的顺序有关系的。  
在上面的Dockerfile中，`COPY . /app`在`RUN apt-get ...`之前，而COPY是经常改变的部分，所以每次构建都会到导致`RUN apt-get ...`缓存失效。  

**Tip-1** : 合理利用缓存，而执行命令的顺序是会影响缓存的可用性的。  

要减小构建时间，另一方面是应该仅仅COPY需要的东西，对于上面这个Dockerfile的目的，应该仅仅需要COPY Java应用的jar文件。  

**Tip-2** : 构建过程中仅仅COPY需要的东西。  

上面的Dockerfile对apt-get命令分别使用了两个RUN指令，会生成两个不同的层。  

**Tip-3** : 尽量合并最终镜像的层数。  

还有对于这个示例，我们最终是想要一个JRE环境来运行Java应用，因此可以选择一个jre的镜像来作为基础镜像，这样不用花时间再去安装jdk。  

**Tip-4** : 选择合适的基础镜像  

这样我们可以把Dockerfile写成：  

```Dockerfile
FROM ubuntu:18.04
RUN apt-get update \
    && apt-get y install ssh vim openjdk-8-jdk
COPY target/app.jar /app
CMD [“java”,”-jar”,”/app/app.jar”]
```

## 减小镜像大小

进一步，我们如何尽量减小最终应用镜像的大小，来加速我们的CI构建，以及减小镜像在网络上传输的效率。  
在上例中，`ssh, vim`应该都是不必要的软件包，它们会咱用镜像的空间。  

**Tip-5** : 移除不必要的软件包安装（包括一些debug工具）。  

其次，类似apt-get之类的系统包管理工具会产生缓存数据，我们也应该清除。  

**Tip-6** : 在使用系统包管理工具安装软件包后清理缓存数据。  

另外我们应该使用Docker提供的多阶段构建特性来减小最终的镜像大小，我们在后面介绍。  

我们进一步改进Dockerfile：  

```Dockerfile
FROM ubuntu:18.04
RUN apt-get update \
  && apt-get y install –no-install-recommends openjdk-8-jdk \
  && rm -rf /var/lib/apt/lists/*
COPY target/app.jar /app
CMD [“java”,”-jar”,”/app/app.jar”]
```

## 镜像的可维护性

我们看看上面的Dockerfile，使用了一个`ubuntu`的镜像来安装jdk包，而在安装jdk包的不同时间点，可能会导致不同的版本，这样就导致了镜像的不易维护。  

**Tip-7** : 尽可能使用应用（语言）运行时的官方基础镜像，并指定Tag版本  

一般来说，官方会维护一些变种镜像来提供多样性，例如基于 alpine的，还有 -slim 精简版本的，其次对于像Java应用，最终我们需要的应该只是JRE，因此应该选择jre的镜像，这样既保证了可维护性，同时也可以减小镜像的大小。  

```Dockerfile
FROM openjdk:8-jre-alpine
COPY target/app.jar /app
CMD [“java”,”-jar”,”/app/app.jar”]
```

## 重复构建一致性

我们应该保障我们的镜像构建在任何时候，以及任何构建服务器上是一致的，但是我们看上面的Dockerfile，是将jar文件COPY到容器中，但是这个jar文件是在什么环境构建的呢？  

**Tip-8** : 在一致的环境中从源代码构建

同样，Docker的多阶段构建提供了最好的解决方案，将源码编译构建放到构建阶段，将最终生成的软件包COPY放到运行是阶段。  

**Tip-9** : 使用多阶段构建

```Dockerfile
FROM maven:3.6-jdk-11 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn -e -B dependency:resolve
COPY src ./src
RUN mvn -e -B package

FROM openjdk:11-jre-slim
COPY –from=builder /app/target/app.jar /
CMD [“java”,”-jar”,”/app.jar”]
```

例如上面的Dockerfile，我们使用了`maven`的镜像来构建代码，使用`openjdk:jre`的镜像来运行。  

## 安全性

最后我们来看看安全性，如何使我们的应用容器更加安全。首先，容器里包含的软件包越少，那可能的漏洞就会越少，所以这也是 **Tip-5** 所强调的。

**Tip-10** : 使用非root用户运行容器应用进程

其次，我们应该使用非root用户来运行我们的应用，默认情况下容器都是使用root用户来执行，我们可以使用以下两种方法来使用非root用户来运行。  

1. 使用`USER`指令，记得在使用`USER`指令前创建相应的用户
2. 在`CMD`或者`ENTRYPOINT`中使用`su-exec` , `gosu`等工具来启动应用  

我推荐使用第二种方法，因为第一种方式，在启动容器后进入容器会默认使用非root用户，这样不便于安装某些调试工具来执行调试（当然也可以通过配置sudo）。  
而第二种方式需要安装`su-exec`等工具，我建议自己基于官方的基础镜像维护一些自己的运行时基础镜像，这样避免在每次构建应用镜像的时候都进行一次安装。  

```Dockerfile
FROM gradle:6.4-jdk11 as builder
WORKDIR /code
COPY . .
RUN gradle assemble

FROM mengzyou/openjdk:11-jre-alpine
ENV APP_HOME="/opt/app" \
APP_USER="appuser" \
JAR_OPTS="--spring.profiles.active=prod"
RUN addgroup ${APP_USER} && \
  adduser -D -h ${APP_HOME} -S -G ${APP_USER} ${APP_USER}
COPY --from=builder --chown=${APP_USER}:${APP_USER} /code/build/libs/*.jar ${APP_HOME}/app.jar
EXPOSE 8080/tcp
WORKDIR ${APP_HOME}
CMD su-exec app java ${JAVA_OPTS} -jar ${APP_HOME}/app.jar ${JAR_OPTS}
# CMD [“su-exec”,”appuser”,”sh -c”,”java -jar /opt/app/app.jar"]
```

在来一个golang的示例  

```Dockerfile
FROM golang:1.14-alpine AS builder
RUN apk add --no-cache git && \
    mkdir -p $GOPATH/src/app \
WORKDIR $GOPATH/src/app
COPY . $GOPATH/src/app
RUN go mod tidy \
    && go build -o /go/bin/app

FROM mengzyou/alpine:3.12
ENV APP_HOME=/opt/app \
    APP_USER=appuser
RUN addgroup ${APP_USER} && \
  adduser -D -h ${APP_HOME} -S -G ${APP_USER} ${APP_USER}
COPY --from=builder --chown=${APP_USER}:${APP_USER} /go/bin/app ${APP_HOME}/
EXPOSE 8080/tcp
WORKDIR ${APP_HOME}
CMD su-exec ${APP_USER} ${APP_HOME}/app
```

## 总结

这里仅仅是在Dockerfile实践中的一些提示，要写好Dockerfile，还有很多方面需要注意的地方，可参考Docker官方的[Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)。  
