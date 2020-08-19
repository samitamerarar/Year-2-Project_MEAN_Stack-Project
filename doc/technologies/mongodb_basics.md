# Bases de MongoDB

Comme pour la pluspart des bases de données, MongoDB requière d'avoir un serveur indépendant du site web (qui peut être sur la même machine ou une machine distante) pour ensuite s'y connecter à travers une API.

## Installation

### Pour les systèmes Linux 64-bit:

Ouvrez un terminal de ligne de commande et rendez-vous à l'intérieur du dossier où vous voulez installer le serveur MongoDB, puis faites les commandes suivantes:

    curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.4.7.tgz &&\
    tar -zxvf mongodb-linux-x86_64-3.4.7.tgz &&\
    mv mongodb-linux-x86_64-3.4.7/* ./ &&\
    rm -rf mongodb-linux-x86_64-3.4.7*

Si vous voulez executer le serveur sans avoir à spécifier son chemin d'accès, il faut vous assurer que le dossier `bin/` du dossier de MongoDB soit contenu dans la variable `PATH`. Vous pouvez ajouter une ligne au fichier `rc` de votre interpréteur de commande ("`~/.bashrc`" pour bash) pour que ce soit fait automatiquement au lancement d'un invité de commande:

    export PATH=<mongodb-install-directory>/bin:$PATH

Remplacez `<mongodb-install-directory>` par le chemin absolut vers le dossier où vous avez installé MongoDB.

## Démarrage du serveur MongoDB

### Premier démarrage

Il faut tout d'abord préparer un emplacement où les bases de données seront créées.

Premièrement, choisissez un dossier où pour y mettre les DB. Créez-le s'il n'existe pas encore. Par défaut, le programme `mongod` s'attend à ce que ce soit le dossier `/data/db`. Si vous choisissez un autre emplacement autre que celui-là, notez-le pour plus tard. Assurez vous que vous possédez les droits pour le dossier.

Voici la commande pour créer le dossier par défault:

    mkdir -p /data/db

Enfin, pour démarrer le serveur, executer la commande:

    mongod

Si vous n'avez pas changé votre variable `PATH`, vous devez mettre le chemin complet vers l'executable:

    <chemin_vers_installation_mongodb>/bin/mongod

Si vous voulez utiliser un autre dossier que celui par défault pour placer les DB, utilisez cette option:

    mongod --dbpath <chemin vers le dossier des DB>

## Utilisation basique avec `NodeJS`

On suppose que la librairie de MongoDB pour `NodeJS` est déjà installé (Le Cadriciel s'en charge).

Voici un script JavaScript basique pour accéder à une base de donnée MongoDB:

```JavaScript
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/<DB_name>";

MongoClient.connect(url, function(err, db){
    // Récupère (et créé si absant) une collection
    var myCollection = db.collection("myCollection");

    // Insertion d'une nouvelle entrée (un document)
    myCollection.insertOne({first : "hello", second : "world"},
        function(err, result){
            if (result.insertedCount == 1) {
                // Tout s'est bien passé
            }
        }
    );

    // Récupère le document inséré plus tôt
    myCollection.findOne({first : "hello"}, function (err, doc) {
        if (doc.second == "world") {
            // Tout c'est bien passé
        }
    });

    // Supprime le document
    myCollection.deleteOne({first : "hello"}, function(err, result){
        if (result.deletedCount == 1) {
            // Tout c'est bien passé
        }
    });
});
```