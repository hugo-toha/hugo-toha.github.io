---
title: "解读OPEN GITOPS 1.0"
description: "解读CNCF的GitOps工作组发布的GitOps 1.0版规范"
date: 2021-11-25T20:16:10+08:00
categories: ["DEVOPS"]
hero: open-gitops.webp
tags: ["gitops", "cncf"]
menu:
  sidebar:
    name: "解读OPEN GITOPS 1.0"
    identifier: open-gitops
    parent: devops
    weight: 10
---

[GitOps](https://about.gitlab.com/topics/gitops/)的概念以及提出了几年时间了，伴随着DevOps的发展也来越流行。简单地说，GitOps是一套操作和管理软件系统的原则，其源自于现代软件运维，也根植于之前存在和广泛采用的最佳实践。虽然其名字中包含Git，但其所表示的是与版本控制系统相关，而不仅限于Git工具。也可以说其是一个运维框架，它将 DevOps 最佳实践用于应用程序开发，例如版本控制、协作、合规性和 CI/CD 工具，并将它们应用于基础设施自动化。  

去年，来自Amazon和Azure，Codefresh，Github，Redhat，Weaveworks等具有云原生经验公司的工程师们在[云原生计算基金会（CNCF）](https://cncf.io/)下组建了一个[GitOps工作组](https://github.com/gitops-working-group/gitops-working-group)，并创建了[OpenGitOps](https://github.com/open-gitops)项目。  

GitOps工作组在上个月（10/09）发布了[OpenGitOps原则和术语1.0版本](https://github.com/open-gitops/documents/releases/tag/v1.0.0)。  


## OpenGitOps 1.0

GitOps工作组的联合主席 - [Leonardo Murillo](https://www.linkedin.com/in/leonardomurillo)说过，“很多人认为他们在做GitOps，因为他们正在使用git，并且使用拉取请求（Pull Request）和推送更改（Push Changes）。而我们希望社区开始看到GitOps不仅仅是使用git的CI/CD流水线，其还包含很多”。  

工作组首先定义了GitOps的核心原则和相关术语，而我们可以用自己的方式自由地解释这些原则，并通过相关的DevOps工具实现最佳实践。  

发布的[1.0版本](https://github.com/open-gitops/documents/releases/tag/v1.0.0)由两个简单的[原则](https://github.com/open-gitops/documents/blob/v1.0.0/PRINCIPLES.md)和[术语](https://github.com/open-gitops/documents/blob/v1.0.0/GLOSSARY.md)文档组成，每一个原则都讨论了系统的需求状态（Desired State）以及它应该如何运行。  

GitOps所管理的系统的需求状态必须满足  

1. 声明式的（Declarative） - GitOps管理的系统必须以声明的方式表达其所需要的状态。  
2. 版本化和不可变（Versioned & Immutable） - 系统所需要的状态将以不可变、版本化的方式存储，以及保留完整的版本历史信息。  
3. 自动拉取（Pulled Automatically） - 软件代理会自动从源中提取所需的状态声明。  
4. 持续调节（Continuously Reconciled） - 软件代理持续观察系统状态并尝试达到系统所需要的状态。  

## 进一步解读

声明式的状态应该很好理解，声明式的描述不应该包含如何达到需求状态的操作，而仅仅描述系统或者应用所需要的状态。例如可使用[Terraform](https://www.terraform.io)来描述和管理一个基础设施，也可以使用[Kubernetes](https://www.kubernetes.io)的应用部署文件（mainfest）来管理部署的应用。  

版本化和不可变通常理解为是用“git”，其实不仅限于此，这里更加强调的是使用具体的版本标签来定义系统的一个版本状态，而不应该使用例如“latest”之类的标签，因为其不能回退到之前所需要的状态。而其他版本管理系统，只要满足这样的版本标签功能，以及符合团队的协作方式，都可用于GitOps。  

自动拉取意味着我们必须有一个系统内的代理持续观测系统的状态，其需要时时刻刻知道系统所需要的状态和当前状态，而不是在触发确切的更改时才去获取系统得到状态。这里的拉取（Pull）明确地表明了其于CI/CD流水线由条件来触发的不同。  

而持续调节将以上三个部分整合，系统内的代理必须时刻了解管理的系统的实际状态和所需的状态，当发现实际状态和所需的状态由偏差时，或者发现所需状态被改变时（版本改变），其应该尽力时系统状态达到所需求的状态。而这一切都是由系统自动完成的。  

当团队遵循以上原则来管理和维护系统和应用时，才是对GitOps的真正实践。  

## OpenGitOps发展

OpenGitOps 1.0仅仅定义了部分实现GitOps的原则，接下来还需要扩展更多的定义，例如如何在GitOps环境中处理事件管理，安全管理，凭证管理等。如果我们的基础设施环境以及我们的应该出现故障，那么在GitOps中应该遵循怎么样的处理原则？  
期待CNCF GitOps工作组的进一步工作。  
