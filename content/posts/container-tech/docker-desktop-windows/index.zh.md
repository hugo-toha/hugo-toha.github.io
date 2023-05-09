---
title: "WINDOWS上的DOCKER DESKTOP"
description: "介绍在Windows上使用Docker Desktop开始容器之旅"
date: 2020-03-18T14:31:38+08:00
categories: ["Container"]
hero: docker-desktop-windows.jpg
tags: ["docker", "windows"]
menu:
  sidebar:
    name: "WINDOWS上的DOCKER DESKTOP"
    identifier: docker-desktop-windows
    parent: container-tech
    weight: 10
---

在本系列的[Docker入门](../docker-intro/)中，我们介绍了容器的基本概念，以及如何在Ubuntu（Linux）上安装Docker引擎来进行容器化引用的开发。  
本篇我们介绍如何在Windows系统上安装和使用Docker，这里主要介绍在Windows 10上安装和使用[Docker Desktop](https://www.docker.com/products/docker-desktop)，对于Windows 10以下的版本，可以使用[Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/)，这里就不做介绍了．  

## 安装Docker Desktop

Docker Desktop　- The fastest way to containerize applications on your desktop，　这是Docker官方的定义，Docker Desktop为Windows和Mac提供了一个桌面化的容器开发环境，在Windows 10上，Docker Desktop使用了Windows的[Hyper-V](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/)虚拟化技术，因此你需要一台打开了硬件虚化化的电脑并且安装的是Windows 10专业版以上的系统，还需要打开Hyper-V功能，如何在Windows 10上打开Hyper-V，[参考这里](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v)．  

_补充_　：　Docker Desktop支持Windows 10 64位: 专业版，企业版，教育版 (Build 15063 或以上).  

首先在满足条件的Windows系统上下载Docker Desktop的安装包 - https://hub.docker.com/editions/community/docker-ce-desktop-windows　．安装过程是简单的，直接双击下载的安装，更具提示安装就好了，一开始我们选择使用Linux容器（之后可以其他换到使用Windows容器的方式，会单独写一篇来介绍使用Windows容器）．安装过程中安装程序会检查系统是否满足，如果不满足，安装程序会报错并结束安装．  

安装完成之后，打开 `开始` 菜单，然后选择 `Docker Desktop` 启动．  

查看状态栏上的Docker图标，一开始会显示 `starting` 装，等到显示`Docker Desktop is running`，就可以通过终端（例如 PowerSheel）来使用Docker的相关命令了，下面我们将使用Windows 10的PowerShell作为终端来进行操作．  

![docker-desktop-version](https://images.mengz.dev/posts/docker-desktop-version.png)  

## 构建和运行容器

我们将使用一个简单[Node应用](https://github.com/mengzyou/hellonode)来示例如何在Windows上构建容器镜像和启动一个容器．首先我们需要将代码库下载到我们的环境中，这里可以使用Git来克隆代码库或者直接下载代码包．  

在Windows上，可以使用[Git for Windows](https://gitforwindows.org/)，也可以使用Windows 10的[WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10)安装一个Ubuntu子系统，然后在Ubuntu子系统终端里安装Git，并直接使用Git克隆代码，这里我使用的是在Ubuntu子系统终端里克隆代码库到本地目录．  

![Git-clone](https://images.mengz.dev/posts/docker-desktop-git-clone.png)  

如上图所示，我们把代码克隆到了`D:\gitrepos\hellonode\`目录，然后切换到PowerShell终端，进入该目录.　用你喜欢的文本编辑器打开`hellonode\Dockerfile`（推荐时候用VS Code，内容如下  

```Dockerfile
FROM node:12.2-alpine

MAINTAINER Mengz You <mengz.you@outlook.com>

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]
```

### 构建镜像

使用这个简单的Dockerfile，用于构建示例的Node应用，在Powershell中执行如下命令  

```powershell
docker image build -t hellnode:local .
docker image ls
```

如下图所示，将会看到构建的容器镜像  

![Build-image](https://images.mengz.dev/posts/docker-desktop-build.png)  

### 运行容器

接着我们使用构建好的镜像来启动一个应用容器，在Powershell中执行如下命令  

```powershell
docker container run --name hellonode -d -p 3000:3000 hellonode:local
docker container ls
```

![Container-run](https://images.mengz.dev/posts/docker-desktop-container-run.png)  

这样我们就启动了一个容器，并且可以使用`docker contianer ls`查看当前的容器状态，同时我们也可以使用Docker Desktop的Dashboard来图形化查看容器状态并进行一些操作，要打开Dashboard，点击状态栏的Docker Desktop图标，选择`Dashboard`打开，如下图所示  

![Desktop-dashboard](https://images.mengz.dev/posts/docker-desktop-dashboard.png)  

在Dashboard上，我们可以UI操作的方式查看容器相关的信息，例如查看容器的日志，停止／启动／重启容器，还可以进入容器CLI等操作．  

在运行容器时，我们使用`-p 3000:3000`指定了将容器应用的3000端口映射到了本地的3000端口，所以我们可以直接访问本地3000端口来访问应用  

![Bowser-access](https://images.mengz.dev/posts/docker-desktop-access-http.png)  

之后，我们可以使用一下命令停止和删除掉容器  

```powershell
docker container stop hellonode
docker contianer rm hellonode
```

### 推送镜像到Docker Hub

如何你需要将构建的镜像推送到Docker Hub，首先需要登录你的Docker Hub帐号，点击状态栏的Docker Desktop图标，选择`Sign in/Create Docker ID..`，打开登录窗口进行登录

![Dockerhub](https://images.mengz.dev/posts/docker-desktop-signin-dockerhub.png)  

然后我们在PowerShell里执行  

```powershell
docker image tag hellonode:local mengzyou/hellonode:v1.0
docker image push mengzyou/hellonode:v1.0
```

这样就会将镜像推送到Docker Hub上你的仓库中了．  

## 总结

这里是简单介绍了下如何在Windows 10上使用Docker Desktop来进行容器话应用的开发，Docker Desktop为Windows用户提供了很好的Docker容器化工具，除了可以使用Docker引擎之外，Docker Desktop还提供了Kubenetes功能，可以在Windows上运行一个单机的K8S环境，更多信息可以阅读[官方文档](https://docs.docker.com/docker-for-windows/)．  

虽然Docker Desktop为Windows提供了一个可视化的管理工具，不过我还是推荐直接在Linux桌面上直接使用Docker引擎，在Linux环境中，如果你也想要一个UI的管理工具，我推荐使用[Portainer](https://www.portainer.io/) - 一个基于Web的容器管理工具．  
