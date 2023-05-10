---
title: "DOCKER LIVERESTORE特性"
date: 2021-12-19T11:59:17+08:00
categories: ["Container"]
hero: docker-banner.webp
tags: ["docker"]
menu:
  sidebar:
    name: "DOCKER LIVERESTORE特性"
    identifier: docker-live-restore
    parent: container-tech
    weight: 10
---

我们都知道Docker是C/S模式架构，通过客户端（CLI）访问Docker Daemon来创建和管理容器的。在默认情况下，当daemon终止的时候，会停止所有运行的容器。  
因此我们需要对Docker Daemon进行升级或者某些需要重启的维护操作时，都需要导致运行着的容器跟着重新启动。  

## Live Restore

其实，Docker提供了一个特性，可以使得在Daemon不可用的时候，保持容器继续运行，这样就减少了在Daemon进行升级或者出现问题的时候容器的停机时间。那这个特性就叫做Live Restore 。  

通过为Docker Daemon增加以下配置来开启Live Restore特性。在Linux上，默认的配置文件 */etc/docker/daemon.json* 里添加  

```json
{
  "live-restore": true
}
```

然后重启docker服务。如果使用systemd管理服务，可以通过reload来避免重启docker服务  

```bash
sudo systemctl reload docker.service
```

其他情况下，可以发送 SIGHUP 信号给dockerd进程。  

对于Windows和MacOS上的Docker Desktop，可以通过Desktop节目的Daemon高级配置来开启Live Restore。  

配置完成后，可以尝试重启Docker Daemon来查看容器是否会保持继续运行。重启之前查看容器的启动时间  

```
 WSL -   mengz  docker container inspect portainer_edge_agent -f '{{ .State.StartedAt }}'
2021-12-18T09:50:59.761725785Z
```

然后执行 `sudo systemctl restart docker.service`，在查询一次容器的启动时间，将发现启动时间未发生变化，这说明了容器并没有重启。  

## Live Restore的限制

当前的Live Restore特性可以在进行Daemon维护，或者在Daemon发生问题导致不可用的情况，减少容器的停机时间，不过其也有一定的限制。   

1. Docker版本升级限制  

  Live Restore仅支持Docker补丁版本升级时可用，也就是 YY.MM.x 最后一位发生变化的升级，而不支持大版本的升级。在进行大版本升级后，可能会导致Daemon无法重新连接到运行中容器的问题，这时候需要手动停止运行的容器。  

2. Daemon选项变更  

  也就是说Live Restore仅仅在某些Daemon级别的配置选项不发生改变的情况工作，例如Bridge的IP地址，存储驱动类型等。如果在重启Daemon时候，这些选项发生了改变，则可能会到Daemon无法重新连接运行中的容器，这时也需要手动停止这些容器。  

3. 影响容器的日志输出

  如果Daemon长时间停止，会影响运行容器的日志输出。因为默认情况下，日志管道的缓冲区大小为64k，当缓冲写满之后，必须启动Daemon来刷新缓冲区。  

4. 不支持Docker Swarm

  Live Restore只是独立Docker引擎的特性，而Swarm的服务是由Swarm管理器管理的。当Swarm管理器不可用时，Swarm服务是可以在工作节点上继续运行的，只是不同通过Swarm管理器进行管理，直到Swarm管理恢复工作。  


## 总结

通过Docker Daemon的 **live-restore** 特性，我们可以运行无守护进程（daemonless）的容器，这可以减小容器应用在对Docker Daemon进行维护时候的停机时间，不过在使用时也有一定的限制，例如对于升级引擎版本的限制。如果关注无守护进程的容器，可以进一步了解 [Podman](https://podman.io) 。  

以上内容大部分来自Docker的官方文档，更详细的信息请参考 [](https://docs.docker.com/config/containers/live-restore/)。  
