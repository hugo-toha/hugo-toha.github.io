---
title: "OPENSUSE上的定时任务"
description: "了解openSUSE上cron任务的运行时间"
date: 2011-02-02T15:03:32+0800
categories: ["Linux"]
hero: cron-job.webp
tags: ["opensuse"]
menu:
  sidebar:
    name: "OPENSUSE上的定时任务"
    identifier: opensuse-cronjob
    parent: linux
    weight: 10
---

前段时间，发现每次开机后一段时间机器就会很慢，似乎在跑些什么任务，于是查看系统任务，发现有[*updatadb*][updatadb_link]（为[*locate*][locate_link]构建数据索引）在运行。这些任务是由 cron 触发的。

于是我用[*crontab*][crontab_link]命令来查看当前的cron任务列表，可是得到如下返回：  

> $sudo crontab -u root -l  
> root’s password:  
> no crontab for root  

可是我发现在*/etc/cron.daily/*目录下有一些脚本， 其中就有一个*suse-updatedb*。那些进程就是由这个脚本启动的。
接下来，我查看了一下*/etc/crontab*文件:  

> -*/15 * * * *   root  test -x /usr/lib/cron/run-crons && /usr/lib/cron/run-crons >/dev/null 2>&1  

这说明系统会每15分钟调用一次 */usr/lib/cron/run-crons* 脚本，接着查看了一下那个脚本，其中发现了一行注释：   

> \# if DAILY_TIME set, run only at a fixed time of day  

而**DAILY_TIME**这个变量应该在*/etc/sysconfig/cron*配置文件里指定，在文件中有这么一段：  

> \## Type:         string  
> \## Default:      “”  
> \#  
> \# At which time cron.daily should start. Default is 15 minutes after booting  
> \# the system. Example setting would be “14:00″.  
> \# Due to the fact that cron script runs only every 15 minutes,  
> \# it will only run on xx:00, xx:15, xx:30, xx:45, not at the accurate time  
> \# you set.  
> DAILY_TIME=""  

也就是说如果没有指定**DAILY_TIME**，则*cron.daily*将在系统启动后的15分钟触发，并且如果要指定特定时间，也只能指定在每小时的00/15/30/45分钟。

于是我把这个时间设定为01:45，这样就在每天的凌晨1点45分的时候才会触发那些cron任务。

不过我看了下*/usr/lib/cron/run-crons*，还是没有完全弄明白这个cron框架是如何去按照指定时间触发的。
好像[openSUSE][opensuse_link] 11.4将使用新的*cronie 1.4.4*替代现在的*vixie-cron 4.1*，看看这里[SDB:Cron][sdbcron_link]。

[updatadb_link]: http://unixhelp.ed.ac.uk/CGI/man-cgi?updatedb+1
[locate_link]: http://www.manpagez.com/man/1/locate/
[crontab_link]: http://www.manpagez.com/man/1/crontab/
[opensuse_link]: http://www.opensuse.org/
[sdbcron_link]: http://en.opensuse.org/SDB:Cron
