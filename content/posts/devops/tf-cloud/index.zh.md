---
title: "迁移本地项目到TF CLOUD"
description: "以Terraform Cloud作为执行Backed来迁移本地Terraform项目，并管理资源状态"
date: 2021-11-25T10:49:14+08:00
categories: ["DEVOPS"]
hero: tf-cloud.jpg
tags: ["terrafrom", "cloud"]
menu:
  sidebar:
    name: "迁移本地项目到TF CLOUD"
    identifier: tf-cloud
    parent: devops
    weight: 10
---

[之前文章](../tf-aws-lightsail/)我们尝试了在本地环境使用Terraform来创建和管理AWS Lightsail资源，对于管理一些云资源，我们需要在本地安装相应的CLI工具和配置访问相应云资源的凭据（例如AWS CLI， AccessKeyID等），Terraform通过调用本地的CLI工具或者云API来管理云资源的状态，其默认使用的是`local`类型的Backend，资源的状态文件(*.tfstate*)也是保存在本地文件目录中的。  
这篇文章我们将尝试使用`remote`类型的Backend，将项目迁移到[Terraform Cloud](https://www.terraform.io/cloud)去执行，并且由Terraform Cloud来管理资源状态。  

## 什么是Terraform Cloud

Terraform Cloud 是一个管理Terraform在一致且可靠的环境中运行的SaaS应用，从而可以替换在本地机器是执行Terraform项目，其存储共享的状态和机密数据，并可以连接到版本控制系统（如 Git)，使得我们可以在团队中将基础设施作为代码进行工作。  
Terraform是一个商业应用，团队和商业使用将会收取费用并提供了更多的高级功能。但对于个人用户，可以免费使用基本的功能。关于费用和功能详情，可以参考 (https://www.hashicorp.com/products/terraform/pricing)。  

首先我们需要注册一个Terraform Cloud的账号，访问 https://app.terraform.io/public/signup/account ，根据提示注册账号  

![sigup-page](https://images.mengz.dev/posts/tf-cloud-signup.png)  

注册完成后第一次登陆Terraform Cloud，其会询问如何开始一个项目，这里我们选择 **Start from scratch**，也就是将从一个空模板开始  

![start-from-scratch](https://images.mengz.dev/posts/tf-cloud-setup.png)  

接下来我们需要创建一个组织（Organization），例如这里我创建一个名为 **learn-terraform** 的组织，一个组织就类似要给命名空间，可以管理多个工作空间（Workspace），还可以管理其下工作空间共享的变量和环境变量。  

接下来我们需要在本地环境登录Terraform Cloud，并添加相应的配置来重新初始化项目。  

## 重新初始项目  

完成了Terraform Cloud的账号注册之后，我们需要在本地终端运行 `terraform login` ，会打开浏览器来登录账号得到一个Token值，将其复制填入终端完成登录  

```
> terrafrom login
Terraform must now open a web browser to the tokens page for app.terraform.io.

If a browser does not open this automatically, open the following URL to proceed:
    https://app.terraform.io/app/settings/tokens?source=terraform-login


---------------------------------------------------------------------------------

Generate a token using your browser, and copy-paste it into this prompt.

Terraform will store the token in plain text in the following file
for use by subsequent commands:
    /home/mengz/.terraform.d/credentials.tfrc.json

Token for app.terraform.io:
  Enter a value:
```

接着我们修改项目的配置文件 *main.tf* ，加入 `backend "remote"`   

```tf
terraform {
  backend "remtoe" {
    organization = "learn-terraform"
    workspaces {
      name = "mylightsail"
    }
  }

  ...
}
```

执行 `terraform init` ，Terraform将下载remote的插件，连接至Terraform Cloud 的 **learn-terraform/mylightsail** 工作空间，并将本地的状态文件迁移到云端  

```bash
$ terraform init

Initializing the backend...Do you want to copy existing state to the new backend?  Pre-existing state was found while migrating the previous "local" backend to the  newly configured "remote" backend. No existing state was found in the newly  configured "remote" backend. Do you want to copy this state to the new "remote"  backend? Enter "yes" to copy and "no" to start with an empty state.
  Enter a value: yes
Releasing state lock. This may take a few moments...
Successfully configured the backend "remote"! Terraform will automaticallyuse this backend unless the backend configuration changes....
```

浏览器访问Terraform Cloud WebUI，进入相应的工作空间可以查看状态信息。  

完成之后可以将本地的 *.terraform/terraform.tfstate* 文件删除。本地项目已将Terraform Cloud作为远程后端（remote backend），并且关联了命令行(CLI)驱动的方式，因此后续可以在本地更新资源配置文件，然后在本地运行 `plan & apply` 命令，这将会触发在远端Cloud上执行具体的状态维护工作。不过要使用Terraform Cloud来执行状态维护，我们还需要将AWS的访问凭据配置到Terraform Cloud上。  

## 配置工作空间的环境变量

使用Terraform Cloud来维护云资源（例如AWS），我们需要配置相应的访问凭据。这里我们需要配置AWS的 `AWS_ACCESS_KEY_ID` 和 `AWS_SECRET_ACCESS_KEY` 作为项目空间的环境变量。  
在工作空间点击 **Variables** 标签页，点击 **+ Add Varaible** 按钮  

![ad-varaible](https://images.mengz.dev/posts/tf-cloud-workspace-variable.png)  

选择 **Environment Variables** ，然后添加 `AWS_ACCESS_KEY_ID` 和 `AWS_SECRET_ACCESS_KEY` 两个环境变量，并设置相应的值。  

完成之后，我们就可以本地控制台运行 `terraform plan`，`terraform apply` 将操作发送到Terraform Cloud端去运行，当然我们还是可以在本地项目执行 `terraform show` 来查看当前的状态，状态将会管理在云端  

![terraform-cloud-state](https://images.mengz.dev/posts/tf-cloud-state.png)  

```bash
> terraform plan
Running plan in the remote backend. Output will stream here. Pressing Ctrl-C
will stop streaming the logs, but will not stop the plan running remotely.

Preparing the remote plan...

To view this run in a browser, visit:
https://app.terraform.io/app/mengz-infra/my-lightsail/runs/run-LzwFBbihffEKmucd

Waiting for the plan to start...

Terraform v1.0.11
on linux_amd64
Configuring remote state backend...
Initializing Terraform configuration...
aws_lightsail_static_ip.outline-sig-ip: Refreshing state... [id=Outline-EIP]
aws_lightsail_instance.outline-sig: Refreshing state... [id=Outline-Sig]
aws_lightsail_instance_public_ports.outline-sig-public-ports: Refreshing state... [id=Outline-Sig-987241840]
aws_lightsail_static_ip_attachment.outline-sig-ip-attache: Refreshing state... [id=Outline-EIP]

No changes. Your infrastructure matches the configuration.

Terraform has compared your real infrastructure against your configuration
and found no differences, so no changes are needed.
```

可以看到计划是在 remote backend 运行的。  

## 本版化管理项目  

最后，我们可以将项目的配置文件提交到版本控制系统（例如 Gitlab），并配置工作空间的版本控制  

![terraform-cloud-version-control](https://images.mengz.dev/posts/tf-cloud-version-control.png)  

在Terraform Cloud工作空间的设置里，按照提示配置关联相应的版本管理代码仓库。完成之后，我们在本地提交更新的代码后，会自动触发Terraform Cloud去执行维护新的状态。不过这将不会允许在本地终端执行 `terraform apply`  

```bash
> terraform apply

│ Error: Apply not allowed for workspaces with a VCS connection
│ A workspace that is connected to a VCS requires the VCS-driven workflow to ensure that the VCS remains the single source of truth.
```

只能通过更新代码，然后提交到远程代码仓库的方式来触发状态维护。这将更加便于与团队共享基础设施代码，以及共同维护基础设施状态，同时也更加趋于GitOps的工作方式。  


## 总结

本文基于[上一篇文章](../tf-aws-lightsail/) - 尝试使用Terraform在本地环境管理AWS Lightsail资源，延申了将状态管理的操作迁移到以Terraform Cloud作为远程后端的尝试，除了Terraform Cloud之后，还有其他类型的Backend，可以参考 (https://www.terraform.io/docs/language/settings/backends/index.html)。  
自此，我们初探了使用Terraform作为IaC工具来管理AWS Lightsail资源，当作Terraform学习的一个入门。Hashicrop官方提供了更多的[学习资源和文档](https://learn.hashicorp.com/terraform)，想深入学习Terrform，并投入到实际工作中，还请参考[官方文档](https://www.terraform.io/docs/)。  