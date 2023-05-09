---
title: "在UBUNTU上删除旧的内核"
date: 2019-12-08T23:42:22+08:00
categories: ["Linux"]
hero: ubuntu-kernel.jpg
tags: ["ubuntu", "kernel"]
menu:
  sidebar:
    name: "在UBUNTU上删除旧的内核"
    identifier: ubuntu-old-kernel
    parent: linux
    weight: 10
---

在使用Ubuntu Linux系统时，经常发现在升级Linux内核之后，旧版本的内核包依旧保留在系统中，占据了一定的磁盘空间。系统并不会自动删除掉旧版本的内核，是因为保证在使用新内核无法启动时，还可以选择使用旧版本的内核来启动系统。因此在使用新版本内核启动成功之后，我们需要手动来删除掉一些旧版本的内核包，以释放一定的磁盘空间。那我们如何安全的删除旧版本的内核呢？  

## 删除旧的内核映像  

以下是在Ubunut上安全删除旧的Linux内核映像步骤，你不必须以`root`用户执行命令，或者使用`sudo`．　　

### 步骤一　- 启动到新的内核　　

首先启动到新安装的内核版本，可以使用如下的命令来验证当前内核版本：  

```
> uname -mrs
> uname -a
```

输出样例如下：  

> Linux 4.4.0-117-generic x86_64  

使用以下命令显示当前系统中已经安装的所有Linux内核映像：  

```
# dpkg --list | egrep -i --color 'linux-image|linux-headers'  
```

输出可能如下：  

```
ii  linux-headers-4.15.0-45               4.15.0-45.48                      all          Header files related to Linux kernel version 4.15.0
ii  linux-headers-4.15.0-45-generic       4.15.0-45.48                      amd64        Linux kernel headers for version 4.15.0 on 64 bit x86 SMP
ii  linux-headers-generic                 4.15.0.45.47                      amd64        Generic Linux kernel headers
ii  linux-image-4.15.0-45-generic         4.15.0-45.48                      amd64        Signed kernel image generic
ii  linux-image-generic                   4.15.0.45.47                      amd64        Generic Linux kernel image
rc  linux-headers-4.15.0-22               4.15.0-22.24                      all          Header files related to Linux kernel version 4.15.0
rc  linux-headers-4.15.0-22-generic       4.15.0-22.24                      amd64        Linux kernel headers for version 4.15.0 on 64 bit x86 SMP
rc  linux-headers-generic                 4.15.0.22.23                      amd64        Generic Linux kernel headers
rc  linux-image-4.15.0-22-generic         4.15.0-22.24                      amd64        Signed kernel image generic
rc  linux-image-generic                   4.15.0.22.23                      amd64        Generic Linux kernel image
```

### 步骤二　- 删除不想要或者不使用的内核映像

然后可以使用如下命令一个一个地删除掉旧的内核包：  

```
# apt-get --purge remove linux-image-4.15.0-22-generic
```

或者　　

```
$ sudo apt-get --purge remove linux-image-4.15.0-22-generic
```

## 对于较新的Ubunu发行版的提示

在较新的系统上，所有过期的内核和相关头文件包会自动标记为不再使用的状态，因此可以使用以下一条命令直接清除：  

```
$ sudo apt --purge autoremove  
```

## 直接使用一个脚本来删除　　

可以考虑使用如下的一个功夫脚本来清除旧的内核包：  

```bash
#!/usr/bin/env bash

v="$(uname -r | awk -F '-virtual' '{ print $1}')"
i="linux-headers-virtual|linux-image-virtual|linux-headers-${v}|linux-image-$(uname -r)"
apt-get --purge remove $(dpkg --list | egrep -i  'linux-image|linux-headers' | awk '/ii/{ print $2}' | egrep -v "$i")
```
