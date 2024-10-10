---
title: "ETL simplified: unified data"
date: 2024-09-20T06:00:23+06:00
hero: /images/post1.jpg
description: Automate data collection.
theme: Toha
menu:
  sidebar:
    name: Compiled data
    identifier: data-engineer-py-etl-simp
    weight: 500
    parent: data-engineer-py
categories: 
- Data Engineer
tags: ["ETL", "Python"]
---

In today's dynamic business environment, integrating and analysing data from multiple sources is essential for making informed decisions. In many industries, such as finance, logistics or marketing, it is common to receive data files in a variety of formats, including CSV, XML and JSON. These files can contain valuable information, but their dispersion and variety of formats make processing and analysis a significant challenge.

One of the challenges in this scenario is the need to consolidate information from multiple files into a single format that can be easily imported into a database, for example. The task becomes even more critical when considering the need to maintain data integrity and consistency during this compilation process.

To illustrate a simple and effective solution to this challenge, I have used as an example files containing name, height and weight information available in a central directory dedicated to this purpose. The data is stored in various formats: CSV, JSON and XML.

ETL is a fundamental process in data management and system integration. Through this process, using the Python language and libraries: glob, pandas, datetime and ElementTree, information is extracted from the files, transforming weight from inches to kg and height from pounds to metres according to defined business rules. The compiled data is returned in a csv file called transformed_data.csv. Another fundamental output file to store all the actions performed during the ETL process will be the log_file.txt file.

The importance of a log file in an ETL process lies in its ability to provide a complete trace of all activities performed. By recording each step in detail, the log allows teams to monitor execution in real time, quickly identify and resolve problems, optimise process performance, comply with regulatory requirements and document all actions for future reference. In addition, regular analysis of the log allows you to identify opportunities for continuous improvement, ensuring that the ETL process is always efficient and effective.

The video below, in Portuguese, provides a summary of the proposed solution for the project.

<br>

{{< youtube mzjJOHLFCJM >}}

<br>


We can imagine other scenarios where a company receives daily sales, stock and customer feedback reports in different formats. In order to optimise analysis and reporting, it is essential to consolidate all this information into a single CSV file.

In short, data aggregation is a critical process for transforming scattered information into useful knowledge. By automating and optimising this process, organisations can extract maximum value from their data and drive growth and competitiveness.

#### Project repository

https://github.com/diogo-dantas/ETL-simplificado-CSV-JSON-e-XML-