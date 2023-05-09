---
title: "RCLOUD与云存储同步"
date: 2019-08-30T12:19:04+08:00
categories: ["OpenTool"]
hero: rclone.png
tags: ["cloud", "rclone", "linux"]
menu:
  sidebar:
    name: "RCLOUD与云存储同步"
    identifier: rclone-sync
    parent: opentool
    weight: 10
---

[Rclone](https://rclone.org/)是一个命令行云存储同步工具，可以在文件系统和云存储服务之间或者多个云存储服务之间访问和同步文件，支持很多云存储服务后端。  

<!-- more -->

## Rclone支持的云存储服务

rclone的当前版本为v1.49.1，支持以下云存储服务：  

- 1Fichier  
- Alibaba Cloud (Aliyun) Object Storage System (OSS)  
- Amazon Drive   (See note)
- Amazon S3  
- Backblaze B2  
- Box  
- Ceph  
- C14  
- DigitalOcean Spaces  
- Dreamhost  
- Dropbox  
- FTP  
- Google Cloud Storage  
- Google Drive  
- Google Photos  
- HTTP  
- Hubic  
- Jottacloud  
- IBM COS S3  
- Koofr  
- Memset Memstore  
- Mega  
- Microsoft Azure Blob Storage  
- Microsoft OneDrive  
- Minio  
- Nextcloud  
- OVH  
- OpenDrive  
- Openstack Swift  
- Oracle Cloud Storage  
- ownCloud  
- pCloud  
- premiumize.me  
- put.io  
- QingStor  
- Rackspace Cloud Files  
- rsync.net  
- Scaleway  
- SFTP  
- Wasabi  
- WebDAV  
- Yandex Disk  
- The local filesystem  

当前对于[Google Photos](https://www.google.com/photos/about/)的支持有一定的限制，具体请看[文档](https://rclone.org/googlephotos/)。  

Rcline的功能：  
- 始终检查MD5/SHA1哈希值保证文件完整性  
- 保留文件时间戳  
- 在整个文件上支持部分同步  
- [复制](https://rclone.org/commands/rclone_copy/)模式仅仅复制新的/修改的文件  
- [检查](https://rclone.org/commands/rclone_check/)模式检查文件的哈希相等  
- [同步](https://rclone.org/commands/rclone_sync/) (单一方向)使文件目录保持一致  
- 可以同步到或者从网络同步  
- 支持后端[加密](https://rclone.org/crypt/)  
- 支持后端[缓存](https://rclone.org/cache/)  
- 支持后端[联合](https://rclone.org/union/)  
- 可选的[FUSE挂载](https://rclone.org/commands/rclone_mount/)  
- 多线程下载到本地磁盘  
- 可以通过HTTP/WebDav/FTP/SFTP/dlna为本地或者远端文件提供[服务](https://rclone.org/commands/rclone_serve/)  
- 实验性的基于Web的图形界面  

## 安装Rclone

对于Linux环境，由于rclone是由[Golang](https://golang.org)开发，因此安装非常简单。管发提供了编译好的二进制可执行程序，以及RPM和DEB包，可根据自己系统的情况选择。以下演示直接下载二进制可执行文件的方式。  

下载地址： https://downloads.rclone.org/v1.49.1/rclone-v1.49.1-linux-amd64.zip  

```bash
❯ wget https://downloads.rclone.org/v1.49.1/rclone-v1.49.1-linux-amd64.zip
❯ unzip -qq rclone-v1.49.1-linux-amd64.zip
❯ sudo cp rclone-v1.49.1-linux-amd64/rclone /usr/local/bin/
❯ sudo chmod +x /usr/local/bin/rclone
```

## 配置云存储服务

Rclone支持很多云存储服务，以下举例配置两个服务[Microsoft OneDrive](https://onedrive.live.com/)和[Dropbox](https://www.dropbox.com/)。  

对于其他的云存储服务，可参考[官方文档](https://rclone.org/)。  

### Microsoft OneDrive

在命令行终端执行`rclone config` :  

```bash
❯ rclone config
2019/08/30 11:21:13 NOTICE: Config file "/home/mengz/.config/rclone/rclone.conf" not found - using defaults
No remotes found - make a new one
n) New remote
s) Set configuration password
q) Quit config
n/s/q> n
name> onedrive
```

这里使用`n`添加新的远程服务，然后给服务设置一个名字，这里使用了`onedrive`，接下来需要选择存储服务：  

```bash
Type of storage to configure.
Enter a string value. Press Enter for the default ("").
Choose a number from below, or type in your own value
...
...
Storage> onedrive
...
```

我们选择`onedrive`，接下来是询问`client_id`和`client_secret`，这里直接回车，后面会通过打开浏览器来授权：  

```bash
Microsoft App Client Id
Leave blank normally.
Enter a string value. Press Enter for the default ("").
client_id>
Microsoft App Client Secret
Leave blank normally.
Enter a string value. Press Enter for the default ("").
client_secret>
Edit advanced config? (y/n)
y) Yes
n) No
y/n> n
Remote config
Use auto config?
 * Say Y if not sure
 * Say N if you are working on a remote or headless machine
y) Yes
n) No
y/n> y
If your browser doesn\'t open automatically go to the following link: http://127.0.0.1:53682/auth
Log in and authorize rclone for access
Waiting for code...

```

会自动打开浏览器，请求服务授权，授权成功后返回终端继续：  

```bash
Got code
Choose a number from below, or type in an existing value
...
Your choice> 1
Found 1 drives, please select the one you want to use:
0: OneDrive (business) id=b!Eqwertyuiopasdfghjklzxcvbnm-7mnbvcxzlkjhgfdsapoiuytrewqk
Chose drive to use:> 0
Found drive 'root' of type 'business', URL: https://org-my.sharepoint.com/personal/you/Documents
Is that okay?
y) Yes
n) No
y/n> y
--------------------
...
--------------------
y) Yes this is OK
e) Edit this remote
d) Delete this remote
y/e/d> y
Current remotes:

Name                 Type
====                 ====
onedrive             onedrive

e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> q
```

这样就配置好了`OneDrive`的访问，现在在终端可以使用`rclone`的操作命令来查看远程存储的内容了：  

```bash
❯ rclone lsd onedrive:
❯ rclone copy ./file onedrive:Temp/
❯ rclone ls onedrive:Temp/
     1452 file
```

关于`OneDrive`的详细详细，参考[官方文档](https://rclone.org/onedrive/)。  

### Dropbox

其实`Dropbox`的配置方式与上面几乎一样，就不做具体的展示了，只是要说明的一点是，对于像`Dropbox`，`Google Drive`之类的服务，需要你终端配置相应的代理（也就是可以科学上网），否则会无法访问相应的服务。  

当前配置完成之后，运行命令 `rclone config` 可以看到当前配置了的远程服务：  

```bash
❯ rclone config
Current remotes:

Name                 Type
====                 ====
dropbox              dropbox
gdrive               drive
onedrive             onedrive

```

相应的配置文件位置在 *~/.config/rclone/rclone.conf* 。  

## 基于Web的图形界面

基于Web的图形管理界面是实验性的功能，可通过以下命令打开：  

`❯ rclone rcd --rc-web-gui`  

其会自动打开浏览器并自动登录，   

![rclone-webui-dashboard](https://images.mengz.dev/posts/rclone-webui.webp)  

- Dashboard ： 显示Rclone的状态，全局状态、速度和允许设置的带宽  
- 配置 ： 允许添加新的后端配置、更新或者删除现有的配置  
- Explorer ： 允许浏览配置的Rclone远程后端，并执行文件操作  
- Backend ： 版本信息和各种后端设置  

## 总结

Rclone提了大量的云存储服务支持，供用户选择，使得用户方便在命令行终端操作云存储的文件和目录，同时提供了一个实验性的基于Web的图像界面，使用方便，有兴趣的朋友可以尝试一下。  

更多的功能请参考[官方网站](https://rclone.org/)。