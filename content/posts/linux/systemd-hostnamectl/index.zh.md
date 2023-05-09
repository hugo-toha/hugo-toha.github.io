---
title: "HOSTNAMECTL管理主机名"
description: "介绍在 openSUSE 上使用基于 systemd 的 hostnamectl 来管理系统主机名"
date: 2015-05-17T13:35:00+0800
categories: ["Linux"]
hero: systemd-hostname.jpg
tags: ["systemd", "hostname", "opensuse"]
menu:
  sidebar:
    name: "HOSTNAMECTL管理主机名"
    identifier: systemd-hostnamectl
    parent: linux
    weight: 10
---

基于 [systemd][link_wiki_systemd] 的 Linux 系统中提供了一个新的名来 [hostnamectl][link_man_hnc] 来管理系统主机名。  
当然除了 `hostnamectl` 之外，还是可以通过原来的 [hostname][link_man_hostname] 命令以及修改 `/etc/HOSTNAME` 来修改主机名。不过使用 `hostnamectl` 更方便。  
<!-- more -->

## hostnamectl的语法

`hostnamectl [OPTIONS...] {COMMAND}`  

有如下 options :  

- --static,--transient,--pretty 如果用于 status 命令，static 显示当前的静态主机名; transient 显示临时的主机名，一般用于网络临时设置; pretty 显示良好阅读主机名，如"Sam's Computer"。  
- H, --host=<user@hostname> 用来操作远程主机。  

命令：

- **status** ： 显示当前系统主机名和相关信息，可以使用 --static, --transient, --pretty 仅显示指定内容。  
- **set-hostname** [NAME] ： 设置系统主机名，默认改变 pretty，static，及 transient 。 指定相应选项只改变相应主机名。  
- **set-icon-name** [NAME] ： 设置系统 Icon 名，用于一些图形应用来可视化主机。Icon 名需要符合 [Icon 名规范][link_icon_name]。  
- **set-chassis** [TYPE] ： 设置 chassis 类型，用于一些图形应用来可视化主机或者改变用户界面。当前设置以下类型："desktop"，"laptop"，"server"，"tablet"，"handset"，还有 "vm" 和 "container"。  

## 示例

1. 查看当前主机名及相关信息：  

  > $sudo hostnamectl status  
  >   Static hostname: mengz-dev.me  
  >         Icon name: computer-laptop  
  >           Chassis: laptop  
  >        Machine ID: 74fc18841ff54a7f8e09f6b58d4bad53  
  >           Boot ID: ee3d24a9c1db41cf8f2696aeea513009  
  >  Operating System: openSUSE 13.2 (Harlequin) (x86_64)  
  >       CPE OS Name: cpe:/o:opensuse:opensuse:13.2  
  >            Kernel: Linux 3.16.7-21-desktop  
  >      Architecture: x86-64  

2. 设置/改变静态主机名：  

  > $sudo hostnamectl set-hostname example-host.com  

总之，相比使用 `hostname` 和修改配置文件的方式，使用 `hostnamectl` 更方便。   

[link_wiki_systemd]: https://zh.wikipedia.org/wiki/Systemd  
[link_man_hnc]: http://www.freedesktop.org/software/systemd/man/hostnamectl.html  
[link_man_hostname]: http://linux.die.net/man/1/hostname  
[link_icon_name]: http://standards.freedesktop.org/icon-naming-spec/icon-naming-spec-latest.html
