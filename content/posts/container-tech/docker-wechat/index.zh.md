---
title: "DOCKER运行微信桌面客户端"
description: "文本演示如何使用Docker容器的方式在openSUSE系统上运行微信客户端"
date: 2020-02-25T13:36:58+08:00
categories: ["Container"]
hero: docker-wechat.webp
tags: ["docker", "wechat", "opensuse"]
menu:
  sidebar:
    name: "DOCKER运行微信桌面客户端"
    identifier: docker-wechat
    parent: container-tech
    weight: 10
---

今天借助[Github](https://github.com)用户[huan](https://github.com/huan)的[盒装微信](https://github.com/huan/docker-wechat)项目，在我的openSUSE Leap系统上使用[Docker](https://docker.com)成功地运行封装的Windows上的微信客户端。  

<!-- more -->

## 安装Docker

在Linux系统上安装Docker引擎是很容器的，请参考[Docker入门](../docker-intro/)，如果你也使用的是[openSUSE Leap](https://www.opensuse.org)，执行如下命令安装Docker引擎:  

```bash
$ sudo zypper ref
$ sudo zypper in docker
```

## 启动微信客户端

**注意**： 在启动之前，需要设置主机系统的X服务的访问控制，使用如下的命令禁用主机上X服务的访问控制，允许所有客户端链接服务：  

```bash
$ xhost +
```

关于[xhost]的更多信息，可参考(https://www.computerhope.com/unix/xhost.htm)。

[huan/docker-wechat](https://github.com/huan/docker-wechat)提供了一个启动脚本`dochat.sh`来执行容器镜像的下载，以及启动，可直接执行如下操作：  

```bash
$ curl -sL https://raw.githubusercontent.com/huan/docker-wechat/master/dochat.sh | bash
```

当然也可以克隆Git代码库，然后执行`dochat.sh`脚本。  

成功启动后如下图所示，使用手机扫描登录。  

![Wechat-Login](https://images.mengz.dev/posts/wechat-login.png)  

## 使用Docker Compose启动

`dochat.sh`是直接使用了`docker run`命令启动容器，也可以编写一个compose文件来使用`docker-compose`管理应用容器。例如我在目录 _~/dockerapp/_ 下创建了一个 _dochat.yml_ 文件。  

```yml
version: '2.4'

services:
  dochat:
    image: zixia/wechat
    container_name: dockerapps_dochat
    network_mode: bridge
    devices:
      - "/dev/video0:/dev/video0"
      - "/dev/snd:/dev/snd"
    volumes:
      - "/etc/localtime:/etc/localtime:ro"
      - "$HOME/.dochat/appdata:/home/user/.wine/drive_c/user/Application Data/"
      - "$HOME/.dochat/wechatfiles:/home/user/WeChat Files/"
      - "/tmp/.X11-unix:/tmp/.X11-unix"
    environment:
      - "DISPLAY=unix$DISPLAY"
      - "XMODIFIERS=@im=fcitx"
      - "GTK_IM_MODULE=fcitx"
      - "QT_IM_MODULE=fcitx"
      - "AUDIO_GID=492"
      - "VIDEO_GID=484"
      - "GID=100"
      - "UID=1000"
      - "DOCHAT_DEBUG=true"
    ipc: host
    privileged: true
```

首次启动时使用命令`docker-compose -f ~/dockerapp/dochat.yml up -d`，在关闭应用之后，再次启动时使用`docker-compose -f ~/dockerapp/dochat.yml start`。  

也可以创建一个桌面快捷方式，编写一个Desktop文件放在桌面文件夹下 _~/desktop/dochat.desktop_ :  

```desktop
[Desktop Entry]
Categories=Network;Utility;Chat;
Comment[en_US]=Docker run windows wechat client on Linux.
Comment=Docker run windows wechat client on Linux.
Exec=/usr/local/bin/docker-compose -f /home/mengz/dockerapp/dochat.yml start
GenericName[en_US]=
GenericName=
Icon=/home/mengz/dockerapp/dochat.png
MimeType=
Name=Docker WeChat
Path=
StartupNotify=true
Terminal=false
TerminalOptions=
Type=Application
X-DBUS-ServiceName=
X-DBUS-StartupType=
X-KDE-SubstituteUID=false
X-KDE-Username=
```

这样在桌面双击快捷方式就可以启动微信了，是不是很棒！  

## 补充

如果不想使用Docker来运行封装的Windows版本的微信桌面客户端，这里也可以推荐你使用一个用Electronic封装的Web版本微信客户端[geeeeeeeeek/electronic-wechat](https://github.com/geeeeeeeeek/electronic-wechat)。  
