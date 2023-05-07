---
title: "短代码示例"
date: 2020-06-08T08:06:25+06:00
description: 短代码演示的文章
menu:
  sidebar:
    name: 短代码示例
    identifier: shortcodes
    weight: 40
hero: boat.jpg
mermaid: true
---

这是一个示例帖子，旨在测试以下内容：

- 默认英雄形象。
- 不同的短代码。

## 告警

该主题可用以下告警。  

{{< alert type="success" >}}
这是 `type="success"` 的告警。  
{{< /alert >}}

{{< alert type="danger" >}}
这是 `type="danger"` 的告警。  
{{< /alert >}}

{{< alert type="warning" >}}
这是 `type="warning"` 的告警。  
{{< /alert >}}

{{< alert type="info" >}}
这是 `type="info"` 的告警。  
{{< /alert >}}

{{< alert type="dark" >}}
这是 `type="dark"` 的告警。  
{{< /alert >}}

{{< alert type="primary" >}}
这是 `type="primary"` 的告警。  
{{< /alert >}}

{{< alert type="secondary" >}}
这是 `type="secondary"` 的告警。  
{{< /alert >}}

## 图像

#### 没有任何属性的示例图像

> \{\{< img src="/posts/shortcodes/boat.jpg" title="海上的一艘船" >}}  
{{< img src="/posts/shortcodes/boat.jpg" title="海上的一艘船" >}}

{{< vs 3 >}}

#### 设置高宽属性的示例图像

> \{\{< img src="/posts/shortcodes/boat.jpg" height="400" width="600" title="海上的一艘船" >}}
{{< img src="/posts/shortcodes/boat.jpg" height="400" width="600" title="海上的一艘船" >}}

{{< vs 3 >}}

#### 设置高宽属性中间对齐的图像

> \{\{< img src="/posts/shortcodes/boat.jpg" height="400" width="600" align="center" title="海上的一艘船" >}}
{{< img src="/posts/shortcodes/boat.jpg" height="400" width="600" align="center" title="海上的一艘船" >}}

{{< vs 3 >}}

#### 带有`float`属性的图像

> \{\{< img src="/posts/shortcodes/boat.jpg" height="200" width="500" float="right" title="海上的一艘船" >}}

{{< img src="/posts/shortcodes/boat.jpg" height="200" width="500" float="right" title="海上的一艘船" >}}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas lectus sed leo ultricies ultricies. Praesent tellus risus, eleifend vel efficitur ac, venenatis sit amet sem. Ut ut egestas erat. Fusce ut leo turpis. Morbi consectetur sed lacus vitae vehicula. Cras gravida turpis id eleifend volutpat. Suspendisse nec ipsum eu erat finibus dictum. Morbi volutpat nulla purus, vel maximus ex molestie id. Nullam posuere est urna, at fringilla eros venenatis quis.

Fusce vulputate dolor augue, ut porta sapien fringilla nec. Vivamus commodo erat felis, a sodales lectus finibus nec. In a pulvinar orci. Maecenas suscipit eget lorem non pretium. Nulla aliquam a augue nec blandit. Curabitur ac urna iaculis, ornare ligula nec, placerat nulla. Maecenas aliquam nisi vitae tempus vulputate.

## 分列

此主题支持根据需要将页面拆分为任意数量的列。

#### 两列

> \{\{<split 6 6>}}
> \---
> \{\{< /split >}}

{{< split 6 6>}}

##### 左边列

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas lectus sed leo ultricies ultricies.

---

##### 右边列

Fusce ut leo turpis. Morbi consectetur sed lacus vitae vehicula. Cras gravida turpis id eleifend volutpat.

{{< /split >}}

#### 三列

> \{\{< split 4 4 4 >}} --- --- \{\{< /split >}}

{{< split 4 4 4 >}}

##### 左边列

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas lectus sed leo ultricies ultricies.

---

##### 中间列

Aenean dignissim dictum ex. Donec a nunc vel nibh placerat interdum. 

---

##### 右边列

Fusce ut leo turpis. Morbi consectetur sed lacus vitae vehicula. Cras gravida turpis id eleifend volutpat.

{{< /split >}}

## 垂直空间

两行之间的垂直空间。  
> \{\{< vs 4>}}

第一行。
{{< vs 4>}}
这是第二行。与上一行将有`4rem`的垂直空间。  

## 视频

> \{\{< video src="/videos/sample.mp4" >}}

{{< video src="/videos/sample.mp4" >}}

<!-- markdown-link-check-disable-next-line -->
Video by [Rahul Sharma](https://www.pexels.com/@rahul-sharma-493988) from [Pexels](https://www.pexels.com).

## Mermaid

这里是一些使用**mermaid**短代码的示例。  

**图形:**  

```
\{\{< mermaid align="left" >}}
graph LR;
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
\{\{< /mermaid >}}
```

{{< mermaid align="left" >}}
graph LR;
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
{{< /mermaid >}}

**序列图:**  

```
\{\{< mermaid >}}
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
\{\{< /mermaid >}}
```

{{< mermaid >}}
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
{{< /mermaid >}}

**甘特图:**

```
\{\{< mermaid >}}
gantt
  dateFormat  YYYY-MM-DD
  title Adding GANTT diagram to mermaid
  excludes weekdays 2014-01-10

section A section
  Completed task            :done,    des1, 2014-01-06,2014-01-08
  Active task               :active,  des2, 2014-01-09, 3d
  Future task               :         des3, after des2, 5d
  Future task2               :         des4, after des3, 5d
\{\{< /mermaid >}}
```

{{< mermaid >}}
gantt
  dateFormat  YYYY-MM-DD
  title Adding GANTT diagram to mermaid
  excludes weekdays 2014-01-10

section A section
  Completed task            :done,    des1, 2014-01-06,2014-01-08
  Active task               :active,  des2, 2014-01-09, 3d
  Future task               :         des3, after des2, 5d
  Future task2               :         des4, after des3, 5d
{{< /mermaid >}}

**类图:**  

```
\{\{< mermaid >}}
classDiagram
  Class01 <|-- AveryLongClass : Cool
  Class03 *-- Class04
  Class05 o-- Class06
  Class07 .. Class08
  Class09 --> C2 : Where am i?
  Class09 --* C3
  Class09 --|> Class07
  Class07 : equals()
  Class07 : Object[] elementData
  Class01 : size()
  Class01 : int chimp
  Class01 : int gorilla
  Class08 <--> C2: Cool label
\{\{< /mermaid >}}
```

{{< mermaid >}}
classDiagram
  Class01 <|-- AveryLongClass : Cool
  Class03 *-- Class04
  Class05 o-- Class06
  Class07 .. Class08
  Class09 --> C2 : Where am i?
  Class09 --* C3
  Class09 --|> Class07
  Class07 : equals()
  Class07 : Object[] elementData
  Class01 : size()
  Class01 : int chimp
  Class01 : int gorilla
  Class08 <--> C2: Cool label
{{< /mermaid >}}

**Git图:**  

```
\{\{< mermaid background="black" align="right" >}}
gitGraph:
options
{
    "nodeSpacing": 150,
    "nodeRadius": 10
}
end
commit
branch newbranch
checkout newbranch
commit
commit
checkout master
commit
commit
merge newbranch
\{\{< /mermaid >}}
```

{{< mermaid background="black" align="right" >}}
gitGraph:
options
{
    "nodeSpacing": 150,
    "nodeRadius": 10
}
end
commit
branch newbranch
checkout newbranch
commit
commit
checkout master
commit
commit
merge newbranch
{{< /mermaid >}}

**ER图:**

```
\{\{< mermaid >}}
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
\{\{< /mermaid >}}
```

{{< mermaid >}}
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
{{< /mermaid >}}

## Gist

> \{\{< gist hossainemruz 4ad86c9b6378677e14eff12713e75e44 >}}

{{< gist hossainemruz 4ad86c9b6378677e14eff12713e75e44 >}}