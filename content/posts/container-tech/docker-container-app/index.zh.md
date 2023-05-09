---
title: "DOCKER构建容器化应用"
description: "介绍使用docker build构建容器化应用"
date: 2020-02-13T17:34:10+08:00
categories: ["Container"]
hero: docker-banner.png
tags: ["docker"]
menu:
  sidebar:
    name: "DOCKER构建容器化应用"
    identifier: docker-container-app
    parent: container-tech
    weight: 10
---

这是Docker快速开始系列的第二篇，在对我们的应用进行容器化之前，请先阅读[第一篇](../docker-intro/)安装好Docker环境。  

## 介绍

我们在开发主机（开发环境）上安装好Docker之后，我们就可以开始发开容器化应用，通常按照以下步骤：  

  1. 为应用的每个组件创建Docker镜像，然后通过镜像运行容器并测试．  
  2. 编写 _docker stack_ 文件或者Kubernetes的 _YMAL_　文件，将容器和支持的基础设施集装到一个完整应用程序.  
  3. 测试，分享和部署你的整个容器化的应用程序．  

在这个快速的教程里，我们将专注在第一个步骤：创建容器将基于的镜像．

## 准备Dockerfile

我们将使用Docker的一个培训项目示例`docker-training/node-bulletin-board`，按照如下步骤  

1. 从Github克隆示例代码（首先你需要在环境中安装好Git）  

  ```bash
  $ git clone -b v1 https://github.com/docker-training/node-bulletin-board
  $ cd node-bulletin-board/bulletin-board-app/
  ```

  这是一个简单的公告板应用示例代码，使用`node.js`编写．现在，我们需要容器化该应用．  

2. 在代码目录下，有一个`Dockerfile`文件，该文件描述了如何为一个容器封装一个私有文件系统，以及包含一些描述如何运行容器的元数据，文件内容如下  

  ```Dockerfile
  FROM node:8.9.4-alpine

  WORKDIR /usr/src/app
  COPY package.json .
  RUN npm install
  COPY . .

  CMD [ "npm", "start" ]
  ```

  为应用编写Dockerfile是容器化应用的第一步，你可以认为Dockerfile里的命令是构建镜像的一步步指令  

  - 首先从一个已经存在的基础镜像开始，`FROM node:8.9.4-alpine`，该基础镜像是一个官方的镜像，在开始构建时，如果本地没有该镜像，将会`Docker Hub`自动拉取该镜像．  
  - 然后通过`WORKDIR`指令设置工作目录，之后的操作都将基于该工作目录．  
  - 通过`COPY`指令，将当前目录下的`package.json`文件拷贝到容器的当前目录下（/usr/src/app/），也就是`/usr/src/app/package.json`．　　
  - `RUN`指令是执行相关的命令，示例中在`/usr/src/app/`目录下执行`npm install`命令，该命令将根据`package.json`文件安装应用相关的依赖包．  
  - 接着将剩余的代码从主机拷贝到镜像的文件系统中．  
  - 最后的`CMD`命令配置了镜像的元数据，描述使用该镜像运行容器时，如何启动应用程序，这里启动容器时将运行`npm start`.  

以上只是一个简单的Dockerfile示例，更多的指令请参考[官方文档](https://docs.docker.com/engine/reference/builder/).  

## 构建和测试镜像

现在我们拥有了源代码和Dockerfile，我们可以开始构建应用的镜像了．  

1. 首先确保当前目录是 _node-bulletin-board/bulletin-board-app/_　，通过如下的命令构建镜像  

  ```bash
  $ docker image build -t bulletinboard:1.0 .
  ```

  你将看到Docker按照Dockerfile里的指令进行构建，当构建成功后，可通过如下命令查看到构建出来的镜像  

  ```bash
  $ docker image ls
  bulletinboard            1.0                 866d1f004027        About a minutes ago   82.3MB
  ```

  我们通过`-t`选项指明了镜像的名字和标签，命令的最有一个`.`意思是构建的上下文是当前目录，将在当前目录里寻找`Dockerfile`．  

2. 基于镜像启动一个容器  

  ```bash
  docker container run --name bb --publish 8000:8080 --detach bulletinboard:1.0
  ```

  该命令将基于镜像`bulletinboard:1.0`启动一个容器实例，我们使用如下的一些命令选项  

  - --name : 将容器命名为`bb`，如果不指定，Docker将自动为容器命名.  
  - --publish : 将容器的里的端口8080映射到主机上的8000款口，也就是发往主机8000款口的流量将会转发到容器的8080端口．  
  - --detach : Docker将容器运行在后台．  

  由于构建镜像的时候通过`CMD`指定了容器启动的命令`npm start`，因此容器在启动时候将自动通过该命令来启动应用进程．

3. 访问应用

  由于容器启动时，制定了将服务端口映射到了主机的8000端口，因此我们可以通过浏览器访问 `http://localhost:8000/` 访问应用．  

4. 当验证应用运行正常，可将容器在主机环境中删除掉  

  ```bash
  $ docker container rm --force bb
  ```

## 总结

本文通过一个简单的`node.js`应用，示例了如何通过`Dockerfile`来容器化应用程序，也就是将应用的依赖，可只想代码封装到容器镜像，再通过镜像在开发环境上运行应用容器．　　
这是容器话应用的地一个阶段，在构架了应用的容器之后，我们就可以将镜像分发到其他运行环境（测试环境，生产环境）进行应用的部署了．当然对于复杂的应用，可能由很多的服务组件构成，那每一各服务都将会被构建成相应的镜像，部署的时候就会运行很多的容器来组成整个应用程序，因此我们需要容器的编排工具（Orchestrator）来自动管理和部署相应的容器服务．  
