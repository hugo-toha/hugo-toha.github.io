---
title: "加载virtio驱动的Windows10安装镜像"
date: 2021-06-08T16:42:22+08:00
description: "本文描述了如何在Windows上创建加载了virtio驱动的iso安装镜像"
categories: ["Windows"]
hero: window10-virtio.jpg
tags: ["virtualization"]
menu:
  sidebar:
    name: "加载virtio驱动的Windows10安装镜像"
    identifier: windows10-virtio-image
    parent: windows
    weight: 10
---

如今虚拟化已经非常流行，当我们使用Linux桌面环境时，可以通过安装[libvirt](https://libvirt.org/)和[QEMU](https://www.qemu.org/)直接使用基于内核的虚拟化（KVM）来创建虚拟机并安装其他类型的操作系统。在基于Linux的服务器上，也可以通过[oVirt](https://https://www.ovirt.org/)或者[PVE](https://www.proxmox.com/)等基于KVM的虚拟化方案来实现虚拟机环境。  

<!-- more -->  

当我们想通过官方iso系统镜像安装比较新的Windows（例如Windows 10，Windows Server 2019等），在进入到选择安装磁盘，会发现找不到创建的虚拟磁盘，如下图所示  

![win10-no-driver](https://images.mengz.dev/posts/win10-no-driver.png)  

这是因为在官方的iso镜像中的Widnows未包含针对KVM的[virtio-win](https://github.com/virtio-win/kvm-guest-drivers-windows)驱动，因此我们可以基于Windows的iso镜像，加载virtio-win的相应驱动之后，重新创建一个包含了virtio-win驱动的iso镜像文件。  

关于virtio-win的更多信息，可以参考 https://www.linux-kvm.org/page/WindowsGuestDrivers/Download_Drivers 。  

## 前提条件

为了创建一个加载virtio-win驱动之后的iso镜像文件，我们需要以下准备：  

1. 具有管理员权限的Windows 10工作系统并安装[Windows ADK](https://go.microsoft.com/fwlink/?linkid=2120254)  
2. Windows 10的安装iso文件（这里以Windows 10作为例子）  
3. virtio-win驱动的iso文件 (https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/archive-virtio/virtio-win-0.1.196-1/virtio-win-0.1.196.iso)  
4. UltraISO工具  

## 准备工作

### 创建工作目录

假设在你的Windows 10系统上有D盘，那我们在D盘创建相应的工作目录，以管理员权限打开PowerShell，并执行  

```powershell
PS D:\> mkdir D:\mnt\windows_temp,D:\mnt\boot,D:\mnt\install,D:\virtio-win
```

### 提取Windows安装文件

使用UltraISO工具打开windows 10的iso文件，并将所有文件提取到目录 *D:\mnt\windows_temp\* 下  

![ultraiso-extra-win10](https://images.mengz.dev/posts/ultraiso-extra-win10.png)  

然后给Windows的镜像文件授权读写  

```ps
PS D:\> attrib -r C:\mnt\windows_temp\sources\*.wim /s
```

### 提取virtio驱动文件

使用UltraISO打开下载的virtio-win的iso文件，同样提取到目录 *D:\virtio-win\* 下，然后查看有哪些w10（针对windowns10）的驱动  

![virtio-w10-drivers](https://images.mengz.dev/posts/virtio-w10-drivers.png)  

我们可以看到在 **0.1.196** 版本中，包含了以下w10（64位）的驱动，为了方便后面一条命令加载所有驱动，我们把这些驱动重新放到一个目录下  

```ps
PS D:\> cd virtio-win\
PS D:\virtio-win\> mkdir w10
PS D:\virtio-win\> cp -r .\Balloon\w10\amd64\ .\w10\Balloon
PS D:\virtio-win\> cp -r .\NetKVM\w10\amd64\ .\w10\NetKVM
PS D:\virtio-win\> cp -r .\pvpanic\w10\amd64\ .\w10\pvpanic
PS D:\virtio-win\> cp -r .\qemufwcfg\w10\amd64\ .\w10\qemufwcfg
PS D:\virtio-win\> cp -r .\qemupciserial\w10\amd64\ .\w10\qemupciserial
PS D:\virtio-win\> cp -r .\qxldod\w10\amd64\ .\w10\qxldod
PS D:\virtio-win\> cp -r .\sriov\w10\amd64\ .\w10\sriov
PS D:\virtio-win\> cp -r .\viofs\w10\amd64\ .\w10\viofs
PS D:\virtio-win\> cp -r .\viogpudo\w10\amd64\ .\w10\viogpudo
PS D:\virtio-win\> cp -r .\vioinput\w10\amd64\ .\w10\vioinput
PS D:\virtio-win\> cp -r .\viorng\w10\amd64\ .\w10\viorng
PS D:\virtio-win\> cp -r .\vioscsi\w10\amd64\ .\w10\vioscsi
PS D:\virtio-win\> cp -r .\vioserial\w10\amd64\ .\w10\vioserial
PS D:\virtio-win\> cp -r .\viostor\w10\amd64\ .\w10\viostor
```

如果创建的是其他版本的Windows系统，例如Windows Server 2019，则提取对应目录（2k19/）下的驱动。  

## 加载virtio驱动

需要加载virtio驱动到Windows镜像文件 **boot.wim** 和 **install.wim** 。  

### 加载驱动到boot.wim  

挂载提取出来的 *D:\mnt\windows_temp\sources\boot.wim* 文件到目录 *D:\mnt\boot\* :  

先获取镜像文件的索引  

```ps
PS D:\> Get-WindowsImage -ImagePath D:\mnt\windows_temp\sources\boot.wim

ImageIndex       : 1
ImageName        : Microsoft Windows PE (x64)
ImageDescription : Microsoft Windows PE (x64)
ImageSize        : 1,657,563,910 bytes

ImageIndex       : 2
ImageName        : Microsoft Windows Setup (x64)
ImageDescription : Microsoft Windows Setup (x64)
ImageSize        : 1,809,575,703 bytes
```

然后挂载索引2  

```ps
PS D:\> Mount-WindowsImage -Path D:\mnt\boot\ -ImagePath D:\mnt\windows_temp\sources\boot.wim -Index 2

Path          : D:\mnt\boot\
Online        : False
RestartNeeded : False
```

接下来就是加载我们之前提取出来的驱动  

```ps
PS D:\> Add-WindowsDriver -Path D:\mnt\boot\ -Driver D:\virtio-win\w10\ -Recurse
```

可以使用下面的命令来查看驱动是否已经加载进去  

```ps
PS D:\> Get-WindowsDriver -Path D:\mnt\boot\
```

确定加载成功后，卸载镜像挂载并保存  

```ps
PS D:\> Dismount-WindowsImage -Path D:\mnt\boot\ -Save
```

### 加载驱动到install.wim

同样，首先查看 **install.wim** 镜像的索引（不同索引指定了同一iso文件里的版本）  

```ps
PS D:\> Get-WindowsImage -ImagePath D:\mnt\windows_temp\sources\install.wim

ImageIndex       : 1
ImageName        : Windows 10 教育版
ImageDescription : Windows 10 教育版
ImageSize        : 15,543,804,395 bytes

ImageIndex       : 2
ImageName        : Windows 10 企业版
ImageDescription : Windows 10 企业版
ImageSize        : 15,543,958,390 bytes

ImageIndex       : 3
ImageName        : Windows 10 专业版
ImageDescription : Windows 10 专业版
ImageSize        : 15,540,672,790 bytes

ImageIndex       : 4
ImageName        : Windows 10 专业教育版
ImageDescription : Windows 10 专业教育版
ImageSize        : 15,543,742,813 bytes

ImageIndex       : 5
ImageName        : Windows 10 专业工作站版
ImageDescription : Windows 10 专业工作站版
ImageSize        : 15,543,773,604 bytes
```

挂载想要加载驱动的版本，例如专业版  

```ps
PS D:\> Mount-WindowsImage -Path D:\mnt\install\ -ImagePath D:\mnt\windows_temp\sources\install.wim -Index 3

Path          : D:\mnt\install\
Online        : False
RestartNeeded ：False
```

然后加载驱动  

```ps
PS D:\> Add-WindowsDriver -Path D:\mnt\install\ -Driver D:\virtio-win\w10\ -Recurse
```

卸载保存  

```ps
PS D:\> Dismount-WindowsImage -Path D:\mnt\install\ -Save
```

同理，可以继续挂载其他索引（版本），执行以上操作，加载驱动，然后保存。  

## 创建新的iso镜像文件  

这里我们使用Windows ADK带的 **oscdimg** 工具来创建ISO文件，安装完[Windows ADK](https://go.microsoft.com/fwlink/?linkid=2120254)工具之后，进入目录 *C:\Program Files (x86)\Windows Kits\10\Assessment and Deployment Kit\Deployment Tools\amd64\Oscdimg\*  

```ps
PS D:\> cd 'C:\Program Files (x86)\Windows Kits\10\Assessment and Deployment Kit\Deployment Tools\amd64\Oscdimg'

PS C:\Program Files (x86)\Windows Kits\10\Assessment and Deployment Kit\Deployment Tools\amd64\Oscdimg> .\oscdimg.exe -lcn_windows_10_virtio -m -u2 -bD:\mnt\windows_temp\boot\etfsboot.com D:\mnt\windows_temp\ D:\ISOFiles\cn_windows_10_virtio_x64.iso
```

只想如上命令后，就会在目录 *D:\ISOFiles\* 目录下创建出一个名为 **cn_windows_10_virtio_x64.iso** 的文件。  

最后尝试使用新创建的iso文件来安装虚拟机系统，在选择选择磁盘驱动器时，我们就可以看到我们创建的虚拟磁盘了  

![win10-with-driver](https://images.mengz.dev/posts/win10-with-driver.png)  

接下来就可以正常安装了。

## 总结

本文以Windows 10的iso文件作为示例，演示了如何将virtio-win驱动加载进去，并且创建新的iso文件，使得在基于KVM的虚拟环境也可以顺利加载虚拟机磁盘进行Windows的安装。当然某些虚拟厂家也会直接提供相应的签名驱动，在安装过程中可以通过多增加一个虚拟CD驱动器来加载相应的驱动。  
