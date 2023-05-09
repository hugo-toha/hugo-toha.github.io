---
title: "TF执行计划可视化"
description: "介绍一款展示Terraform执行计划的可视化工具"
date: 2021-11-26T16:13:46+08:00
categories: ["DEVOPS"]
hero: tf-plan.png
tags: ["terrafrom"]
menu:
  sidebar:
    name: "TF执行计划可视化"
    identifier: tf-rover
    parent: devops
    weight: 10
---

之前我们通过[一篇文章](../tf-aws-lightsail/)入门了使用[Terrafrom](https://www.terraform.io)以声明式配置文件（可版本化的代码）来创建和管理基础设施资源。  
在使用命令`terraform apply`之前，我们通常使用`terraform plan`来查看执行计划，输出的执行计划以类似“git diff”的文本方式描述。这里我们将介绍如何以图形可是化的方式来了解执行计划。  

## Terrafrom Graph

首先Terraform CLI工具自带了一个子命令 - [graph](https://www.terraform.io/docs/cli/commands/graph.html)，graph命令用于生产配置和执行计划的图形表示，其输出是DOT格式，可以通过[Graphviz](http://www.graphviz.org/)转化为图片，例如在Linux终端下  

```bash
❯ terraform graph | dot -Tsvg > graph.svg
```

![tf-graph-1](https://images.mengz.dev/posts/tf-graph.svg)  

对于简单的项目（管理的资源对象比较的情况），我们可以通过这个图形了解资源对象的关系。但是如果一个项目管理了大量的资源对象，使用graph生成的图形会显得错中复杂，而且图形文件也比较庞大。  

那接下我们将介绍一款开源的可视化工具。  

## Rover

[Rover](https://github.com/im2nguyen/rover)是一款开源的，可交互的Terraform配置和执行计划可视化工具，其通过Web服务的方式，是我们可以通过浏览器查看生成的图形，并进行一些交互操作。  

使用Rover非常容易，可以从其Github项目的[Release](https://github.com/im2nguyen/rover/releases)下载为各平台编译好的二进制文件（命令）来运行，也可以通过Docker容器的方式运行。  

如果使用下载的二进制文件，将下载好的二进制文件（例如 *rover_v0.2.2*）放到PATH路径下，例如 */usr/local/bin/rover*，接下來在Terraform项目的文件夹下执行  

```bash
❯ rover
2021/11/26 16:59:34 Starting Rover...
2021/11/26 16:59:34 Initializing Terraform...
2021/11/26 16:59:35 Generating plan...
2021/11/26 16:59:37 Parsing configuration...
2021/11/26 16:59:37 Generating resource overview...
2021/11/26 16:59:37 Generating resource map...
2021/11/26 16:59:37 Generating resource graph...
2021/11/26 16:59:37 Done generating assets.
2021/11/26 16:59:37 Rover is running on 0.0.0.0:9000
```

运行rover命令，其将会执行以下操作  

1. 解析目录下的配置文件，并通过Terraform plan生成执行计划文件  
2. 解析计划和配置文件，生成3种对象： 资源概览（rso），资源映射图（map），资源图（graph）  
3. 使用上面的3中对象，将其转换为可交互的配置和状态视图，以Web服务器运行在本地的 **9000** 端口  

我们可以通过浏览器访问 http://localhost:9000/ 来查看可视化的结果。  

整个页面包含4个部分  

**LEGEND** - 该部分是对图例的一些说明  

![rover-legend](https://images.mengz.dev/posts/tf-rover-legend.png)  

**GRAPH** - 这部分是整个资源关系和状态的视图，可使用鼠标进行缩放，拖拽，以及选择某一个资源  

![rover-graph](https://images.mengz.dev/posts/tf-rover-graph.png)  

**RESOURCES** - 资源文件的映射列表，现实了资源在配置文件中的定义位置，同时也可以使用鼠标进行选择  

![rover-resources](https://images.mengz.dev/posts/tf-rover-resources.png)  

**DETAILS** - 详细信息视图，当使用鼠标选择了 **GRAPH** 或者 **RESOURCES** 视图中的资源对象时，这里将现实其详细的信息  

![rover-detailsj](https://images.mengz.dev/posts/tf-rover-details.png)  

通过与 `terraform graph` 生成的图形对比，Rover展示了更加丰富和美观的视图，让我们能以可视化的方式充分理解项目所管理的资源。  


## 注意的问题  

1. Rover还不支持使用了“remote” - Backend的项目，因为还没办法将执行计划保存到本地

## 介绍视频

HashiCrop的工程师[Tu Nguyen](https://github.com/im2nguyen/)，也就是Rover的开发者，在 [Youtube](https://www.youtube.com) 上发布了他[介绍Rover的视频](https://www.youtube.com/watch?v=zIwZ6XEeCAo)

{{< video src="https://dsdcdn.oss-cn-hongkong.aliyuncs.com/mengzdev/videos/Terraform-Visualization-Rover-zIwZ6XEeCAo.mp4" >}}

<!-- markdown-link-check-disable-next-line -->
Video by [Tu Nguyen](https://github.com/im2nguyen/) From [Youtube](https://www.youtube.com)
