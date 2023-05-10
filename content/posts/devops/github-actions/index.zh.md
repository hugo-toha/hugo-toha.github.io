---
title: "GITHUB ACTIONS工作流"
description: "介绍如何使用Github Actions创建CI/CD工作流"
date: 2020-03-05T17:31:54+08:00
categories: ["DEVOPS"]
hero: github-actions.webp
tags: ["github", "cicd"]
menu:
  sidebar:
    name: "GITHUB ACTIONS工作流"
    identifier: github-actions
    parent: devops
    weight: 10
---

这篇文章以一个简单的Nodejs应用为例，示例如何使用[Github Actions](https://github.com/features/actions)来自动构建，测试和部署一个应用．  

## 什么是Github Actions

首先简单介绍下什么是Github Actions？　Github Actions是Github官方提供的一个与Github集成在一起的CI/CD工具，使用Github Actions可以非常容易地自动化你的所有软件工作流程，包括持续集成（CI）和持续发布（CD）．  

不过要使用Github Actions，你需要将你的项目代码库放在Github上，然后为代码库配置相应的工作流（Workflows）．　　

![Github-Actions](/images/devops/github-actions.png)

### Actions Runner

使用Github Actions来执行工作流任务，还需要一个可执行的环境，Actions Runner就是提供这样的环境，Github Actions支持两种类型的Runner:  

- Github-Hosted Runner : 由Github官方提供和维护的Runner服务器，不需要用户自己维护和更新，有支持Linnux，Windows，macOS环境的构建  
- Self-Hosted Runner : 用户自己使用本地机器，云服务器安装Actions应用，用户可以自定义硬件，软件等需求  

### Actions

在Github Actions中有一个Action的概念，Actions是一个独立的任务，你可以组合这些任务成为要完成一个工作的步骤.　　

在工作步骤中，你可以自己写执行命令组成Action，也可以直接使用Github社区提供的针对一个写公共任务的Actions，可以到[Github市场](https://github.com/marketplace?type=actions)查找社区或者其他开发人员编写的Actions．　　

例如一个最常用的Action - [checkout](https://github.com/marketplace/actions/checkout)，可用来检出代码库：  

```yml
- uses: actions/checkout@v2
```

除了以上概念之外，Github Actions还有其他概念需要了解，具体可参考　(https://help.github.com/en/actions/getting-started-with-github-actions/overview)  

## Nodejs应用示例

接下来，我们就那个简单的nodejs应用来看看如何使用Github Actions创建CI/CD的流程．  

首先，你的项目代码库需要放在Github上，例如　https://github/mengzyou/hellonode/ ，访问你的代码库主页，然后点击 `Actions` 进入Actions页面．  

![Access-Actions](/images/devops/access-actions.png)  

根据你的代码库的语言类型，Github推荐了一些Workflow的模板，这里我们将使用Nodejs的模板　　

![nodejs-template](/images/devops/actions-nodejs-template.png)  

直接点击 `Set up this workflow` 来应用这个模板，然后Github会直接打来Web编辑器来编辑这个模板文件  

![nodjs-workflow-editor](/images/devops/actions-workflow-editor.png)  

你可以直接使用该文件，也可以修改，添加需要的Actions，完成之后可以点击　`Start commit` 按钮来提交Workflow文件，Github会自动为代码库创建目录　`.github/workflows/`，以及把该文件放在该目录下，例如　`.github/workflows/nodejs.yml` .　　

提交之后，Github Actions就会根据Workflow的内容开始运行相应的工作．  

### 创建一个执行测试CI工作流

其实我们也可以直接编辑本地代码库，添加目录　`.github/workflows/｀，以及创建相应的Workflows配置文件，例如我们创建一个　`.github/workflows/nodejs.yml`　　

```yml
name: Node.js CI

on:
  push:
    branches:
      - master

jobs:
  build:

    runs-on: ubuntu-latest
    container: node:12.16-alpine

    steps:
      - name: Checkout repository code
        uses: actions/checkout@v2
      - name: Cache node modules
        uses: actions/cache@v1
        env:
          cache-name: cache-node-modules
        with:
          path: ./node_modules
          key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-build-${{ env.cache-name }}-
            ${{ runner.os }}-build-
            ${{ runner.os }}-

      - name: Install Dependencies
        run: npm install

      - name: Test
        run: npm test
        env:
          CI: true
```

我们就定义了一个Workflow，并命名为 **Node.js CI**，将在master分支发生push时执行．并且定义了一个名为　**build** 的工作（job），该工作将使用Github-Hosted Runner（ubuntu-latest，Github-Hosted Runner会虚拟化一个相应的操作系统环境），我们也会使用容器来执行相应的步骤，这里使用了Docker容器镜像`node:12.16-alpine`.　　

`setps`定义将要执行的没有个步骤，可以给每个步骤命名，也可以直接调用相应的Actions，或者直接使用　`－run` 来执行命令．　　
上面的步骤中，有使用　`actions/checkout@v2` 来拉去代码库，也有使用　`actions/cache@v1` 来创建使用缓存（使用缓存可加速工作流的执行），然后使用直接行命令　`npm install` 和　`npm test`　的步骤．　　

当我们编写好之后，创建一个提交，然后Push到Github上master分支，就会出发一次定义的CI流程，如下图所示  

![nodejs-build-job](/images/devops/actions-nodejs-test.png)  

我们可以通过Github代码库的`Actions`页面查看Workflow执行的状态和结果，也可以查看执行的日志．  

在上面的示例中，我们的工作流里只有一个Job，就是测试代码，我们可以添加更多的Job来只想其他任务．例如打包我们的应用，部署我们的应用．  

下面我们就添加更多工作来完成我们的整个CI/CD工作流．  

### 添加一个工作打包应用的Docker镜像

我们编辑　`.github/workflows/nodejs.yml` 文件，添加以下内容　　

```yml
  package:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Checkout repository code
        uses: actions/checkout@v2
      - name: Build & Push container image
        uses: mr-smithers-excellent/docker-build-push@v2
        with:
          image: mengzyou/hellonode
          tag: latest
          registry: docker.io
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
```

我们添加两一个job - package，这个job将运行在Github-Hosted Runner（ubuntu-latest）上，`needs` 表示该job需要 `build`　job成功执行完成之后才执行．  
包括了两个步骤，拉取代码库，然后是使用 `mr-smithers-excellent/docker-build-push@v2` Action来执行容器镜像的构建和推送．　　
这个Action中，我们还使用到了Github Actions的Secrets，Secrets可以配置一些敏感的变量，到Github代码库设置的Secrets进行配置  

![actions-secrets](/images/devops/github-actions-secrets.png)  

这里我们配置了推送Docker镜像到Dokcer Hub需要的用户名和访问凭证. 对于[Docker Hub](https://hub.docker.com/)，推荐使用[Docker Hub Access Token](https://docs.docker.com/docker-hub/access-tokens/)作为访问密码．  

我们将Workflow提交到master分支后，在地一个`build`工作之后，就发触发这个job，打包镜像并推送到Docker Hub.　　

### 添加一个工作来自动部署

接下来，为了完成整个CI/CD的演示，我们再添加一个job，名为　`deploy`．　对于这个job的执行，我们需要使用一个Self-Hosted的Runner．  

访问代码库的Github界面，点击`Settings`，然后点击左侧边栏的`Actions`，再点击`Add runner｀按钮  

![add-runner](/images/devops/github-actions-add-runner.png)  

按照弹出来的指导，在需要部署应用的服务器上安装 `action-runner`，这里我们选择的是在一个Linux上安装，成功启动runner应用之后，会连接Github服务，在Gihub的`Self-hosted runners`下能看到添加的runner的状态，这样添加的一个Self-hosted runner会具有标签['self-hosted','linux','x86']，这些标签将会用于job选择合适runner来执行．  

添加了Self-hosted　Runner之后，我们就可以在Workflow里添加相应的job了　　

```yml
  deploy:
    runs-on: [self-hosted,linux]
    needs: package
    env:
      CONTAINER_IMAGE: mengzyou/hellonode
      CONTAINER_NAME: webapps_hellonode
    steps:
      - name: Docker pull image
        run: docker image pull $CONTAINER_IMAGE
      - name: Docker stop container
        run: docker container stop $CONTAINER_NAME
      - name: Docker remove container
        if: always()
        run: docker container rm -f $CONTAINER_NAME
      - name: Docker run container
        if: always()
        run: docker container run --name $CONTAINER_NAME -d -p 8000:3000 $CONTAINER_IMAGE
      - name: Prune images
        if: always()
        run: docker image prune -f    # remove the dangling images
```

这里，我们将 `runs-on`　设置为　[self-hosted,linux]　来选择运行的Runner服务器，然后该job需要　`package` job 成功完成之后才会执行．　　
我们还配置了两个Job（．job.env）范围内的变量来使用我们的容器镜像和名字．然后包含了以下执行步骤：　　

1. 从Docker Hub拉取上一个Job构建出来的容器镜像  
2. 停止运行的容器  
3. 删除之前的应用容器  
4. 使用新的镜像运行一个新的应用容器  
5. 清理旧的容器镜像  

提交代码，Push到master分支，这样一个包含３个Jobs的Workflow就会自动执行，如果在任何一个Job中只想错误，都会停止后续的Jobs，并且给出反馈．  

![ci-ci-workflow](/images/devops/github-actions-cicd-workflow.png)  

## 总结

上面通过为一个简单的nodejs应用添加了Github Actions来完成了一个构建，打包，部署的CI/CD流程．通过使用Github Actions，可以很容易地为我们放在Github上的项创建CI/CD流程，管理软件开发的生命周期（SDLC）．　　

Gihhub Actions类似于[Gitlab](https://gitlab.com/)的[Gitlab-CI](https://docs.gitlab.com/ee/ci/)，以及［Jinkens］(https://jenkins.io/zh/)，还有很多第三方的CI/CD服务．  

Github Actions是Github原生支持的，因此对于代码库管理在Github上的组织和用户，更容易使用．

> 参考
> - https://help.github.com/en/actions
