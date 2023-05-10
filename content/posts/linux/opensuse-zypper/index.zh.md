---
title: "OPENSUSE上的ZYPPER包管理器"
description: "在 SUSE 上使用 zypper 命令进行软件包管理的示例"
date: 2015-04-27T08:07:00+0800
categories: ["Linux"]
hero: opensuse-zypper.webp
tags: ["opensuse", "zypper"]
menu:
  sidebar:
    name: "OPENSUSE上的ZYPPER包管理器"
    identifier: opensuse-zypper
    parent: linux
    weight: 10
---

自己在使用 [opensuse][link_opensuse]，自己非常喜欢 opensuse 的包管理命令行工具 [zypper][link_zypper]。这里做一个笔记，也希望能看到这个篇文章的朋友能够快速地掌握 zypper 的用法。   

[CentOS][link_centos] 和 [Redhat][link_redhat] 使用的是 [yum][link_yum] 作为命令行的软件包管理工具。  
[Debian][link_debian] 和 [Ubuntu][link_ubuntu] 使用的是 [apt-get][link_aptget]。  

> 在 Debian/Ubuntu 上还有另一个软件包管理工具 - [aptitude][link_apatitude] 。  

同样，在 SUSE/opensuse Linux 上，`zypper` 就是其命令行的软件包管理工具。  
从高层次的角度，你可以使用 `zypper` 命令管理两种不同的东西：  

1. 管理软件包： 使用 `zypper` 来安装，删除，更新以及查询本地的或者远端媒体上的软件包。  
2. 管理软件源： 也可以使用 `zypper` 管理软件源信息，你可以在命令行添加，删除，打开或者关闭某个软件源。它还可以设置在安装过程中软件源的优先级。  

## I. 使用 `zypper` 管理软件包

### 1. 安装软件包

使用如下语法安装一个软件包：  

`zypper install <package name>`

如，执行一下命令来安装 [火狐浏览器][link_firefox] 和它的依赖：  

```bash
# zypper install MozillaFirefox  
Loading repository data...  
Reading installed packages...  
Resolving package dependencies...   
The following NEW packages are going to be installed:  
  MozillaFirefox MozillaFirefox-branding-SLED  
The following packages are not supported by their vendor:  
  MozillaFirefox MozillaFirefox-branding-SLED  
2 new packages to install.  
Overall download size: 964.0 KiB. After the operation, additional 3.4 MiB will be used.  
Continue? [y/n/?] (y): y  
Retrieving package MozillaFirefox-3.6.16-0.2.1.x86_64 (1/2), 949.0 KiB (3.4 MiB unpacked)  
Retrieving: MozillaFirefox-3.6.16-0.2.1.x86_64.rpm [done]  
Installing: MozillaFirefox-3.6.16-0.2.1 [done]  
Retrieving package MozillaFirefox-branding-SLED-3.5-1.1.5.x86_64 (2/2), 15.0 KiB (34.0 KiB unpacked)  
Retrieving: MozillaFirefox-branding-SLED-3.5-1.1.5.x86_64.rpm [done]  
Installing: MozillaFirefox-branding-SLED-3.5-1.1.5 [done]  
```

### 2. 安装源代码包

使用 `source-install` 选项来从软件源安装源代码包，如下：  

```bash
# zypper source-install apache2-mod_nss
Reading installed packages...
Loading repository data...
Resolving package dependencies...
Retrieving package mozilla-nss-devel-3.12.8-1.2.1.x86_64 (2/3), 473.0 KiB (2.6 MiB unpacked)
Retrieving: mozilla-nss-devel-3.12.8-1.2.1.x86_64.rpm [done]
Installing: mozilla-nss-devel-3.12.8-1.2.1 [done]
Retrieving: apache2-mod_nss-1.0.8-17.5.src.rpm [done]
```

### 3. 更新软件包

一旦安装了一个软件包，当有可用的新版本时，你可以使用更新命令来升级相应的软件包。  
下面的示例仅仅更新火狐浏览器软件包：  

`zypper update MozillaFirefox`  

而下面的示例将升级安装在系统上的所有可更新的软件包到其最新版本：  

`zypper update`

你也可以用下面的命令来查看所有的可用更新：  

`zypper list-updates`  

### 4. 系统发行版的升级

要在系统上执行完整的发行版升级，像下面一样使用 `dup` 选项：  

```bash
# zypper dup
Warning: You are about to do a distribution upgrade with all enabled repositories. Make sure these repositories are compatible before you continue. See 'man zypper' for more information about this command.
Loading repository data...
Reading installed packages...
Computing distribution upgrade...

The following NEW packages are going to be installed:
  drbd-xen libsoftokn3-32bit mozilla-nspr-32bit mozilla-nss-32bit mozilla-nss-certs-32bit suseRegister xen yast2-registration
  yast2-registration-branding-SLE
The following packages are going to be upgraded:
  libfreebl3-32bit libnsssharedhelper0 libnsssharedhelper0-32bit
The following packages are going to change vendor:
  libfreebl3-32bit           SUSE LINUX Products GmbH, Nuernberg, Germany -> openSUSE Build Service
  libnsssharedhelper0        SUSE LINUX Products GmbH, Nuernberg, Germany -> openSUSE Build Service
  libnsssharedhelper0-32bit  SUSE LINUX Products GmbH, Nuernberg, Germany -> openSUSE Build Service
```

### 5. 删除软件包

要删除软件包，使用 `remove` 命令选项，这也会删除掉所有的依赖。  

```bash
# zypper remove MozillaFirefox
Loading repository data...
Reading installed packages...
Resolving package dependencies...
The following packages are going to be REMOVED:
  MozillaFirefox MozillaFirefox-branding-SLED
2 packages to remove.
After the operation, 3.4 MiB will be freed.
Continue? [y/n/?] (y): y
Removing MozillaFirefox-branding-SLED-3.5-1.1.5 [done]
Removing MozillaFirefox-3.6.16-0.2.1 [done]
```

### 6. 搜索一个指定的软件包

要从软件源搜索一个软件包，使用下面的命令。你也可以在关键字中使用通配符。  
下面的示例将搜索所有以“usb”开头的软件包：  

```bash
# zypper search usb*
Loading repository data...
Reading installed packages...
S | Name           | Summary                                                        | Type
--+----------------+----------------------------------------------------------------+--------
  | usb_modeswitch | A mode switching tool for controlling multiple-device USB gear | package
i | usbutils       | Tools and libraries for USB devices                            | package
```

### 7. 查看软件包详细信息

使用 `info` 命令选项来显示一个软件包的详细信息，如：  

```bash
# zypper info usbutils
Loading repository data...
Reading installed packages...
Information for package usbutils:
Repository: @System
Name: usbutils
Version: 0.73-38.19
Arch: x86_64
Vendor: SUSE LINUX Products GmbH, Nuernberg, Germany
Support Level: unknown
Installed: Yes
Status: up-to-date
Installed Size: 461.0 KiB
Summary: Tools and libraries for USB devices
Description:
This package contains a utility for inspecting devices connected to USB
ports.
It requires kernel version 2.3.99-pre7 or newer, or the USB backport
which was introduced in 2.2.18 (supporting the /proc/bus/usb
interface).
```

### 8. 安装补丁

你可以使用 `zypper` 来安装补丁到你系统。  
首先，使用 `patches` 命令选项来查看所有可用的补丁：  

`zypper pathces`

然后，使用 `pathc` 命令选项来安装指定的补丁：  

`zypper patch <patch name>`  

### 9. 锁定指定软件包

包锁定阻止系统上的包被更改。一旦设置了锁，你不能删除，升级锁定的软件包。  
下面的示例展示了如何设置包锁定和在需要的时候移除锁。  
使用 `al` 命令选项来为一个软件包加锁，*al* 表示 “Add Lock”  

```bash
# zypper al ypbind
Specified lock has been successfully added.
```

要显示所有被锁定的软件包，使用 `ll` 命令选项，代表 “List Locks”。下面的命令输出说明 “ypbind” 软件包是锁定状态，你不能删除和升级该包。  

```bash
# zypper al ypbind
Specified lock has been successfully added.

# zypper ll
# | Name   | Type    | Repository
--+--------+---------+-----------
1 | ypbind | package | (any)
```

### 10. 移除包锁定

使用 `rl` 命令选项来移除对一个包的锁定，*rl* 代表 “Remove Lock”  

```bash
# zypper rl ypbind
Loading repository data...
Reading installed packages...
1 lock has been successfully removed.
```

然后再次查看锁定的包时，已经没有锁定的包了  

```bash
# zypper ll
There are no package locks defined.
```

## II. 管理软件源

### 11. 添加软件源
使用 RUI 来添加软件源的通用格式如下：  

`zypper addrepo <options> <URI> <alias>`

例如：  

```bash
# zypper addrepo --check --refresh --name "Mozilla-repo" http://download.opensuse.org/repositories/mozilla/SLE_11/ "Mozillarepo"
Adding repository 'Mozilla-repo' [done]
Repository 'Mozilla-repo' successfully added
Enabled: Yes
Autorefresh: Yes
URI: http://download.opensuse.org/repositories/mozilla/SLE_11/
```

### 12. 创建一个本地源

你也可以在你的机器上从一个本地的目录来创建一个本地源，如下的命令创建了一个叫 *myrepo* 的本地源：  

```bash
# zypper addrepo /var/stormgt/dsminst mylocalrepo
Adding repository 'mylocalrepo' [done]
Repository 'mylocalrepo' successfully added
Enabled: Yes
Autorefresh: No
URI: dir:///var/stormgt/dsminst
# zypper search --repo mylocalrepo
Loading repository data...
Reading installed packages...
S | Name        | Summary                                 | Type
--+-------------+-----------------------------------------+--------
i | TIVsm-API   | the API                                 | package
i | TIVsm-API64 | the API                                 | package
i | TIVsm-BA    | the Backup Archive Client               | package
i | gskcrypt32  | IBM GSKit Cryptography Runtime          | package
i | gskcrypt64  | IBM GSKit Cryptography Runtime          | package
i | gskssl32    | IBM GSKit SSL Runtime With Acme Toolkit | package
i | gskssl64    | IBM GSKit SSL Runtime With Acme Toolkit | package
```

你也可以使用上面的命令添加 NFS 或者 FTP 目录到源。  

### 13. 查看软件源

可以使用如下命令查看那所有添加的软件源：  

```bash
# zypper lr
# | Alias                                            | Name                                             | Enabled | Refresh
--+--------------------------------------------------+--------------------------------------------------+---------+--------
1 | Mozillarepo                                      | Mozilla-repo                                     | Yes     | Yes
2 | SUSE-Linux-Enterprise-Server-11-SP1 11.1.1-1.152 | SUSE-Linux-Enterprise-Server-11-SP1 11.1.1-1.152 | Yes     | Yes
```

要查看完整的 RUI ，使用：  

```bash
# zypper lr --uri
# | Alias                                            | Name                                             | Enabled | Refresh | URI
--+--------------------------------------------------+--------------------------------------------------+---------+---------+----------------------------------------------------------
1 | Mozillarepo                                      | Mozilla-repo                                     | Yes     | Yes     | http://download.opensuse.org/repositories/mozilla/SLE_11/
2 | SUSE-Linux-Enterprise-Server-11-SP1 11.1.1-1.152 | SUSE-Linux-Enterprise-Server-11-SP1 11.1.1-1.152 | Yes     | Yes     | http://19.106.65.64/FUSELinux/600RC0
```

### 14. 在指定的源里搜索软件包

像列出一个软件源里的所有软件包，使用如下命令：  

```bash
# zypper search --repo Mozillarepo
Loading repository data...
Reading installed packages...

S | Name                                 | Summary                                                                 | Type
--+--------------------------------------+-------------------------------------------------------------------------+-----------
i | MozillaFirefox                       | Mozilla Firefox Web Browser                                             | package
i | MozillaFirefox-branding-SLED         | SLED branding of MozillaFirefox                                         | package  
  | MozillaFirefox-branding-openSUSE     | openSUSE branding of MozillaFirefox                                     | package
  | MozillaFirefox-branding-openSUSE     | openSUSE branding of MozillaFirefox
```

### 15. 重命名一个软件源

使用 `renamerepo` 命令选项来重命名一个软件源。  
下面的示例中，名为 “mylocalrepo” 的软件源被重命名为 “LOCALRPM-Repo”  

```bash
# zypper renamerepo mylocalrepo LOCALRPM-Repo
Repository 'mylocalrepo' renamed to 'LOCALRPM-Repo'.
```

### 16. 删除软件源

使用 `removerepo` 命令选项来删除软件源：  

```bash
# zypper removerepo LOCALRPM-Repo
Removing repository 'mylocalrepo' [done]
Repository 'mylocalrepo' has been removed.
```

### 17. 备份软件源

可以使用 `lr` 命令的 `export` 选项来将所有添加的软件源备份到一个文件：  

```bash
# zypper lr --export /var/tmp/backup.repo
Repositories have been successfully exported to /var/tmp/backup.repo.
```

### 18. 从备份添加软件源

如果你有之前导出的软件源备份文件，那可以使用 `addrepo` 命令来添加备份的软件源：  

`zypper addrepo /var/tmp/backup.repo`  

### 19. 打开或关闭软件源

可以使用 `modifyrepo` 命令的 `-d` 选项来关闭一个软件源：  

```bash
# zypper modifyrepo -d Mozillarepo
Repository 'Mozillarepo' has been successfully disabled.
```

使用 `-e` 选项来打开一个关闭的软件源：  

```
# zypper modifyrepo -e Mozillarepo
Repository 'Mozillarepo' has been successfully enabled.
```

### 20. 刷新软件源

当软件源过期时，刷新软件源是非常重要的。你可以像下面一样执行一个手动的刷新，也可以设置当需要时自动刷新：  

```bash
# zypper refresh Mozillarepo
Repository 'Mozilla-repo' is up to date.
Specified repositories have been refreshed.
```

使用如下命令来设置自动刷新：  

```bash
# zypper modifyrepo --refresh mylocalrepo
Autorefresh has been enabled for repository 'mylocalrepo'.
```

> 【译者注】 其实这里只是示例了 zypper 的一些基本用法，zypper 是一个很强大的软件包管理工具，请查看 [Portal:Zypper][link_zypper] 获取更多详细信息。  


[link_trans_original]: http://www.thegeekstuff.com/2015/04/zypper-examples/
[link_opensuse]: https://zh.opensuse.org/
[link_centos]: http://centos.org/
[link_ubuntu]: http://www.ubuntu.com/
[link_firefox]: https://zh.wikipedia.org/wiki/Firefox
[link_aptget]: https://zh.wikipedia.org/wiki/%E9%AB%98%E7%BA%A7%E5%8C%85%E8%A3%85%E5%B7%A5%E5%85%B7
[link_apatitude]: https://zh.wikipedia.org/wiki/Aptitude
[link_zypper]: https://zh.opensuse.org/Portal:Zypper
[link_redhat]: http://www.redhat.com/
[link_debian]: http://www.debian.org/
[link_yum]: https://zh.wikipedia.org/wiki/Yellowdog_Updater,_Modified
