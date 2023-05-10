---
title: "TF管理AWS LIGHTSAIL实例"
description: "示例使用Terraform管理AWS Lightsail实例"
date: 2021-11-23T13:42:41+08:00
categories: ["DEVOPS"]
hero: tf-aws.webp
tags: ["terraform", "aws"]
menu:
  sidebar:
    name: "TF管理AWS LIGHTSAIL实例"
    identifier: tf-aws-lightsail
    parent: devops
    weight: 10
---

[Terraform](https://www.terraform.com)是一种开源基础设施及代码（IaC）的工具，可提供一致的CLI（命令行接口)工作流来管理数百个云服务，将云API编码为声明性的配置文件进行管理。  
本文创建一个管理[AWS Lightsail](https://aws.amazon.com/lightsail/)实例的例子来入门Terraform的使用。  

<!-- more -->

## 安装Terraform CLI

要使用Terramform，首先要在本地系统安装Terraform命令行工具。HashiCorp提供了预编译好的二进制分发包，可以通过(https://www.terraform.com/downolads.html) 直接下载相应平台的二进制包，解压后放到相应的执行路径。也可以通过一些软件包管理工具安装，例如在Linux/OS X上通过LinuxBrew/HomeBrew进行安装，在Windows上通过Chocolatey进行安装。  

这里我们示例在Linux上是使用LinuxBrew进行安装    

```bash
> brew install terraform
```

安装完成后，可以查看其版本  

```bash
❯ terraform -version
Terraform v1.0.11
on linux_amd64
```

使用`-help`查看其可用命令，安装成功后，我们就可以使用Terraform来创建相应的基础设施项目了。  

## AWS账号准备

本文将通过创建一个管理AWS Lightsial实例的项目来尝试Terraform，因此需要一个AWS账号，以及在本地环境安装和配置好AWS CLI工具的访问凭据。  
安装和配置AWS CLI，请参考其文档 (https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) 。 配置完成之后，可以在本地命令行终端访问相应的AWS资源。  

## 创建并初始化Terraform项目

Terraform在本地通过文件夹来管理一个基础设施项目的声明性代码，例如我们在本地创建一个文件夹  

```bash
> mkdir mylightsail
> cd mylightsail/
```

进入文件夹后，创建一个以 *.tf* 作为后缀的文件，例如 `main.tf`  

```bash
> touch main.tf
```

然后使用编辑器打开文件进行编辑，写入以下代码块  

```tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.65"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "ap-southeast-1"
}
```

其中 `terraform/required_providers` 块定义了该项目需要的 **Provider**，Terraform是通过不同的Provider来管理相应的基础设施资源的，可到 (https://registry.terraform.io) 来查找需要的Providers，例如GCP，Azure以及阿里云等的Providers。这里因为我们要管理的资源是AWS Lightsail实例，所以使用了Hashicorp官方提供的 [hashicorp/aws](https://registry.terraform.io/providers/hashicorp/aws/latest) 。  

`provider "aws"` 部分配置了该Provider的一些可选项，例如这里配置了区域为 *ap-southeast-1* ，因此请确保上面配置的AWS访问凭据能够操作该区域的资源。  

也就是这里我们定义了我们需要使用的Provider及其相应的选项配置，接下来我们需要使用 `terraform init` 命令来初始化项目  

```bash
> terraform init

Initializing provider plugins...
...
Terraform has been successfully initialized!
```

初始化将会从 (https://registry.terraform.io/) 下载相应的Provider插件到 *.terramorm/providers/* 目录，供接下來的命令使用。  
同时，会生成一个 *.terraform.lock.hcl* 的文件来记录使用的具体Provider版本，其功能类似于NPM的package-lock文件，可将其提交到代码版本管理仓库，其他协作的成员就可以保持使用相同的插件版本。  

## 创建基础设施资源

完成项目的初始化之后，我们就可以编写需要创建的资源声明性配置，可以直接将相应的配置写入 *main.tf* 文件，也可以另外创建新的以 `.tf` 作为后缀的文件，这里我们创建一个新的名为 *resources.tf* 的文件，并写入我们需要的资源的定义  

```tf
## LightSail Resources

resource "aws_lightsail_static_ip" "Example-sig-ip" {
  name = "Example-EIP"
}

resource "aws_lightsail_instance" "Example-sig" {
  name              = "Example-Sig"
  availability_zone = "ap-southeast-1c"
  blueprint_id      = "ubuntu_20_04"
  bundle_id         = "nano_2_0"
  key_pair_name     = "LightsailDefaultKeyPair"
  tags = {
    Example = ""
  }
}

resource "aws_lightsail_static_ip_attachment" "Example-sig-ip-attache" {
  static_ip_name = aws_lightsail_static_ip.Example-sig-ip.id
  instance_name  = aws_lightsail_instance.Example-sig.id
}

resource "aws_lightsail_instance_public_ports" "Example-sig-public-ports" {
  instance_name = aws_lightsail_instance.Example-sig.name

  port_info {
    protocol  = "tcp"
    from_port = 0
    to_port   = 65535
    cidrs = [
      "0.0.0.0/0"
    ]
  }
  port_info {
    protocol  = "udp"
    from_port = 0
    to_port   = 65535
    cidrs = [
      "0.0.0.0/0"
    ]
  }
}
```

定义资源的格式为 `resource "[provider_resource _type]" "resource_name"`，第一个参数为相应Provider支持的资源类型名称，第二个参数为自己定义的资源名称（可用于其他资源引用）。例如，我们首先定义了一个Lightsail的静态IP资源，其中参数 `name` 指定了AWS资源的名称。  

上面的定义中，我们声明了以下资源  

- 一个Lightsail静态IP地址  
- 一个Lightsail计算实例，并绑定名为 `LightsailDefaultKeyPair` 的SSH密钥  
- 静态IP地址和计算实例的绑定  
- 实例的开放的网络端口组（类似于AWS EC2实例的安全组定义）  

保存文件之后，我们可以使用 `terraform fmt` 命令来格式化文件格式，以及 `terraform validate` 来检查是否有语法错误。  

定义好我们想要的资源之后，我们先通过命令 `terraform plan` 命令来执行计划，查看具体的执行更改（plan不会实际操作相应的资源）  

```bash
❯ terraform plan                    

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # aws_lightsail_instance.Example-sig will be created
  + resource "aws_lightsail_instance" "Example-sig" {
      + arn                = (known after apply)
      + availability_zone  = "ap-southeast-1c"
      + blueprint_id       = "ubuntu_20_04"
      + bundle_id          = "nano_2_0"
      + cpu_count          = (known after apply)
      + created_at         = (known after apply)
      + id                 = (known after apply)
      + ipv6_address       = (known after apply)
      + ipv6_addresses     = (known after apply)
      + is_static_ip       = (known after apply)
      + key_pair_name      = "LightsailDefaultKeyPair"
      + name               = "Example-Sig"
      + private_ip_address = (known after apply)
      + public_ip_address  = (known after apply)
      + ram_size           = (known after apply)
      + tags               = {
          + "Example" = ""
        }
      + tags_all           = {
          + "Example" = (known after apply)
        }
      + username           = (known after apply)
    }

  # aws_lightsail_instance_public_ports.Example-sig-public-ports will be created
  + resource "aws_lightsail_instance_public_ports" "Example-sig-public-ports" {
      + id            = (known after apply)
      + instance_name = "Example-Sig"

      + port_info {
          + cidrs     = [
              + "0.0.0.0/0",
            ]
          + from_port = 0
          + protocol  = "tcp"
          + to_port   = 65535
        }
      + port_info {
          + cidrs     = [
              + "0.0.0.0/0",
            ]
          + from_port = 0
          + protocol  = "udp"
          + to_port   = 65535
        }
    }

  # aws_lightsail_static_ip.Example-sig-ip will be created
  + resource "aws_lightsail_static_ip" "Example-sig-ip" {
      + arn          = (known after apply)
      + id           = (known after apply)
      + ip_address   = (known after apply)
      + name         = "Example-EIP"
      + support_code = (known after apply)
    }

  # aws_lightsail_static_ip_attachment.Example-sig-ip-attache will be created
  + resource "aws_lightsail_static_ip_attachment" "Example-sig-ip-attache" {
      + id             = (known after apply)
      + instance_name  = (known after apply)
      + ip_address     = (known after apply)
      + static_ip_name = (known after apply)
    }

Plan: 4 to add, 0 to change, 0 to destroy.
```

`+`表示将要增加的资源，(know after apply)的意思是要在具体只想（apply）之后，AWS根据定义创建相应资源之后才会返回的具体值。接下来就可以使用 `terraform apply` 来具体执行操作了，执行成功之后，会生成 *.terraform/terraform.state* 文件来记录执行后的资源状态，也可以通过命令 `terraform show` 命令来查看  

```bash
❯ terraform show
# aws_lightsail_instance.Example-sig:
resource "aws_lightsail_instance" "Example-sig" {
    arn                = "arn:aws:lightsail:ap-southeast-1:090767794770:Instance/21cb0ea5-e814-4307-8606-01348d98be15"
    availability_zone  = "ap-southeast-1c"
    blueprint_id       = "ubuntu_20_04"
    bundle_id          = "nano_2_0"
    cpu_count          = 1
    created_at         = "2021-11-08T05:49:05Z"
    id                 = "Example-Sig"
    ipv6_address       = "2406:da18:8ae:4b02:1f2:4ff1:daa1:6a8c"
    ipv6_addresses     = [
        "2406:da18:8ae:4b02:1f2:4ff1:daa1:6a8c",
    ]
    is_static_ip       = true
    key_pair_name      = "LightsailDefaultKeyPair"
    name               = "Example-Sig"
    private_ip_address = "172.26.45.249"
    public_ip_address  = "54.220.33.133"
    ram_size           = 0.5
    tags               = {
        "Example" = ""
    }
    tags_all           = {
        "Example" = ""
    }
    username           = "ubuntu"
}

# aws_lightsail_instance_public_ports.Example-sig-public-ports:
resource "aws_lightsail_instance_public_ports" "Example-sig-public-ports" {
    id            = "Example-Sig-987241840"
    instance_name = "Example-Sig"

    port_info {
        cidrs     = [
            "0.0.0.0/0",
        ]
        from_port = 0
        protocol  = "tcp"
        to_port   = 65535
    }
    port_info {
        cidrs     = [
            "0.0.0.0/0",
        ]
        from_port = 0
        protocol  = "udp"
        to_port   = 65535
    }
}

# aws_lightsail_static_ip.Example-sig-ip:
resource "aws_lightsail_static_ip" "Example-sig-ip" {
    arn          = "arn:aws:lightsail:ap-southeast-1:090767794770:StaticIp/3f0298e0-efeb-4429-9574-156fef12a48f"
    id           = "Example-EIP"
    ip_address   = "54.220.33.133"
    name         = "Example-EIP"
    support_code = "313963776615/54.220.33.133"
}

# aws_lightsail_static_ip_attachment.Example-sig-ip-attache:
resource "aws_lightsail_static_ip_attachment" "exmaple-sig-ip-attache" {
    id             = "Example-EIP"
    instance_name  = "Example-Sig"
    ip_address     = "54.220.33.133"
    static_ip_name = "Example-EIP"
}
```

之后我们就可以通过更新资源定义文件，然后执行 `plan & apply` 来更新云上的资源了，如果资源不需要了，我们也可以通过 `terraform destroy` 一条命令来销毁所有资源。  

## 总结

本文以管理简单的AWS Lightsail资源为例，展示了如何使用Terraform来管理云上的资源。通过一声明性的代码来定义我们需要的资源，同时资源定义代码可以通过版本管理工具进行版本化管理，进一步实现IaC的工作方式。  

这么我们使用的是Terraform的本地执行模式，除了在本地执行之外，Terraform还提供了执行后端（Backend）的功能，就可以将执行放到云上的一些执行环境，资源状态的管理也将会维护在Backend端，方便实现CI/CD Pipeline，以及GitOps的方式。其中Hashicorp的[Terraform Cloud](https://app.terraform.io/)就是一个Backend。下一篇文章将示例将该项目放到Terraform Cloud上去执行。  
