---
title: "轻量级Kubernetes集群-K3S"
date: 2022-07-22T21:00:13+08:00
categories: ["Kubernetes"]
description: "介绍一款轻量级kubernetes集群工具k3s"
hero: k3s-kubernetes.webp
tags: ["contianer", "kubernetes", "cluster"]
menu:
  sidebar:
    name: "轻量级Kubernetes集群-K3S"
    identifier: lightweight-k3s
    parent: k8s
    weight: 10
---

[K3S](https://k3s.io) 是 [Rancher](https://rancher.com) 为物联网（IoT）和边缘计算环境开发的轻量级 [Kubernetes](https://kubernetes.io) 发行版本。相比原生的 Kubernetes，其移除了很多非必要的组件，例如云控制管理器（CCM）、内置的（In-Tree）的存储插件等，以及为ARM架构的基础设施做了优化。  

<!-- more -->

K3s 的轻量级同时也体现在其打包成一个二进制可执行文件进行分发，状态存储除了支持 etcd 外，还支持 Sqlite3、MySQl和Postgres。其跟多特性可参考[官方文档](https://rancher.com/docs/k3s/latest/en/)。  

K3s 支持单节集群部署（可用于开发测试环境），也支持高可用的多节点集群。同时还可以通过 [k3d](https://k3d.io) 项目快速在本地开发环境使用Docker容器部署 k3s 集群作为开发环境。  

这里我将演示通过虚拟机部署一个高可用的多节点集群（3个Servers节点 + 3个Agent节点）。  

## k3S架构

![k3s-arch](https://k3s.io/img/how-it-works-k3s-revised.svg)  

上图是来自k3s官网的架构图，其架构与Kubernetes的架构是相似的，k3s的server节点也就是控制面节点，agent节点是工作负载节点。k3s默认使用 [containerd](https://containerd.io/) 作为容器运行时。  

更信息的部署架构可参考[官方文档](https://rancher.com/docs/k3s/latest/en/architecture/)。  

## 准备虚拟机节点

这里我们将部署 3 + 3 的集群，需要6台虚拟机，基本配置如下  

| 主机名 | IP | vCPU | 内存 |  
| --------- | ---------- | -------- | --------- |  
| homek3s-server1 | 192.168.0.150 | 1 | 2 GB |  
| homek3s-server2 | 192.168.0.151 | 1 | 2 GB |  
| homek3s-server3 | 192.168.0.152 | 1 | 2 GB |  
| homek3s-agent1 | 192.168.0.154 | 2 | 4 GB |  
| homek3s-agent2 | 192.168.0.155 | 2 | 4 GB |  
| homek3s-agent3 | 192.168.0.156 | 2 | 4 GB |  

部署的最小需求，可参考[官方文档](https://rancher.com/docs/k3s/latest/en/installation/installation-requirements/)。  

K3s 支持大部分主流的Linux操作系统，这里我使用的是 [openSUSE Leap Micro 15.2](https://microos.opensuse.org/)，其是一个基于openSUSE，为容器负载而设计的操作系统。  

为了部署简单，这里我们禁用了系统的防火墙，如果开启防火墙，需要为Server节点开放如下端口  

- 6443/TCP - Kubernetes API 服务  
- 8472/UDP - Flannel VXLAN模式需要  
- 51820/UDP - Flannel Wireguard后端需要  
- 10250/TCP - Kubelet metrics需要  
- 2379-2380/TCP - 基于内嵌etcd高可用部署模式需要  

## 启动Server节点  

首先登陆到第一个Server节点 **homek3s-server1**，然后下载最新版本（v1.24.3+k3s1）的 k3s 二进制文件  

```bash
# curl -sfL https://github.com/k3s-io/k3s/releases/download/v1.24.3%2Bk3s1/k3s -o /usr/local/bin/k3s
# chmod +x k3s
# k3s --version
k3s version v1.24.3+k3s1 (990ba0e8)
go version go1.18.1
```

k3s 支持一下几个子命令  

- k3s server - 用于运行管理服务节点  
- k3s agent - 用于运行agent工作节点  
- k3s kubectl - 运行 kubectl 命令  
- k3s crictl - 运行 crictl 容器管理命令  

其他的命令帮助，请通过 `k3s --help` 查看。  

这里我们将要创建一个使用内置etcd数据库的高可用集群，执行如下命令  

```bash
# k3s server --cluster-init --advertise-address=192.168.0.150 --tls-san=homek3s.mengz.lan --write-kubeconfig-mode=644
```

参数 --cluster-init 是使用内置的etcd初始户一个新的集群;  
参数 --advertise-address 是指定API服务器的监听IP地址，如果不指定，默认为节点的IP地址;  
参数 --tls-san 是指定额外的域名或者IP地址作为TLS证书的SAN，使得我们从客户端可通过域名访问而API服务器。  

运行成功后，在 **homek3s-server1** 打开另一个终端执行  

```bash
# k3s kubectl get no
NAME              STATUS   ROLES                       AGE   VERSION
homek3s-server1   Ready    control-plane,etcd,master   27h   v1.24.3+k3s1
```

可以看到，集群中以及运行了一个节点，不过这时k3s服务是启动在前台的，我们需要配置一个 systemd 服务，让其以服务形式运行。  
创建文件 */etc/systemd/system/k3s.service*，内如如下  

```service
[Unit]
Description=Lightweight Kubernetes
Documentation=https://k3s.io
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
EnvironmentFile=-/etc/default/%N
EnvironmentFile=-/etc/sysconfig/%N
EnvironmentFile=-/etc/systemd/system/k3s.service.env
ExecStartPre=/bin/sh -xc '! /usr/bin/systemctl is-enabled --quiet nm-cloud-setup.service'
ExecStart=/usr/local/bin/k3s server
KillMode=process
Delegate=yes
# Having non-zero Limit*s causes performance problems due to accounting overhead
# in the kernel. We recommend using cgroups to do container-local accounting.
LimitNOFILE=1048576
LimitNPROC=infinity
LimitCORE=infinity
TasksMax=infinity
TimeoutStartSec=0
Restart=always
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

终止刚才运行的k3s进程，然后执行  

```bash
# systemctl enable --now k3s.server

# systemctl status k3s
● k3s.service - Lightweight Kubernetes
     Loaded: loaded (/etc/systemd/system/k3s.service; enabled; vendor preset: disabled)
     Active: active (running) since Fri 2022-07-22 03:31:21 CST; 18h ago
       Docs: https://k3s.io
    Process: 1121 ExecStartPre=/bin/sh -xc ! /usr/bin/systemctl is-enabled --quiet nm-cloud-setup.service (code=exited, status=0/SUCCESS)
   Main PID: 1129 (k3s-server)
      Tasks: 120
     CGroup: /system.slice/k3s.service
     ...
```

这是后k3s进程将以服务的形式运行在后台了。  

执行完上述步骤后，k3s将会生产集群的管理员 kubeconfig 文件 - */etc/rancher/k3s/k3s.yaml*，可将该文件拷贝的本地环境，修改 server 内容  

~~server: https://127.0.0.1:6443~~
server: https://192.168.0.150:6443  

这样就可以在本地主机上使用 kubectl 访问集群了。  

接下来，我们将在其他Server节点上启动k3s，并作为管理节点加入集群，首先在第一个节点 **homek3s-server1** 上获取到集群的Token  

```bash
# cat /var/lib/rancher/k3s/server/node-token 
K1087c3ff53c94a3c3b20475e84602f1e6d46f1b3903f2979f144800990897b06ac::server:fb8e7aa7ba23d7652942b09cb440ba24
```

SSH登陆其他Server节点（`homek3s-server2` 和 `homek3s-server3`），执行如下步骤  

1. 下载相同版本的 k3s 二进制文件到 */usr/local/bin/k3s*  

2. 执行如下命令加入集群  

```bash
# k3s server --server=https://192.168.0.150:6443 --token=${NODE_TOKEN}
```

其中 ${NODE_TOKEN} 是上面从第一个节点获取的 Token 内容。  

3. 如第一个节点一样，配置 *etc/systemd/system/k3s.service*，将k3s进程启动以服务方式启动。  

完成上述步骤后，通过 kubectl 查看节点  

```bash
❯ k get no
NAME              STATUS   ROLES                       AGE   VERSION
homek3s-server1   Ready    control-plane,etcd,master   28h   v1.24.3+k3s1
homek3s-server2   Ready    control-plane,etcd,master   27h   v1.24.3+k3s1
homek3s-server3   Ready    control-plane,etcd,master   27h   v1.24.3+k3s1
```

## 启动Agent节点

在启动完3个管理节点（Server）的集群之后，我接下来继续添加工作节点（Agent）到集群中，登陆到3个Agent节点之下如下步骤（3个节点上的操作相同）  

1. 下载相同版本的 k3s 二进制文件到 */usr/local/bin/k3s* （方法与Server节点上一样）  

2. 执行如下命令，以工作节点加入集群   

```bash
# k3s agent --server=https://192.168.0.150:6443 --token=${NODE_TOKEN}
```

${NODE_TOKEN} 是上面获取的节点Token值。  

执行成功之后，也需要将 k3s 的 agent 进程以服务方式启动，这里与Server节点有些不同，创建文件 */etc/systemd/system/k3s-agent.service*，内容如下  

```service
[Unit]
Description=Lightweight Kubernetes
Documentation=https://k3s.io
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
EnvironmentFile=-/etc/default/%N
EnvironmentFile=-/etc/sysconfig/%N
EnvironmentFile=-/etc/systemd/system/k3s-agent.service.env
ExecStartPre=/bin/sh -xc '! /usr/bin/systemctl is-enabled --quiet nm-cloud-setup.service'
ExecStart=/usr/local/bin/k3s agent --server=${K3S_URL} --token=${K3S_TOKEN}
KillMode=process
Delegate=yes
# Having non-zero Limit*s causes performance problems due to accounting overhead
# in the kernel. We recommend using cgroups to do container-local accounting.
LimitNOFILE=1048576
LimitNPROC=infinity
LimitCORE=infinity
TasksMax=infinity
TimeoutStartSec=0
Restart=always
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

然后再创建文件 */etc/systemd/system/k3s-agent.service.env*，内容如下  

```env
K3S_URL="https://192.168.0.150:6443"
K3S_TOKEN="K1087c3ff58c94a3c3b20475e84602f8e6d46f1b3903f2979f144800990897b06ac::server:fb8e7aa7ba23d7652942b09cb440ba24"
```

注意，将以上的 K3S_TOKEN 替换成你的值。  
然后执行  

```bash
# sysetmctl enable --now k3s-agent.service
```

3个Agent节点都启动完成之后，使用 kubectl 查看节点  

```bash
❯ k get no
NAME              STATUS   ROLES                       AGE   VERSION
homek3s-agent1    Ready    <none>                      27h   v1.24.3+k3s1
homek3s-agent2    Ready    <none>                      26h   v1.24.3+k3s1
homek3s-agent3    Ready    <none>                      26h   v1.24.3+k3s1
homek3s-server1   Ready    control-plane,etcd,master   28h   v1.24.3+k3s1
homek3s-server2   Ready    control-plane,etcd,master   27h   v1.24.3+k3s1
homek3s-server3   Ready    control-plane,etcd,master   27h   v1.24.3+k3s1
```

可以看到，我们以及通过K3S部署了一个3+3的高可用Kubernetes集群。  

![k3s-lens](../images/k3s-lens.png)  

## 部署应用  

成功启动一个K3S集群，除了Kubernetes必要的组件之外，还自动为集群部署以下组件  

- Flennel作为CNI插件  
- rancher-local-path 作为默认的存储类插件  
- [Traefik](https://traefik.io) 作为 Ingress 控制器  
- [kipper Load Balancer](https://github.com/k3s-io/klipper-lb) 作为服务的负载均均衡控制器  

Traefik的Load Balancer类型的服务就直接通过每个节点的 80 和 443 端口暴露了  

```bash
❯ k get svc -n kube-system
traefik          LoadBalancer   10.43.66.163   192.168.0.150,192.168.0.151,192.168.0.152,192.168.0.154,192.168.0.155,192.168.0.156   80:30833/TCP,443:32747/TCP   28h
```

因此，我们可以直接创建应用，并通过Ingress向外暴露服务，这里我们创建一个简单的Web服务，也就是 [Docker的教程](https://hub.docker.com/r/docker/getting-started)，创建如下资源文件 `docker-tour.yaml`    

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    com.docker.project: tutorial
  name: tutorial
spec:
  replicas: 1
  selector:
    matchLabels:
      com.docker.project: tutorial
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        com.docker.project: tutorial
    spec:
      containers:
        - image: docker/getting-started
          name: tutorial
          ports:
            - containerPort: 80
              protocol: TCP
          resources: {}
      restartPolicy: Always
---
apiVersion: v1
kind: Service
metadata:
  name: tutorial
spec:
  ports:
    - name: 80-tcp
      port: 80
      protocol: TCP
      targetPort: 80
  selector:
    com.docker.project: tutorial
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tutorial
  labels:
    com.docker.project: tutorial
spec:
  #  ingressClassName: contour
  rules:
    - host: "tour.homek3s.lan"
      http:
        paths:
        - pathType: Prefix
          path: "/"
          backend:
            service:
              name: tutorial
              port:
                number: 80
```

然后执行  

```bash
❯ kubectl apply -f docker-tour.yaml
```

在你的内部DNS服务器，或者 `/etc/hosts` 中配置域名解析，将 `tour.homek3s.lan` 解析到任何一个节点的IP地址，如  

```hosts
192.168.0.150   tour.homek3s.lan
```

通过浏览器访问 https://tour.homek3s.lan/ ，将打开部署的应用。  

![k3s-tour-access](https://pics.mengz.dev/upload/2023/05/07/20230507113655-27096950.png)  

## 总结

这里演示了如果通过K3S部署一个高可用的Kubernetes集群，使用k3s内置etcd的方式作为入门，k3s还支持使用外部的数据存储以及其他更多的部署选项，可参考[官方文档](https://rancher.com/docs/k3s/latest/en/)。K3s作为一个轻量级的kubernetes版本，以了单一的二进制文件 - k3s进行分发，可以快速部署开发测试，以及边缘生产级别的集群。  
后期将会继续探索另一款开源的轻量级Kubeernets版本 - [K0S](https://k0sproject.io)。  
