---
title: "GITLAB CI自动部署容器应用"
date: 2019-07-30T09:57:36+08:00
categories: ["DEVOPS"]
hero: gitlab-ci-docker.webp
tags: ["gitlab", "cicd", "docker"]
menu:
  sidebar:
    name: "GITLAB CI自动部署容器应用"
    identifier: gitlab-ci-docker
    parent: devops
    weight: 10
---

容器 [Docker](https://www.docker.com) 越来越受开发者和运维人员的喜爱，更是作为实践 [DevOps](https://zh.wikipedia.org/zh-hans/DevOps) 的一个中要工具。同时 [Gitlab](https://gitlab.com/) 提供了免费的代码管理服务，其 [gitlab-ci](https://about.gitlab.com/product/continuous-integration/) 更是提供了强大的自动化 CI/CD 流程功能。  

本文以一个静态站点的示例来说明如何使用 gitlab-ci 和 docker 进行容器镜像的构建，以及如何将镜像自动化部署到目标服务器上。  

### 编写Dockerfile

首先在代码库中增加 [Dockerfile](https://docs.docker.com/engine/reference/builder/) ，用于描述如何构建应用的容器镜像。以下是一个基于 [Hugo](https://gohugo.io/) 的静态站点应用的示例：  

```Dockerfile
FROM mengzyou/hugo:latest as builder

COPY . /app/

RUN hugo

FROM nginx:1.16-alpine

RUN set -x \
  && rm -f /etc/nginx/conf.d/default.conf \
  && mkdir -p /usr/share/nginx/html

COPY --from=builder /app/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/public/ /usr/share/nginx/html
```

其实非常简单，使用了多阶段构建，以 [mengzyou/hugo](https://hub.docker.com/r/mengzyou/hugo) 作为构建镜像，然后将生成的静态文件拷贝到 [nginx](https://hub.docker.com/_/nginx) 镜像中，最终生成静态站点的镜像。  

### 配置Gitlab-ci构建容器镜像

该阶段，在项目根目录添加 `.gitlab-ci.yml` 文件，示例内容如下：  

```yml
variables:
  DOCKER_DRIVER: overlay2
  CI_REGISTRY_IMAGE: ${CI_REGISTRY}/mengzyou/app

before_script:
  - echo $CI_JOB_NAME
  - echo $CI_PROJECT_DIR

stages:
  - build

build:docker:
  stage: build
  variables:
    DOCKER_HOST: tcp://docker:2375
  image: docker:stable
  services:
    - docker:dind
  script:
    - echo "Building image - $CI_REGISTRY_IMAGE:latest"
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin $CI_REGISTRY
    - docker image build --force-rm --no-cache -t $CI_REGISTRY_IMAGE:latest .
    - docker image push $CI_REGISTRY_IMAGE:latest
  only:
    - master
```

其中有几个变量是需要在代码库的 Gitlab 上进行配置，如下图所示：  

![gitlab-ci-setting](https://images.mengz.dev/posts/gitlab-cicd-variables.png)  

因为直接是用了 Gitlab 提供的容器镜像服务，构建完成的镜像需要推送到该镜像仓库服务，所以需要配置相应的仓库地址，用户名和登录密码：  

- CI_REGISTRY : 仓库地址，如 registry.gitlab.com  
- CI_REGISTRY_USER : Gitlab 的访问用户名  
- CI_REGISTRY_PASSWORD : Gitlab 的访问密码  

这样在推送镜像之前，需要进行一次登录操作。更多关于如何是用 Gitlab 容器镜像仓库可参考 https://docs.gitlab.com/ee/user/project/container_registry.html 。  

该 pipeline 工作使用了 [Gitlab Runner](https://docs.gitlab.com/runner/) 的 docker 执行器，如果是自己安装和注册 gitlab-runner ，请参考其文档。这里直接是用了 Gitlab.com 分享的 Runner 。

### 安装用于部署的gitlab-runner

为了在目标服务器上使用 gitlab-ci 进行自动部署（运行容器），需要在目标服务器上安装和注册 gitlab-runner 。由于目标服务器上运行容器，因此应该首先安装好 Docker 环境，同时 gitlab-runner 也直接是用容器运行（当然也可以直接本地运行，具体可以查看 gitlab-runner 的文档）。  

#### 安装注册Runner

可以使用 [docker-compose](https://docs.docker.com/compose/) 来部署 gitlab-runner 容器，在目标服务器上的 `~/gitalb/` 目录下编写如下 `docker-compose.yml` 文件：  

```yml
version: '2.4'

services:
  runner:
    image: gitlab/gitlab-runner:alpine-v11.11.0
    container_name: gitlab_runner
    restart: always
    network_mode: bridge
    volumes:
      - ./config/:/etc/gitlab-runner/
      - /var/run/docker.sock:/var/run/docker.sock
```

创建目录 `config` 用于保存 runner 的配置:  

`mkdir config`

然后启动 runner 容器：  

`docker-compose up -d runner`

注册 runner 之前需要在 Gitlab 项目的 CI/CD 配置中（设置 > CI/CD > Runner）查看注册 URL 和令牌，如下图所示：  

![gitalb-runner-setting](https://images.mengz.dev/posts/gitlab-runner-setting.png)  

接下来，运行一下命令进行 runner 的注册:  

```
docker-compose exec runner gitlab-runner register \
  --url https://gitlab.com/ \
  --registration-token $REGISTRATION_TOKEN \
  --executor docker \
  --description "app-deployment-runner" \
  --tag-list "deploy,docker" \
  --docker-image "mengzyou/docker:19.03" \
  --docker-volumes /var/run/docker.sock:/var/run/docker.sock
```

**注意** : 上面的 $REGISTRATION_TOKEN 需要替换成真实的令牌值。  

上面的命令注册了一个默认使用 [mengzyou/docker](https://hub.docker.com/r/mengzyou/docker) 镜像运行容器的执行器，同时挂载了 `/var/run/docker.sock`，因为默认执行容器里的 docker 将房屋主机上的 docker 服务。  

#### 配置Gitlab-ci进行自动部署

在 `.gitlab-ci.yml` 中增加部署的工作：  

```yml
stages:
  - build
  - deploy

deoploy:docker:
  stage: deploy
  script:
    - echo "Deploy try_app - $CI_REGISTRY_IMAGE:latest"
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin $CI_REGISTRY
    - docker rm -f try_app || true
    - docker image pull $CI_REGISTRY_IMAGE:latest
    - docker container run --name try_app -p 80:80 -d $CI_REGISTRY_IMAGE:latest
  only:
    - master
  tags:
    - deploy
    - docker
```

当然，也可以写部署脚本来执行部署的步骤，也可以使用 docker-compose 通过 docker-compose.yml 文件来执行，例如：  

```yml
deoploy:docker:
  stage: deploy
  script:
    - echo "Deploy ${CD_COMPOSE_PROJECT}_app - $CI_REGISTRY_IMAGE:latest"
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin $CI_REGISTRY
    - docker image pull $CI_REGISTRY_IMAGE:latest
    - mkdir -p /tmp/${CD_COMPOSE_PROJECT} && cp ${CI_PROJECT_DIR}/docker-compose.prod.yml /tmp/${CD_COMPOSE_PROJECT}/docker-compose.yml
    - cd /tmp/${CD_COMPOSE_PROJECT} && docker-compose up -d myblog
  only:
    - master
  tags:
    - deploy
    - docker
```

其中可以定义 CD_COMPOSE_PROJECT 变量来指定 docker-compose 的项目名，相应的在代码根目录增加 `docker-compose.prod.yml` 文件：  

```yml
version: '2.4'

networks:
  web:
    external: true

services:
  app:
    image: "registry.gitlab.com/mengzyou/app:latest"
    networks:
      - web
    restart: unless-stopped
    mem_limit: 256M
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=web"
      - "traefik.backend=app"
      - "traefik.frontend.rule=Host:app.mengz.me;PathPrefix:/"
      - "traefik.frontend.redirect.entryPoint=https"
      - "traefik.frontend.redirect.permanent=true"
      - "traefik.port=80"
```

上面的 `docker-composle` 文件还定义了 traefik 相关的参数，这要求在目标服务器上已经运行了相应的 traefik 服务作为 Web 代理。  

完成以上步骤之后，每次推送 master 分支，都会触发相应的 gitlab CI/CD pipeline 来执行每个阶段的 CI/CD 工作，如下图：  

![gitlab-pipeline](https://images.mengz.dev/posts/gitlab-pipeline.png)  

### 总结

以上仅仅进行了一个简单应用的 CI/CD 示例，主要演示了如何使用 gitlab-ci 和 docker 来进行 CI/CD 流程。  

对于不同的项目，如何构建？如何部署，情况都可能不一样，需要根据不同的场景来编写 `.gitlab-ci.yml` 文件，需要进一步阅读相应的[文档](https://about.gitlab.com/product/continuous-integration/) 。
