---
title: "DOCKER入门"
description: "Docker容器入门技术，介绍什么是Docker"
date: 2020-02-13T12:40:25+08:00
categories: ["Container"]
hero: docker-banner.webp
tags: ["docker"]
menu:
  sidebar:
    name: "DOCKER入门"
    identifier: docker-intro
    parent: container-tech
    weight: 10
---

## Docker

Docker是一个为开发者和运维工程师（系统管理员）以容器的方式构建，分享和运行应用的平台。使用容器进行应用部署的方式，我们成为容器化。    

容器化应用具有一下特性，使得容器化日益流行：  

- 灵活：　再复杂的应用都可以进行容器化．  
- 轻量：　容器使用使用和共享主机的内核，在系统资源的利用比虚拟机更加高效．  
- 可移植：　容器可以本地构建，部署到云上，运行在任何地方．  
- 松耦合：　容器是高度自封装的，可以在不影响其他容器的情况下替换和升级容器．  
- 可扩展：　可以在整个数据中心里增加和自动分发容器副本．  
- 安全：　容器约束和隔离应用进程，而无需用户进行任何配置．  

### 镜像和容器

其实，容器就是运行的进程，附带一些封装的特性，使其与主机上和其他容器的进程隔离．每个容器都只访问它自己私有的文件系统，这是容器隔离很重要的一方面．而Docker镜像就提供了这个文件系统，一个镜像包含运行该应用所有需求 - 代码或者二进制文件，运行时，依赖库，以及其他需要的文件系统对象．  

通过与虚拟机对比，虚拟机（VM）通过一个虚拟机管理（Hypervisor）运行了完整的操作系统来访问主机资源．通常虚拟机会产生大量的开销，超过了应用本身所需要的开销．  

![Container-VM](https://images.mengz.dev/posts/container-vm.png)  

### 容器编排

容器化过程的可移植性和可重复性意味着我们有机会跨云和数据中心移动和扩展容器化的应用程序，容器有效地保证应用程序可以在任何地方以相同的方式运行，这使我们可以快速有效地利用所有这些环境．当我们扩展我们的应用，我们需要一些工具来帮助自动维护这些应用，在容器的生命周期里，可以自动替换失败的容器，管理滚动升级，以及重新配置．　　

容器编排器（Orchestrator）就是管理，扩展和维护容器化应用的工具，当前最常见的例子就是 _Kubernetes_ 和 _Docke Swarm_ ．_Docker Desktop_ 工具可以在开发环境提供这两个编排工具．当前，_Docker Desktop_ 仅支持在[Windows](https://docs.docker.com/docker-for-windows/install/)和[OSX](https://docs.docker.com/docker-for-mac/install/)系统上安装，本文接下来主要介绍如何在[Linux](https://docs.docker.com/docker-for-windows/install/)上安装Docker，以及运行一个容器．  

## 安装Docker

如果你使用的是Windows或者Mac OS系统，请参考上面的链接安装和使用 _Docker Desktop_，下面我们将已[Ubuntu 18.04](https://docs.docker.com/install/linux/docker-ce/ubuntu/)系统为例来安装Docker的社区版本（docker-ce）．　　

### 配置软件源

1. 更新`apt`包索引  
  ```bash
  $ sudo apt update
  ```  

2. 安装需要的软件包  
  ```bash
  $ sudo apt install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
  ```

3. 添加Docker官方的GPG信息  
  ```bash
  $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  ```

4. 使用如下命令添加Docker的安装源  

  ```bash
  $ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
  ```

  `stable`意思为添加的是稳定版本的源．  

### 安装

1. 更新软件源  
  ```bash
  $ sudo apt update
  ```

2. 安装最新版本的Docker引擎和containerd  
  ```bash
  $ sudo apt install docker-ce docker-ce-cli containerd.io
  ```

3. 验证安装  
  ```bash
  $ sudo docker run hello-world
  ```

  该命令会下载一个测试镜像并运行一个容器，该容器会打印一些信息后退出．　　

**补充**：　为了运行`docker`命令不需要使用`sudo`，可以将当前用户加入`docker`  
```bash
$ sudo usermod -aG "docker" <username>
```

在重新登录用户后，可以直接使用`docker`命令进行操作．  

## 运行容器

在上面安装`docker`引擎的最后一个验证步骤中，其实我们已经运行了一个容器，这里再示例如何运行一个`ubuntu`操作系统的基础容器．  

以下命令假设已经将当前用户添加到了`docker`组．  

1. 拉取（Pull）镜像  
  ```bash
  $ docker image pull ubuntu:18.04
  ```

  该命令将从Docker官方的镜像仓库（[Docker Hub](https://hub.docker.com/)）上下载一个官方维护的Ubuntu的基础镜像，标签为`18.04`．　　

2. 运行容器  
  ```bash
  $ docker container run --rm -it ubuntu:18.04
  root@451a1f6ed7c9:/#
  ```

  上面的命令，将用`ubuntu:18.04`的镜像运行一个容器，`--rm`选项指示在退出或停止容器时自动删除该容器，`-it`选项表示创建一个tty并与其交互，因为该容器默认运行的进程是`bash`，这样我们可直接在容器里进行交互．  

  在容器运行时，可以打开另一个终端，使用如下命令查看当前运行在该主机上的容器  
  ```
  docker container ls
  CONTAINER ID        NAMES               IMAGE                 CREATED ago         STATUS              PORTS                                          COMMAND
451a1f6ed7c9        musing_diffie       ubuntu:18.04          4 minutes ago ago   Up 4 minutes                                                       "/bin/bash"
  ```

  当我们在容器的只能高端里执行`exit`，或者在主机的另一个终端里执行`docker container stop musing_diffie`，都将停止并删除该容器．  

## 总结

这里我们介绍了容器的基本概念，以及在`Ubuntu`系统上安装Docker，运行了一个简单的容器．该系列接下来的文章中我会介绍如何容器化我们的应用程序．  
