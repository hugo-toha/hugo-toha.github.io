---
title: "本地环境运行MQTT容器"
description: "本文演示如何在本地开发环境使用Docker运行MQTT的Broker"
date: 2021-03-10T14:14:54+08:00
categories: ["Container"]
hero: docker-mqtt.webp
tags: ["docker", "mqtt"]
menu:
  sidebar:
    name: "本地环境运行MQTT容器"
    identifier: docker-mqtt-broker
    parent: container-tech
    weight: 10
---

在我们的本地开发环境（Windows, Mac or Linux），我们可以很容易地使用Docker容器的方式，跑一个MQTT的Broker起来，方便我们的应用开发调试MQTT相关的功能。这里我们以[Emqx](https://github.com/emqx/emqx)作为MQTT的Broker来做示例。

## 环境准备

首先需要在我们本地的Workstation上安装Docker环境:  

- Windows - 如果是Windows 10，推荐使用[Docker Desktop](https://www.docker.com/products/docker-desktop)或者[WSL2](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install)，如果是10一下版本，可以使用[Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/)，或者在Windows上跑一个Linux虚拟机，直接在虚拟机里安装Docker    
- Mac - 使用[Docker Desktop](https://www.docker.com/products/docker-desktop)  
- Linux - [直接安装Docker引擎](https://docs.docker.com/install/linux/docker-ce/ubuntu/)  

如果选择使用Docker Desktop，可以参考 [Windows上的Docker Desktop](../docker-desktop-windows/) 。   

## Docker运行emqx容器

Emqx的开发者已经构建了可用的容器映像，放在[Docker Hub](https://hub.docker.com/r/emqx/emqx)上，所以我们这里不需要自己构建映像，而是直接从Docker Hub上拉取  

```bash
$ docker image pull emqx/emqx:v4.0.5
```

如果是在Windows上使用Docker Desktop，则上面的命令是在PowerShell里执行。  
使用如下的命令直接启动一个emqx的容器  

```bash
$ docker image container run --name dev_emqx -d -p 18083:18083 -p 1883:1883 emqx/emqx:v4.0.5
```

启动成功后，我们可以使用命令查看运行情况  

```bash
$ docker container ls
docker container ls
CONTAINER ID        NAMES               IMAGE                 CREATED ago          STATUS              PORTS                                                                                                                          COMMAND
7c93940c07a3        dev_emqx            emqx/emqx:v4.0.5      39 minutes ago ago   Up 39 minutes       4369/tcp, 5369/tcp, 6369/tcp, 8080/tcp, 8083-8084/tcp, 8883/tcp, 0.0.0.0:1883->1883/tcp, 0.0.0.0:18083->18083/tcp, 11883/tcp   "/usr/bin/docker-ent…"
```

我们可以看到映射了两个端口到我们的主机上

- 1883 : mqtt端口，用户mqtt客户端连接  
- 18083 : emqx的Web管理界面端口，可以访问 http://localhost:18083/ ，默认的用户名 `admin`，密码 `public`  

这样就运行了一个单节点的MQTT Broker，下面我们使用[MQTT.js](https://www.npmjs.com/package/mqtt]的命令行客户端尝试连接，订阅/发布消息。  

## 客户端连接

首先使用npm安装MQTT.js，当然如果没有Node环境，也可以选择其他客户端    

```bash
$ npm install mqtt -g
```

连接一个客户端订阅一个主题（topic/hello）  

```bash
$ mqtt sub -h localhsot -p 1883 -t 'topic/hello' -v
```

然后打开另一个终端向主题发布消息  

```bash
$ mqtt pub -h localhsot -p 1883 -t 'topic/hello' -m "{\"message\":\"Hello\",\"timestamp\":\"$(date +'%s')\"}"
```

查看另一个订阅的终端，会收到该消息  

```bash
└❯ mqtt sub -h localhost -p 1883 -t 'topic/hello' -v
topic/hello {"message":"Hello","timestamp":"1585189813"}  
```

我们在订阅的时候，使用了`-v`选项，所以消息会打印出主题信息。  

## MQTT客户端

- [Java client](https://docs.emqx.io/tutorial/v3/cn/client_dev/java.html)    
- [MQTTFx - 一个Java编写的MQTT图像界面客户端](https://mqttfx.jensd.de/)  
- [MQTTX - 跨平台MQTT桌面客户端工具](https://mqttx.app/zh)