---
title: "BUMBLEBEE禁用NVIDIA显卡"
description: "记录如何安装Bumblebee来禁止使用Nvidia的独立显卡"
date: 2015-11-25T01:13:00+0800
categories: ["Linux"]
hero: bumblebee-nvidia.webp
tags: ["opensuse", "nvidia", "linux"]
menu:
  sidebar:
    name: "BUMBLEBEE禁用NVIDIA显卡"
    identifier: bumblebee-nvidia
    parent: linux
    weight: 10
---

如今有很多笔记本电脑都配备了双显卡，一块集成的 [Intel][link_intel_site] 显卡，一块性能更好一些的 [NVIDIA][link_nvidia_site] 显卡。  
可是在平时的使用中可能根本用不上 NVIDIA 的那块显卡，那么为了使这样的笔记本电脑更省电，那么在平时的使用中可以禁用 NVIDIA 的显卡，而只使用集成的显卡。 [Bumblebee][link_bumblebee_site] 就是一个开源项目，在 Linux 上实现了 NVIDIA 的 Optimus 技术，在需要的时候使用 NVIDIA 的显卡。  

我的电脑是 Lenovo ThinkPad T440s ，配备了如下的两块显卡：  

```
1. 00:02.0 VGA compatible controller: Intel Corporation Haswell-ULT Integrated Graphics Controller (rev 09)  
2. VGA compatible controller: NVIDIA Corporation GK208M [GeForce GT 730M] (rev ff)  
```

而我使用的系统是 [openSUSE Leap 42.1][link_opensuse_42.1]，下面就看看如何在该系统上禁用 NVIDIA 的显卡。  

## 安装所需的软件包

首先添加如下安装源：  

> sudo zypper ar -r http://download.opensuse.org/repositories/X11:/Bumblebee/openSUSE_Leap_42.1/X11:Bumblebee.repo  

刷新后，安装如下软件包：  

> bumblebee nvidia-bumblebee bbswitch bbswitch-kmp-default  

如果你是64位系统，还请安装  

> nvidia-bumblebee-32bit  

之后还需要将用户添加入 bumblebee 和 video 两个组：  

> sudo usermod -a bumblebee username  
> sudo usermod -a video username

## 启动服务

安装完以上软件包之后，需要启动连个服务：  

> sudo systemctl enable bumblebeed  
> sudo systemctl enable dkms  

然后检查 */etc/modprobe.d/50-blacklist.conf* 文件，确保 **blacklist nouveau** 存在（除非你确定要使用 nouveau 驱动）。  之后  

> mkinitrd  

重启系统。

## 查看状态
重启之后，使用如下命令查看状态  

> optirun --status  

如果显示的结果是：  

> Bumblebee status: Ready (3.2.1). X inactive. Discrete video card is off.  

那么恭喜，你已经配置成功并且禁用了 NVIDIA 的显卡。 如果你想测试你的 NVIDIA 的显卡，可以运行如下命令：  

> optirun glxsheres  

这是将会启用 NVIDIA 显卡来运行该程序，所以如果你想使用 NVIDIA 的显卡来运行某个应用程序，请使用 **optirun** 命令。  

## 排除问题

如果你在 "optirun --status" 中得到的结果是：  

> Bumblebee status: Ready (3.2.1). X inactive. Discrete video card is on.  

那么首先检查文件 */etc/modprobe.d/50-bbswitch.conf* ，看是有如下内容：  

> options bbswitch load_state=0  

然后检查  

> sudo systemctl -l status bumblebeed  

看是否有类似如下的信息  

> /dev/dri/card0: failed to set DRM interface version 1.4: Permission denied

如果有，那么往文件 */etc/bumblebee/xorg.conf.nvidia* 里添加如下内容：  

```
Section "Screen"
    Identifier "Default Screen"
    Device "DiscreteNvidia"
EndSection
```  

然后重启该服务。  

在其次，检查  

> dmesg | grep -C 10 bbswitch  

看是否有类似如下内容：  

> ACPI Warning: \_SB_.PCI0.PEG_.VID_.\_DSM: Argument #4 type mismatch - Found [Buffer], ACPI requires [Package] (20150410/nsarguments-95)  

这样需要在启动内核参数添加  "acpi_osi=!Windows 2013" 后重启系统。  
如果想了解更多的情况，请查看考 Github 上的 [Bumblebee][link_github_bumblebee] 和 [bbswitch][link_github_bbswitch] 两个项目。  

[link_github_bbswitch]: https://github.com/Bumblebee-Project/bbswitch  
[link_github_bumblebee]: https://github.com/Bumblebee-Project/Bumblebee
[link_intel_site]: http://www.intel.cn
[link_nvidia_site]: http://www.nvidia.cn  
[link_bumblebee_site]: http://bumblebee-project.org/  
[link_opensuse_42.1]: https://www.opensuse.org/
