---
title: "IaC示例-TERRAFORM&ANSIBLE创建K3S集群"
description: "通过 Pacer，Terraform 和 Ansible 在本地环境自动化创 K3S 集群演示"
date: 2022-10-13T12:18:27+08:00
categories: ["DEVOPS"]
hero: k3s-terraform-ansible.webp
tags: ["terraform", "ansible", "k3s"]
menu:
  sidebar:
    name: "IaC示例-TERRAFORM&ANSIBLE创建K3S集群"
    identifier: k3s-terrafrom-ansible
    parent: devops
    weight: 10
---

[轻量级Kubernetes集群-K3S](../../k8s/lightweight-k3s/)文章介绍了一个轻量级的 Kubernetes 发行版本 - [k3s](https://k3s.io) 。  
这篇文章，我们将通过使用以下几个 IaC（Infrastructure as Code）工具，在本地环境（例如你的 Linux 工作台）自动化部署一个可用的 K3S 集群  

- [Packer](https://www.packer.io) - [HashiCorp](https://www.hashicorp.com/) 开源的一个系统镜像构建工具。  
- [Terraform](https://www.terraform.io) - HashiCorp 开源的基础设施及代码自动化管理工具。  
- [Ansible](https://www.ansible.com) - RedHat赞助的一个开源社区项目，IT自动化配置工具。  

## 环境需求

本演示将的所有操作将在一台支持虚拟化（kvm + qemu + libvirt) Linux 主机上执行。  

在 [Ubuntu](https://www.ubuntu.com) 上启用虚拟化环境，请参考 [KVM hypervisor: a beginner's guide](https://ubuntu.com/blog/kvm-hyphervisor) 。  
在 [Fedora](https://getfedora.org) 上启用虚拟化环境，请参考 [Getting startyed with virtualization (libvirt)](https://docs.fedoraproject.org/en-US/quick-docs/getting-started-with-virtualization/) 。  
在 [openSUSE](https://opensuse.org) 上启用虚拟化环境，请参考 [Virtualization Guide](https://doc.opensuse.org/documentation/leap/virtualization/html/book-virtualization/) 。  

其他 Linux 发行版，请参考相关文档。  

我是在我的笔记本电脑上执行的操作，系统是 openSUSE Leap 15.4 。  

除了上述的虚拟化需求外，还需要在系统上安装上面提到的几个工具。如果你的环境中有 [LinuxBrew](https://docs.brew.sh/Homebrew-on-Linux)，则可通过 Brew 直接安装  

```shell
❯ brew install packer terraform ansible
```

否则，请下载各自官方发布的二进制包，解压后放到 `PATH` 路径中。  

```shell
❯ packer version
Packer v1.8.3

❯ terraform version
Terraform v1.3.2
on linux_amd64

❯ ansible --version
ansible [core 2.13.4]
```

因为本示例中，使用了 Terraform 的 [ansbile provisioner](https://github.com/radekg/terraform-provisioner-ansible)，因此还需要安装这个插件  

```shell
❯ mkdir -p ~/.terraform.d/plugins

❯ curl -sL \
  https://raw.githubusercontent.com/radekg/terraform-provisioner-ansible/master/bin/deploy-release.sh \
  --output /tmp/deploy-release.sh

❯ chmod +x /tmp/deploy-release.sh

❯ /tmp/deploy-release.sh -v 2.5.0

❯ rm -rf /tmp/deploy-release.sh
```

完成以上需求之后，我们将开始执行如下步骤  

- 使用 Packer 创建一个基于 [Debian 11.5.0](https://mirrors.ustc.edu.cn/debian-cd/current/amd64/iso-cd/debian-11.5.0-amd64-netinst.iso) 的虚拟机系统模板镜像，该镜像中，将会配置好 SSH 免密登陆密钥。  
- 使用 Terraform 在本地虚拟环境中，创建出需要的虚拟机，并生成后续 ansible 配置虚拟机需要的 inventory 文件。  
- 使用 Ansible 配置虚拟机节点安装 k3s 集群，以及演示应用。  

以上所有步骤的代码在 （https://github.com/mengzyou/iac-examples）  

将代码克隆到本地  

```shell
❯ git clone https://github.com/mengzyou/iac-examples.git

❯ cd iac-example/k3scluster/
```

## 创建虚拟机镜像  

首先我们需要通过 Packer 创建一个虚拟机系统镜像，后续需要使用该镜像来创建虚拟机实例，需要的代码在 **k3scluster/packer/** 目录下 

```shell
❯ cd packer/

❯ tree 
.
|-- Makefile
|-- base.pkr.hcl
`-- preseed
    |-- debian11.txt

```

这里通过 Makefile 来调用 packer 进行镜像的构建，和上传到虚拟化环境，注意以下变量配置  

```makefile
LIBVIRT_HYPERVISOR_URI := "qemu:///system"
LIBVIRT_TEMPLATES_IMAGES_POOL := "templates"
LIBVIRT_TEMPLATES_IMAGES_POOL_DIR := "/var/lib/libvirt/images/templates"
LIBVIRT_IMAGE_NAME := "debian11-5.qcow2"
ROOT_PASSWORD := "rootPassword"
$(eval SSH_IDENTITY=$(shell find ~/.ssh/ -name 'id_*' -not -name '*.pub' | head -n 1))
```

默认使用 *${HOME}/.ssh/id_rsa* 的密钥对作为 SSH 免密访问的密钥，如果没有，请先创建一个。  

执行 `make image` 进行镜像的构建，以及在本地虚拟化环境创建名为 **templates** 的存储池，并将镜像上传到该存储池中，命名为 **debian11-5.qcow2** 的卷，具体的代码，请查看 *Makefile* 。  

```shell
❯ make image
...
```

完成之后，我们可以通过 **virsh** 命令查看镜像卷  

```shell
❯ sudo virsh vol-list --pool templates
 名称               路径
------------------------------------------------------------------------
 debian11-5.qcow2   /var/lib/libvirt/images/templates/debian11-5.qcow2
 ```

**补充**: 在文件 *base.pkr.hcl* 中，对 iso 文件源的配置  

```hcl
  iso_url           = "https://mirrors.ustc.edu.cn/debian-cd/current/amd64/iso-cd/debian-11.5.0-amd64-netinst.iso"
```

配置网络地址时，在 packer 进行构建时，可能会下载 iso 文件超时而导致构建失败。可通过预先下载对应的 iso 文件到本地文件系统，然后将 `iso_url` 配置为本地路径，例如  

```hcl
  iso_url           = "/data/debian-11.5.0-amd64-netinst.iso"
```

这样可以避免由于网络问题导致构建失败。  

## 创建虚拟机实例  

接下来，我们将使用 Terraform 创建并初始化集群所需要的虚拟机实例，进入 *k3scluster/terraform/* 目录  

```shell
❯ cd ../terraform/
```

该目录下包含了创建集群所需虚拟机资源的定义，首先看 *provider.tf* 文件  

```tf
terraform {
  required_providers {
    libvirt = {
      source  = "dmacvicar/libvirt"
      version = "0.7.0"
    }
  }
  required_version = ">= 0.13"
}

provider "libvirt" {
  uri = var.libvirt_uri
}
```

因为我们需要通过 libvirt 创建虚拟机，因此这里需要 [dmacvicar/libvirt](https://registry.terraform.io/providers/dmacvicar/libvirt/latest) 的 Provider，该 Provider 的 uri 配置为变量 `var.libvirt_uri`，默认为 `qemu:///system`，也就是本地虚拟环境。  

其他需要的变量定义都放在 *variables.tf* 文件中。资源文件 *vms.tf* 定义了需要创建的资源，其中包括  

```tf
resource "libvirt_network" "network" {
  name      = var.net_name
  mode      = "nat"
  domain    = var.net_domain
  addresses = [var.subnet]
  dhcp {
    enabled = true
  }
  dns {
    enabled    = true
    local_only = true
  }
}
```

创建一个 NAT 模式的虚拟网络，默认的网络地址为 `192.168.123.0/24`，可通过变量 `net_domain` 修改。  

```tf
resource "libvirt_volume" "disk" {
  count            = length(var.vms)
  name             = "${var.vms[count.index].name}.qcow2"
  pool             = "default"
  base_volume_name = var.template_img
  base_volume_pool = var.templates_pool
}
```

根据变量 **vms** 定义的虚拟机实例，创建虚拟机的系统磁盘，基于变量 **templates_pool** 和 **template_image** 指定的模板镜像，默认也就是上面我们通过 Packer 创建的系统镜像。  

```tf
resource "libvirt_domain" "vm" {
  count      = length(var.vms)
  name       = var.vms[count.index].name
  autostart  = true
  qemu_agent = true
  vcpu       = lookup(var.vms[count.index], "cpu", 1)
  memory     = lookup(var.vms[count.index], "memory", 512)

...
  }
}
```  

`libvirt_domain` 资源定义了需要创建的虚拟机实例，并通过 `ansible provisioner` 进行是初始化配置（配置静态IP地址和主机名）。  

```tf
resource "local_file" "ansible_hosts" {
  content = templatefile("./tpl/ansible_hosts.tpl", {
    vms        = var.vms
    subnet     = var.subnet
    gateway    = cidrhost(var.subnet, 1)
    mask       = cidrnetmask(var.subnet)
    nameserver = cidrhost(var.subnet, 1)
    user       = var.user
  })
  filename             = "../ansible/k3s_hosts"
  file_permission      = 0644
  directory_permission = 0755
}
```

该资源定义通过模板文件创建虚拟机实例的 Ansible Inventory 文件，便于下一步通过 Ansible 进行 K3S 集群的创建。  

在应用之前，我们需要配置 **vms** 变量，来指定我们需要的虚拟机实例信息  

```shell
❯ cp .k3svms.tfvars k3dcluster.auto.tfvars
```

```tfvars
vms = [
  {
    name   = "control"
    cpu    = 1
    memory = 1024
    ip     = 10
    groups = ["k3s"]
    vars   = {
      role = "server"
    }
  },
  {
    name   = "worker1"
    cpu    = 1
    memory = 1024
    ip     = 21
    groups = ["k3s"]
    vars = {
      role = "agent"
    }
  },
  {
    name   = "worker2"
    cpu    = 1
    memory = 1024
    ip     = 22
    groups = ["k3s"]
    vars = {
      role = "agent"
    }
  }
]
```

上面定义了3台实例，1台作为k3s集群的 server 节点，2台作为k3s集群的 role 节点，默认IP地址将会被配置为  

- control : 192.168.123.10
- worker1 : 192.168.123.21
- worker2 : 192.168.123.22

接下来我们将执行 Terrform 操作  

```shell
❯ terraform init

❯ terraform plan  

❯ terrafrom apply --auto-approve
...
Apply complete! Resources: 8 added, 0 changed, 0 destroyed.

Outputs:

vms_ip_addresses = {
  "control" = "192.168.123.10"
  "worker1" = "192.168.123.21"
  "worker2" = "192.168.123.22"
}
```

完成之后，3台虚拟机将会创建并运行，同时在 *k3scluster/ansible/* 目录中将创建名为 *k3s_hosts* 的 Inventory 文件。  

## 部署K3S集群  

完成虚拟机的创建之后，我们进入 *k3scluster/ansible/* 目录，进行下一步操作  

```shell
❯ cd ../ansible/

❯ ls
 apps.yml   init.yml   k3s.yaml   k3s_hosts   main.yml   roles
```

其中文件 *k3s_hosts* 是在上一步生成的 Inventory 文件，*init.yml* 文件是初始化节点的 playbook，在上一步的 Terraform 应用中以及执行了。  
*main.yml* 文件是安装配置 K3S 集群的 playbook，*roles/* 目录包含了所有的任务。   

在执行具体任务之前，我们可以通过 ansbile 测试下虚拟机节点的可用性  

```shell
❯ ansible -i k3s_hosts all -m ping
worker1 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
worker2 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
control | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

接下来执行 *main.yml* playbook  

```shell
❯ ansible-playbook -i k3s_hosts main.yml
...
PLAY RECAP ********************************************
control                    : ok=16   changed=7    unreachable=0    failed=0    skipped=4    rescued=0    ignored=0   
worker1                    : ok=8    changed=4    unreachable=0    failed=0    skipped=6    rescued=0    ignored=0   
worker2                    : ok=8    changed=4    unreachable=0    failed=0    skipped=6    rescued=0    ignored=0
```

这将会调用 *roles/k3s/* 里定义的任务，安装和配置 K3S 集群，具体的执行任务，请查看 roles 里的代码。  
成功之后，会发现在当前目录生成了一个 *k3s.yaml* 的文件，这是从 control 节点获取的 kubeconfig 文件，我们需要替换一下 api-server 的 IP  

```shell
❯ sed -i 's/127.0.0.1/192.168.123.10/g' k3s.yaml
```

之后，我们就可以通过该 kubeconfig 文件来访问该集群了，例如  

```shell
❯ kubectl --kubeconfig k3s.yaml cluster-info
Kubernetes control plane is running at https://192.168.123.10:6443
CoreDNS is running at https://192.168.123.10:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
Metrics-server is running at https://192.168.123.10:6443/api/v1/namespaces/kube-system/services/https:metrics-server:https/proxy

❯ kubectl --kubeconfig k3s.yaml get no
NAME                STATUS   ROLES                  AGE     VERSION
worker2.k3s.local   Ready    <none>                 4m19s   v1.25.2+k3s1
worker1.k3s.local   Ready    <none>                 4m18s   v1.25.2+k3s1
control.k3s.local   Ready    control-plane,master   4m39s   v1.25.2+k3s1
```

至此，我们就完成了一个 K3S 集群的部署，并可以在部署其他应用。最后，我们也可以继续使用 ansible 来部署演示应用。  
文件 *apps.yml* 是部署演示应用的 playbook，其通过 *roles/k3s-app/* 任务，与 k3s server 节点交互来进行应用部署，其会部署 [Traefik](https://traefik.io) Ingress 和一个 whoami web 应用，直接执行  

```shell
❯ ansible-playbook -i k3s_hosts apps.yml
...
PLAY RECAP *****************************************************
control                    : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0 
```

完成之后，通过 kubectl 命令查看部署的 pod  

```shell
❯ kubectl --kubeconfig k3s.yaml get po -n whoami
NAME                      READY   STATUS    RESTARTS   AGE
whoami-5b844ffb57-mffgf   1/1     Running   0          79s

❯ kubectl --kubeconfig k3s.yaml get ingressroute -n whoami
NAME     AGE
whoami   2m12s
```  

尝试访问 whoami 应用  

```shell
❯ http http://192.168.123.10/
HTTP/1.1 200 OK
Content-Length: 413
Content-Type: text/plain; charset=utf-8
Date: Thu, 13 Oct 2022 08:58:06 GMT

Hostname: whoami-5b844ffb57-mffgf
IP: 127.0.0.1
IP: ::1
IP: 10.42.2.3
IP: fe80::b83a:19ff:febe:7a7f
RemoteAddr: 10.42.0.5:60580
GET / HTTP/1.1
Host: 192.168.123.10
User-Agent: HTTPie/3.2.1
Accept: */*
Accept-Encoding: gzip, deflate
X-Forwarded-For: 192.168.123.1
X-Forwarded-Host: 192.168.123.10
X-Forwarded-Port: 80
X-Forwarded-Proto: http
X-Forwarded-Server: traefik-rjbr9
X-Real-Ip: 192.168.123.1
```

## 销毁集群

通过以上方式创建的 K3S 集群，我们可以很方便的通过 Terraform 销毁并重新创建。当完成了相关的应用测试之后，我们可以通过以下命令销毁集群  

```shell
❯ rm -f k3s.yaml

❯ cd ../terraform/

❯ terraform destroy --auto-approve
...
Destroy complete! Resources: 8 destroyed.
```

我就将会删除所创建的所有相关资源，恢复干净的本地环境。  

当需要集群的时候，只需要执行上面的步骤就可以创建一个新的 K3S 集群。  

## 总结

这里演示了一个 IaC 场景，通过代码化基础设施资源，我们可以很容易地通过 Terraform，Ansible 等工具管理并维护相应的基础设施资源。  
这里我们演示在本地虚拟化环境创建虚拟机并部署k3S集群，那通过 Terraform 的其他 Providers (例如 AWS, GCP等共有云)，我们可以代码化管理我们的公有云基础设施环境，并可以将相应的流程加入 CI/CD 中，可快速创建需要的环境做测试。  

IaC 是现代化基础设施运维的方向，结合相关工具，我们可以轻松实现基础设施自动化运维。  
