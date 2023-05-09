---
title: "升级OPENSUSE LEAP"
description: "如何在线升级openSUSE"
date: 2022-01-15T10:04:00+08:00
categories: ["Linux"]
hero: opensuse-upgrade.jpg
tags: ["opensuse"]
menu:
  sidebar:
    name: "升级OPENSUSE LEAP"
    identifier: opensuse-upgrade
    parent: linux
    weight: 10
---

openSUSE Leap 15.2自2022年1月4日起已结束生命周（EOL），还在使用该系统的用户未来将不会再收到任何形式的安全与维护更新。  
建议所有用户尽快将系统升级到 - openSUSE Leap 15.3，该系统将获得安全补丁和更新直至2022年11月。下一个版本openSUSE Leap 15.4也将预计在2022年6月发布。  

喜欢滚动更新版的的朋友，也可以借此机会从Leap版本切换到Tumbleweed版本。  

openSUSE Leap的版本升级可以通过联网在线升级，也可以通过下载最新版本的ISO文件进行线下升级，这里面我们将看看如何在线升级。  

## openSUSE Leap在线升级

使用在线升级的方式有如下优势：  

- 只需要下载需要更新的软件包，将节省不少带宽  
- 在升级期间，虽然不推荐，但是你任然可以使用系统，只有在升级完成后需要重新启动  
- 因为不需要下载ISO镜像文件，所以不需要DVD驱动器或者刻录USB启动盘，需要的仅仅是网络  

当然在线升级也有如下缺点：  

- 如果由于某些原因，导致升级过程被中断（例如突然断电，网络连接断开），升级进程无法继续，这有可能会留下一个被破坏的系统  
- 如果有多个系统需要升级，那么下载ISO镜像可能会更省带宽  
  
**注意**，如果你使用的是更旧的Leap版本，例如 15.1，请先升级到15.2之后，再升级到15.3 。  

你可以使用如下命令查看当前版本  

```shell
> lsb_release -d
Description:     openSUSE Leap 15.2
```

虽然正常的升级不会导致用户数据的丢失，但是为了安全，建议在升级之前备份自己重要的个人数据。  

### 升级系统之前的准备

#### 首先检查更新源是否存在并更新当前发行版本的软件包

```shell
# zypper repos --uri
...
29 | repo-update                   | 主更新源                                                                              | Yes     | (  ) No   | No      | https://mirrors.tuna.tsinghua.edu.cn/opensuse/update/leap/15.2/oss/
30 | repo-update-non-oss           | 主更新源（非开源软件)                                                                 | Yes     | (  ) No   | No      | https://mirrors.tuna.tsinghua.edu.cn/opensuse/update/leap/15.2/non-oss/
...
```

这里我使用了清华大学的镜像源（https://mirrors.tuna.tsinghua.edu.cn/）
如果上面一样已经存在更新源，则进行下一步；如果没有更新源，请添加  

```shell
# zypper addrepo --check --refresh --name 'openSUSE-Leap-15.2-Update' http://download.opensuse.org/update/leap/15.2/oss/ repo-update
```

#### 将 /var/cache 移动到一个独立子卷（subvolume）

**注意**，如果你系统的根文件系统不是 *Btrfs* 的类型，则可以跳过这一步

- 查找根文件系统的设备名  
```shell
# df /
Filesystem     1K-blocks     Used Available Use% Mounted on
/dev/sdb3       62914560 37723280  24393296  61% /
```

- 确定所有其他子卷的父卷  
```shell
# btrfs subvolume list /
```
一般来说应该是 **@**   

- 挂在指定子卷到临时挂载点  
```shell
# mount /dev/sdb3 -o subvol=@ /mnt
```

- 为了避免数据丢失，备份下缓存  
```shell
# mv /mnt/var/cache /mnt/var/cache.old
```

- 创建一个新的子卷，并将缓存移回
```shell
# btrfs subvol create /mnt/var/cache

# mv /mnt/var/cache.old/* /mnt/var/cache/
# rm -rf /mnt/var/cache.old
```

- 卸载临时挂载点，然后将新的缓存子卷添加到 /etc/fstab  
```shell
# umount /mnt
```
添加以下条目到 */etc/fstab*  

```
UUID=4f648797-078d-426f-b103-51d9a73dd937       /var/cache    btrfs   subvol=/@/var/cache   0       0
```
这里的UUID应该是和根文件系统的一样。  

```shell
# mount /var/cache
```

#### 将当前系统的包更新到最新

```shell
# zypper ref

# zypper update
```

### 执行发行版升级 -> 15.3

- 更新软件源版本

```shell
# sed -i 's/15.2/${releasever}/g' /etc/zypper/repos.d/*.repo
```

- 刷新所有软件源

```shell
# zypper --releasever=15.3 ref
```

如果在此期间，发现某些自己添加OBS软件源不可用的话，可以先Disable掉。  

- 最后就是执行发行版的版本升级  

```shell
# zypper --releasever15.3 dup
```

你可能会被询问一些软件包提供商的更改，因为之前我们可能使用其他软件源安装了比较新版本的软件包，我们只需要选择相应选项就可以，最后会得到如下提示  

```
The following NEW product is going to be installed:
  "openSUSE Leap 15.3"

The following product is going to be REMOVED:
  "openSUSE Leap 15.2"

The following package requires a system reboot:
  kernel-preempt-5.3.18-59.10.1

2732 packages to upgrade, 876 to downgrade, 394 new, 75 to remove, 2430  to change vendor.
Overall download size: 3.14 GiB. Already cached: 0 B. After the operation, 17.4 MiB will be freed.

    Note: System reboot required.
Continue? [y/n/v/...? shows all options] (y):
```

敲一个 'y' 然后回车，就开始了漫长的（却决于你的网络环境和使用的软件源镜像地址）下载和安装过程了，升级过程中你任然可以使用你的系统 ^_^ 。  

完成所有下载和安装之后，会要求你重启你的系统，关闭你的所有应用，然后重启你的系统，你将会得到一个新版本（Leap 15.3）的openSUSE系统。  

```shell
> lsb_release -d
Description:    openSUSE Leap 15.3
```

之后就可以继续添加你需要使用的OBS软件源（当然对应 15.3 版本）来安装其他软件包了。

## 总结

Leap发行版是openSUSE的常规发行版本，基本上12个月会进行一次小版本的更新，例如从 15.2 -> 15.3 -> 15.4; 每36-38个月会进行一次大版本的升级，例如 15.x -> 16.x 。  
openSUSE还发行了Tumbleweed版本，也就是滚动更新版本，其软件源提供了所有最新的软件包进行滚动升级。  
这里我们看到了如何升级一个Leap版本，过程不算复杂，总结来说就是更新软件源版本，然后通过 `zypper dup` 进行更新，我使用了openSUSE已经多年了，几乎都是每个版本这样升级上来的。  
说实话，在所有的Linux桌面发行版中，openSUSE不算流行，但是我的使用体验是非常稳定，配合KDE桌面环境，也是非常优雅漂亮的一款Linux发行版，希望喜欢Linux桌面用于办公的小伙伴来尝试。