# Notes de lecture du SRS pour le jeux de mot croisé
<!--Quelque note que j'ai prise sur le SRS en rapport avec les premières étapes de ce sprint-->

plusieurs niveaux de difficulté

deux modes de jeux:
  * classique
  * dynamique

partie
  * solo
  * un contre un

## Commencer la partie

À son arrivé, le joueur se fait proposer de *configurer* une partie à jouer ou d'en joindre une.

1. jouer seul ou contre un autre joueur
2. (seul) indiquer le niveau de difficulté (facile/normal/difficile)
3. (le reste concerne le 1-on-1)

(!) Non spécifier mais on pourait ajouter le support pour plusieurs langue avec la librairie i18n de angular (pour l'interface seulement, pas pour le mot-croisé...)

[librairie i18n](https://daveceddia.com/angular/multilingual-angular-using-two-or-more-languages-in-your-app/)

## Construction d'une grille 

* carrée, 10x10
* chaque ligne ou colonne contient 1 ou 2 mots, séparé par (case noire)+
* lettres majuscules, pas d'accents
* pas de tiret (m'as-tu-vu ==> mastuvu)

**(!) La construction de la grille doit être automatisée**

### indices:
  * ne doit pas contenir le mots (ou un mot de la même famille??)
    * On devra peut-être ajouter un check qui lit la description et rejète le mots si un pattern similaire est présent dans l'indice, puisque les définition proviendront d'un service externe
  * pas utiliser d'exemple (il faudra bien choisir le provider qui répond à ces critères)
  * le système doit prévoir plusieurs grilles à l'avance de chaque niveau pour être prêt à les envoyer
  * Lors d'une partie dynamique, on génère à l'avance des mutations à chaque étape pour être prêt quand la minuterie atteint 0


### Difficulté: 
difficulté calculée à partir de la *rareté* d'un mot, et de la *définition*

Rareté (commun/non-commun)

commun = fait partie de la liste des N mots les plus courant en francais 
Définition

[600 mots francais les plus utilisés](http://www.encyclopedie-incomplete.com/?Les-600-Mots-Francais-Les-Plus)

Définition:
* première partie
* toute les autres; définitions des sens alternatifs, etc.

Niveaux:
  * facile: mots communs + définitions premières
  * normal: mots communs + définition alternative
  * difficile: mots non-communs + définition alternative (ouch)

  **Lorsqu'aucune définition alternative n'est disponible, on se rabat sur la première définition 

  (!) Donc le service de définition doit supporter jusqu'ici:
    * plusieurs définitions distincte par mots (la plupart du temps)
    * Ne doit pas comporter d'exemple ni le mots défini (ou doit permettre de filter ceux-ci le cas échéant)

___

## Éxecution du jeux

pour entrer un mot, on clique sur sa définition, ce qui met en évidence l'espace dans la grille en épaissisant la bordure des cases (le contour devient de la couleur du joueur seulment en 1-v-1, ou pointillés bicolore si les 2 on sélectionnés le même), la sélection est visible pour tous, mais l'entré que pour le joueur qui l'exécute. 

On peut changer la sélection

Lorsque les 2 ont sélectionné le même mot, dès que un joueur entre la bonne définition, l'autre se fait kick-out (le notifier pour qu'il ne pense pas que le système a boggué ??)

Bonne réponse entré = ~~définition~~ + le background des lettres prend la couleur du joueur qui l'a entré

<!--reste ne semble plus pertinent à cette étape-->

---
# Premier Sprint

## Configurer une partie

En tant qu'utilisateur, je souhaite pouvoir configurer les paramètres d'une nouvelle partie afin d'avoir une expérience de jeu à mon goût.

À terme, je pourrai:

    Choisir entre les modes classique et dynamique.
    Choisir entre trois niveaux de difficulté : facile, normal et difficile.

Je peux choisir entre les modes _classiques_ et _dynamiques_ lors de la création d'une nouvelle partie.

Je peux choisir entre trois niveaux de difficulté: _facile_, _normal_ et _difficile_ lors de la création d'une nouvelle partie.

# Tâche

* page principale avec un lien pour les 2 jeux
* page de config pour Le Mots Croisé
  * mode:
    * solo ==> configuration solo
    * un contre un:
      * créer une partie ==> configurations
      * joindre une partie ==> afficher la liste détaillée des parties
  * configuration solo:
    * niveau difficulté
  * affchage de la grille de jeux