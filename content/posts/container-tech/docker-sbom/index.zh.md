---
title: "DOCKER SBOM镜像物料清单"
description: "介绍Docker新的实验性CLI命令sbom，用于分析容器镜像的物料清单"
date: 2022-05-09T12:58:16+08:00
categories: ["Container"]
hero: docker-sbom.jpeg
tags: ["docker", "sbom", "security"]
menu:
  sidebar:
    name: "DOCKER SBOM镜像物料清单"
    identifier: docker-sbom
    parent: container-tech
    weight: 10
---

在上个月发布的[Docker Desktop v4.7.0](https://docs.docker.com/desktop/windows/release-notes/#docker-desktop-470)中，增加了一个新的CLI插件-[docker/sbom-cli-plugin](https://github.com/docker/sbom-cli-plugin)，其为Docker CLI增加了一个子命令 - `sbom`，用于查看Docker容器镜像的软件物料清单（SBOM)。  

## 什么是SBOM？

首先介绍下什么是SBOM（Software Bill of Materials），我们称之为软件物料清单，是软件供应链中的术语。软件供应链是用于构建软件应用程序（软件产品）的组件、库和工具的列表，而物料清单则声明这些组件、库的清单，类似于食品的配料清单。软件物料清单可以帮助组织或者个人避免使用有安全漏洞的软件。  

![SBOM](https://images.mengz.dev/posts/sbom.png)  

## DOCKER SBOM命令

**注意**: 从Docker Desktop 4.7.0版本开始到现在，`docker sbom` 命令还是实验性的，该功能也许会在以后版本中删除和更改，当前Linux的Docker CLI还未包含该子命令。  

`docker sbom` 命令用于生产一个容器镜像的软件物料清单（SBOM）  

```
WSL - mengz  docker sbom --help

Usage:  docker sbom [OPTIONS] COMMAND

View the packaged-based Software Bill Of Materials (SBOM) for an image.

EXPERIMENTAL: The flags and outputs of this command may change. Leave feedback on https://github.com/docker/sbom-cli-plugin.

Examples:

 docker sbom alpine:latest                                          a summary of discovered packages
 docker sbom alpine:latest --format syft-json                       show all possible cataloging details
 docker sbom alpine:latest --output sbom.txt                        write report output to a file
 docker sbom alpine:latest --exclude /lib  --exclude '**/*.db'      ignore one or more paths/globs in the image


Options:
 -D, --debug                 show debug logging
     --exclude stringArray   exclude paths from being scanned using a glob expression
     --format string         report output format, options=[syft-json cyclonedx-xml cyclonedx-json github-0-json spdx-tag-value spdx-json table text] (default "table")
     --layers string         [experimental] selection of layers to catalog, options=[squashed all] (default "squashed")
 -o, --output string         file to write the default report output to (default is STDOUT)
     --platform string       an optional platform specifier for container image sources (e.g. 'linux/arm64', 'linux/arm64/v8', 'arm64', 'linux')
     --quiet                 suppress all non-report output
 -v, --version               version for sbom

Commands:
 version     Show Docker sbom version information

Run 'docker sbom COMMAND --help' for more information on a command.
```

从命令的帮助信息中可以看到，除了直接生成表格形式的SBOM输出外，还支持使用`--format`指定多种类型的输出格式。  

我们尝试对镜像 `neo4j:4.4.5` 生成SBOM:  

```
WSL - mengz  docker sbom neo4jh:4.4.5
Syft v0.43.0
 ✔ Loaded image
 ✔ Parsed image
 ✔ Cataloged packages      [385 packages]
NAME                                VERSION                                    TYPE
CodePointIM                         11.0.15                                    java-archive  
FastInfoset                         1.2.16                                     java-archive
FileChooserDemo                     11.0.15                                    java-archive
Font2DTest                          11.0.15                                    java-archive
HdrHistogram                        2.1.9                                      java-archive
J2Ddemo                             11.0.15                                    java-archive
Metalworks                          11.0.15                                    java-archive
...
libuuid1                            2.36.1-8+deb11u1                           deb
libxxhash0                          0.8.0-2                                    deb
libzstd1                            1.4.8+dfsg-2.1                             deb
listenablefuture                    9999.0-empty-to-avoid-conflict-with-guava  java-archive
log4j-api                           2.17.1                                     java-archive
log4j-core                          2.17.1                                     java-archive
login                               1:4.8.1-1                                  deb
...
```  

上面的输出表格之截取了部分，我们可以看到在清单列表中，除了系统包（deb类型）之外，还有java的软件包，其中就包含了 *log4j* 的包及其版本信息，从这些信息中就可以了解到容器镜像是否包含了存在安全漏洞的依赖和软件包，增强了使用软件镜像来部署应用的安全性。  

上面的信息中还看到了 `Syft v0.43.0`，这是因为当前的SBOM CLI插件是使用Anchore的[Syft项目](https://github.com/anchore/syft)来进行镜像层的扫描，以后的版本也许会通过其他方法读取SBOM信息。  

我们再尝试输出一个镜像的[SPDX](https://spdx.dev/)格式的SBOM文件：

```
WSL - mengz  docker sbom --form spdx-json --output hugo-sbom.json mengzyou/hugo:latest
Syft v0.43.0
 ✔ Loaded image
 ✔ Parsed image
 ✔ Cataloged packages

WSL - mengz  cat hugo-sbom.jso
{
  "SPDXID": "SPDXRef-DOCUMENT",
  "name": "mengzyou/hugo-latest",
  "spdxVersion": "SPDX-2.2",
  "creationInfo": {
   "created": "2022-05-09T10:55:06.6343529Z",
   "creators": [
    "Organization: Anchore, Inc",
    "Tool: syft-[not provided]"
   ],
   "licenseListVersion": "3.16"
  },
  "dataLicense": "CC0-1.0",
  "documentNamespace": "https://anchore.com/syft/image/mengzyou/hugo-latest-162a6a05-379c-49f0-a7f2-b4b738a63d1b",
  "packages": [
   {
    "SPDXID": "SPDXRef-ed18f2a986e77aab",
    "name": "alpine-baselayout",
    "licenseConcluded": "GPL-2.0-only",
    "description": "Alpine base dir structure and init scripts",
    "downloadLocation": "https://git.alpinelinux.org/cgit/aports/tree/main/alpine-baselayout",
 ...
   }
}
```

 由于生成的文件较长，上面只输出了一小部分。  

*补充* - SPDX (Software Package Data Exchage)是一个描述SBOM信息的开放标准，其中将包含软件组件、许可版权信息以及相关的安全参考。SPDX 通过为公司和社区提供共享重要数据的通用格式来减少冗余的工作，从而简化和提供合规性。  

## 总结

这里简单的介绍了 SBOM，以及Docker CLI的实验性子命令 - sbom，可以通过该命令生成r容器镜像多种格式的SBOM信息，让开发人员和需要使用容器镜像来部署服务的运维人员可以容易的获取到镜像的SBOM信息，从而了解到镜像的安全信息，以满足使用的合规性。  
同时，也可以考虑将该工具加入到公司交付应用的CI/CD流水中，作为镜像制品的安全检查工作。  