# MongoDB

## NoSQL

  - Favorise les données distribuées sur différents serveurs distants.
  - Utilise des model plus simples, mais moins structurés.
  - Ne garantie pas l'intégrité des données.

## MongoDB

  - Une base de donnée contient des collections
  - Une colleciton contient des documents.
  - Un document, c'est _essentiellement_ un objet JSON.
  - Chaque document à un attribut `_id` unique.

### Requêtes

Find:
  - `find()` et `findOne()`
  - Premier argument est un critère de recherche. (Ressemble à un document,
    mais avec des opérateurs spéciaux)
  - On demande à un `find` : "cherche-moi un document qui ressemble à _ça_".
    (_ça_ étant le critère, qui décrit partiellement le document que l'on
    recherche)
  ```
    db.collection.find({age: 10}) // Cherche tous les documents dont le champs 'age' est à 10
    db.collection.find({age: {$gt: 10}}); // Cherche tous les document dont le champ 'age' est "plus grand que" 10
  ```
  - Un `find` retourne un Curseur (qui est essentiellement l'équivalent d'un
    Itérateur sur tous les documents récupérés)
  - `find` peut accepter un second argument: Une "Projection"
  - Sert à spécifier (filtrer) les informations que l'on veut récupérer des
    documents.
  - `find` sans arguments va tout retourner.

`insertOne()`, `insertMany()`, `updateOne()`, `updateMany()`, `deleteOne()`, `deleteMany()`

