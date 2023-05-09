---
title: "查看硬件信息"
description:  "一篇关于如何通过Linux命令查看系统硬件信息的文章"
date: 2010-11-19T21:33:20+0800
categories: ["Linux"]
hero: linux-hardware.jpg
tags: ["linux", "hardware"]
menu:
  sidebar:
    name: "查看硬件信息"
    identifier: what-hardwre
    parent: linux
    weight: 10
---

通常，你也许不需要知道你使用了什么样的硬件 — 你也许拥有的是一台来自比较小一点公司的组装机或者一台二手机。本月，我将介绍你可以用来查看你安装的硬件的工具。 第一步，使用[*lshw*][lshw_link] — 列举硬件工具。如果你使用普通用户执行，它会警告你需要使用**root**执行。因此，以*sudo lshw*执行。你将可以看到屏幕上显示你系统的信息。第一段将是常规信息，看起来就像下面这样：   

> jbernard-eeepc   
> &nbsp;description: Notebook   
> &nbsp;product: 700   
> &nbsp;vendor: ASUSTeK Computer INC.   
> &nbsp;version: 0129   
> &nbsp;serial: EeePC-1234567890   
> &nbsp;width: 32 bits   
> &nbsp;capabilities: smbios-2.5 dmi-2.5 smp-1.4 smp   
> &nbsp;configuration: boot=normal chassis=notebook   
> &nbsp;cpus=1 uuid=XXXXXX-XXXXX-XXXXX-XXXXX   

这是我在我的ASUS EeePC执行的结果。你可以看到生产商是ASUSTeK, BIOS的版本是0129， 以及这是一台32位的单一CPU机器。更多的信息以下面的分类来说明：   

> core   
> &nbsp;firmware - motherboard and BIOS information   
> &nbsp;cpu - CPU information   
> &nbsp;&nbsp;cache - cache information   
> &nbsp;memory - memory information   
> &nbsp;&nbsp;bank - specific bank memory information   
> &nbsp;pci - PCI bus information   
> &nbsp;&nbsp;display - PCI display adapter   
> &nbsp;&nbsp;multimedia - PCI audio adapter   
> &nbsp;&nbsp;pci - other PCI devices   
> &nbsp;&nbsp;network - PCI network adapter   
> &nbsp;usb - USB devices   
> &nbsp;ide - IDE information   
> &nbsp;&nbsp;disk - individual disks   
> &nbsp;&nbsp;volume - volumes on this disk   

对于多少信息可用的想法，以下内存段显示了我的EeePC的内存信息：  

> \*-memory   
> &nbsp;description: System Memory   
> &nbsp;physical id: 1f     
> &nbsp;slot: System board or motherboard   
> &nbsp;size: 512MiB   
> &nbsp;\*-bank   
> &nbsp;&nbsp;description: DIMM DDR2 Synchronous 400 MHz (2.5 ns)   
> &nbsp;&nbsp;product: PartNum0   
> &nbsp;&nbsp;vendor: Manufacturer0   
> &nbsp;&nbsp;physical id: 0   
> &nbsp;&nbsp;serial: SerNum0   
> &nbsp;&nbsp;slot: DIMM0   
> &nbsp;&nbsp;size: 512MiB   
> &nbsp;&nbsp;width: 64 bits   
> &nbsp;&nbsp;clock: 400MHz (2.5ns)   

这是一个基本的集中成一个命令的工具，执行一次，它可以得到系统的所有信息。但是，如果你只想知道指定子系统的信息，怎么办呢？其实是有一整套的工具的，当你需要一些指定的信息或者想在一个脚本做一些系统查询时，这些工具将更有用。
你也许只想看看CPU，[*lscpu*][lscpu_link]工具提供了类似如下的输出：   

> Architecture:          i686   
> CPU op-mode(s):        32-bit   
> CPU(s):                1   
> Thread(s) per core:    1   
> Core(s) per socket:    1   
> CPU socket(s):         1   
> Vendor ID:             GenuineIntel   
> CPU family:            6   
> Model:                 13   
> Stepping:              8   
> CPU MHz:               571.427   

你可以从中看出生产厂家，是否是32位还是64位的，准确的版本和型号，以及当前CPU频率。 如果你想知道你的显卡是否被X11支持，或者你是否需要第三方驱动，你可以使用[*lspci*][lspci_link]。该工具给出了所有插在你的PCI总线的设备的信息。输出类似下面：  

> 00:02.0 VGA compatible controller: Intel Corporation   
> &nbsp;Mobile 915GM/GMS/910GML Express Graphics Controller (rev 04)   
> 00:02.1 Display controller: Intel Corporation   
> &nbsp;Mobile 915GM/GMS/910GML Express Graphics Controller (rev 04)   

这个信息显示了在我的EeePC上的显卡控制器是一个Intel控制器。因此，如果你想，你现在就可以到Google搜索关于你的显卡的信息以及怎样最大限度的配置它。如果你想看看你系统上的USB设备，那么可以使用[*lsusb*][lsusb_link]。在我的EeePC上，拥有一个SD卡，显示如下：
> Bus 001 Device 002: ID 0951:1606 Kingston Technology   

如果你对硬盘子系统感兴趣，你可以使用[*blkid*][blkid_link]工具来查看。该工具打印出所有可用的文件系统，类似如下的输出：  

> /dev/sda1: UUID="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" TYPE="ext2"   
> /dev/sda2: UUID="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" TYPE="swap"   
> /dev/sda3: UUID="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" TYPE="ext2"   
> /dev/sdb1: UUID="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" TYPE="ext2"   

用这个工具，你可以了解到什么设备可用以及什么文件系统正用在它们上面。如果你想在*/etc/fstab*里的条目使用UUID，那相关联的UUID是可用的。

现在你知道你的系统使用了什么样的硬件，最后需要检查的是看看是否你的内核实际上正在使用可用硬件。在大部分现在的发行版本中，内核是被编译来使用模块的。你可以使用[*lsmod*][lsmod_link]命令来查看哪个模块被加载了。你将得到像下面的一个别表：  

> agpgart&nbsp;&nbsp;31788  2 drm,intel_agp   
> lp&nbsp;&nbsp;7028  0   
> video&nbsp;&nbsp;17375  1 i915   
> output&nbsp;&nbsp;1871  1 video   

你可以看到agpgart模块拥有31788字节的大小，以及被drm和intel\_agp模块使用。

现在，希望你可以配置和优化你的硬件，使你最大的使用它们。如果你发现有其他的工具这里没有提到，我很愿意得知它们。

[orignal_article_link]: http://www.linuxjournal.com/content/what-hardware-do-i-have
[lshw_link]: http://linux.die.net/man/1/lshw
[lscpu_link]: http://www.unix.com/man-page/Linux/1/lscpu/
[lspci_link]: http://linux.die.net/man/8/lspci
[lsusb_link]: http://linux.die.net/man/8/lsusb
[blkid_link]: http://linux.die.net/man/8/blkid
[lsmod_link]: http://linux.die.net/man/8/lsmod