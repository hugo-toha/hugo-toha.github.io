---
title: "扩展你的KUBECTL功能"
date: 2022-07-04T15:37:12+08:00
description: "介绍kubectl的插件来增强kubectl命令行工具的功能"
categories: ["Kubernetes"]
hero: "krew-banner.png"
tags: ["kubernetes", "kubectl"]
menu:
  sidebar:
    name: "扩展你的KUBECTL功能"
    identifier: kubectl-plugins
    parent: k8s
    weight: 10
---

随着 [Kubernetes](https://kubernetes.io) 成为主流的应用容器编排平台，其命令行客户端 `kubectl` 也成为了我们日常部署应用，维护集群最常用的工具。  
`kubectl` 自身提供了强大的内置自命令来满足我们对集群的操作，例如 `get` 获取集群内的资源对象，`proxy` 创建代理之类的，除了内置的这些自命令，`kubectl` 还提供了可扩展的能力，允许我们安装自己编写或者社区提供的插件来增强我们使用 `kubectl` 的生产力。  

<!-- more -->  

这里将给大家介绍如何在安装 `kubectl` 扩展插件，以及几款我在日常工作中常用到的社区提供的插件。  

在安装和使用 `kubectl` 插件的之前，请确保以及安装和配置好 `kubectl` 命令行工具和 `git` 工具。  

## krew

首先介绍的第一款扩展插件就是 **krew** - k8s特别兴趣小组开发的一款用于安装和管理 `kubectl` 扩展插件的插件。  

代码： https://github.com/kubernetes-sigs/krew  

安装 **krew** (在macOS/Linux上):  

1. 在终端执行（Bash或者Zsh）执行  
```bash
(
  set -x; cd "$(mktemp -d)" &&
  OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
  ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
  KREW="krew-${OS}_${ARCH}" &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
  tar zxvf "${KREW}.tar.gz" &&
  ./"${KREW}" install krew
)
```  

2. 将 *$HOME/.krew/bin* 加入到 **PATH** 环境变量，更新你的 *.bashrc* 或者 *.zshrc* 文件，添加下面一行  
```bash
export PATH="${KREW_ROOT:-$HOME/.brew}/bin:$PATH"
```

然后重启你的终端。  

3. 测试 **krew** 已经安装成功  
```bash
❯ k krew version
OPTION            VALUE
GitTag            v0.4.3
GitCommit         dbfefa5
IndexURI          https://github.com/kubernetes-sigs/krew-index.git
BasePath          /home/mengz/.krew
IndexPath         /home/mengz/.krew/index/default
InstallPath       /home/mengz/.krew/store
BinPath           /home/mengz/.krew/bin
DetectedPlatform  linux/amd64
```

4. （可选）设置 krew 别名  
```bash
alias krew='kubectl-krew'
echo "alias krew='kubectl-krew'" >> ~/.alias
```

这样就安装完成了，**krew** 是 `kubectl` 插件管理器，而 `krew` 自己又是插件，所以之后可以使用 `krew` 来更新 `krew`。  

在 Windows 上安装，请参考 https://krew.sigs.k8s.io/docs/user-guide/setup/install/ 。  

使用示例  

- 列出当前已安装的插件  
```bash
❯ krew list
PLUGIN            VERSION
krew              v0.4.3
```

- 安装插件（下面介绍的其他插件将使用这个方式安装）  
```bash
❯ krew install [插件名]
```

- 更新本地插件索引（查看是否有插件更新）  
```bash
❯ krew update
Updated the local copy of plugin index.
  New plugins available:
    * liqo
    * switch-config
  Upgrades available for installed plugins:
    * open-svc v2.5.2 -> v2.5.3
    * rbac-tool v1.7.1 -> v1.8.0
    * rolesum v1.5.1 -> v1.5.5
```

- 升级插件  
```bash
❯ krew upgrade open-svc
Updated the local copy of plugin index.
Upgrading plugin: open-svc
```

- 删除插件  
```
❯ krew uninstall [插件名]
```

[krew-index](https://krew.sigs.k8s.io/plugins/) 里维护了上百款可通过 krew 直接安装的插件。接下来将介绍其他几款我日常使用的 `kubectl` 插件。  

## example

代码： https://github.com/seredot/kubectl-example

安装 `krew install example`

`example` 插件可用于快速生成k8s资源对象的yaml文件示例，例如  
```bash
❯ k example deploy
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
          ports:
            - containerPort: 80
```

当我们想临时通过资源声明文件不熟应用的时候，可以使用该插件来生成模板。  

## fleet

代码： https://github.com/kubectl-plus/kcf

安装： `krew install fleet`

`fleet` 插件可快速查看当前配置的集群的概览  

```bash
❯ k fleet
CLUSTER                                    VERSION         NODES NAMESPACES PROVIDER   API
homek8sc1                                  v1.23.8         3/3   4          ?          https://k8sc1.mengz.lan:6443
api-sandbox-x8i5-p1-openshiftapps-com:6443 v1.23.5+9ce5071 ?     ?          ?          https://api.sandbox.x8i5.p1.openshiftapps.com:6443
minikube                                   v1.22.3         1/1   4          minikube   https://192.168.64.3:8443
```

## get-all

代码： https://github.com/corneliusweig/ketall

安装： `krew install get-all`

`get-all` 插件获取集群（或者某一个名字空间）的所有资源对象  

```bash
❯ k get-all -n kube-system
NAME                                                                                     NAMESPACE    AGE
configmap/calico-config                                                                  kube-system  13d  
configmap/coredns                                                                        kube-system  13d  
configmap/extension-apiserver-authentication                                             kube-system  13d  
configmap/kube-proxy                                                                     kube-system  13d  
configmap/kube-root-ca.crt                                                               kube-system  13d  
configmap/kubeadm-config                                                                 kube-system  13d  
configmap/kubelet-config-1.23                                                            kube-system  13d  
endpoints/kube-dns                                                                       kube-system  13d
...
```

## htpasswd

代码： https://github.com/shibumi/kubectl-htpasswd

安装： `krew install htpasswd`

`htpasswd` 是 nginx-ingress 兼容的基础认证密码生成器

```bash
❯ k htpasswd create aaa-basic-auth user1=user1password user2=user2password -o yaml --dry-run
apiVersion: v1
data:
  auth: dXNlcjE6JDJhJDEwJDVNeEJGT3lEUEJYT0xkUldlblNWME91RGtZTzFQOElJNXJuRnh5blpUdC55L2FUUUNDYzJ1CnVzZXIyOiQyYSQxMCRVbFdHOG5NTU4zRGVpOC5GMmVRM3EuYWhxTENYZGtLYUJ1cXZzT3lEOGl0ODJRdU4zV1c1dQ==
kind: Secret
metadata:
  creationTimestamp: null
  name: aaa-basic-auth
  namespace: default
type: Opaque
```

该插件在为服务创建基础认证的 Ingress 很方便。  

## images

代码： https://github.com/chenjiandongx/kubectl-images

安装： `krew install images` 

`images` 现实名字空间中使用的容器镜像信息  

```bash
❯ k images
[Summary]: 1 namespaces, 2 pods, 2 containers and 1 different images
+------------------------+---------------+-------------------+
|        PodName         | ContainerName |  ContainerImage   |
+------------------------+---------------+-------------------+
| webapp-98f7444c5-8772w | nginx         | nginx:1.21-alpine |
+------------------------+               +                   +
| webapp-98f7444c5-vsxr9 |               |                   |
+------------------------+---------------+-------------------+
```

## ktop

代码： https://github.com/vladimirvivien/ktop

安装： `krew install ktop`  

`ktop` 插件是以类似 Linux Top 工具的方式来插件k8s集群的负载情况  

```bash
❯ k ktop
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
│   API server: https://k8sc1.mengz.lan:6443 Version: v1.23.8 context: admin@homek8sc1 User: kubernetes-admin namespace: (all)  metrics: not connected                            v0.3.0  
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
╔ 🌡 Cluster Summary ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═
║ ptime: 13d   Nodes: 3   Namespaces: 4    Pods: 15/15 (20 imgs)     Deployments: 5/5    Sets: replicas 5, daemons 6, stateful 0      Jobs: 0 (cron: 0)    PVs: 0 (0Gi) PVCs: 0 (0Gi)     
║ PU: [|||||||||||                             ] 1600m/6000m (26.7% requested)               Memory: [||                                      ] 1Gi/11Gi (2.5% requested)                 
╚ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═
┌ 🏭 Nodes (3) ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  
│   NAME                STATUS   AGE   VERSION   INT/EXT IPs            OS/ARC                      PODS/IMGs    DISK    CPU                               MEM                            
│   homek8sc1-control   Ready    13d   v1.23.8   192.168.0.140/<none>   Ubuntu 20.04.4 LTS/amd64    9/10         16Gi    [||||||    ] 1100m/2000m (55%)    [||        ] 1Gi/2Gi (13%)     
│   homek8sc1-worker1   Ready    13d   v1.23.8   192.168.0.141/<none>   Ubuntu 20.04.4 LTS/amd64    3/5          16Gi    [||        ] 250m/2000m (12%)     [          ] 0Gi/5Gi (0%)      
│   homek8sc1-worker2   Ready    13d   v1.23.8   192.168.0.142/<none>   Ubuntu 20.04.4 LTS/amd64    3/5          16Gi    [||        ] 250m/2000m (12%)     [          ] 0Gi/5Gi (0%)      
│                                                                                                                                                                                         
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
┌ 📦 Pods (15) ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── 
│ AMESPACE    POD                                        READY   STATUS    RESTARTS   AGE   VOLS   IP              NODE                CPU                       MEMORY                   
│ ube-system  kube-controller-manager-homek8sc1-control  1/1     Running   1          13d   8/8    192.168.0.140   homek8sc1-control   [|         ] 200m 10.0%   [          ] 0Gi 0.0%    
│ ube-system  kube-proxy-4c9nq                           1/1     Running   2          13d   4/4    192.168.0.141   homek8sc1-worker1   [          ] 0m 0.0%      [          ] 0Gi 0.0%    
│ ube-system  kube-proxy-4whcn                           1/1     Running   1          13d   4/4    192.168.0.140   homek8sc1-control   [          ] 0m 0.0%      [          ] 0Gi 0.0%    
│ ube-system  kube-proxy-bz8lt                           1/1     Running   3          13d   4/4    192.168.0.142   homek8sc1-worker2   [          ] 0m 0.0%      [          ] 0Gi 0.0%    
│ ube-system  kube-scheduler-homek8sc1-control           1/1     Running   1          13d   1/1    192.168.0.140   homek8sc1-control   [|         ] 100m 5.0%    [          ] 0Gi 0.0%    
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
```

## 总结  

[krew-index](https://krew.sigs.k8s.io/plugins/) 里包含了大量功能强大的扩展插件，涵盖了 RBAC 管理，资源管理等功能，这里没法意义列出。不过有了 `krew` ，我们可以很方便的安装需要的扩展，以在日常工作中提高我们管理k8s集群的的生产力。  

> 参考  
> - https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/
> - https://krew.sigs.k8s.io/docs/user-guide/quickstart/