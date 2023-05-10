---
title: "LINUX上统计网络接口数据包"
date: 2020-12-02T15:15:03+08:00
categories: ["Linux"]
hero: linux-network.webp
tags: ["network", "linux"]
menu:
  sidebar:
    name: "LINUX上统计网络接口数据包"
    identifier: network-packets
    parent: linux
    weight: 10
---

在Linux系统上，我们可以通过 [ip] , [netstat] 或者 [ethtool] 命令显示网络接口丢弃数据包的统计信息。接下来我们看看如何使用每个命令。

## 使用netstat按接口显示数据包

其实 [netstat] 命令已经过时，可使用命令 [ip] 和 [ss] 来代替。但是 [netstat] 依然在一些旧的Linux分发版本上可用，因此在 ip/ss 不可用的情况，我们可以使用netstat，其语法如下  

```bash
netstat -i
netstat --interfaces
```

例如  

```bash
~$ netstat -i
Kernel Interface table
Iface   MTU Met   RX-OK RX-ERR RX-DRP RX-OVR    TX-OK TX-ERR TX-DRP TX-OVR Flg
docker0    1500 0    188180      0      0 0        151852      0      0      0 BMRU
eth0       1500 0    472368      0      0 0        375351      0      0      0 BMRU
lo        65536 0     51687      0      0 0         51687      0      0      0 LRU
vethc8f46ea  1500 0    136984      0      0 0         79587      0      0      0 BMRU
```

如果想显示每种协议的概要统计信息，可以执行  

```bash
netstat -s
netstat --statistics
```

例如  

```bash
$ netstat -s
Ip:
    527622 total packets received
    19 with invalid addresses
    329762 forwarded
    0 incoming packets discarded
    191137 incoming packets delivered
    568337 requests sent out
Icmp:
    8 ICMP messages received
    8 input ICMP message failed.
    ICMP input histogram:
        destination unreachable: 7
        timeout in transit: 1
    5 ICMP messages sent
    0 ICMP messages failed
    ICMP output histogram:
        destination unreachable: 5
IcmpMsg:
        InType3: 7
        InType11: 1
        OutType3: 5
Tcp:
    2509 active connections openings
    26 passive connection openings
    748 failed connection attempts
    14 connection resets received
    4 connections established
    182968 segments received
    241886 segments send out
    72 segments retransmited
    279 bad segments received.
    1844 resets sent
    InCsumErrors: 279
Udp:
    8067 packets received
    5 packets to unknown port received.
    0 packet receive errors
    11440 packets sent
```

只显示tcp的信息  

```bash
netstat -s -t
netstat --statistics --tcp
```

只显示udp的信息  

```bash
netstat -s -u
netstat --statistics --udp
```

## 使用ip命令显示网络接口数据包信息

如果要显示所有接口的统计信息，命令如下  

```bash
ip -s link
```

如果要显示某一个接口的，则制定接口名  

```bash
ip -s link show {interface}
```

例如  

```bash
$ ip -s link show eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP mode DEFAULT group default qlen 1000
    link/ether 00:16:3e:02:c8:e3 brd ff:ff:ff:ff:ff:ff
    RX: bytes  packets  errors  dropped overrun mcast   
    377786943  473945   0       0       0       0       
    TX: bytes  packets  errors  dropped carrier collsns 
    266024587  377467   0       0       0       0
```

RX指示了接收的数据包，TX指示了发送的数据包。  

## 使用ethtool命令查询指定网络接口的信息  

可以使用 -S 或者 --statistics 选项来显示统计信息，语法如下  

```bash
ethtool -S {device}
```

例如  

```bash
❯ ethtool -S wlan1
NIC statistics:
     rx_packets: 487703
     rx_bytes: 207474712
     rx_duplicates: 180
     rx_fragments: 487682
     rx_dropped: 19952
     tx_packets: 141579
     tx_bytes: 34804215
     tx_filtered: 0
     tx_retry_failed: 0
     tx_retries: 19541
     sta_state: 4
     txrate: 400000000
     rxrate: 360000000
     signal: 201
     channel: 0
     noise: 18446744073709551615
     ch_time: 18446744073709551615
     ch_time_busy: 18446744073709551615
     ch_time_ext_busy: 18446744073709551615
     ch_time_rx: 18446744073709551615
     ch_time_tx: 18446744073709551615
```

还可以直接使用cat或者column命令来查询 */proc/net/dev* 文件，例如  

```bash
❯ column -t /proc/net/dev
Inter-|           Receive     |        Transmit                                                                                                              
face              |bytes      packets  errs      drop  fifo  frame  compressed  multicast|bytes  packets    errs     drop  fifo  colls  carrier  compressed  
lo:               230352757   1201722  0         0     0     0      0           0                230352757  1201722  0     0     0      0        0           0
eth0:             0           0        0         0     0     0      0           0                0          0        0     0     0      0        0           0
wlan1:            1346770664  2865963  0         14    0     0      0           0                282983658  1154942  0     0     0      0        0           0
br-13cb4d22d1c8:  0           0        0         0     0     0      0           0                0          0        0     0     0      0        0           0
br-44561b4ee062:  0           0        0         0     0     0      0           0                0          0        0     0     0      0        0           0
br-70b0dad49865:  0           0        0         0     0     0      0           0                0          0        0     0     0      0        0           0
docker0:          6824830     44848    0         0     0     0      0           0                133304965  47104    0     0     0      0        0           0
vetheb8b528:      2360070     13321    0         0     0     0      0           0                60431688   18817    0     0     0      0        0           0
vetha4dc663:      461283      2464     0         0     0     0      0           0                2981558    2302     0     0     0      0        0           0
```

## 补充：如何诊断数据包丢弃的原因

发现网络数据有被丢弃的请，想找出原因，这里介绍一个工具 [dropwath](https://github.com/nhorman/dropwatch)。  

首先使用需要自己编译安装该工具，下面示例在Ubuntu上编译安装：  

```bash
sudo apt-get install libpcap-dev libnl-3-dev libnl-genl-3-dev binutils-dev libreadline6-dev autoconf libtool pkg-config build-essential

git clone https://github.com/nhorman/dropwatch.git
cd dropwatch
./autogen.sh
./configure
make
make install
```

然后可以运行dropwatch进行监控  

```bash
$ dropwatch -l kas
Initializing kallsyms db
dropwatch> help
Command Syntax:
exit                             - Quit dropwatch
help                             - Display this message
set:
        alertlimit <number>      - capture only this many alert packets
        alertmode <mode>         - set mode to "summary" or "packet"
        trunc <len>              - truncate packets to this length. Only applicable when "alertmode" is set to "packet"
        queue <len>              - queue up to this many packets in the kernel. Only applicable when "alertmode" is set to "packet"
        sw <true | false>        - monitor software drops
        hw <true | false>        - monitor hardware drops
start                            - start capture
stop                             - stop capture
show                             - show existing configuration
stats                            - show statistics
dropwatch>
```

还可以通过 [tcpdump] 进行网络抓包，然后使用 [wireshark] 来进行分析。  

[ip]: https://linux.die.net/man/8/ip  
[netstat]: https://linux.die.net/man/8/netstat
[ss]: https://man7.org/linux/man-pages/man8/ss.8.html
[tcpdump]: https://www.tcpdump.org/manpages/tcpdump.1.html
[wireshark]: https://www.wireshark.org/
