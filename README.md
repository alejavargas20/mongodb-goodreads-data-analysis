# Análisis con MongoDB – Goodreads Choice Awards 2024

## Descripción

Este proyecto realiza un análisis del dataset **Goodreads Choice Awards 2024 Books** utilizando **MongoDB** y su **Aggregation Framework**.
El objetivo es explorar información relevante sobre los libros nominados a los premios Goodreads, incluyendo categorías, votos, ratings, géneros y popularidad de autores.

## Dataset

El dataset contiene información sobre libros nominados a los **Goodreads Choice Awards 2024**, incluyendo:

* Título del libro
* Autor
* Categoría
* Número de votos
* Rating
* Precio
* Número de páginas
* Géneros
* Número de seguidores del autor
* Número de libros publicados por el autor

## Objetivos del análisis

Los principales objetivos del proyecto son:

* Explorar las categorías existentes en los premios Goodreads
* Identificar los libros con mayor número de votos
* Analizar el número de libros nominados por categoría
* Encontrar los libros con mejor rating en cada categoría
* Identificar los géneros más populares
* Calcular el precio promedio de los libros
* Analizar la distribución de seguidores de los autores
* Detectar autores con más de un libro nominado
* Determinar los libros ganadores en cada categoría

## Tecnologías utilizadas

* MongoDB
* MongoDB Aggregation Framework
* JavaScript queries
* MongoDB Shell

## Análisis realizados

El proyecto incluye las siguientes consultas y análisis:

1. Visualización de todos los documentos del dataset
2. Identificación de las categorías existentes en los premios
3. Ordenar los libros por número de votos
4. Número de libros nominados por categoría
5. Top 10 libros con más votos por categoría
6. Reemplazo de valores nulos en campos como precio y número de páginas
7. Identificación del libro con mejor rating en cada categoría
8. Análisis de los géneros más populares
9. Cálculo del precio promedio de los libros
10. Suma total de votos por categoría
11. Identificación de autores con múltiples libros nominados
12. Clasificación de autores según su número de seguidores
13. Identificación de los libros ganadores por categoría

## Estructura del repositorio

```
mongodb-goodreads-data-analysis
│
├── queries.js        # Consultas y análisis realizados en MongoDB
└── README.md         # Documentación del proyecto
```

