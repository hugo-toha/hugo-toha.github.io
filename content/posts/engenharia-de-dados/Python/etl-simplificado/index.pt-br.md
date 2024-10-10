---
title: "ETL simplificado: dados unificados"
date: 2024-09-20T06:00:23+06:00
hero: /images/post1.jpg
description: Automatizando a compilação de dados.
theme: Toha
menu:
  sidebar:
    name: Dados Compilados
    identifier: data-engineer-py-etl-simp
    weight: 500
    parent: data-engineer-py
categories: 
- Engenharia de Dados
tags: ["ETL", "Python"]
---


No ambiente dinâmico de trabalho atual, a integração e a análise de dados provenientes de diversas fontes são fundamentais para a tomada de decisões informadas. Em muitos setores, como o financeiro, logístico ou de marketing, é comum receber arquivos de dados em diferentes formatos, como CSV, XML e JSON. Esses arquivos podem conter informações valiosas, mas sua dispersão e diversidade de formatos tornam o processamento e a análise um desafio significativo.

Neste cenário, um dos desafios enfrentados  é a necessidade de consolidar informações provenientes de múltiplos arquivos em um único formato que possa ser facilmente importado para um banco de dados, por exemplo. A tarefa torna-se ainda mais crítica quando se considera a necessidade de manter a integridade e a consistência dos dados durante esse processo de compilação.

Para ilustrar uma solução simples e eficaz para esse desafio, utilizei como exemplo arquivos contendo informações de nome, altura e peso, disponíveis em um diretório central específico para esse propósito. Os dados estão armazenados em diferentes formatos: CSV, JSON e XML.

ETL é um processo fundamental em gerenciamento de dados e integração de sistemas. Por meio deste processo utilizando a linguagem python e as bibliotecas: glob, pandas, datetime e ElementTree serão extraídas as informações dos arquivos, transformando o peso de polegadas para kg e a altura de libra para metro mediante regra do negócio estipulada. Os dados compilados serão devolvidos em um arquivo csv intitulado transformed_data.csv". Outro arquivo de saída fundamental para armazenar todas as ações realizadas durante o processo de ETL, será o arquivo "log_file.txt".

A importância de um arquivo de log em um processo ETL reside em sua capacidade de fornecer um rastro completo de todas as atividades realizadas. Ao registrar detalhadamente cada etapa, o log permite que as equipes monitorem a execução em tempo real, detectem e resolvam problemas rapidamente, otimizem o desempenho do processo, cumpram com requisitos regulatórios e documentem todas as ações para futuras referências. Além disso, a análise regular dos logs permite identificar oportunidades de melhoria contínua, garantindo que o processo ETL seja sempre eficiente e eficaz.

O vídeo abaixo apresenta uma síntese da solução proposta para o projeto. 

<br>

{{< youtube mzjJOHLFCJM >}}

<br>

Podemos imaginar outros cenários, como por exemplo,  em que uma empresa recebe relatórios diários de vendas, estoque e feedback de clientes em diferentes formatos. Para otimizar a análise e a geração de relatórios, é essencial compilar todas essas informações em um único arquivo CSV.

Em resumo, a compilação de dados é um processo crucial para transformar informações dispersas em conhecimento útil. Ao automatizar e otimizar esse processo, as empresas podem extrair o máximo valor de seus dados, impulsionando o crescimento e a competitividade.

#### Repositório do projeto

https://github.com/diogo-dantas/ETL-simplificado-CSV-JSON-e-XML-
