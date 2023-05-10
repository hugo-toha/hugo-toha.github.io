---
title: "DIUN-容器镜像更新通知"
description: "推荐一个开源的Docker镜像更新通知工具diun"
date: 2023-03-18T16:12:58+08:00
categories: ["OpenTool"]
hero: diun-banner.webp
tags: ["cotainer", "docker", "slack"]
menu:
  sidebar:
    name: "DIUN-容器镜像更新通知"
    identifier: diun-intro
    parent: opentool
    weight: 10
---

我们通常可以将一台或多台服务器作为Docker主机，使用容器跑一些开源的工具服务。而往往我们不知道该什么时候这个这些应用有了更新的版本，最近发现了一个开源的工具，可以检查主机上运行的容器的镜像是否有更新，并可以通过集成多种渠道发送更新通知，这款工具就是 [DIUN(Docker Image Update Notifier)](https://crazymax.dev/diun/) 。  

## DUIN介绍

DUIN是一款使用GO语言编写的命令行工具，可以本地运行，也可以通过容器运行（开发者提供了构建好的[镜像](https://hub.docker.com/r/crazymax/diun) )，当监控的容器镜像在相应的注册表（Registry）中更新时，可以接收到相应的通知。  

DUIN支持多种监控配置（Providers）：  

- Docker - 分析Docker主机上运行容器的镜像，并检查其更新  
- Podman - 类似Docker，需要Podman以服务方式启动  
- Kubernetes - 分析Kubernetes集群中的Pods，检查pod使用的镜像  
- Swarm - 分析Swarm集群中服务使用的镜像  
- Nomad - 类似Docker，分析Nomad引擎运行的镜像  
- Dockerfile - 分析Dockerfile中引用的镜像  
- File - yaml格式的配置文件，直接配置需要检查的镜像信息  

DUIN支持集成多种通知渠道，例如 Discord， Slack，Matrix，Telegram 以及 Webhook 等。  

## DUIN使用示例

这里将演示在Docker主机上使用[Docker Compose](https://docs.docker.com/compose/)来运行duin服务，并集成Slack，将通知发送到相应的频道。  

`docker-compose.yml` :  

```yml
services:
  diun:
    image: crazymax/diun:latest
    container_name: diun
    hostname: home200-diun
    command: serve
    volumes:
      - diundata:/data
      - "/var/run/docker.sock:/var/run/docker.sock"
    environment:
      - "TZ=Asia/Shanghai"
      - "LOG_LEVEL=info"
      - "LOG_JSON=false"
      - "DIUN_WATCH_WORKERS=20"
      - "DIUN_WATCH_SCHEDULE=0 */6 * * *"
      - "DIUN_WATCH_JITTER=30s"
      - "DIUN_PROVIDERS_DOCKER=true"
      - "DIUN_PROVIDERS_DOCKER_WATCHBYDEFAULT=true"
      - "DIUN_NOTIF_SLACK_WEBHOOKURL=https://hooks.slack.com/services/xxxxxxxxxxxxx"
    restart: on-failure

volumes:
  diundata:
```

上面的环境变量中  

- `DIUN_WATCH_SCHEDULE=0 */6 * * *` 指定每6小时做一次检查  
- `DIUN_PROVIDERS_DOCKER=true` 指定使用Docker Provider，因此需要绑定 `/var/run/docker.sock:/var/run/docker.sock`  
- `DIUN_PROVIDERS_DOCKER_WATCHBYDEFAULT=true` 指定默认检查当前Docker环境中运行的所有容器的镜像，如果该值设置为 `false`，则在运行需要检查镜像的容器时，需要添加标签 `diun.enable=true`  
- `DIUN_NOTIF_SLACK_WEBHOOKURL=` 指定了发现更新时，将通知发送到Slack的频道，配置的值只需要在Slack的某个频道中添加一个`Incoming Webhook`应用即可  

启动更多的配置，可参考[文档](https://crazymax.dev/diun/providers/docker/)。  

启动容器，可进入容器进行通知测试  

```shell
➜  docker compose exec diun sh
/ # diun notif test
Notification sent for slack notifier(s)
```

在Slack中，将收到如下所示的通知  

![diun-slack-notify](https://images.mengz.dev/posts/diun-slack.png)

之后，当DIUN发现有新的镜像发布到镜像仓库后，就会收到相应的通知，我们就可以选择是否进行应用升级。  

当我们为应用使用固定标签的镜像时，我们可以指定相应的标签来进行检查，如  

```yml
  labels:
    - 'diun.enable=true'
    - 'diun.watch_repo=true'
    - 'diun.include_tags=^\d+\.\d+\.\d+$'
```

上面的正则指定了需要检查的标签。  

## 总结

这里推荐了一个开源的容器镜像更新通知工具，同时演示了基于Docker+Slack的集成，更多的使用方式请参考其[文档](https://crazymax.dev/diun/) 。  
