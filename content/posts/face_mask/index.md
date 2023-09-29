---
date: 2020-11-11T10:58:08-04:00
description: "Build an Face Mask detection application using deep learning approache, Keras//Tensorflow and openCV"
hero: "/images/face.jpg"
tags: ["Keras","Tensorflow","python"]
title: "Face Mask detection application using deep learning approache, Keras/Tensorflow and openCV"
---

# General context

With the crazy augmentation of COVID-19 cases, wearing a face mask play a crucial role in protecting the health of individuals against this respiratory disease. But masks are not comfortable for everyone, which makes the control operation almost impossible to everyone.  

Facial recognition applications with the deep leaning models could be an efficient way to detect people who does not respect this masks protocol in public places such as Public transport, Supermarket …
In this article I will show you how I could implement a Face mask detector, with a high accuracy deep learning model. 

# Architecture 

{{< figure src="/images/Image1.png" title="Project architecture " >}} 

To train our model we must break our project to two distinct parts as shown above. 
The first part for training the model using keras on a data set from bings that has two type of images, persons with mask (folder with_mask) and others without mask (folder without_mask). 
The second part for deployment, from the first part we obtained a pretrained deep learning model, we can now perform face detection and classify each face to with mask or without mask.

# Requirements 

> tensorflow>=1.15.2  
keras==2.3.1  
imutils==0.5.3  
numpy==1.18.2  
opencv-python==4.2.0.*  
matplotlib==3.2.1  
scipy==1.4.1  


we used in this project the MobileNetV2 architecture as a highly efficient architecture that can be applied to embedded devices with limited computational capacity (ex., Raspberry Pi, Google Coral, NVIDIA Jetson Nano, etc.). 