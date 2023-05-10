---
title: "在LINUX上配置WIREGUARD"
date: 2020-12-03T11:56:29+08:00
categories: ["Linux"]
hero: linux-wireguard.webp
tags: ["wireguard", "vpn"]
menu:
  sidebar:
    name: "在LINUX上配置WIREGUARD"
    identifier: wireguard-vpn
    parent: linux
    weight: 10
---

什么是 [WireGuard] ？ 其官方宣称是快速、现代以及安全的[VPN]隧道（Fast, Modern, Secure VPN Tunnel）。  
WireGuard使用了最先进的加密技术，相比 [IPSec] 更简单更精简，而且拥有几乎超越 [OpenVPN] 的性能。其最初是针对Linux内核发布的，但是现在已经跨平台（Windows, MacOS, BSD, Android, iOS等）可部署。  

接下来这篇*How To*系列文章，就来一步步在Ubuntu (Linux)上安装和配置WireGuard VPN，其中一台云主机运行Ubuntu-20.04用作VPN服务器，另一台本地的linux桌面环境作为VPN客户端。  

## 服务器端安装WireGuard

这里我们的服务器使用的是操作系统为Ubuntu 20.04的云主机，对于如何创建并配置一台云主机，可以选择 [DigitalOcean]（https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04）。  

这里我们我们已经配置好一台Ubuntu 20.04的云主机，并且可以通过SSH访问。首先对系统进行安全更新  

```bash
$ sudo apt update
$ sudo apt upgrade
```

接下来直接使用APT安装WireGuard软件包  

```bash
$ sudo apt install wireguard
```

会同时安装 `wireguard-tools` 软件包，我们需要使用其工具进行相关的配置。  

## 配置WireGuard服务端

进入**root**权限进行操作，为服务端生产私有/公共密钥对  

```bash
$ sudo -i
\# cd /etc/wireguard/
\# umask 077
\# wg genkey | tee privatekey | wg pubkey > publickey
```

执行完上述命令后，我们会在目录 */etc/wireguard/* 下生产两个密钥文件 *privatekey* 和 *publickey* 。  

接下来我们需要创建一个接口配置文件，命名为 *wg0.conf*，编辑并添加如下内容  

```conf
[Interface]
## VPN server private IP address ##
Address = 192.168.6.1/24
 
## VPN server port ##
ListenPort = 4114
 
## VPN server's private key i.e. /etc/wireguard/privatekey ##
PrivateKey = xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

其中 **Address** 指定该网络接口的IP地址，可自己设定一个子网的地址，**ListenPort** 指定WG的UDP监听端口（客户端将需要配置该端口进行连接），**PrivateKey** 就是上面生成的私有密钥的内容。  

如果你的系统开启了UFW防火墙，记住要配置ufw允许以上端口（4114），例如  

```bash
$ sudo ufw status
Status: active
$ sudo ufw allow 4114/udp
```

我们这里使用的是云主机，则需要在云控制台配置相应的安全组/防火墙开放 `4114/udp` 端口的访问。  

接下来，执行以下命令启动WireGuard服务  

```bash
$ sudo systemctl enable wg-quick@wg0
$ sudo systemctl start wg-quick@wg0
$ sudo systemcl status wg-quick@wg0
```

最后一个命令是查看wg服务的运行状态的，例如返回如下  

```
● wg-quick@wg0.service - WireGuard via wg-quick(8) for wg0
     Loaded: loaded (/lib/systemd/system/wg-quick@.service; enabled; vendor preset: enabled)
     Active: active (exited) since Thu 2020-12-03 06:48:02 UTC; 5s ago
       Docs: man:wg-quick(8)
             man:wg(8)
             https://www.wireguard.com/
             https://www.wireguard.com/quickstart/
             https://git.zx2c4.com/wireguard-tools/about/src/man/wg-quick.8
             https://git.zx2c4.com/wireguard-tools/about/src/man/wg.8
    Process: 3606 ExecStart=/usr/bin/wg-quick up wg0 (code=exited, status=0/SUCCESS)
   Main PID: 3606 (code=exited, status=0/SUCCESS)
      Tasks: 0 (limit: 682)
     Memory: 800.0K
     CGroup: /system.slice/system-wg\x2dquick.slice/wg-quick@wg0.service
```

而且系统里增加了一个虚拟的网络接口  

```
3: wg0: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1380 qdisc noqueue state UNKNOWN group default qlen 1000
    link/none 
    inet 192.168.40.1/24 scope global wg0
       valid_lft forever preferred_lft forever
```

还可以通过wg命令显示接口信息  

```bash
$ sudo wg
interface: wg0
  public key: rQYpYVpgPYdYYVrlgF52S/M8vrht+rkqSmn5ayVAG0I=
  private key: (hidden)
  listening port: 4114
```

## 配置客户端连接WG

完成服务器断的配置，并成功启动之后，我们需要配置本地客户端来连接该VPN，我本地使用的是 [openSUSE] 桌面环境，首先需要安装 wireguard-tools，其他 Linux 系统也是类似的  

```bash
❯ sudo zypper in wireguard-tools
正在加载软件源数据...
正在读取已安装的软件包...
正在解决软件包依赖关系...

将安装以下 1 个新软件包：
  wireguard-tools

1 个软件包将新装.
总下载大小：72.4 KiB。已缓存：0 B。 操作完成后，将使用额外的 140.7 KiB。
继续吗？ [y/n/v/...? 显示全部选项] (y): y
```

一样地需要创建私有/公共密钥对  

```bash
$ sudo -i
\# cd /etc/wireguard/
\# umask 077
\# wg genkey | tee privatekey | wg pubkey > publickey
```

创建 */etc/wireguard/wg0.conf* 文件，配置如下  

```conf
[Interface]
## This Desktop/client's private key ##
PrivateKey = <client private key>
 
## Client ip address ##
Address = 192.168.40.10/24
 
[Peer]
## public key ##
PublicKey = <Server public key>
 
## set ACL ##
AllowedIPs = 192.168.40.0/24
 
## Your Ubuntu 20.04 LTS server's public IPv4/IPv6 address and port ##
Endpoint = 35.220.179.202:4114
 
##  Key connection alive ##
PersistentKeepalive = 15
```

注意需要分别配置接口（也就是客户端自己）的私有密钥，还要配置连接服务端（peer）的公共密钥，还有连接服务端的IP和端口信息。

启动连接  

```bash
❯ sudo systemctl start wg-quick@wg0.service
❯ sudo wg
interface: wg0
  public key: 1abmCvigQqhXYLOkvjrU864dOyJHN9bf6Ya0GP4tXzs=
  private key: (hidden)
  listening port: 54147

peer: rQYpYVpgPYdYYVrlgF52S/M8vrht+rkqSmn5ayVAG0I=
  endpoint: 35.220.179.202:4114
  allowed ips: 192.168.40.0/24
  latest handshake: 4 seconds ago
  transfer: 92 B received, 180 B sent
  persistent keepalive: every 15 seconds
```

这个时候还不能通过VPN直接访问服务器端，想要客户端和服务端可以通过VPN的私有网络互相访问，这个时候需要到服务端添加[Peer]的配置，服务端向文件 */etc/wireguard/wg0.conf* 添加以下内容  

```conf
[Peer]
PublicKey = +pztufezkYV8ujhJI2N2Q5SW5yuuTXzHmytrGdJjziE=
AllowedIPs = 192.168.40.10/32
```

重启服务器，客户端服务  

```bash
$ sudo systemctl restart wg-quick@wg0
```

这个时候就建立了一个P-to-P的VPN网络，可以使用私有IP互相访问  

```bash
❯ ping 192.168.40.1
PING 192.168.40.1 (192.168.40.1) 56(84) bytes of data.
64 bytes from 192.168.40.1: icmp_seq=2 ttl=64 time=51.8 ms
64 bytes from 192.168.40.1: icmp_seq=3 ttl=64 time=55.0 ms
64 bytes from 192.168.40.1: icmp_seq=4 ttl=64 time=58.6 ms
...
```

客户端还不能通过VPN网络访问互联网，要想所有VPN的客户端都可以通过该服务器来访问互联网，还需要在服务器上配置相应的NAT，IP转发规则。  

## 总结

这里仅仅通过示例，在Linux上使用 [WireGuard] 创建了一个端到端（客户端/服务器）VPN网络，让客户端和服务器可以通过VPN私有IP地址互相访问。想了解更多关于WireGuard的信息，请访问其官网 https://www.wireguard.com/ 。


[VPN]: https://zh.wikipedia.org/zh-cn/%E8%99%9B%E6%93%AC%E7%A7%81%E4%BA%BA%E7%B6%B2%E8%B7%AF
[WireGuard]: https://www.wireguard.com/
[IPSec]: https://zh.wikipedia.org/zh-cn/IPsec
[OpenVPN]: https://zh.wikipedia.org/zh-cn/OpenVPN
