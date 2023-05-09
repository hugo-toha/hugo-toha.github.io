---
title: "DOCKER构建MariaDB"
description: "使用Dockerfile构建并运行MariaDB数据库"
date: 2015-05-27T23:09:00+0800
categories: ["Container"]
hero: mariadb-docker.png
tags: ["docker", "mariadb"]
menu:
  sidebar:
    name: "DOCKER构建MariaDB"
    identifier: mariadb-docker
    parent: container-tech
    weight: 10
---

现在 [Docker][link_docker] 可所谓是最火的容器技术了，至于什么是 Docker，请到其[官方网站][link_docker]或者[维基百科][link_wiki_docker]查看。  
这里想通过一个示例来看看怎么通过 [Dockerfile][link_dockerfile] 来构建一个 Docker 镜像。  

## 构建MariaDB容器镜像

Docker 提供了两种方法来生产应用镜像:  

1. 通过启动一个基础容器（比如基于某种 Linux 发行版的镜像的容器），然后在容器里执行各种命令来安装相应的软件包，进行配置后，再通过 [docker commit][link_docker_commit] 命令把已经更新的容器生产相应的镜像。  
2. 通过编写一个 Dockerfile ，然后使用 [docker build][link_docker_build] 命令来构建相应的镜像。  

相比第一种方式，通过 Dockerfile 的方式，可以更好的维护镜像，将镜像的 Dockerfile 提交到版本库管理。还可以在 [Docker Hub][link_dockerhub] 里创建镜像的自动构建。  

下面让我们通过如何编写 Dockerfile 来构建一个 [mariadb][link_mariadb] 的镜像：  

首先创建一个目录，如 `docker-mariadb` ，然后编写一个名为 *Dockerfile* 的文件，内容如下：

```dockerfile
FROM opensuse:13.2
MAINTAINER Mengz You <you.mengz@yahoo.com>

ENV MARIADB_MAJOR 10.0
ENV MARIADB_VERSION 10.0.17
ENV MYSQL_ROOT_PASSWORD mysecretpassword
ENV MYSQL_DATADIR /var/lib/mysql

RUN zypper ar -f -r http://download.opensuse.org/repositories/server:/database/openSUSE_13.2/server:database.repo \
  && zypper -n --gpg-auto-import-keys ref

RUN zypper -n in --no-recommends mariadb-$MARIADB_VERSION net-tools \
  && zypper clean --all

RUN mkdir -p /var/lib/mysql \
  && mkdir -p /var/log/mysql \
  && chown mysql:mysql /var/log/mysql

VOLUME /var/lib/mysql

COPY docker-entrypoint.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 3306
CMD ["mysqld_safe"]
```

让我们来看看上面的 Dockerfile 里用到的指令：  

- **FROM** ： 指明用来构建该镜像的基础镜像，该示例中我们使用 Docker Hub 官方的 [opensuse][link_docker_opensuse] 镜像，格式为 `image[:tag]` ；  
- **MAINTAINER** ： 指明该 Dockerfile 的维护者；  
- **ENV** ： 设置环境变量，后面的命令可以使用这些变量。也可以在启动容器时改变其值；  
- **RUN** ： 执行命令，比如设置软件源，安装相应的软件包，在上面的例子中，将会在构建镜像的时候安装 Mariadb 的包，然后配置一些使用的目录；  
- **VOLUME** ： 设置目录卷，使得在运行容器的时候可以通过 `-v` 参数来指定挂载和主机同步的目录；  
- **COPY** ： 将构建目录下的脚本放到镜像里，然后可以在容器中执行。上例中，`docker-entrypoint.sh` 将在启动容器时作为容器入口点执行；  
- **ENTRYPOINT** ： 配置容器启动时执行的命令，每个 Dockerfile 中之应该只有一个 ENTRYPOINT ；  
- **EXPOSE** ： 配置容器暴露的服务端口号，在启动容器时，如果使用 `-P` 参数，Docker 主机将会自动分配一个随机端口转发到制定的端口，也可以额使用 `-p` 制定主机的具体端口；
- **CMD** ： 也是可以制定容器启动时执行的命令，其和 ENTRYPOINT 的区别是，其可以作为 ENTRYPOINT 的参数，如上例中启动容器时，其实执行的是 `/docker-entrypint.sh mysqld_safe`。还有一个区别就是 ENTRYPOINT 制定的命令不能被启动容器时的命令覆盖，而 CMD 指定的可以被覆盖。  

以上是本示例中用的指令，其实 Dockerfile 还有其他指令，请参考 Dockerfile 的[文档][link_dockerfile]。  

由于本例中我们使用到了一个脚本来作为容器的入口命令，因此还需要在当前目录下写该脚本文件 `docker-entrypoint.sh` ：  

```bash
#!/bin/bash
set -e

if [ ! -d "$MYSQL_DATADIR/mysql" ]; then
  echo 'Running mysql_install_db ...'
  mysql_install_db --datadir="$MYSQL_DATADIR"
  echo 'Finished mysql_install_db'

  tempSqlFile='/tmp/mysql-first-time.sql'
  cat > "$tempSqlFile" <<-EOSQL
DELETE FROM mysql.user ;
CREATE USER 'root'@'%' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}' ;
GRANT ALL ON *.* TO 'root'@'%' WITH GRANT OPTION ;
DROP DATABASE IF EXISTS test ;
EOSQL

  if [ "$MYSQL_DATABASE" ]; then
    echo "CREATE DATABASE IF NOT EXISTS \`$MYSQL_DATABASE\` ;" >> "$tempSqlFile"
  fi

  if [ "$MYSQL_USER" -a "$MYSQL_PASSWORD" ]; then
    echo "CREATE USER '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD' ;" >> "$tempSqlFile"

    if [ "$MYSQL_DATABASE" ]; then
      echo "GRANT ALL ON \`$MYSQL_DATABASE\`.* TO '$MYSQL_USER'@'%' ;" >> "$tempSqlFile"
    fi
  fi

  echo 'FLUSH PRIVILEGES ;' >> "$tempSqlFile"
  set -- "$@" --init-file="$tempSqlFile"
fi

chown -R mysql:mysql "$MYSQL_DATADIR"

exec "$@"
```

该脚本通过相应的环境变量来初始化 mariadb 实例，后面我们会给出容器运行的命令示例。  

最后，我们就可以通过在当前目录下执行 `docker build` 命令来构建镜像，如：  

`docker build -t docker-mariadb:latest .`  

如果本地没有 opensuse 的镜像，首先会下载 opensuse 的镜像，然后会基于 opensuse 的镜像，运行 Dockerfile 里指定的命令，最后会生成 **docker-mariadb:latest** 镜像，可以通过 `docker images` 看到。  

## 运行Mariadb容器

镜像生成后，如何来运行该镜像的容器呢？通过上面的脚本，我们可以看到，我们在启动容器时可以指定相应的环境变量，如：  

`docker run --name mydb -e MYSQL_USER=test -e MYSQL_PASSWORD=testpw -e MYSQL_DATABASE=testdb -p 13306:3306 -d docker-mariadb:latest`  

该命令会启动一个该镜像的容器，名为 'mydb'，容器中的 mariadb 会在启动时创建名为 'testdb' 的数据库实例，名为 'test' 的数据库用户，其密码为 'testpw'。  
这时你就可以通过在主机上运行一下命令来尝试登录数据库了：  

`mysql -h127.0.0.1 -P13306 -utest -ptestpw testdb`   

是不是感觉通过 Dockerfile 来构建 Docker 镜像是如此的简单。最后你可以将该目录作为一个项目 push 到 [Github][link_github]，然后在到 Docker Hub 去创建一个仓库，然后配置到 Github 代码库，每当你 push 更新 Dockerfile 后，都会自动构建镜像。就像[我的镜像库][link_my_docker]一样，当然在 Docker Hub 里还有来自全世界人们构建的镜像。  

[link_docker]: https://www.docker.com  
[link_wiki_docker]: http://zh.wikipedia.org/wiki/Docker_(%E8%BB%9F%E9%AB%94)  
[link_dockerfile]: https://docs.docker.com/reference/builder/  
[link_docker_commit]: https://docs.docker.com/reference/commandline/cli/#commit  
[link_docker_build]: https://docs.docker.com/reference/commandline/cli/#build  
[link_dockerhub]: https://hub.docker.com/  
[link_mariadb]: https://mariadb.org/  
[link_docker_opensuse]: https://registry.hub.docker.com/_/opensuse/  
[link_github]: https://github.com  
[link_my_docker]: https://registry.hub.docker.com/u/mengzyou/
