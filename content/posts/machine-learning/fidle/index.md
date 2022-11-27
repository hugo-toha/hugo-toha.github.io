---
title: "Deep Learning - formation Fidle"
date: 2020-06-08T08:06:25+06:00
description: Notes prise en suivant la formation CNRS Fidle.
menu:
  sidebar:
    name: Fidle
    identifier: machine_learning-fidle
    parent: machine_learning
    weight: 10
# hero: images/forest.jpg
tags: ["Machine Learning"]
categories: ["Machine Learning"]
mermaid: true
---
Liens vers le GitLab [Fidle](https://gricad-gitlab.univ-grenoble-alpes.fr/talks/fidle/-/wikis/Fidle%20%C3%A0%20distance/Pr%C3%A9sentation)

# 1 - Introduction, Contexte et historique

## Intro et contexte : 
Approche avec les 4 paradigmes. <br />
Description du monde de l'IA. Machine Learning et Deep Learning. ( Schéma 3 disques ) <br />
Descriptions des 4 grandes familles du ML en fonction de l'apprentissage : 
- Supervisé
- Non-supervisé
- Renforcement 
- Transfert

Les outils du deep-learning : 
- Keras + Tensorflow (utilisé dans l'industrie)
- PyTorch
- \+ outils classiques (python, numpy, jupyter notebooks)

Les environnements sont difficiles à installer -> Docker
Besoin de puissance de calcul, donc on utilise des GPU. Des centres de calculs existent pour ça. Certains sont accessibles sur demandes (GENCI, Méso)
## Première approche : Régression linéaire et régression logistique
Sur un nuage de point. La solution peut être trouvée par calcul direct. **Mais**, quand il y a beaucoup de données cela ne marche plus (calcul trop lourd)

Utilisation de la descente de gradient pour optimiser la fonction perte (loss function). La fonction qui optimise la descente est la fonction d'optimisation (Optimization function).

Pour des données, on va choisir un modèle (Linéaire, Polynomial de °N...). Si modèle n'est pas bon, on peu faire : 
- De l'**underfiting** (Pas assez d'intelligence pour apprendre le phénomène )
- De l'**overfitting** (Trop d'intelligence )

### Régression logistique
Classer des points
Utilisation de biais, d'une fonction d'activation pour calculer un output. -> C'est un neurone artificiel

Détermination des poids et biais avec la descente de gradient 

**Résumé** :
Un neurone est une fonction simple qui a des poids et un biais. Il permet la régression et la classification.
### Historique 
#### L'intelligence :
Deux conception de l'intelligence : 
- Connectioniste : Résultat d'un ensemble de petites fonction élémentaires (Neurones)
- Symbolique : Forger une opinion via des inférences 

{{< mermaid >}}
graph LR;
    A[Input] --> D[algo connectiviste]
    B[Output] --> D
    D --> C[Program]
    A2[Input] --> D2[algo symbolique]
    B2[Program] --> D2
    D2 --> C2[Output]
{{< /mermaid >}}

Ce sont deux approches trés différentes. 

### La rétropropagation 
Idée : grouper des neurones en réseau en faisant des couches. 
- Permet des comportement non linéaire 
- Comment régler les parametres ? 

Back-propagation : Mise a jour des poids du réseau à partir de l'erreur 
Epoch : Un cycle Feed forward + calcul de loss + backpropagation 

Exemple: 
- On donne 128 valeurs au réseau (1 batch), 128 predictions, calcul de la loss (1 fois), back-prop en fonction de la loss (1 fois)

### SVM (Support Vector Machine)
Concurrent du Deep Learning

## Exemple : Prédiction du prix du vin
<!-- [Exemples de codes](../../../notes/python/machine_learning/index.md) -->
## Exemple : Classification des chiffres manuscrits

## Questions
Aléatoire? :
- Dans l'initialisation des poids 
- Dans les dataset 
- -> De résultats sont reproductibles si on arrivbe à la même conclusion 
Intéret des batch : 
- Reduire les calculs 
- Utiliser les archi // des pc
- Exploration du dataset plus ou moins rapide
- Lissage de l'influence des valeurs 
- Compromis biais/variance 
Sur-apprentissage : 
