
//Goodreads Choice Awards 2024 Books
//Alejandra Vargas 

use Books

// Explorar dataset

//Ver todos los datos del datset
db.GoodreadsBook.find()


//Encontrar las diferentes categorias que existen en los premios Goodreads
db.GoodreadsBook.distinct("category")


//Ordernar los libros por los mas votados, mostrando la categoria,
//el nombre del libro y la cantidad de votos de los libros

var query = {}

var proyeccion = {"_id": 0, "title": 1, "votes" : 1, "category" : 1}

var votes = { "votes" : -1,  }

db.GoodreadsBook.find(query, proyeccion).sort(votes)


//Calcula cuantos libros nominados hay por categoría y
//además añadir un array de documentos  con los nombres de los libros con el acumulador $push
var query1 = { 
    "_id": "$category",
    "count": { $sum: 1 },
    "book" : { $push: {"title": "$title", "price" : "$price", "author_followers": "$author_followers_count"}}
}
var fase1 = { $group: query1 }

db.GoodreadsBook.aggregate(fase1)

//Los 10 libros con mas votos por categoria 

var query2 = { 
    "_id": "$category",
    "books" : { 
        $push: {
            "title":"$title",
            "votes" : "$votes", 
            "author_followers": 
            "$author_followers_count", 
            "price" : "$price"
        }
    },
}

var fase2 = { $group: query2 }

var fase3 = {
    $addFields: { 
        books: { 
            $slice: [{
                $sortArray: {input: "$books", sortBy: { votes: -1 }
                }
            }, 10]
        }
    }
}

var etapas = [ fase2, fase3]

db.GoodreadsBook.aggregate(etapas)



// Reemplazar los valores null de price por No disponible 

var query4= { "price" : null}

var operacion4 = { $set: { "price": "No disponible" } }

db.GoodreadsBook.updateMany(query4,operacion4)


var query5 = {"price": "No disponible"}

var proyeccion5 = {"_id" : 0, "title" : 1, "author" : 1, "price" : 1}

db.GoodreadsBook.find( query5, proyeccion5)

// Reemplazar los valores null de num_pages por No disponible

var query6 = { "num_pages" : null}

var operacion6 = { $set: { "num_pages": "No disponible" } }

db.GoodreadsBook.updateMany(query6, operacion6)


var query7 = {"num_pages": "No disponible"}

var proyeccion7 = {"_id" : 0, "title" : 1, "author" : 1, "num_pages" : 1}

db.GoodreadsBook.find( query7, proyeccion7)


//Que libros tienen el mejor rating en las diferentes categorias 
//que existen en los premios Goodreads

var query8 = { "_id": "$category", 
                "book" : { $push: {"title": "$title", "rating": "$rating", "author_followers_count": "$author_followers_count"}}
}

var fase8 = { $group: query8 }

var fase9 = {
  $addFields: {
    "book": {
      $slice: [{$sortArray: { input: "$book", sortBy: { "rating": -1 } }}, 1]  
    }
  }
}

var fase10 = {
  $project: {
    "book_with_max_rating": { $arrayElemAt: ["$book", 0] }
  }
}

var etapas9 = [ fase8, fase9, fase10]

db.GoodreadsBook.aggregate(etapas9)

/// Calcular los diferentes generos que hay y cuantos libros pertenecen a cada uno
// así se puede observar los generos más populares

var fase10 = {$unwind: "$genres"}

var query11 = { "_id": "$genres",  "count": { $sum: 1 }}

var fase11 = {$group: query11}

var fase12 = {$sort: { count: -1 }}

var etapas12 = [fase10, fase11, fase12]

db.GoodreadsBook.aggregate(etapas12)


//Calcular el promedio de los precios de los libros por categoria 
//excluyendo los libros con precios "No disponible"

var fase13 = {$match: {"price": { $ne: "No disponible" }}}

var query14 = {"_id" : null, averagePrice: { $avg: "$price"}}

var fase14 = {$group : query14}

var etapas14 = [fase13, fase14]

db.GoodreadsBook.aggregate(etapas14)


//Sumar los votos de todos los libros en cada categoría, organizando las categorías de mayor a menor cantidad de votos
var query15 = {"_id" : "$category",  totalVotes: { $sum: "$votes" }} 

var fase15 = {$group : query15}

var fase16 = {$sort: { totalVotes: -1 }}

var etapas16 = [fase15, fase16]

db.GoodreadsBook.aggregate(etapas16)


//Calcular los autores que tienen más de un libro nominado a los premios 
//y ver a que categoria pertenece cada libro

var query17 = {"_id": "$author", booksCount: { $sum: 1 }, books: { $push : {"title": "$title","category" : "$category" }}}

var fase17 = {$group : query17}

var fase18 = {$match: {booksCount: { $gt: 1 }}}

var fase19 = {$sort: { booksCount: -1 }}

var etapas19 = [fase17, fase18, fase19]

db.GoodreadsBook.aggregate(etapas19)


//Ver los seguidores de los autores de los libros y agruparlos para clasificarlos

db.GoodreadsBook.find({}, {"author" : 1, "author_followers_count" : 1}).sort({"author_followers_count": -1})

var query20 = {"_id" : "$author", 
                totalFollowers: { $first: "$author_followers_count" }, 
                AuthorbooksCount: {$first : "$author_book_count"}}

var fase20 = {$group: query20}

var fase21 = {$bucket: {
        groupBy: "$totalFollowers",  
        boundaries: [0, 100, 500, 2000, 10000, 50000, 100000, 500000],  // Definir los rangos de seguidores
        default: "Más de 500000", 
        output: {
          "count": { $sum: 1 },
          "authors": { $push: { name: "$_id", AuthorfollowersCount: "$totalFollowers", AuthorbooksCount: "$AuthorbooksCount" } }
        }
   }
}
    
    
var fase22 = {$sort: { "_id": 1 }}

var etapas22 = [fase20, fase21, fase22]

db.GoodreadsBook.aggregate(etapas22)



//Los libros ganadores por categoria 

var query23 = { 
    "_id": "$category",
    "books" : { 
        $push: {
            "title":"$title",
            "votes" : "$votes", 
            "rating" : "$rating",
            "author" : "$author",
            "author_followers": "$author_followers_count", 
            "author_book_count": "$author_book_count",
            "price" : "$price",
            "num_pages" : "$num_pages"
        }
    },
}

var fase23 = { $group: query23}

var fase24 = {
    $addFields: { 
        books: { 
            $slice: [{
                $sortArray: {input: "$books", sortBy: { votes: -1 }
                }
            }, 1]
        }
    }
}

var etapas24 = [ fase23, fase24]

db.GoodreadsBook.aggregate(etapas24)


















