---
title: "SYSTEMD定时服务"
description: "介绍在Linux上使用systemd的定时服务"
date: 2021-12-03T15:17:07+08:00
categories: ["Linux"]
hero: systemd.webp
tags: ["systemd", "crontab"]
menu:
  sidebar:
    name: "SYSTEMD定时服务"
    identifier: systemd-timer
    parent: linux
    weight: 10
---

我[上一篇](https://mengz.dev/posts/linux/recommend-2-find-file-tools/)文章中介绍的[locate](https://linux.die.net/man/1/locate)文件查找命令，需要依赖[updatedb](https://linux.die.net/man/8/updatedb)更新索引才能快速查找文件，因此需要定时运行该命令来更新文件索引。我们知道在Linux和类Unix系统上通常使用[crontab](https://man7.org/linux/man-pages/man5/crontab.5.html)来创建定时任务。  

在Ubuntu上我们使用`apt install mlocate`之后，会安装一个脚本文件到 */etc/cron.daily/mlocate*，也就是通过Cron机制来每天执行updatedb。然而在我的[openSUSE](https://opensuse.org)上却并未发现有相关的Crontab配置，但我发现索引文件还是在每天的零点进行了更新，那这个定时任务是谁来执行的呢？  

我通过查找与mlocate相关的文件，发现了以下几个文件：  

```bash
❯ locate "mlocate"
/etc/systemd/system/timers.target.wants/mlocate.timer
/usr/lib/systemd/system/mlocate.service
/usr/lib/systemd/system/mlocate.timer
```

原来在openSUSE系统上，使用的是[Systemd](https://www.freedesktop.org/wiki/Software/systemd/)的定时单元来实现的。Systemd是一种Linux系统服务管理程序，在我之前的文章[在OPENSUSE上使用SYSTEMCTL管理系统服务](https://mengz.dev/posts/linux/systemd-on-opensuse-sysetmctl/)中介绍过。  

那这里我们将重点介绍下Systemd的定时服务（systemd timer unit）。  

## systemd定时单元  

类似与Cron，systemd的定时单元在Linux系统上提供了机制来调度任务，相比于Cron机制，其他具有以下特性（在使用systemd作为初始化和服务管理的系统上）：  
- 调度的任务可以依赖于其他systemd服务  
- 可以使用`systemctl`命令来管理定时单元，类似与管理systemd服务  
- 除了类似Cron的循环实时定时任务（realtime）之外，还支持一种基于非时间事件触发的任务（monotonic）  
- 定时单元记录日志到systemd的日志系统（journal），因此方便于统一监控和诊断  

### systemd定时任务的类型  

上面的特性中，我们提到其支持两种类型 - realtime 和 monotonic  

- Realtime - 类似于Cron，这种类型的定时任务由定义的绝对时间来触发，在配置文件中通过 `OnCalendar` 选项来定义  
- Monotonic - 这种类型的定时任务将会在指定的事件（例如系统启动，服务激活）一定时间后触发，在配置文件中通过 `OnBootSec` 和 `OnUnitActiveSec` ，`OnStartupSec` 等选项来定义，并且该类型的定时任务触发时间不是固定的，在每一次系统重启之后都会被重置  

### systemd定时任务的配置  

在文章开始，我们在寻找mlocate更新文件索引的定时任务时看到，有文件 */usr/lib/systemd/system/mlocate.timer* ，没错，就是通过以 *.timer* 作为扩展名的systemd单元文件来定义systemd的定时单元的  

```
[Unit]
Description=Daily locate database update
Documentation=man:updatedb

[Timer]
OnCalendar=daily
AccuracySec=12h
Unit=mlocate.service
Persistent=true

[Install]
WantedBy=timers.target
```

可以看到文件格式与systemd服务的单元文件类似，不过需要 **[Timer]** 段，在该段定义了如下选项  

- OnCalendar=daily，意思是每天触发  
- AccuracySec=12h，意思是由于某些原因需要推测执行的时间  
- Unit=mlocate.service，这里就是指定了需要执行的任务服务  
- Persistent=true，指定如果由于关机等原因到时了为能执行任务的情况下，启动会立即触发该任务  

那该定时单元指定了 **mlocate.service** 作为触发执行的任务，也就是 */usr/lib/systemd/system/mlocate.service* 里定义的服务，那服务里就是定义使用 `updatedb` 命令去更新文件索引。  

对于 `OnCalendar` ，其值支持的格式为 `DayOfWeek Year-Month-Day Hour:Minute:Second`，例如  

- OnCalendar=*-*-* 5:00:00，指定在每天早上的5点执行  
- OnCalendar=Fri 18:00:00，指定在每个月的周五下午6点执行  

在一个配置文件中，还可以指定多个 `OnCalendar` ，例如  

```
OnCalendar=Mon..Fri 10:00
OnCalendar=Sat,Sun 22:00
```

上面的配置就指定了在周一到周五的每天上午10点，以及在周末两天的晚上10点执行。  

下面我们来举一个使用monotonic类型定时任务的例子，在目录 */etc/systemd/system/* 下服务单元文件 *foo.service*   

```foo.service
[Unit]
Description="Foo shell script"

[Service]
ExecStart=/usr/local/bin/foo.sh
```

同时创建一个定时单元文件 *foo.timer*  

```foo.timer
[Unit]
Description="Run foo shell script"

[Timer]
OnBootSec=5min
OnUnitActiveSec=24h
Unit=foo.service

[Install]
WantedBy=multi-user.target
```

这里我们看到在 **[Timer]** 段，我们定义一下选项  

- OnBootSec=5min，指定了在系统启动5分钟后触发指定服务的执行  
- OnUnitActiveSec=24h，指定了在服务在激活之后的24小时执行，也就是每天都会执行一次（但是执行的具体时间取决于开机时间）  
- Unit=foo.service，指定了触发的任务是我们上面定义的foo服务，也就是执行 *foo.sh* 脚本  

### 管理timer单元  

上面的特性中，我们说道timer单元可以通过 `systemctl` 命令进行管理，类似管理服务单元  

- `sudo systemctl start foo.timer` ，启动指定的定时单元  
- `sudo systemctl enable foo.timer` ，开启定时单元自动激活（开机自启）  
- `sudo systemctl list-timers` ，列出当前系统已激活的定时单元  

例如  

```bash
❯ sudo systemctl list-timers
NEXT                         LEFT                LAST                         PASSED      UNIT                         ACTIVATES
Fri 2021-12-03 17:00:00 CST  22min left          Fri 2021-12-03 16:00:03 CST  37min ago   snapper-timeline.timer       snapper-timeline.service
Sat 2021-12-04 00:00:00 CST  7h left             Fri 2021-12-03 00:00:03 CST  16h ago     logrotate.timer              logrotate.service
Sat 2021-12-04 00:00:00 CST  7h left             Fri 2021-12-03 00:00:03 CST  16h ago     mandb.timer                  mandb.service
Sat 2021-12-04 00:00:00 CST  7h left             Fri 2021-12-03 00:00:03 CST  16h ago     mlocate.timer                mlocate.service
```

我们还可以直接使用 `journalctl` 来查看相关日志，例如  

```bash
❯ sudo journalctl -u mlocate
-- Logs begin at Thu 2021-12-02 06:58:59 CST, end at Fri 2021-12-03 16:41:26 CST. --
Dec 03 00:00:03 linux-dev systemd[1]: Starting Update locate database...
Dec 03 00:00:03 linux-dev su[864]: (to nobody) root on none
Dec 03 00:00:06 linux-dev systemd[1]: Started Update locate database.
```

同时查看mlocate定时单元和服务的日志。  

关于更多的配置细节，可以参考[官方文档](https://www.freedesktop.org/software/systemd/man/systemd.time.html) 。

## 总结

如果你的系统使用的Systemd作为初始化和服务管理系统，并且想使用到我们之前提到的特性，那么我们可以使用systemd的timer单元来定义我们的定时任务。当然大部分系统还是支持Crontab机制的定时任务。