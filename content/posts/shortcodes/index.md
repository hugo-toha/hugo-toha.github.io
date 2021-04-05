---
title: "Shortcodes Samples"
date: 2020-06-08T08:06:25+06:00
description: Shortcodes sample
menu:
  sidebar:
    name: Shortcodes Sample
    identifier: shortcodes
    weight: 40
hero: boat.jpg
---

This is a sample post intended to test the followings:

- Default hero image.
- Different shortcodes.

## Alert

The following alerts are available in this theme.

{{< alert type="success" >}}
This is sample alert with `type="success"`.
{{< /alert >}}

{{< alert type="danger" >}}
This is sample alert with `type="danger"`.
{{< /alert >}}

{{< alert type="warning" >}}
This is sample alert with `type="warning"`.
{{< /alert >}}

{{< alert type="info" >}}
This is sample alert with `type="info"`.
{{< /alert >}}

{{< alert type="dark" >}}
This is sample alert with `type="dark"`.
{{< /alert >}}

{{< alert type="primary" >}}
This is sample alert with `type="primary"`.
{{< /alert >}}

{{< alert type="secondary" >}}
This is sample alert with `type="secondary"`.
{{< /alert >}}

## Image

#### A sample image without any attribute.

{{< img src="/posts/shortcodes/boat.jpg" title="A boat at the sea" >}}

{{< vs 3 >}}

#### A sample image with `height` and `width` attributes.

{{< img src="/posts/shortcodes/boat.jpg" height="400" width="600" title="A boat at the sea" >}}

{{< vs 3 >}}

#### A center aligned image with `height` and `width` attributes.

{{< img src="/posts/shortcodes/boat.jpg" height="400" width="600" align="center" title="A boat at the sea" >}}

{{< vs 3 >}}

#### A image with `float` attribute.

{{< img src="/posts/shortcodes/boat.jpg" height="200" width="500" float="right" title="A boat at the sea" >}}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas lectus sed leo ultricies ultricies. Praesent tellus risus, eleifend vel efficitur ac, venenatis sit amet sem. Ut ut egestas erat. Fusce ut leo turpis. Morbi consectetur sed lacus vitae vehicula. Cras gravida turpis id eleifend volutpat. Suspendisse nec ipsum eu erat finibus dictum. Morbi volutpat nulla purus, vel maximus ex molestie id. Nullam posuere est urna, at fringilla eros venenatis quis.

Fusce vulputate dolor augue, ut porta sapien fringilla nec. Vivamus commodo erat felis, a sodales lectus finibus nec. In a pulvinar orci. Maecenas suscipit eget lorem non pretium. Nulla aliquam a augue nec blandit. Curabitur ac urna iaculis, ornare ligula nec, placerat nulla. Maecenas aliquam nisi vitae tempus vulputate.

## Split

This theme support splitting the page into as many columns as you wish.

#### Two column split

{{< split 6 6>}}

##### Left Column

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas lectus sed leo ultricies ultricies.

---

##### Right Column

Fusce ut leo turpis. Morbi consectetur sed lacus vitae vehicula. Cras gravida turpis id eleifend volutpat.

{{< /split >}}

#### Three column split

{{< split 4 4 4 >}}

##### Left Column

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas lectus sed leo ultricies ultricies.

---

##### Middle Column

Aenean dignissim dictum ex. Donec a nunc vel nibh placerat interdum. 

---

##### Right Column

Fusce ut leo turpis. Morbi consectetur sed lacus vitae vehicula. Cras gravida turpis id eleifend volutpat.

{{< /split >}}

## Vertical Space

Give vertical space between two lines.

This is line one.
{{< vs 4>}}
This is line two. It should have `4rem` vertical space with previous line.

## Video

{{< video src="/videos/sample.mp4" >}}

<!-- markdown-link-check-disable-next-line -->
Video by [Rahul Sharma](https://www.pexels.com/@rahul-sharma-493988) from [Pexels](https://www.pexels.com).
