---
date: 2020-09-07T10:58:08-04:00
description: "Comment les préférences peuvent être compilées, afin de permettre une réponse rapide aux requêtes"
hero: "/images/BandeauANITI.jpg"
tags: ["Java","knowledge compilation","Decision suport systems"]
title: "Compilation de préférences pour les systèmes d'aide à la décision"
---

# Contexte général
The Master's level Internships provide the opportunity for hands-on experience in a student affairs setting. I had the chance to add an interesting experience to my CV by doing a 5-month internship with [Institut de recherche en informatique de Toulouse (IRIT)](https://www.irit.fr/) as part of [ANITI project](https://en.univ-toulouse.fr/aniti). In this internship I worked on the following subject "Preferences compilation for decision suport systems" in the next section I'll explainto you  the subject in more detail.

# Sujet du travaille
Les systèmes d’aide à la décision, comme les configurateurs en ligne ou les systèmes de recommandation, doivent s’adapter à chaque utilisateur afin d’offrir une meilleure interaction et de guider rapidement l’utilisateur vers la meilleure décision pour lui: le système doit être capable de rassembler un modèle du préférences de l’utilisateur et être en
mesure de lui montrer, presque instantanément, pendant l’interaction, ce qui semble être ses meilleures alternatives possibles. Plusieurs modèles de préférences ont été développés dans la littérature sur l’intelligence artificielle et la recherche opérationnelle, offrant la possibilité de représenter des préférences complexes sur des domaines à attributs multiples sous une forme plutôt compacte. La richesse de ces modèles a un coût: trouver les alternatives optimales ou comparer entre deux objets sont, en général, des problèmes de calcul difficile - au moins NP-difficile - sauf pour certains modèles assez restrictifs.  

Les requêtes de calculs complexes sont également typiques de nombreux systèmes basés sur la logique. Au cours des deux dernières décennies, une nouvelle approche, appelée "Compilation de connaissances" a été étudiée pour faire face à de telles requêtes difficiles dans le contexte de systèmes en temps réel: les bases logiques peuvent être compilées, hors ligne, dans une représentation moins compacte, telle que GAI-Décomposition et VDD, qui permet une réponse rapide aux requêtes (en temps polynomial). Si, en théorie, la taille de ces représentations moins compactes peut croître de façon exponentielle rapidement avec le nombre de variables, cette explosion ne se produit pas souvent en pratique.  

Le but principal de ce travail est d’étudier comment les préférences peuvent être compilées, afin de permettre une réponse rapide aux requêtes qui consistent, par exemple, à trouver les alternatives optimales compte tenu de certains choix déjà faits et compte tenu de certaines contraintes ou de comparaison entre les alternatives (test de dominance). Sur
le plan pratique, le travail consistera à concevoir et implémenter un compilateur pour transformer les CP-nets en GAI-Décompositions et en SLDD (Semiring Labeled Decision Diagrams).

[Ici](https://drive.google.com/file/d/1sQsZ70N9fVJaltj4BfQ7WNhl_fdGHxki/view?usp=sharing), vous pouvez trouver une version française de mon travail. Je n'ai pas encore partagé le code pour des raisons confidentielles.