---
date: 2020-09-07T10:58:08-04:00
description: "Study how preferences can be compiled, in order to enable fast answering to queries"
hero: "/images/BandeauANITI.jpg"
tags: ["Java","knowledge compilation","Decision support systems"]
title: "Preferences compilation for decision support systems"
---

# General context
The Master's level Internships provide the opportunity for hands-on experience in a student affairs setting. I had the chance to add an interesting experience to my CV by doing a 5-month internship with [Institut de recherche en informatique de Toulouse (IRIT)](https://www.irit.fr/) as part of [ANITI project](https://en.univ-toulouse.fr/aniti). In this internship I worked on the following subject "Preferences compilation for decision support systems" in the next section I'll explainto you  the subject in more detail.

# Internship subject
Decision support systems, like on-line configurators or recommender systems, need to adapt themselves to each user in order to offer a better interaction and guide the user quickly to the best decision for her: the system should be able to gather a model of the preferences of the user, and be able to show her, almost instantly, during the interaction, what seems to be her best, most preferred possible alternatives. Several models of preferences have been developped in the literature on Artificial Intelligence and Operations Research, offering the possibility to represent complex preferences over multi-attribute domains in some rather compact form. The richness of the models comes at a cost: finding the optimal alternatives is, in general, a computationnally hard problem - at least NP-hard - except for some quite restrictive models.

Computationnaly hard queries are also typical of many logic-based systems. In the last two decades, a new approach, called knowledge compilation has been studied to cope with such hard queries in the context of real-time systems: logical bases can be compiled, offline, into some less compact representation, such as GAI-Decomposition and SLDD, which enables fast (polynomial time) query answering. Although, in theory, the size of these less compact representations can grow exponentially fast with the number of variables, this explosion does not often occur in practice.

The main porpose of this work is to study how preferences can be compiled, in order to enable fast answering to queries that consist, for instance, in finding the optimal alternatives given some choices already made and given some constraints or comparing between to alternatives (dominance testing). On the practical side, the work consist in desining and implementing a compiler to transform CP-nets into GAI-Decompositions and SLDD (Semiring Labeled Decision Diagrams).

[Here](https://drive.google.com/file/d/1sQsZ70N9fVJaltj4BfQ7WNhl_fdGHxki/view?usp=sharing) you can find a french version of my work. I haven't shared the code yet for confidential reasons.