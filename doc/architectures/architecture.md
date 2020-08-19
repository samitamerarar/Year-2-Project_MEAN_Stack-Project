# Élaborer l'architecture d'une carte Scrum

## 1. Définir le but de la carte

En utilisant les demandes du client (SRS et / ou cartes Trello), se demander: Quelles ressources est-ce que cette carte devrait rendre disponible? Exemples pour la carte Service Lexical:

- Mots selon des contraintes (longueur et position des lettres)
- Définitions
- Fréquences de mots

## 2. Définir une architecture

**REMARQUES**:
- Même si on parle de 'classe', le principe s'applique aussi aux middlewares d'Express.
- La structure peut au départ être composée des 1-2 classes les plus évidentes.

### 2.1. Définir une structure (RDD)

Quand rajouter des classes? Si on veut déléguer une responsabilité à une classe. En la créant, définir assez précisément ce qu'elle doit gérer, c'est-à-dire ses responsabilités. Le faire si possible sur papier. Ex:

- `RegexBuilder`: Gère la création d'expressions régulières qui contiennent les contraintes sur les caractères d'un mot. _(NOTE: RegexBuilder n'est pas une classe évidente ; on n'y penserait pas forcément au départ. On y penserait probablement par la suite.)_

### 2.2. Ajouter des opérations et ressources

Ajouter des opérations qui vont permettre à la classe de remplir ses responsabilités. Ex:
- Si la classe `Interval` gère un intervalle entre deux nombres, on pourrait:
    - Créer l'intervalle en passant deux nombres
    - Savoir si un nombre est dans l'intervalle
    - Savoir si un intervalle est vide.

Attention à:
- Bien respecter la responsabilité de la classe. Exemple un peu évident:
    - `Interval` ne devrait pas calculer la norme d'un vecteur, puisqu'il doit simplement gérer l'intervalle entre deux nombres.
- Ne pas perdre trop de temps à créer inutilement des opérations. On pourrait créer les quelques opérations les plus évidentes, puis en rajouter au besoin. Ex:
    - Implémenter le produit carthésien de deux intervalles?? Est-ce que l'on en a vraiment besoin? Si un jour on en a besoin, on pourrait le faire à ce moment-là.

### 2.3. Définir les tests (TDD)

Pour chaque méthode publique, définir des tests. Les tests devraient contenir un cas valide, des cas limites valides, et des cas limites invalides. Souvent, en définissant les tests, on définit mieux ce que la méthode fait. Ex:
- Pour chercher si deux segments se croisent, on peut essayer:
    - Deux segments quelconques qui se croisent
    - Deux segments qui ne se croisent pas
    - Deux segments qui se croisent presque, mais pas encore
    - Deux segments qui se croisent, mais à peine
    - Un segment vertical qui croise un segment horizontal
    - Un segment de longueur 0 et un segment quelconque
    - Deux segments qui se superposent
- Pour construire un intervalle, on peut essayer:
    - Le premier nombre inférieur au deuxième
    - Le premier nombre supérieur au deuxième (d'ailleurs, en écrivant ce test, on pourrait se poser la question: _"Est-ce que, dans ce cas, on devrait jeter une erreur, accepter les valeurs mais les inverser, ou accepter les valeurs mais considérer l'intervalle comme un intervalle vide?"_)
    - Deux valeurs égales

Attention à:
- Ne pas perdre trop de temps à définir les cas de tests: en rajoutant/modifiant des classes, vous allez peut-être devoir revoir vos tests. La plupart des méthodes ne vont demander que 2-3 cas de test.

### 2.4. Extraire des classes ou opérations ?

Regarder chaque classe, et chaque opération. Se demander:
- Est-ce que la responsabilité de chaque classe est bien définie? Ex:
    - _"`MapEditor` doit gérer les données de la Map et gérer son rendu à l'écran"_, versus: _"`MapEditor` doit gérer les données de la Map, et `MapRenderer` doit gérer le rendu de la Map à l'écran"_.
- Est-ce que les opérations remplissent bien la responsabilité de la classe, et _seulement_ la responsabilité de la classe?
- À vue d'oeil, est-ce que les opérations seront assez simples? Est-ce qu'il ne serait pas mieux de les séparer en plusieurs opérations? Ex:

    ``` Typescript
    public checkMapValid(): boolean {
        // Check if map closed
        // ...
        // Check angles
        // ...
        // Check if segments cross
        // ...
        return closed && anglesOk && !segmentsCross;
    }
    ```

    Versus:

    ``` Typescript
    public checkMapValid(): boolean {
        return this.checkIfMapClosed() && this.checkAngles() &&
               !this.checkIfSegmentsCross();
    }
    ```

### 2.5. Autres critères de qualité

Se demander:
- Est-ce que le nom des classes et opérations montrent clairement ce qu'ils font? Ex:
    - `switchCase2` versus `addWordToGrid`

### 2.6. Itérer!

Si les étapes 2.4. et 2.5. ont montré des problèmes, retourner à 2.1. .

## 3. Faire approuver son architecture

Une fois assez satisfaits de votre architecture, créez les opérations (sans les implémenter), et commitez sur Git, puis contactez Emir. Il devrait trouver des photos de votre architecture et de vos tests sous `doc/architectures/<feature>`. Il est fort probable qu'Emir ne puisse pas vous réponde tout de suite, puis vous fasse des suggestions. Votre travail pourrait demander une coordination avec ce que font les autres présentement. Une fois l'architecture approuvée, dites-vous que la moitié du travail a été faite.

## Autres commentaires

- Gardez trace de l'architecture. Le travail d'architecture peut se faire surtout sur papier, ou avec un logiciel du genre (écrivez clairement SVP ☺).
- L'implémentation des tests peut se faire tout seul. Il faut que tout le monde puisse accéder à une trace écrite de la définition des tests, pour qu'une personne puisse implémenter les tests alors qu'un autre implémente le code.
- **Parlez!** Même après avoir fait une architecture et l'avoir fait approuver, vous allez encore vous rendre compte que certaines classes ont trop de responsabilités, et vous allez créer de nouvelles classes. Assurez-vous d'en parler à vos collègues ; ils pourraient trouver la nouvelle classe utile pour leur code.

Attention à:
- Ne pas créer des classes juste pour créer des classes. C'est normal d'avoir beaucoup de classes tant que ça a un sens, mais si une classe est paresseuse, renvoyez-la chez elle. _Exemple_:
    - La classe `Path` dans `src/client/src/app/admin-screen/map-editor/path.ts`. À quoi est-ce qu'elle sert? Elle ne fait que contenir des points sans rien faire avec. On dirait que ses responsabilités n'ont pas été très bien définies.
