---
title: "调试Shell脚本错误"
description: "尝试增加一些符号来调试shell脚本"
date: 2011-02-13T15:03:32+0800
categories: ["Programming"]
hero: 
tags: ["shell", "debug"]
menu:
  sidebar:
    name: "调试Shell脚本错误"
    identifier: shell-debug
    parent: programming
    weight: 10
---

今天在写一个 shell 脚本的时候遇到了如下的错误：  

> line 225: unexpected EOF while looking for matching \`”‘  
> line 233: syntax error: unexpected end of file

可是认真查看它提示出错的行时，却发现(")号是配对的。

225行是如下的代码:  

```shell
if [ ${options} = "ALL" ]; then
```

很明显报错的行数不对，由于前面的代码比较多，一行行看也不容易看错错误。
既然说文件结尾有问题，于是我在文件尾加上一个(")符号，再运行。现在提示给出了正确的错误行号。

原来是前面有这样的代码:

```shell
echo "${PACKAGENAME" >> ${file}
```

是变量的引用时少了相应的 (}) 号。

所以，如果以后遇到类似的问题，可以尝试加一些符号来调试，也许会有帮助。