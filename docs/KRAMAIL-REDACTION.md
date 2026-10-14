# Kramail — rédaction : barre d'outils et champ « Destinataires »

## Mandat

Carte `t_abf9ccd4`. Arnaud a validé la maquette `t_859e687e` (« Je valide la nouvelle interface ») : elle reprend la barre d'outils de `t_29241bce` et propose un champ « Destinataires » unique. PR vers `feature/next` uniquement, sans fusion. Base : `ac0e638`.

## Ce qui change pour le joueur

- **Barre d'outils.** Elle garde les 18 boutons du site, dans le même ordre et en 4 groupes, avec les mêmes icônes et les mêmes actions (insertion BBCode, menus Smileys et Couleurs). Seul le rendu change :
  - sur ordinateur, une ligne compacte de boutons de 24 px ;
  - sur mobile, des boutons de 40 px ; à 375 px la barre tient sur 3 lignes, à 320 px sur 4. Quand un groupe ne tient plus, il passe à la ligne en entier. Il n'y a plus de bouton étiré sur toute la largeur ni de défilement horizontal.
- **Destinataires.** Les trois zones du site (Destinataire(s), Contacts +, Chercher) deviennent un seul champ :
  - chaque nom choisi devient une **pastille** retirable (croix, ou Retour arrière) ;
  - dès 2 lettres, des suggestions s'affichent : **Vos contacts** d'abord, puis **Annuaire du jeu**. L'annuaire est interrogé avec la même requête que le bouton Chercher (`ajaxsearch.php`), 250 ms après la dernière frappe ; une requête devenue inutile est annulée ;
  - un nom déjà choisi apparaît grisé avec ✓, et sa pastille s'allume ;
  - si aucun résultat ne correspond, « ajouter tel quel · non vérifié » reste possible ;
  - au clavier : ↑ ↓ pour choisir, Entrée pour ajouter, Échap pour fermer, Retour arrière pour retirer une pastille ;
  - le bouton **Contacts** ouvre la liste complète des contacts.

## Comment c'est fait

- Un module `Kramail:Destinataires`, inscrit dans `InitQueue`, ne s'active que sur `body.page-kramail-compose`. Il **masque** les zones natives `#dest`, `#contacts`, `#search` et `#results` sans les supprimer, et écrit les pastilles dans `#dest` (`c[3]`) au format du site : `Nom; Nom; `.
- L'envoi reste celui du site. Le module n'ajoute aucun appel serveur autre que `ajaxsearch.php` et n'invente aucune fonction.
- **Repli** : sans le script, ou si le module échoue, son interface est retirée et les zones natives redeviennent visibles et utilisables.
- La barre d'outils n'est modifiée qu'en CSS, dans la section « KRAMAIL RÉDACTION » de `kraland-theme.css`.

## Preuves (suite `tests/e2e/kramail-redaction.mjs`, `npm run test:kramail`)

Les tests tournent sur des fixtures locales anonymisées, issues du DOM réel (nouveau message, réception, envoi, corbeille, lecture). L'envoi est neutralisé et tout le réseau est refusé, sauf ce que le harnais sert lui-même (annuaire fictif au format du site).

- **Barre**, à 1280, 375 et 320 px :
  - 18 boutons en groupes `[4,4,4,6]` ; icônes, ordre et éléments actifs identiques au natif ;
  - 1 ligne de boutons de 24 px à 1280, 3 lignes à 375 et 4 lignes à 320, avec des cibles de 40 px ;
  - aucun défilement horizontal ;
  - Gras insère `[b]…[/b]`, un smiley insère son code, une couleur insère sa balise.
- **Destinataires**, à 1280, 375 et 320 px :
  - la valeur de `#dest` est vérifiée après chaque ajout et chaque retrait, par exemple `Marelle Duvent; Omar Sablier; ` puis `Omar Sablier; ` ;
  - les six états de la maquette (vide, suggestions, deux pastilles, aucun résultat, doublon, contacts) ;
  - les lignes de suggestion mesurent 34 px (bureau) ou 44 px (mobile), les croix 26×24 ou 34×32 ;
  - une seule requête après 250 ms, annulation, réponse tronquée à 25 noms suivie de « (...) », cas d'erreur.
- **Repli** : cas sans script, module en panne et navigateur sans `AbortController`.
- **Non-régression** : réception, envoi, corbeille et lecture sont rendues pixel pour pixel comme avec le bundle de `feature/next`, à 3 largeurs.
- **Contrastes** : au moins 4,5:1 sur les 16 thèmes.
- **Résultats** : `npm run test:all` est vert, avec 3 479 contrôles « ok » et 0 FAIL ; la suite Kramail compte 157 contrôles « ok ».
- **Captures** avant/après à 1280, 375 et 320 px : elles sont livrées avec la carte et ne sont pas versionnées dans le dépôt.

## Ce qui reste inconnu

Le contrôle fait par le serveur à l'envoi (nom inexistant, doublon, nombre maximal de destinataires) n'a pas été observé : aucun Kramail n'a été envoyé. Le module n'en présume rien et laisse le serveur décider, comme avant.
