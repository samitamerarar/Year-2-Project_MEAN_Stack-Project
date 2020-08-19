# Bases d'Angular

Bien-sûr, le meilleur moyen d'apprendre Angular est un tutoriel officiel comme [Tour of Heroes](https://angular.io/tutorial). On ne va même pas écrire de code ; juste donner un aperçu d'Angular.

Angular
=======

Ce que c'est:

- S'occupe de la DOM (qui permet de modifier dynamiquement l'HTML de la page).
- Gère la navigation sur le site web.
- Permet de séparer le code en plusieurs classes et fichiers assez naturellement.
- Probablement beaucoup d'autres choses.

Ce qu'Angular utilise principalement:

- Typescript pour la logique (calculs, requêtes, classes, ...)
- HTML5 (structure des pages)
- CSS (stylisation des pages)

Jargon
======

(Ce ne sont pas des définitions ; juste des explications approximatives sur comment on les utilise généralement)

- _Component_: Classe à laquelle on associe souvent du HTML (par exemple, la représentation HTML de la liste des parties d'un jeu pourrait pourrait être `GameListComponent` et devenir le tag HTML `<game-list></game-list>`).
- _Service_: Classe que l'on utilise pour obtenir ou enregistrer de l'information, par exemple d'un autre serveur. Le dictionnaire pourrait être un service.
- _Module_: Ensemble de _components_, _Services_, etc. J'ai l'impression que c'est un peu comme une librairie en C.

`ng`
====

Commande du terminal. Permet de:

- Créer une application Angular vide: `$ ng new my_angular_app`
- Démarrer une application Angular: `$ ng serve`
- Générer des _Components_, _Services_, _Modules_ vides: `$ ng generate component components/MyComponent `. Je conseille de les créer à la main une couple de fois pour comprendre comment ça marche, puis de les générer avec `ng`.
- **Exécuter les tests: `$ ng test`**
- **Vérifier la qualité du code: `$ ng lint --type-check`**

Organisation des fichiers
=========================

- `package.json`: Utilisé par `npm` pour savoir ce dont a besoin l'application. Avant de pouvoir démarrer l'application, il faut faire `$ npm install` pour télécharger et installer les dépendances. Les dépendances seront mises dans un dossier appelé `node_modules`.
- `*.module.ts`: Contient un _Module_ et spécifie quels sont les _Components_, (presque tous) les _Services_ et les _Modules_ importés qui composent ce _Module_.
- `*.component.ts`: Contient un _Component_.
- `*.service.ts`: Contient un _Service_.

Style de codage
===============

Angular [donne les recommandations suivantes](https://angular.io/tutorial/toh-pt3#make-a-hero-detail-component):

- Un seul classe/_Component_/_Service_/_Module_ par fichier.
- Le nom d'un _Component_ devrait être en `UpperCamelCase`, se terminer par `Component` et le nom de fichier devrait être `formatté-avec-des-tirets.component.ts`. Similaire pour les _Modules_ et _Services_.

Si vous générez les fichiers avec `$ ng generate`, ça sera fait tout seul. Par exemple, si vous faites `$ ng g service services/MyCool`, `ng` va vous créer les fichiers `my-cool.service.ts` et `my-cool.service.spec.ts`, va appeler le service `MyCoolService` et l'ajouter au module.
