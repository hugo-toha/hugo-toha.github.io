---
title: "改良鸡尾酒排序算法"
date: 2010-10-27T15:03:32+0800
categories: ["Programming"]
hero: 
tags: ["algorithm", "cpp"]
menu:
  sidebar:
    name: "改良鸡尾酒排序算法"
    identifier: cocktail-improve
    parent: programming
    weight: 10
---

记得以前学习数据结构和算法时就了解了冒泡排序算法， 前几天的一个面试也被问到了这个问题。于是回来后就又温习了一遍，还了解到了一种冒泡的改良算法，叫做鸡尾酒(cocktail)排序算法，其实现是通过两个循环分别从两端进行冒泡。  

<!-- more -->

## 通常实现

```cpp
    template< typename T >
    void cocktail_sort(T array[], int n)
    {
        int bottom = 0;
        int top = n – 1;
        bool swapped = true;
        while (swapped) {
            swapped = false;
            for ( int i = bottom; i < top; i++ ) {
                if ( array[i] > array[i+1] ) {
                    swap(array[i], array[i+1]);
                    swapped = true;
                }
            }
            top–; // top is a larger one
            for ( int i = top; i > bottom; i– ) {
                if ( array[i] < array[i-1] ) {
                    swap(array[i], array[i-1]);
                    swapped = true;
                }
            }
            bottom++; // bottom is a smaller one
        }
    } // end, cocktail_sort
```

## 改良实现

我在网上搜索的实现基本上都是上面的实现方法。 我就想为什么不在一个循环中两端一起进行冒泡呢？于是我实现了下面这样的改良的cocktail算法实现，暂且取名为*bi_bubble_sort*，减少了循环比较的次数：  

```cpp
    template< typename T >
    void bi_bubble_sort(T *array, int n)
    {
        int top = 0;
        int bottom = n – 1;
        bool swapped = true;
        while (swapped) {
            swapped = false;
            int i = top;
            int j = bottom;
            for (i = top, j = bottom; i < bottom || j > top; i++, j–) {
                if (array[i] > array[i+1]) {
                    swap(array[i], array[i+1]);
                    swapped |= true;
                }
                if (array[j] < array[j-1]) {
                    swap(array[j], array[j-1]);
                    swapped |= true;
                }
            }
            top++;
            bottom–;
        }
    } // end, bi_bubble_sort
```

不过冒泡排序在排序算法中是效率比较差的算法了，实际中应该很少应用，呵呵！