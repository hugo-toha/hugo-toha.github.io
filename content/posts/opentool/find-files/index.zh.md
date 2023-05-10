---
title: "文件系统查找工具"
description: "推荐两款开源的文件系统查找工具 - mlocate, fd"
date: 2021-12-03T09:28:38+08:00
categories: ["OpenTool"]
hero: find-file.webp
tags: ["linux", "find"]
menu:
  sidebar:
    name: "文件系统查找工具"
    identifier: find-files
    parent: opentool
    weight: 10
---

众所周知，在Linux或者类Unix的文件系统中，想通过文件名关键字查找文件，可以通过[find](https://man7.org/linux/man-pages/man1/find.1.html)命令。那本文将推荐2款可以快速查找文件的工具，性能比find命令更好，可在某些场景下替换find的使用。  

## mlocate

大部分的Linux发行版的都提供了 **mlocate**  软件包，该软件包包含了一个[locate](https://linux.die.net/man/1/locate)命令用于查找文件，和一个[updatedb](https://linux.die.net/man/8/updatedb)命令用于更新文件索引供locate使用。  

可直接通过系统的软件包管理工具直接安装  

```bash
# CentOS/RHEL
$ sudo dnf install mlocate

# Debian/Ubuntu
$ sudo apt install mlocate
```

安装完成后，首先需要执行以下命令进行文件索引  

```bash
sudo updatedb
```

索引文件将默认存放在 */var/lib/mlocate/mlocatedb* ，也可以修改配置文件 */etc/updatedb.conf* 文件，添加某些不需要索引的文件夹，例如  

```
# Paths which are pruned from updatedb database
PRUNEPATHS="/tmp /var/tmp /var/cache /var/lock /var/run /var/spool /mnt /cdrom /usr/tmp /proc /media /sys /.snapshots /var/run/media"
```  

完成索引之后，就可以使用 **locate <pattern>** 命令进行文件查找了，例如  

```bash
$ locate mlocate
/etc/systemd/system/timers.target.wants/mlocate.timer
/usr/bin/rpmlocate
/usr/lib/systemd/system/mlocate.service
/usr/lib/systemd/system/mlocate.timer
/usr/sbin/rcmlocate
/usr/share/doc/packages/mlocate
/usr/share/doc/packages/mlocate/AUTHORS
/usr/share/doc/packages/mlocate/ChangeLog
/usr/share/doc/packages/mlocate/NEWS
/usr/share/doc/packages/mlocate/README
/usr/share/licenses/mlocate
/usr/share/licenses/mlocate/COPYING
/usr/share/man/man5/mlocate.db.5.gz
/var/lib/mlocate
/var/lib/mlocate/mlocate.db
/var/lib/mlocate/mlocate.db.9O5YsQ
/var/lib/systemd/migrated/mlocate
/var/lib/systemd/timers/stamp-mlocate.timer
```  

可以使用 `-b` 选项进行精确匹配，例如下面两个查询的结果区别  

```bash
$ locate -b '\updatedb'
/usr/bin/updatedb
```
注意使用 `-b` 时，需要在搜索的关键自前使用 `\` 。  

```bash
$ locate 'updatedb'
/etc/updatedb.conf
/etc/apparmor.d/usr.bin.updatedb
/usr/bin/updatedb
/usr/share/augeas/lenses/dist/updatedb.aug
/usr/share/man/man5/updatedb.conf.5.gz
/usr/share/man/man8/updatedb.8.gz
/usr/share/nvim/runtime/ftplugin/updatedb.vim
/usr/share/nvim/runtime/syntax/updatedb.vim
/usr/share/vim/vim80/ftplugin/updatedb.vim
/usr/share/vim/vim80/syntax/updatedb.vim
```

还可以使用 `-r` 进行基本的正则表达式模式匹配查找，可以查看 `locate --help` 或者 `man locate` 。  

接下来我们将介绍另一款find的替代平 - fd 。  

## fd

[fd](https://github.com/sharkdp/fd)是一款由[David Peter](https://david-peter.de/)开发的开源工具，用于在文件系统中查找文件，在大部分情况下可以替换find命令。  

fd可用于多个平台，包括大部分的Linux发行版，MacOS，Windows，具体安装可查看 https://github.com/sharkdp/fd#installation 。  

例如可以使用 HomeBrew/LinuxBrew 进行安装  

```bash
$ brew install fd
```

安装完成后，就可以直接使用，例如查找当前文件夹下以 `png` 为扩展名的文件  

```bash
$ fd -e png
go/src/github.com/Go-zh/tour/static/img/gopher.png
go/src/github.com/Go-zh/tour/content/img/tree.png
go/src/github.com/containous/yaegi/doc/images/yaegi.png
...
```

注意，fd命令默认的搜索路径是当前目录，可以使用 `--base-directory` 或者 `--search-path` 来指定搜索路径，例如我们查找 */etc/* 下，匹配 *docker* 的常规文件  

```bash
$ fd --base-directory /etc/ -t f 'docker'
audit/rules.d/docker.rules
bash_completion.d/docker-compose.bash
sysconfig/docker
```

还可以使用 `-x` 选项将结果输出给其他命令进行操作（类似find命令的--exec选项），例如  

```bash
$ fd -d 1 -e png -x convert {} {.}.jpg
```

这将查找当前目录下的所有PNG文件，并转换为JPG文件。上面的命令中使用到了占位符 `{}` 和 `{.}` ，看如下示例展示占位符所代表的结果  

```bash
❯ fd 'recognition.db' -x echo {}
Pictures/recognition.db
Pictures/Photos/recognition.db

❯ fd 'recognition.db' -x echo {.}
Pictures/Photos/recognition
Pictures/recognition

❯ fd 'recognition.db' -x echo {/}
recognition.db
recognition.db

❯ fd 'recognition.db' -x echo {//}
Pictures
Pictures/Photos

❯ fd 'recognition.db' -x echo {/.}
recognition
recognition
```

通过占位符，可以很方便的对文件进行相关操作。更多的fd命令选项，可以查看 `fd --help` 。  

如果想在Windows上使用fd，可以通过 **Scoop** 包管理器安装，打开PowerShell  

```ps
-> scoop install fd
```

## 总结

这里介绍了两款在文件系统中通过文件名匹配快速查找文件的工具，mlocate使用了索引文件，所以在全局查找文件时的效率很高。而fd工具提供了很多的功能，在大部分场景下可代替find命令来使用，而性能也高于find命令。补充，fd工具的开发者除了这个工具外，还开发了其他很实用的工具，例如[bat](https://github.com/sharkdp/bat) - 一个可以代替cat命令的工具，其他支持很多编程语言的语法高亮的形式来输出文件内容，也推荐使用。  
