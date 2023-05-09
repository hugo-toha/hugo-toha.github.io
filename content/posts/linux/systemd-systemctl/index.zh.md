---
title: "SYSTEMCTL管理系统服务"
description: "openSuSE上使用systemd作为系统初始化程序，其提供了systemctl命令来关系系统服务"
date: 2015-01-29T18:46:00+0800
categories: ["Linux"]
hero: systemd.webp
tags: ["systemd", "linux"]
menu:
  sidebar:
    name: "SYSTEMCTL管理系统服务"
    identifier: systemd-systemctl
    parent: linux
    weight: 10
---

这是我在使用[openSuSE][opensuse_link]过程中学习和使用[systemd][systemd_link]来管理系统的一些笔记。
首先那就让我们来先看看什么是systemd：

## Systemd

Systemd是Linux下的一个程序，用来初始化系统。像[SysV][sysv_wiki_link]一样，其将会被Linux内核启动。
在opneSuSE上，systemd将会是系统进程号为1的进程，其负责初始化系统和启动系统服务。

openSuSE从12.3版本开始，用systemd作为默认的系统初始化程序代替了SysV。
想了解systemd和SysV的对于，可以参看[这里][link_systemd_sysv]。
<!-- more -->

## 用sytemctl进行系统管理

systemd提供了[systemctl][link_man_systemctl]命令来进行系统服务管理，其调用格式如下：  

> systemctl [通用选项] *子命令* [子命令选项]

### 在系统上管理服务

像SysV一样，通过子命令start|stop|restart等来管理服务：  

> systemctl start|stop|status|restart|reload|... <服务名>.service

如查看当前cron服务的状态：  

> \# systemctl status cron.service
> cron.service - Command Scheduler
>   Loaded: loaded (/usr/lib/systemd/system/cron.service; enabled)
>   Active: active (running) since Mon 2015-01-26 15:50:21 CST; 3 days ago
> Main PID: 1247 (cron)
>   CGroup: /system.slice/cron.service
>           └─1247 /usr/sbin/cron -n

systemctl支持一次操作多个服务，只要在子命令后添加多个服务名即可。

使用enable|disable来设置开启自动启动或者不启动一个服务：  

> systemctl enable|disable <服务名>.service

### Systemd的启动目标

在SysV的启动系统上，用启动级别（runlevel）来表示系统的启动状态，已经哪些服务伴随这级别一起启动。
如 0 （关闭系统），3 （多用户带网络），5 （多用户带网络，显示图形用户界面）。

而在Systemd上，用目标（target）表示这个概念，如
graphical.target 提供了多用户带网，显示图像用户界面的启动目标，就相当与level 5。
systemd提供了很多内置的目标单元，可以用下面的命令查看：  

> \# systemctl list-unit-files --type=target

为了和SysV兼容，system提供了如下的启动目标：  

SysV的运行级别 | Systemd的启动目标 |描述   
:------------|:---------------|:----
0 | runlevel0.target, halt.target, poweroff.target | 关闭系统
1,S | runlevel1.target, rescue.target | 单用户模式
2 | runlevel2.target, multi-user.target | 多用户无网络模式
3 | runlevel3.target | 多用户带网络模式
4 | runlevel4.target | 未定义
5 | runlevel5.target, graphical.target | 图形模式
6 | runlevel6.target, reboot.target | 重启

### 用systemctl来操作目标

同样可以使用systemctl来操作启动目标，如更改当前目标：  

> systemctl isolate <目标名>.target

这类似在SysV上使用`telinit X`到某个运行级别。
登录到默认目标：  

> systemctl default

获取当前激活的目标：  

> systemctl list-units --type=target

显示某个目标的依赖：  

> systemctl show -p "Requires" <目标名>.target
> systemctl show -p "Wants" <目标名>.target

可以使用下面的方式来修改默认的启动目标：  

> ln -sf /lib/systemd/system/<目标名>.target /etc/systemd/system/default.target

这里只是简单地介绍了下systemd在系统管理的一些基本用法，systemd还有很多的高级应用，比如自定目标等等。
想了解更多关于systemd，请参考如下链接：  

http://www.freedesktop.org/wiki/Software/systemd
http://0pointer.de/blog/projects

最后在给一个命令`systemd-analyze plot`，其可以生成系统服务启动时间的一个SVG图，如：  

> systemd-analyze plot > startup-time.svg

![Startup-time](https://images.mengz.dev/posts/systemd-analyze.png)


[opensuse_link]: http://opensuse.org
[systemd_link]: http://www.freedesktop.org/wiki/Software/systemd/
[sysv_wiki_link]: http://zh.wikipedia.org/wiki/System_V
[link_systemd_sysv]: http://0pointer.de/blog/projects/why.html
[link_man_systemctl]: http://www.freedesktop.org/software/systemd/man/systemctl.html
