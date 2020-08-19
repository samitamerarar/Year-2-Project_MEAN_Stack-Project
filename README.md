LOG2990 -- Équipe 1
===================

Quelques instructions spécifiques à notre équipe:

1. Pour pouvoir exécuter les tests sur le serveur, il vaut mieux ne pas démarrer le serveur. Si le serveur est démarré, il y aura l'erreur "address already in use" à cause de l'adresse utilisée par socket.io, mais ça ne causera de toute façon aucun problème.
2. Pour avoir un beau logger DEV sur le serveur, exécuter:
3. Pour configurer le nombre de piste, appuyer sur un chiffre de 1-9. On peut avoir 9 tours max.
    $ LOG_LEVEL=INFO npm start

# Note

L'API que nous utilisons pour récupérer les définitions (Wordnik) ne répond plus. Nous cherchons encore la source du problème et/ou une autre API
que nous pourions utiliser à la place. Cela fait que les définitions présente dans le mot croisé ne seront pas celles attendues.

