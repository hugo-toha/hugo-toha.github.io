---
title: "LINUX上创建不可删除文件"
date: 2019-08-24T15:00:04+08:00
categories: ["Linux"]
hero: linux-commands.jpg
tags: ["linux", "command"]
menu:
  sidebar:
    name: "LINUX上创建不可删除文件"
    identifier: make-undeletable
    parent: linux
    weight: 10
---

我们都知道在Linux上默认都会有一个名为`root`的超级用户，该用户可以修改系统上的任何文件和目录，那我们怎么创建一些不能被删除/修改的文件和目录呢？  
那在Linux系统中有一个命令[`chattr`](https://linux.die.net/man/1/chattr)可以用来修改文件和目录的属性，通过该命令就可以设置文件和目录不可删除，甚至包括`root`也不能操作。  

## 创建不可删除的文件

例如，我们在系统上新建一个名为`undeletable-file`的文件，通过名了`chattr`设置其属性为不可修改的：  

```bash
❯ echo "some contents" ❯ ~/undeletable-file

❯ sudo chattr +i -V ~/undeletable-file
chattr 1.43.8 (1-Jan-2018)
Flags of /home/mengz/undeletable-file set as ----i--------------

❯ rm -f ~/undeletable-file
rm: cannot remove 'undeletable-file': Operation not permitted

❯ sudo rm -f ~/undeletable-file
rm: cannot remove 'undeletable-file': Operation not permitted

❯ echo "change" ❯❯ ~/undeletable-file
bash: undeletable-file: Operation not permitted
```

**注意** ： 是用命令`chattr`修改属性的时候需要`root`权限，因此这里使用了`sudo` 。  

我们也可以通过命令`lsattr`来查看当前文件的属性：  

```bash
❯ lsattr ~/undeletable-file
----i-------------- /home/mengz/undeletable-file
```

## 设置目录不可修改

针对目录，同样是用命令`chattr`，是用`-R`选项可以递归地修改目录和其文件的属性：  

```bash
❯ mkdir -p immutable-dir/{dir1,dir2}

❯ touch immutable-dir/dir1/file1

❯ touch immutable-dir/dir2/file2

❯ sudo chattr +i -RV immutable-dir/
chattr 1.43.8 (1-Jan-2018)
Flags of immutable-dir/ set as ----i--------------
Flags of immutable-dir//dir1 set as ----i--------------
Flags of immutable-dir//dir1/file1 set as ----i--------------
Flags of immutable-dir//dir2 set as ----i--------------
Flags of immutable-dir//dir2/file2 set as ----i--------------

❯ rm -rf immutable-dir/
rm: cannot remove 'immutable-dir/dir1/file1': Operation not permitted
rm: cannot remove 'immutable-dir/dir2/file2': Operation not permitted

❯ sudo rm -f immutable-dir/dir1/file1
rm: cannot remove 'immutable-dir/dir1/file1': Operation not permitted
```

要使文件或者目录可修改，是用命令`chattr`加上选项`-i` ：  

```bash
❯ sudo chattr -i -RV immutable-dir/
chattr 1.43.8 (1-Jan-2018)
Flags of immutable-dir/ set as -------------------
Flags of immutable-dir//dir1 set as -------------------
Flags of immutable-dir//dir1/file1 set as -------------------
Flags of immutable-dir//dir2 set as -------------------
Flags of immutable-dir//dir2/file2 set as -------------------

❯ rm -rf immutable-dir/
```
