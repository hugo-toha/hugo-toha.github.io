---
title: "开始使用DOCKER COMPOSE V2"
description: "Docker Compose V2 入门，以及与V1的区别"
date: 2022-06-02T18:53:16+08:00
categories: ["Container"]
hero: docker-compose-v2.webp
tags: ["docker", "compose"]
menu:
  sidebar:
    name: "开始使用DOCKER COMPOSE V2"
    identifier: docker-compose-v2
    parent: container-tech
    weight: 10
---

[Compose V2](https://www.docker.com/blog/volume-management-compose-v2-skipping-updates-and-more-in-docker-desktop-3-4/) 项目启动于2021年6月，直到2022年4月26号，发布了GA版本。在发布GA版本后，社区也宣布对于[Compose V1](https://github.com/docker/compose/tree/master)将不会再进行功能更新，将在6个月后结束生命周期（EOL），期间会进行关键的安全和错误修复。  

<!-- more -->

## V1与V2的兼容对比

确保 V1 和 V2 之间的兼容性对于日常工作流程至关重要，下面是V2中两个关键的更改  

| 更改 | 潜在影响 | 迁移 |
| --- | ------- | ---- |
| V2原生支持BuildKit，并且默认开启 | 开发者在V2中将默认使用BuildKit进行镜像构建 | 可通过设置环境变量不使用 `DOCKER_BUILDKIT=0` |
| 容器名字中使用 **-** 替代了 **_** 作为分隔符 | 如果在脚本中使用了容器名字，这可能会导致错误 | 可以通过 "--compatibility" 标记来关闭此更改 |

关于更多的兼容性更改，请查看[兼容性文档](https://docs.docker.com/compose/cli-command-compatibility/)  

## 如何安装Compose V2

Windows，MacOS和Linux上使用Docker Desktop，就自带了Compose V2，可通过命令 `docker compose` 执行。也可以通过配置“Use Docker Compose V2“来设置 `docker-compose` 别名到 `docker compose`。  

![desktop-compose-v2](https://images.mengz.dev/posts/docker-compose-v2.png)  

如果没有使用[Docker Desktop for Linux](https://docs.docker.com/desktop/linux/install/)，而是直接使用的Docker Engine，则需要额外安装 `docker-compose-plugin` 或者独立的二进制包。  

例如对于Ubuntu,可以通过Docker官方的APT源直接安装  

```bash
❯ sudo apt update
❯ sudo apt install docker-compose-plugin
```

其他Linux, 例如在我的 openSUSE 上，通过手动从[Github](https://github.com/docker/compose/releases)下载二进制文件进行安装（注意选择版本和平台架构）  

```bash
❯ DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
❯ mkdir -p $DOCKER_CONFIG/cli-plugins
❯ wget https://github.com/docker/compose/releases/download/v2.6.0/docker-compose-linux-x86_64
❯ mv docker-compose-linux-x86_64 $DOCKER_CONFIG/cli-plugins/docker-compose
❯ chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
```

执行一下命令测试  

```bash
❯ docker compose version
Docker Compose version 2.6.0
```

更多安装方式，请查看[官方文档](https://docs.docker.com/compose/install/)。  

## Compose V2的优势

### 在Docker CLI中快速交付新功能

- [支持GPU主机](https://docs.docker.com/compose/gpu-support/) - 如果Docker主机有GPU设备（显卡)并且Docker引擎进行了相关配置, 则Compose服务可以定义GPU设备的预留。  
- [支持配置服务启用（Profiles）](https://docs.docker.com/compose/profiles/) - 通过选择性服务器启用来为多种用途和环境启动Compose应用模型，如下Compose文件  

```yaml
version: "3.9"
services:
  frontend:
    image: frontend
    profiles: ["frontend"]

  phpmyadmin:
    image: phpmyadmin
    depends_on:
      - db
    profiles:
      - debug

  backend:
    image: backend

  db:
    image: mysql
```

默认执行 `docker compose up` 将只会启动 **backend** 和 **db** 服务，要启动相应配置的服务，需要使用 `--profile` 标记或者设置环境变量 **COMPOSE_PROFILES**，例如  

```bash
❯ docker compose --profile debug --profile frontend up
❯ COMPOSE_PROFILES=frontend,debug docker compose up
```

- 新增了 `cp` 命令 - 在服务容器和本地文件系统直接拷贝文件和目录  
- 新增了 `ls` 命令 - 列出当前环境中的Compose项目（应用栈）  

### 开发到生产的无缝转换

通过[云集成](https://github.com/docker/compose-cli)项目，可以容易的使用Compose V2将多容器应用部署到[AWS ECS](https://aws.amazon.com/ecs/)或者[Azure ACI](https://azure.microsoft.com/en-us/services/container-instances/)环境。  

具体示例可参考 [Deploying WordPress to the Cloud](https://www.docker.com/blog/deploying-wordpress-to-the-cloud/)。  

### 在Golang中创建一个同构的Docker生态系统

在Compose V2之前，V1是使用Python语言编写的，不在Docker的语言生态系统里。而V2使用Golang语言编写，可以提供来自Moby、CLI或任何基于Golang的项目代码，减少了很多通过Python重写新功能或缺陷的开发，容易从其他Docker工具（例如BuildKit）增加新功能到Compose中。  

通过Golang，现在可以发布一个静态的二进制执行文件，相比Python，大大简化了更新和依赖管理。  


### 在没有Compose文件的情况下执行命令

Compose V2可以在以下情况下通过 `--project-name|-p` 选项来管理运行的Compose项目容器服务  

- 当前目录不包含项目Compose文件（不在Compose项目文件目录下）  
- 不通过 `--file` 标记指定Compose文件  
- 不通过 `--project-directory` 标记指定Compose项目目录  

可执行的命令： `ps`，`exec`,`start`，`stop`，`restart`，`down`  

可以先通过 `docker compose ls` 列出当前环境的Compose项目  

```bash
❯ docker compose ls
NAME                STATUS              CONFIG FILES
dbweb               running(1)          docker-compose.yml
monitor             running(1)          /home/mengz/dockerapp/monitor/docker-compose.yml
traefik             running(1)          /home/mengz/dockerapp/traefik/docker-compose.yml
truenas             running(1)          /home/mengz/dockerapp/truenas/docker-compose.yml
```

然后通过 `-p <项目名> 命令` 来管理项目服务  

```bash
❯ docker compose -p dbweb ps
NAME                COMMAND             SERVICE             STATUS              PORTS
dbweb_pgadmin       "/entrypoint.sh"    pgadmin             running             443/tcp

❯ docker compose -p dbweb exec pgadmin sh
/pgadmin4 $ exit
```

## 总结

这里简单介绍了Docker Compose V2的一些特性和功能，随着V1的逐渐淘汰，我们要拥抱V2，并且尝试其提供的新功能。  
关于详细的Docker Docker，请参考[官方文档](https://docs.docker.com/compose/gettingstarted/)。  

> 参考：
> - [Announcing Compose V2 General Availability](https://www.docker.com/blog/announcing-compose-v2-general-availability/)  
> - [Install Docker Compose](https://docs.docker.com/compose/install/)  