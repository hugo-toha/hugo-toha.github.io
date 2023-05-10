---
title: "最小化静态WEB容器实践"
description: "使用Docker和httpd构建最小化静态web服务器"
date: 2022-11-20T15:24:22+08:00
categories: ["Container"]
hero: docker-bp.webp
tags: ["docker", "web"]
menu:
  sidebar:
    name: "最小化静态WEB容器实践"
    identifier: smallest-web-container
    parent: container-tech
    weight: 10
---

在现代的[B/S架构](https://baike.baidu.com/item/BS%E6%9E%B6%E6%9E%84/1297196)应用中，我们会做前后端分离，某些前端Web服务会将编译完成的静态文件放到一个web服务器进行部署。例如，[我的博客](https://blog.mengz.dev/)也是基于[Hugo](https://gohugo.io)编译的静态文件来进行部署的。  

那在容器化部署模式下，我们需要基于一个web服务的基础容器（镜像）将静态文件构建成站点或者Web服务的容器镜像来进行部署。在[Docker开发最佳实践](https://docs.docker.com/develop/dev-best-practices/)中，我们应该尽量保持镜像足够小（Size大小）。因此，我们应该尽量选择满足我们需求的web服务基础镜像足够小。  

![static-webserver-container](https://images.mengz.dev/posts/static-webserver-container.png)  

大部分情况下，我们会选择[Nginx](https://www.nginx.com/)作为我们的web服务器，一开始我也是这么选择的，因为社区在[Docker Hub](https://hub.docker.com/_/nginx/)上为我们提供了开箱即用的容器镜像，下面来看看我用来构建静态web服务的过程。  

## Nginx On Alpine

我们知道在容器构建的实践中，我们可以选择基于[AlpineLinux](https://www.alpinelinux.org)为分发系统的镜像，其比其他（例如 ubuntu, centos等）的镜像会小很多。因此一开始我们也是选择基于Alpine的nginx镜像，例如 [nginx:1.22-alpine](https://github.com/nginxinc/docker-nginx/blob/fef51235521d1cdf8b05d8cb1378a526d2abf421/mainline/alpine/Dockerfile)。  

```shell
$ docker image pull nginx:1.22-alpine

$ docker image ls | grep nginx
nginx    1.22-alpine    23.5MB
```

可以看到其大小为 **23.5MB** 。  

基于该惊醒构建我的博客的发布镜像  

```Dockerfile
FROM mengzyou/hugo:0.106 AS builder
COPY --chown=hugo:hugo . /home/hugo/app
RUN hugo

FROM nginx:1.22-alpine
COPY --from=builder /home/hugo/app/public/ /usr/share/nginx/html
```

```shell
$ docker build -t myblog:nginx .

$ docker image ls --format "{{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep myblog
myblog  nginx   29MB
```

构建出来而最终交付镜像的大小为 **29MB** 。  

## Easyhttpd On Alpine 

后来，我发现了一个用GoLang编写的轻量级web服务器 - [easyhttpd](https://github.com/bitepeng/easyhttpd)，于是我Fork了该项目，编写了一个[Dockerfile](https://github.com/mengzyou/easyhttpd/blob/main/Dockerfile)来构建该web服务器的镜像，具体可查看该文件内容。  

镜像我已发布在[mengzyou/easyhttpd](https://hub.docker.com/r/mengzyou/easyhttpd)。  

```shell
$ docker image ls --format "{{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep easyhttpd
mengzyou/easyhttpd      v0.0.1  13.7MB
```

镜像大小为 **13.7MB**，比 nginx:alpine 的镜像小了十几MB。使用该镜像构建来构建我的博客站点  

```Dockerfile
...
FROM mengzyou/easyhttpd:v0.0.1
COPY --from=builder --chown=http:www /home/hugo/app/public/ /srv/www
```

```shell
$ docker image ls --format "{{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep myblog
myblog  nginx   29MB
myblog  ehttpd  19.1MB
```

得到的应用镜像大小为 **19.1MB** ，进一步减少了应用的镜像大小。  

## BusyBox Httpd

最近看到了一个国外的[博客文章](https://lipanski.com/posts/smallest-docker-image-static-website)，可以构建一个只有 **~155KB** 大小的web服务器镜像，我非常好奇，向着是否可以进一步减少我的静态站点的镜像大小。  

是使用了[BusyBox](https://busybox.net/)内置的[httpd](https://git.busybox.net/busybox/tree/networking/httpd.c)来静态文件提供web服务。于是我也学习该作者创建了一个基于busybox - httpd的web服务器镜像，将其命名为 [bbhttpd](https://github.com/mengzyou/docker-bbhttpd)，具体的构建内容请参考Github仓库 - [docker-bbhttpd](https://github.com/mengzyou/docker-bbhttpd)。  

构建的镜像我也发布到Docker Hub - [mengzyou/bbhttpd](https://hub.docker.com/r/mengzyou/bbhttpd)  

```shell
$ docker image ls --format "{{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep bbhttpd
mengzyou/bbhttpd        1.35    155kB
```

镜像大小确实只有 **155KB**，是不是挺惊人的？使用该镜像来构建我的站点  

```Dockerfile
...
FROM mengzyou/bbhttpd:1.35
COPY --from=builder --chown=www:www /home/hugo/app/public/ /home/www/html
```

```shell
docker image ls --format "{{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep myblog
myblog  nginx   29MB
myblog  ehttpd  19.1MB
myblog  bbhttpd 5.64MB
```

最终的交付镜像大小只有 **1.64MB**，几乎也就是web服务静态文件的大小。  

## 总结

按照Docker容器镜像构建的最佳实践，我们应该尽量保持最小的经销大小，而减少镜像大小的一个方法就是选择足够小的基础镜像。因此我们在构建静态Web服务的时候，可以通过自己构建基础镜像的方式，大大减少最终的镜像大小。  

| 基础镜像 | nginx:1.22-alpne | mengzyou/easyhttpd:v0.0.1 | mengzyou/bbhttpd:1.35 |  
| ------------- | ---------------- | ------------------------- | --------------------- |  
| Size | 23.5MB | 13.7MB | 155KB |  

