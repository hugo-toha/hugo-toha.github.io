---
title: "Shell Error Debug"
description: "Try to add some symbols to debug shell scripts."
date: 2011-02-13T15:03:32+0800
categories: ["Programming"]
hero: 
tags: ["shell", "debug"]
menu:
  sidebar:
    name: "Shell Error Debug"
    identifier: shell-debug
    parent: programming
    weight: 10
---

Today I encountered the following error while writing a shell script:  

```
line 225: unexpected EOF while looking for matching \`”‘
line 233: syntax error: unexpected end of file
```

I see the `"` are matched after checked the codes seriously.  

The codes of number line 225 is: 

```shell
if [ ${options} = "ALL" ]; then
```

Obviously reported wrong line. It's hardto see the error line by line as there is a lot of codes in the front.  
Since there is a problem with the end of the file, I put a `"` symbol at the end of the file and runt it. It reported the correct error line number now.  

It's line:  

```shell
echo "${PACKAGENAME" >> ${file}
```

Miss a `}` when refer a variable.  

So, if you encounter similar problems in the future, you can try adding some symbols to debug, which maybe helpful.  