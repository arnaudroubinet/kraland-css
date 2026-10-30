# Revue manuelle groupée

Doutes, décisions et validations à trancher par Arnaud à la fin du travail en autonomie (consigne du 2026-10-22). Chaque point porte l'option retenue en attendant, marquée comme hypothèse.


## Décisions d'Arnaud du 2026-10-28 : recommandations suivies

Decision: 2026-10-28 — Arnaud : « Globalement pour tous les points, je vais suivre ta recommandation. » Chaque point ouvert ci-dessous prend la recommandation de l'orchestrateur. Les actions qui exigent Arnaud restent à sa main : clic sur la cloche (8.2, marque les notifications lues), session Kraland dans le Chrome dédié (spike 9.3, Signaler du 7.1, fixtures réelles du 7.2), essais sur téléphone, captures hitl (4.6, 6.1, 6.4, 7.9, 8.5, 9.11). A1 : aucune fusion vers `main`. Arnaud, 2026-10-28 : « Non pas de fusion vers main. On travail que sur next. » Tout le travail est livré sur `feature/next`.

- Tickets hitl (téléphone, captures, validations visuelles) : Arnaud, 2026-10-28 : « tu test via emulateur. ça me suffit. Quand tout seras fini (tous les tickets) je ferais une passe manuelle. pas avant. » L'orchestrateur les vérifie en émulation, sans attendre ; ce qui reste à voir est noté pour la passe finale d'Arnaud.
- 8.3 : aucun `!important`. La marge en ligne de 10 px du bandeau est compensée par le padding-top du body sous la garde ; si un écart reste, il est consigné.
- 9.7 (Q30.5) : le ticket reste dans l'épopée 9. Cercle et barre de PV gardent la couleur par niveau de santé, passée aux jetons.
- A9 : base de `kramail-redaction` figée sur un SHA (tests seulement).
- D11 et H10 : correctif d'ancres limité à `#flap`. L'essai sur téléphone ne bloque rien.
- D12 : liens « lien » et « liste des messages » laissés hors du mobile.
- A5 (cloche invisible menu fermé, 768-991 px) : rendu de base, sans repère ajouté.
- D2, D3, D5 et choix du 6.1 : Staff reste exclu, sans correctif.
- D6 : coins bas de la carte racine en sombre laissés au rendu de base.
- D10 : `span.tagforum` garde son rendu natif.
- Q27.5, Q27.6 : répétition « Jeu (RP) », description et modérateurs du sous-forum laissés tels quels.
- Q24.2, Q30.6, Q32.2 à Q32.4 : rendu actuel ; Q30.6 garde seulement le plancher de 44 px (entrée 9.5). Q20 : aucun seuil de contraste non textuel.
- 4.9 : cellules du forum à 4 px en haut et en bas, 8 px sur les côtés ; seuils L6 inchangés.
- « article » et « Dernier sujet » (CAP-6) : consignés absents, sans règle.
- Lignes de sujet mobiles : cartes détachées gardées.
- O1 : pas de fond de page teinté.
- 5.5 : marque PNJ mobile gardée à 14 px et 46 px.
- 4.6 : panneau Matériel à 13 px sur ordinateur gardé.
- 4.7 : nom de forum de l'index en graisse 400 ; DESIGN.md aligné.
- DESIGN.md : titre du kramail en accent, titre du jeu à 17 px, enveloppe rouge.
- Pages secondaires sous 12 px (accueil, Événements) : laissées en l'état.
- Cibles de 44 px des votes et de la pagination : épopée 9.
- Compteurs sur ordinateur : colonnes Sujets et Messages gardées.
- Sous-forum : inchangé, `EXCEPTION_TICKET66` gardée.
- Épingles du `tickets.toml` de l'initiative : déjà en place, point clos.
- « Non lu » du kramail : décision du 2026-10-23 suivie (entrée 7.4) ; EXPERIENCE.md mis à jour.
- Kramail (épopée 7) : Q31.1, Q31.2, Q31.3 et Q22.1 confirmées telles qu'appliquées.
- 3.5 (palette d'états), 2.5 (croix à sa place native), 9.1 (colonnes ajoutées après le chargement à 0 px), 9.2 (nom à gauche, statut centré ; cartes de 1512 px au nom dessous) : confirmés.
- Backlog 2, 3 et 4 : faits. Backlog 5 : clos (constat 2 infirmé, constat 1 non vérifiable sans marquer un message lu).

## Validations visuelles en attente (tickets `built`)

- Ticket 3.1, jetons de couleur et liens en couleur d'accent : captures de la fixture dans `.tmp/captures/validation-3-1-jetons/` (Kraland, Empire Brun et Paladium, clair et sombre, 375 et 1280 px). Sur le site, changements visibles : liens d'Empire Brun clair en brun `#8a5a00` au lieu de l'or ; survol des liens sans changement de couleur, souligné ; nuances du clair tirées de chaque nation (plus de rouge Kraland hors Kraland). Aucune visite du site réel pour ce ticket.

- Ticket 2.5, croix de fermeture lisible : captures du site réel dans `.tmp/captures/validation-2-5-croix/` ; sur ordinateur, l'image du titre de l'ordre se place 44 px plus à gauche (la zone de la croix lui réserve sa place).

- Ticket 2.4 (et nouveau placement des alertes du 2.3) : captures du site réel dans `.tmp/captures/validation-2-4-modale/` (`index.html`) ; pastilles dans le pied, alertes en tête de l'ordre, 375 et 1280 px, deux variantes.

- Tickets 2.2 et 2.3, modale d'ordre (libellés, alertes en tête, aide repliée) : captures du site réel dans `.tmp/captures/validation-2-2-2-3-modale/` (`index.html`) ; Dormir et Pouvoir, 375 et 1280 px, deux variantes. Pastilles pastel et « Valider » vert : tickets 2.4 et 2.6 à venir.

- Ticket 6.1, index du forum aligné sur le sous-forum : captures du site réel dans `.tmp/captures/validation-6-1-index-forum/` (`index.html`) ; 4 index, sous-forum et racine, 375 et 1440 px, Kraland clair et Empire Brun sombre.

- Ticket 8.5, notifications (cloche et page `/report`) : captures de fixtures dans `/Users/arnaud/kraland-css-captures/8.5/` (22 PNG, 375×667, 1280, 1440, 1920 et popup 900×800, Kraland clair et Empire Brun sombre). Détail et défauts constatés : section « Ticket 8.5 » en bas de ce fichier. Captures, mesures et scripts copiés par l'orchestrateur dans `/Users/arnaud/kraland-css-captures/8.5/`, qui survit au redémarrage.

- Ticket 7.9, kramail face au forum (action A8 de la rétro 6) et reprise des captures 8.5 sur le bundle actuel (A1 de la rétro 8) : captures de fixtures dans `/Users/arnaud/kraland-css-captures/7.9/` (56 PNG et planches) et `/Users/arnaud/kraland-css-captures/7.9/notifications/` (22 PNG). Détail : section « Ticket 7.9 » en bas de ce fichier. Captures copiées hors de `/tmp` par l’orchestrateur ; scripts dans `/Users/arnaud/kraland-css-captures/7.9/travail/` pour les reprendre.

## Tickets construits à marquer « fait »

- Backlog 3 : nom contenant « $ » (bug corrigé, sans validation visuelle requise).
- Backlog 2 : onglet de section actif sur mobile, même règle que l'ordinateur.
- Backlog 4 : tests de CAP-1 (décor CSS sur Cybermonde, « messages », zones de test).
- Backlog 5 (exploration) : constat 2 infirmé, constat 1 non vérifiable sans marquer un message lu ; à clore ou à reprendre quand un message lu ou envoyé existera.

## Décisions à confirmer

- Ticket 3.5, palette d'états réservée aux états (décidé en autonomie le 2026-10-23) :
  - lien dans une alerte (info comprise) : couleur du texte de l'alerte (`text-primary`), souligné. En couleur d'accent, il tombait à 3,80:1 en Paladium sombre sur l'alerte info (Q4) et à 4,30:1 sur l'avertissement à 12 %. Alternative : accent partout sauf Paladium sombre ;
  - info pleine (`.btn-info`, `.label-info`, `.bg-info`) : paire d'action de la nation, comme les boutons primaires ; `.text-info` en `text-accent` ; panneau info et alerte info en `--kr-alert-info-*`. DESIGN.md ne donne que la teinte de l'alerte info ;
  - pièce courante du plateau : la règle sombre `.btn-warning` (couleur de nation, ticket 3.2) ne vise plus que le lien natif `.btn-warning` à image de pièce (`img[src*="/bat/bat"]`) ; en clair, la pièce garde l'orange de Bootstrap (hors périmètre). Les autres `.btn-warning` prennent la couleur d'avertissement ;
  - marque PNJ native (`.btn-danger.xmini`) exclue des boutons de danger (épopée 5) ;
  - fonds `.bg-success/-warning/-danger` : couleur d'état pleine, texte `bg-surface` (plus de pastel de Bootstrap). Aucun emploi relevé sur les fixtures ;
  - score des messages sur mobile : teinte de succès à 12 % (fond) et 35 % (bordure), texte du thème, comme une alerte (il était vert translucide) ; votes sur ordinateur : bouton de succès plein ;
  - alerte info de l'accueil : fond `--kr-alert-info-bg` (et bordure `--kr-alert-info-border` sur ordinateur) au lieu de `bg-elevated`, filet primaire gardé ; en sombre, la règle en dur `rgb(122, 82, 64)` la battait jusqu'ici ;
  - en sombre, la bordure `border-default` ne vise plus que les alertes sans type (aide de la modale d'ordre sur ordinateur) : posée sur toute `.alert`, elle battait la bordure des alertes info et d'état ;
  - en-tête des panneaux info de la modale d'ordre sur ordinateur (tableau des actions) : teinte info de la nation au lieu du bleu de Bootstrap (clair) et de `bg-elevated` (sombre) ;
  - boutons de la page Contacts et « Pas un contact » : non relevés (ni fixture ni classe de page). Ils prennent les règles communes des boutons d'état ; à vérifier, reporté (`deferred-work.md`).

- Ticket 3.4, mode clair thémé comme le sombre, bouton standard (décidé en autonomie le 2026-10-23) :
  - Confédération Libre clair : `text-nation` (sa primaire `#6b7280`) ne fait que 4,38:1 sur `header-tint`, le fond du bouton standard survolé ou pressé. Option retenue : la variante prend son accent `#475369` (7,04:1), comme Paladium (Q2) ; DESIGN.md mis à jour. Alternative : garder la primaire au repos et ne foncer que le survol et l'appui ;
  - « Annuler » de la modale d'ordre mobile : fond `bg-elevated` → `bg-surface`, comme « ? Aide » (en sombre seulement ; en clair les deux sont blancs). Son texte reste `text-secondary` (règle propre à la modale) ;
  - bouton standard en sombre : survol `bg-active` → `header-tint` (`bg-elevated`), focus `bg-hover` → `bg-surface`, bordure des états `border-strong` → `border-default`, selon la matrice du plan (une seule règle pour les deux modes) ;
  - effets visibles en clair : en-têtes, pieds et en-têtes de tableau teintés de la nation, onglets bordés de la teinte, bouton standard au texte de la nation (il était en accent, par la règle des liens, sur les `a.btn-default`), `hr` masqués partout (séparateurs du plateau et séparateur des filtres d'Événements, `body.page-evenements #col-left form hr`, compris), texte atténué un peu plus foncé.

- Ticket 3.3, texte coloré en accent, rouge et bleu en dur (décidé en autonomie le 2026-10-23) :
  - modale du changelog (point résolu, décision à confirmer) : son fond est noir dans les 16 variantes, où l'accent du clair tombait de 2,01:1 (Paladium) à 3,55:1 (Théocratie Seelienne). Option retenue : titre, version et puces y gardent le texte clair de la modale (hérité) au lieu de l'accent, ≥ 4,5:1 dans les 16 variantes. Alternative : modale sur la surface claire du thème en clair, avec l'accent ;
  - flèche du carrousel en sombre : opacité passée de 0,7 à 1 (à 0,7, l'accent tombait à 3,4:1 en Kraland sombre) ;
  - alerte d'avertissement en sombre : fond passé de 15 % à 8 % d'ambre. Avec 15 %, le lien en accent tombait à 4,36:1 en Kraland sombre et à 4,04:1 en Paladium sombre. Avec 8 %, il passe à 5,02:1 et 4,65:1. Les 12 % prévus pour les alertes (maquette) feraient retomber Paladium sombre à 4,30:1 : à arbitrer au ticket 3.5 ;
  - boutons génériques de la barre BBCode : fond passé de `--kr-surface` (blanc dans les 16 variantes) à `--kr-bg-surface`. En sombre, l'accent sur blanc tombait entre 1,66:1 et 3,34:1 ; le clair ne change pas ;
  - couleurs de nation `.f1` à `.f9` en sombre : déjà toutes ≥ 6,26:1 sur `bg-surface` et `bg-elevated` dans les 8 variantes sombres, donc aucune valeur changée ; le contrôle est ajouté ;
  - effets visibles en clair : ces textes passent du vert au rouge en Royaume de Ruthvénie, de l'or au vert en Paladium et au brun `#8a5a00` en Empire Brun.
- Ticket 3.2, texte posé sur la couleur de nation (décidé en autonomie le 2026-10-23) :
  - fond et encre changent ensemble : tout fond en couleur de nation prend la paire d'action. Au repos, c'est `--kr-arm-bg` / `--kr-arm-ink` ; au survol, à l'appui et sur la primaire foncée, `--kr-arm-bg-hover` / `--kr-arm-ink-hover`. Effets visibles :
    - en clair, le texte des boutons primaires passe du rose (accent inverse) au blanc, et à l'encre sombre en Paladium ;
    - en Kraland et Khanat Elmérien sombres, ces fonds prennent la teinte d'action (`#b64c4c`, `#8659b3`) des boutons et de la croix ;
    - en Empire Brun sombre, le texte passe de `#f5f1ed` à blanc ;
  - les règles sombres E3 et PLT-10, qui recopiaient en dur les valeurs des variables, sont remplacées par les variables ;
  - « fin du bleu Bootstrap » étendue à tous les éléments bleus de ces composants : états des boutons primaires, badge interne, `.dropdown-menu > .active`, `.nav-pills`, pagination au focus, `.label[href]` survolé, `.panel-primary`, texte et badge du titre actif des listes ;
  - `.btn-warning` en sombre, peint en couleur de nation : son fond passe aussi en `--kr-arm-bg`. Avec la seule encre, le texte tombait à 4,00:1 en Kraland sombre et à 3,64:1 en Khanat Elmérien sombre. Le choix de sa couleur (état ou nation) revient au ticket 3.5 ;
  - plan approuvé en autonomie (checkpoint 1), gardé en un seul plan malgré sa taille (un seul objectif).
- Ticket 3.1, jetons de couleur (décidé en autonomie le 2026-10-23) :
  - nuances du clair calculées par une formule (`color-mix`, une par nuance, Kraland compris), plutôt que 56 valeurs recopiées ; Kraland clair change d'un cran, comme les tableaux de DESIGN.md (primaire foncée `#700b09` → `#6f0c0b`, accent inverse `#f9d9de` → `#f6dde1`) ;
  - le texte survolé des entrées sans lien des listes latérales (`.list-group-item:hover`, en primaire foncée) passe en couleur d'accent dès 3.1, sinon il tomberait à 2,9:1 en Paladium clair ; les entrées-liens gardent le survol de Bootstrap (`#555`, sans soulignement), avant comme après ;
  - question : les entrées-liens des listes latérales doivent-elles suivre R7 (accent et soulignement au survol) comme les liens du texte ? Option retenue en attendant : non, ce sont des entrées de navigation (rendu actuel gardé) ;
  - texte posé sur la primaire foncée (boucle de revue 1) : la page active de la pagination, le survol des boutons primaires, celui de la croix des panneaux mobiles et celui de « tout voir » prennent la paire de survol d'action dès 3.1. Sinon, en Paladium clair, la nouvelle primaire foncée `#aa8c2c` mettrait leur texte blanc à 3,23:1 (le texte des boutons primaires survolés est blanc : la règle de Bootstrap l'emporte sur l'accent inverse ; le repli garde ce blanc). Seule exception laissée au ticket 3.2 : l'état pressé de la barre d'envoi fixe, bref, et que R4 retire ;
  - alerte info en sombre (boucle de revue 1) : jetons déclarés, mais fond et bordure actuels gardés jusqu'au ticket 3.5. Avec la teinte de la nation, les liens d'alerte, en primaire jusqu'au ticket 3.3, tomberaient sous 4,5:1 dans 3 variantes sombres ; en couleur d'accent, Paladium sombre tomberait à 3,80:1 (Q4) ;
  - jetons et règles de lien réécrits à leur place, globaux comme avant ; la liste combinée vaut pour les règles nouvelles ;
  - plan approuvé en autonomie (checkpoint 1), gardé en un seul plan malgré sa taille (environ 2 100 jetons, un seul objectif).
- Épopée 3 (prises en autonomie le 2026-10-23) : valeurs [ASSUMPTION] de DESIGN.md reprises (formules H5.2, couleurs d'état et jauges Q3, info qui suit la nation en sombre Q4) ; alertes à 12 % (fond) et 35 % (bordure) comme la maquette ; Q21 accepté (non-lu #c41e3a et danger #c62828 voisins en Kraland et Ruthvénie, distingués par le libellé et la forme) ; Q26 : text-secondary foncé à #636a77 en clair ; Q20 : pas de seuil non textuel pour les bordures décoratives ; texte aujourd'hui en primaire → text-accent (Ruthvénie clair passe du vert au rouge) ; Q16 : variante high-contrast laissée hors des 16 ; couleurs de nation .f4 à .f8 éclaircies jusqu'à 4,5:1 en sombre ; épopée 3 déclarée après l'épopée 2 (outil des 16 variantes) ; --kr-arm-ink-hover déclaré par 3.1, règles :focus de la modale à 3.7, fonds et halo de l'onglet actif au ticket 2.6.
- Ticket 2.5, croix de fermeture : zone de 44 × 44 px avec le glyphe calé dans le coin haut droit, pour garder le × à sa place native (Q25.4). Option retenue : oui ; alternative : glyphe centré dans la zone (le × se déplace d'environ 15 px vers la gauche et 11 px vers le bas sur ordinateur).
- Ticket 2.3, mobile : le bloc des alertes collé en haut du corps (au-dessus) recouvre la zone d'onglets, collante elle aussi, quand le corps défile. Option retenue : alertes prioritaires (R2 : « restent fixées en haut ») ; alternative : coller les alertes sous la zone d'onglets (moins de place pour le contenu).
- Tickets 2.3 et 2.4, placement (décidé en autonomie le 2026-10-22, à confirmer) : les pastilles coût, durée, potentiel sont dans le pied de la modale, toujours visibles au-dessus des boutons, et les alertes de blocage et d'avertissement remontent en tête de l'ordre, juste sous son titre (`h3`), avant les caractéristiques et les onglets, collées en haut au défilement. Raison : avec les alertes sous le titre de l'onglet (`h4`) et les pastilles dans le pied, l'avertissement de Dormir passait entièrement sous le pli à 375 × 667. Alternative : alertes sous le `h4` et pastilles en fin d'ordre (visibles seulement en fin de défilement).
- Ticket 2.4, potentiel (relevé réel du 2026-10-22) : le troisième segment de la ligne native vaut « Potentiel: … » ou « Automatique » (aucun jet) ; « Automatique » est montré comme pastille de potentiel.
- Ticket 2.3, mobile : à l'ouverture, la bande coût / durée collante recouvre le titre de Dormir et le « ? Aide » de Pouvoir (touchable après défilement). Repris par le ticket 2.4 (pastilles au-dessus des boutons) : bande retirée.
- Tickets de backlog 6, 7, 8 (créés en autonomie, critères complets, `refined: false`) : à approuver. 6 = trois modules des modales inactifs au démarrage réel (attend 2.3) ; 7 = fenêtre étroite au chargement qui arrête l'initialisation ; 8 = mode « start » de fin-initialisation à corriger.
- Épopée 2 : P2 (vrai téléphone) ne bloque que l'entrée 6 ; les entrées 2 à 5 livrent aussi le mobile, vérifié en émulation, avec un risque de reprise si le téléphone diverge. Alternative : tout attendre P2.
- Épopée 2, Q5 (pastilles coût, durée, potentiel) : style des étiquettes de catégorie, icône et valeur, 12 px gras.
- Épopée 2, Q25.2 : alertes de blocage et d'avertissement placées sous le titre de l'ordre (h3), avant les caractéristiques et les onglets (remplace « sous le h4 », tickets 2.3 et 2.4).
- Épopée 2, Q25.3 : aide repliée derrière « ? Aide » aussi sur ordinateur (maquette key-modale-ordre).
- Épopée 2, Q25.4 : croix de fermeture laissée à sa place native.
- Épopée 2 : croix ≥ 3:1 et onglet actif ≥ 4,5:1 vérifiés sur les deux supports (CAP-3 ne limite pas le support).
- Épopée 2 : l'outil de test des 16 variantes est créé par l'entrée 3 de l'épopée 2.
- Ticket 2.2, thème désactivé (peau coupée) : le socle de la modale d'ordre ne s'installe pas, la modale reste native (« Cancel » / « OK », aucun marquage), comme les modules récents (Kramail:Destinataires, index du forum). Option retenue : oui ; alternative : « Annuler » / « Valider » même thème désactivé.
- P2 à faire par toi : protocole `epic-modale-ordre/protocole-p2-vrai-telephone.md` (ticket 2.1, bloqué en attendant tes résultats) ; il conditionne le ticket 2.6.
- Ticket 6.1, fil d'Ariane de l'index sur mobile : construit à partir du bouton natif « Tous les forums » (« ⏪ Tous les forums › Jeu (RP) »), comme celui du sous-forum part de son bouton « ⏪ Jeu (RP) ». Option retenue : oui ; alternative : titre seul, sans fil d'Ariane (lecture stricte de H12.3).
- Ticket 6.1, index « Staff » : non traité (structure inconnue, hors des quatre index nommés). Option retenue : exclu.
- Ticket 6.1, ordinateur : colonnes Sujets et Messages conservées, comme Msg et Vus du sous-forum, plutôt que « N sujets · N messages » de la maquette h12. Option retenue : alignement sur le sous-forum, consigne du 2026-10-22.
- Ticket 6.1, forum sans message : compteurs « 0 sujets · 0 messages », ni dernier message ni bouton → (Q27). Option retenue : oui.
- Ticket 6.1, en-tête de l'index sur ordinateur : le bouton natif « Tous les forums » (icône seule, libellé en infobulle, posé au-dessus du titre) passe dans le titre, à droite, avec son libellé, comme les boutons « Jeu (RP) » et « nouveau sujet » du sous-forum. Option retenue : oui ; alternative : bouton natif laissé tel quel.
- Ticket 6.1, graisse du nom de forum sur l'index : normale (400), comme un sujet lu du sous-forum, où le gras signale le non-lu ; DESIGN.md donne 700 au jeton `forum-name`. Option retenue : 400.
- Ticket 6.1, icône de l'en-tête de section de l'index : la classe native `fa-comments-o` (nom Font Awesome 4) n'a pas de glyphe en Font Awesome 5, d'où son absence sur la capture ; elle prend le glyphe des en-têtes du sous-forum (`far fa-comments`). Option retenue : oui.
- Plan du ticket 6.1 approuvé en autonomie (checkpoint 1).
- Clore l'épopée 1 (`bmad-ticket`) : verdict de rétrospective « accepted-with-open-items ». Option retenue : laissée ouverte jusqu'à ta confirmation.
- Règle commune aux deux supports en liste combinée `@media (max-width: 767px), (min-width: 768px)` (note P1). Option retenue : oui.
- Ticket 3.6, jauges du panneau sur ordinateur : chaque barre a deux segments, la valeur (`.progress-bar-success`) et le reste (`.progress-bar-warning`, largeurs complémentaires dans le relevé). La valeur prend la couleur de la jauge ; le reste devient transparent et laisse voir la piste, comme sur mobile. Le « #f0ad4e de PP » de DESIGN.md était ce reste (PP à 0 dans le relevé). Option retenue : reste fondu dans la piste ; alternative : reste dans une teinte claire de la couleur de la jauge. La valeur est le 1er segment, quelle que soit sa classe (danger ou warning compris) ; les segments suivants sont transparents.
- Ticket 3.6, piste des jauges sur mobile : la piste (`#f5f5f5` en clair, bg-elevated en sombre) posée sur bg-surface s'en distingue à peine (≈ 1,09:1) ; la partie vide de la jauge se voit mal. Point de validation visuelle pour toi. Option : un filet de 1 px en border-tint autour de la piste.

## Hors autonomie

- Push et PR de `feature/next` : aucun push fait.

## Visites du site réel faites en autonomie (lecture seule)

- 2026-10-29 : relevé de structure (agent releve-aide) : /help, /help/staff, /help/password, /help/defkra, /communaute/membres, une fiche d'un autre membre (GET) ; aucun clic, variante inchangée, /report non visité
- 2026-10-29 : relevé de structure (agent releve-membres, Chrome dédié, nouvel onglet fermé ensuite) : `/communaute/membres`, `/aide` (lecture des onclick), `/help`, `/help/staff`, à 375 et 1280 px. GET et évaluations seulement, aucun clic ni saisie, variante inchangée, `/report` non visité. Relevé hors dépôt dans `/tmp/kr-releve-membres/releve.md`.
- 2026-10-29 : `/accueil` rechargé (GET), vérification du 8.2 par évaluation, `window.open` sondé ; aucun clic, aucune requête vers `/report`.

- 2026-10-29 : `/accueil` déjà ouvert (Chrome dédié), lecture de `openReport`, des balises `<script>` et du onclick de la cloche par évaluation, sans clic ni navigation. Inconnue du 8.2 levée (champ `resolved` de l'entrée).

- 2026-10-29 : relevé de structure (agent releve-site, Chrome dédié) : kramail (4 messages lus de la Réception et de l'Envoi), page Signaler, Interface, Contacts, `/aide` et `/help`. Variante non modifiée, aucun clic d'action. `/report` non visité : la cloche était active. Effet de bord possible : un sujet du forum Entraide ouvert en GET est peut-être passé en lu. Relevé hors dépôt dans `/tmp/kr-releve-2026-10-28/releve.md`.

- 2026-10-23 : `/jouer/plateau` à 1280 px (Chrome dédié, CDP 9223), squelette du DOM des jauges du panneau seulement (classes, largeurs en ligne), relevé hors dépôt ; aucun clic, aucune action de jeu, variante non modifiée.

- 2026-10-23 : captures de validation du ticket 2.5 (modale Dormir, 4 ouvertures annulées), variante restaurée.

- 2026-10-22 : lignes de coût natives de 8 ordres relevées (modales annulées), puis captures de validation du ticket 2.4 (16 ouvertures annulées), variante restaurée.

- 2026-10-22 : captures de validation des tickets 2.2 et 2.3 : modales Dormir et Pouvoir ouvertes puis annulées (16 ouvertures), variante restaurée.

- 2026-10-22 : modales d'ordre Dormir et Pouvoir ouvertes depuis le plateau puis fermées par « Cancel » (aucun ordre validé) ; squelette hors dépôt.

- 2026-10-22 : exploration backlog 5 : `/jouer/plateau`, `/jouer/bat`, `/jouer/materiel`, listes du kramail (réception, envoi) ; aucun message ouvert, aucun contenu relevé.

- 2026-10-22 : captures de validation du ticket 6.1 (index, sous-forum, racine), variante de thème restaurée ensuite.

- 2026-10-22 : squelette DOM natif (sans le thème) de `/forum/rp`, `/forum/hrp`, `/forum/communaute`, `/forum/debats` et du sous-forum Royaume de Ruthvénie ; aucun contenu de message relevé.

### Racine du forum /forum et /forum/ — validation visuelle
La racine reprend les lignes des index sur ordinateur et mobile ; tous les groupes RP, HRP, etc. restent visibles. Vérifier noms, compteurs et accès au dernier message. Revue indépendante sans constat restant ; contre-épreuve rouge et tests sur fixtures verts. Pas de changement publié sur la modale ou la palette dans cette livraison.

## Ticket 3.7 — focus clavier : abandonné (2026-10-23)

- Décision d'Arnaud : « Pas de focus clavier. On ne gère pas les handicapés. » Ticket abandonné, diff annulé (copie hors dépôt : `/tmp/kr-37-annule/`). Les effets de focus existants (halos rouge, bleu, orange, contours kramail) restent tels quels.
- Prérequis retirés : 3.8 n'attend plus 3.7 ; l'épopée 4 n'attend plus « anneau de focus ».
- Hypothèse conservée : les contrastes de texte et les cibles tactiles de 44 px restent (lisibilité, usage au doigt).

## Ticket 2.6 — « Valider » et onglet actif de la modale d'ordre (2026-10-23)

- Effet élargi, accepté en autonomie : sur mobile, le « OK » de toutes les confirmations Bootbox (pas seulement l'ordre, ex. « Retirer ce personnage de vos contacts ? ») perd son dégradé vert et prend la couleur de la nation, comme tout bouton primaire (H5.1). À confirmer.
- L'onglet actif de la modale d'ordre devient fond et texte du thème sur les deux supports ; le libellé rouge de l'onglet Pouvoir prend la couleur du texte.

## Inception de l'épopée 4 « Même rôle, même taille, même forme » (2026-10-24)

Breakdown en 10 entrées (`epic-typographie-formes/tickets.toml`), écrit en autonomie. Option retenue pour chaque point, à confirmer ou renverser :

- Découpage : 1 jetons et étiquettes/pastilles 12 px gras (balle traçante) ; 2 bouton de taille normale ; 3 modales Bootbox mobiles (« Valider » de taille normale, règles contradictoires de `deferred-work.md`) ; 4 bouton compact ; 5 échelle du plateau, du mini-profil et des en-têtes ; 6 Matériel, Personnage, Bâtiments, Employés et ligne d'objet ; 7 échelle du forum et du kramail ; 8 trois rayons ; 9 grille de 4 px ; 10 Refactor sweep. Entrées chaînées (suite et sections CSS partagées).
- L'épopée 4 attend aussi l'épopée 2 (section 9h, tickets 2.6 et 2.7), ajoutée à son `after` dans le `tickets.toml` de l'initiative.
- Q8 : texte courant mobile 15 px ; messages du forum 16 px ; champs 16 px (anti-zoom iOS).
- Q9 : compact en 12 px, rayon 4 px ; hauteur 22 px et couleur de succès (ticket 3.5) gardées ; mobile inchangé.
- Q11 : grille sur `.panel-body`, `.panel-heading`, `.btn`, `.form-control`, cellules de tableau ; gouttière exclue.
- Q12 : croix, avatars et images gardent leur forme.
- Q14 : onglets et jauges du mini-profil à 12 px.
- Kramail : règles communes seulement, sans entrée propre ; recouvrement avec l'épopée 7 (thème du forum).
- À trancher :
  - mandat de relevé en lecture seule (squelette DOM de Matériel, Bâtiments, Employés) avant l'entrée 6 ;
  - pages secondaires sous 12 px (accueil 8-9 px, Événements) : dans l'épopée 4 ou laissées ;
  - cibles de 44 px des votes et de la pagination sur mobile : épopée 9 (option retenue) ou entrée 4.

## Ticket 4.1 — jetons et étiquettes en 12 px (2026-10-24)

- « Puces du kramail » lues comme les étiquettes d'options (`.kd-opt-tag`, `.kd-opt-free`, 11-11,5 px) ; les puces de destinataire `.kd-chip` (13-15 px, avec croix) sont des contrôles et restent à leur taille. Alternative : les passer aussi en 12 px.
- `.kr-stat-badge` (11 px, hors liste du ticket) inclus : c'est une pastille.
- Plan de plus de 1600 jetons gardé entier (la balle traçante regroupe jetons, suite et routeur).
- Icône `.forum-tags .glyphicon` laissée à 8 px (icône, pas texte d'étiquette). Alternative : 12 px.
- Tout `.label` est désormais à 12 px fixe, même dans un titre (avant : 75 % du titre).

## Ticket 4.2 — bouton de taille normale (2026-10-24)

- Envoyer sur mobile laissé à sa taille (`send-button` 48 px, R4, épopée 7) ; sur ordinateur, Envoyer du kramail passe de 15 px / 47 px à 14 px / 34 px (EXPERIENCE.md :280).
- Exclus de la taille normale : boutons-images du plateau (bâtiments), boutons-icônes (en-tête du kramail, œil d'Interface), bandeau de redimensionnement.
- « Jouer » de l'accueil et pied du changelog suivent la taille normale sans fixture (aucune fixture d'accueil).
- L'épopée note « aucun bouton de vote dans les fixtures du sujet » (l.57) : faux, `forum-sujet.html:26-28` en a ; à corriger dans la rétro.
- Boutons à icône seule de l'en-tête du sujet (lien, liste des messages) et de l'index (« Tous les forums ») : leur icône passe de 16 à 14 px sur mobile avec la taille normale. Les garder à 16 px demande une classe posée par le JS. Accepté en l'état, à confirmer.
- À 768 px, le « + » des contacts prend le style ordinateur alors que le champ Destinataires natif garde ses règles `max-width: 768px` ; le champ natif est masqué par le widget, rendu mixte non vérifié visuellement.

## Ticket 4.3 — modales Bootbox mobiles (2026-10-24)

- Toute confirmation Bootbox sur mobile prend le pied de la modale d'ordre (colonne, boutons pleine largeur, 14 px, ≥ 44 px), hors ordre comprise.
- « ? Aide » de la modale d'ordre passe aussi à la taille normale (16 → 14 px sur mobile).
- L'onglet actif des modales à onglets hors ordre (bg-elevated, accent) est gardé tel quel.
- Les modales non Bootbox en mobile-mode perdent l'étirement `flex:1` de leurs boutons (aucune n'est connue sur le site) ; `bootbox.alert` et `prompt` prennent aussi le pied en colonne.

## Ticket 4.4 — bouton compact (2026-10-24)

- Rayon de 4 px posé seulement aux coins déjà arrondis (extrémités des groupes de vote et de la pagination), coins intérieurs carrés.
- Les autres petits boutons des messages (date, profil, kramail, signaler) restent en 12 px natif : ils ne sont ni compacts ni normaux au sens de l'épopée.

## Ticket 4.5 — échelle typographique (2026-10-24)

- Titres mobiles en px : h1 à h3 à 17 px, h4 à h6 à 15 px (l'ancienne échelle en rem donnait 17,5 / 15 / 12,5 / 11 / 10 / 9 px).
- Texte courant à 15 px appliqué au plateau mobile seulement ; forum (messages 16 px), kramail et accueil inchangés.
- Titres de modale (18 px) et en-têtes d'accordéon hors du titre de section 17 px.
- Les 11 px du forum, du kramail et de l'accueil sur mobile ne sont pas traités ici (question ouverte des pages secondaires).
- Pages de jeu repérées par la présence de `#col-leftest` (aucune classe de page pour le plateau) : à confirmer sur le site.
- Nom des cartes du tableau de bord à 15 px dans des cartes de 140-160 px (2 lignes max, ellipse) : rendu à regarder.
- `.xmini` et liens du pied de page passent à 12 px sur toutes les pages (planchers PLT-QU) ; `h1.page-header` mobile 17,5 → 17 px.

## Ticket 4.6 en attente, 4.7 construit avant (2026-10-24)

- 4.6 (Matériel, Personnage, Bâtiments, Employés) attend le mandat d'Arnaud pour relever en lecture seule le squelette DOM de Matériel, Bâtiments et Employés.
- 4.7 (forum et kramail) construit avant 4.6 : leur chaînage n'est qu'une collision de fichiers (même suite, mêmes sections), pas une dépendance fonctionnelle.

## Ticket 4.7 — échelle du forum et du kramail (2026-10-24)

- Kramail : valeurs de ses règles existantes passées en jetons (aucune règle nouvelle), en attendant l'épopée 7.
- Gardés hors échelle : titres de page mobiles à 24 px, icônes et glyphes, champs à 16 px.
- Mandat donné par Arnaud le 2026-10-24 (« Tu as le droit d'aller sur le site juste pas faire des actions ») : HTML natif de `/jouer/materiel`, `/jouer/bat`, `/jouer/pnj` relevé en lecture seule (GET, hors dépôt) ; 4.6 débloqué, construit après 4.7.
- 4.7 : nom de forum de l'index en 15 px, graisse 400 (ticket 6.1) alors que DESIGN.md dit 700 : à trancher.
- 4.7 : cartouche de l'auteur du sujet sur ordinateur passée en détail 13 px (14 natif avant) ; textarea de la rédaction mobile 15 → 16 px (anti-zoom).

## Ticket 4.6 — Matériel, Personnage, Bâtiments, Employés (built, 2026-10-24)

- Plateau mobile inchangé : exclu par la nouvelle classe `html.kr-page-plateau`, posée par le template. Le commerce reste à 12 px.
- À trancher : sur ordinateur, le panneau Matériel du plateau (`.kr-materiel-moved`) passe de 10,6 à 13 px. Le plan l'exige (Always), ce qui contredit « ne pas toucher au plateau ». Je l'ai gardé.
- Ligne d'objet mobile : image, puis le nom, puis la charge en gris secondaire. Sans image, le nom part du bord.
- Les fixtures Bâtiments, Employés et la partie plateau Commerce/Matériel sont reconstruites, pas relevées ligne par ligne : à comparer visuellement au vrai site.

## Ticket 4.8 — Trois rayons (built, 2026-10-24)

- Rayons : contrôles à 4 px (« Envoyer » du forum : 8 → 4 ; boutons à icône du kramail : 10 → 4) ; cartes, panneaux et modales à 8 px (cartes du forum et du kramail : 12 → 8) ; pastilles et étiquettes pleines. La croix, les avatars, les images, les jauges et l'horloge gardent leur forme (Q12).
- Assumptions à relire (détail dans le plan) : la recherche et le tri en pilule passent à 4 px ; les onglets, ceux de la modale d'ordre compris, sont à 4 px ; la barre fixe d'envoi du kramail reste sans rayon (épopée 7) ; les boutons ronds passent à plein.
- Tolérance du test pixel du kramail : l'écart par canal passe de 2 à 4, mesuré en A/A. C'est du bruit de rendu sur le nouveau coin à 8 px de la carte de lecture.
- Restent natifs à 4 px : `nav.navbar`, la pagination, les onglets natifs et `input-group-addon` (sans règle de la peau).

## Ticket 4.9 — Grille d'espacement (2026-10-24)

- **À trancher (bloc figé)** : le plan disait que les cellules du forum (index et sous-forum) passent à 8 px sur les 4 côtés. Mesuré : les lignes permanentes du sous-forum passent à 62 px (seuil L6 : 60), et le 1er sujet arrive à 693 px (seuil : 684). J'ai mis 4 px en haut et en bas, 8 px sur les côtés : les seuils tiennent. Option inverse : 8/8 avec des seuils L6 assouplis.
- Boutons sur ordinateur : leur retrait vertical de 6 px est gardé, hors du pas de 4, pour tenir la hauteur de 34 px.
- Les en-têtes de panneau passent de 40 à 44 px de haut sur ordinateur.

## Ticket 4.10 — Refactor sweep (built, 2026-10-24)

- Seuils 768/769 réalignés sur 767/768 (éditeur du kramail, changelog) : à 768 px, ces pages prennent désormais le rendu ordinateur. Vérifié égal à la base relevée à 769 px.
- Règles mortes retirées : rayon du menu de personnage du kramail, propriétés du hamburger hors `order`, premier bloc de cartes du forum réduit à l'ombre et à l'appui.
- `height: 44px` des champs mobiles gardé : sans effet mesuré (le `min-height` de 44 px l'emporte), consigné comme candidat mort dans `deferred-work.md`.

## Rétrospective de l'épopée 4 (2026-10-24)

- Verdict « rejected » pour une seule raison : rien n'est poussé ni fusionné (Done when 3). Le reste tient sur fixtures. Livraison des épopées 2 à 4 : attend ton accord pour le push et la PR.
- Constats à corriger, traités dans un ticket de suivi : nom de forum mobile à 17 px au lieu de 15 (F2, `h1, h2, h3 !important` bat `.forum-title`) ; ordre du pied Bootbox mobile limité à `.btn-default`/`.btn-primary` (F3) ; jetons jamais lus et commentaire « 4.3 » à corriger en « 4.4 » (F5).
- À corriger dans l'épopée (fichier réservé) : la note « aucun bouton de vote dans les fixtures du sujet » est fausse, `forum-sujet.html` l.26-28 en a (F9).

## Inception de l'épopée 5 « Cartes de section et familles de pastilles » (2026-10-24)

Breakdown en 6 entrées (`epic-cartes-pastilles/tickets.toml`), écrit en autonomie. Option retenue pour chaque point, à confirmer ou renverser :

- Découpage : 1 carte de section mobile des pages de jeu, kramail par les règles communes (balle traçante) ; 2 liste des sujets du forum dans la carte (R6, risque élevé) ; 3 groupes du plateau mobile dans la carte ; 4 cloche et enveloppe en couleur « non lu » ; 5 étiquettes de catégorie, « PNJ » compris ; 6 Refactor sweep. Entrées chaînées par collision.
- Q10 : carte en retrait de 8 px, contenu à 16 px (texte à 24 px du bord ; forum et sous-forum perdent 16 px).
- Q30.7 : aucune icône ajoutée aux en-têtes sans icône native. Q30.1 : pastille de niveau et « ici » gardent `--kr-level-*`. Q30.4 : caractéristiques et malus hors CAP-6. Q30.2, .3, .5, .6 : hors CAP-6.
- Tags du sujet comptés comme étiquettes de catégorie ; index et racine suivent le sous-forum (parité 6.1) ; repli des panneaux gardé tel quel.
- Cloche et enveloppe en « non lu » sur les deux supports.
- Kramail : règles communes seulement, déclarations contraires retirées sans règle propre (épopée 7).
- L'entrée 2 part du code de 6.1 sans l'épingler : l'épingle créait un conflit d'ordre 5 ↔ 6.
- À trancher :
  - « article » et « Dernier sujet » (CAP-6) : introuvables dans le code et les fixtures ; où sont-ils sur le site ?
  - lignes de sujet mobiles : cartes détachées gardées dans la carte (option retenue) ou lignes à filet comme la maquette h04 ?
  - livrer les épopées 3 et 4 (push, PR) avant l'épopée 5 (rétro de l'épopée 4, A1) ?
  - `tickets.toml` de l'initiative (hors écritures permises) : épingler l'épopée 6 sur 5.2 et l'épopée 7 sur 5.1, et retirer « onglets » de ce que l'épopée 7 attend de la 5 (CAP-8, aucune entrée).
  - DESIGN.md périmé : titre du kramail (« primary à 2,56:1 », en fait accent), titre du jeu (« 20 px », en fait 17 px), enveloppe (« grise », en fait rouge).

## Bug 10 — nom de forum mobile (built, 2026-10-24)

- Sur mobile, le nom des cartes de forum (Staff) repasse de 17 à 15 px : la règle des titres h1-h3 exclut `.forum-title`, sans `!important` nouveau.
- Pied des modales mobiles : rien ne change. Le commentaire dit maintenant que seuls `.btn-default` et `.btn-primary` sont rangés ; un `.btn-danger` ou `.btn-success` passerait avant eux. À vérifier si le site en met dans une modale.
- Jetons inutilisés (`--kr-font-page-title`, `--kr-space-5`, `--kr-space-6`, `--kr-margin-mobile`, `--kr-touch-target-dpad`) gardés : DESIGN.md les déclare et le test du 4.1 les vérifie. Les retirer : ta décision.
- `test:all` final passé machine chargée : 2 FAIL de charge, verts rejoués seuls. Le fragment `nettoyage` flanche sous charge de façon répétée : à fiabiliser (rétro 4, A10).

## Ticket 5.1 — carte de section mobile (construit, 2026-10-24)

- À trancher : en clair, le fond de page est blanc (Bootstrap), donc la carte blanche ne se détache pas. Le plan n'ajoute ni fond de page ni filet (maquette h04 : filet). Option : fond de page teinté en clair.
- Portée : la carte vaut là où valait la règle d'origine. Elle s'applique donc aussi aux pages Règles, Cybermonde, Interface, et au kramail, sauf aux panneaux d'accordéon (`.panel-group`) et de modale. Aucune garde « jeu » n'est fiable, car `#col-leftest` manque sur Matériel, Bâtiments et Employés.
- Forum, sous-forum et racine gardent leur rendu actuel (règle scindée).
- Décidé en autonomie : la déclaration `padding: 10px 15px !important` des en-têtes mobiles (l.4337) est gardée. Elle ne gagne que sur les panneaux d'état (`.panel-success`, `-warning`, `-danger`, `-info`, `-primary`), jamais sur un `.panel-default`. La retirer changerait ces panneaux.
- Modale d'ordre : exclue de la carte (`.modal *`) après revue ; elle garde le rendu de base (égalité prouvée à 375 et 767 par `cartes-pastilles`, fragment `forum`).
- Cybermonde « Fonctionnaires » : le chevron natif est dans le titre, à 222 px du bord, comme avant. Non corrigé.
- Push autorisé par Arnaud le 2026-10-24 : `feature/next` poussé jusqu'à `317b5b7` (épopées 2 à 4, bug 10).

## Ticket 5.2 — liste des sujets du forum dans la carte (construit, 2026-10-24)

- Décidé en autonomie (A1, fil de sujet) : rien à décider. La fixture `forum-sujet.html` n'a aucun `.panel` ; le fil est comparé à la base à 375 et 767 px, clair et sombre, et reste égal.
- Décidé en autonomie (A8, coins de la racine) : en sombre, la dernière ligne de `forum-racine.html` (opaque, coins carrés, sans `.panel-body`) recouvre les coins bas arrondis de la carte. Rendu de base gardé : aucun `overflow: hidden` ni rayon ajouté. Report dans `deferred-work.md`.
- Décidé en autonomie (P7, carte blanche en clair) : rien ajouté, comme en 5.1. La carte blanche ne se détache pas du fond blanc de page en Kraland clair. Le point « fond de page teinté » du ticket 5.1 reste ouvert.
- Décidé en autonomie (hauteur des lignes) : la carte raccourcit les lignes de 16 px. À 375 px, deux sujets du sous-forum (« Gagner des PA », « Kayak Portable ») voient l'auteur du dernier message passer à la ligne : 127,1 px au lieu de 106,9. Accepté, c'est l'effet direct du retrait de 8 px demandé. Le test exige l'égalité de hauteur sauf quand une rangée de texte s'ajoute ; il exige alors une ligne plus haute.
- Staff (A6) : chevron natif de 10 × 14 px et croix d'alerte qui sort de 5 px de l'écran, tous deux comme la base. Le test les compare à la base au lieu d'imposer 44 px. Report dans `deferred-work.md`.
- A13, 2e version : 17 déclarations inertes retirées après bisection ; le reste est gardé (Staff). Report dans `deferred-work.md`.
- `#topics` : non touché. Ses marges négatives compensent le retrait de 16 px de `#topics_wrapper`, et les lignes s'arrêtent déjà aux bords internes de la carte.
- La barre de tri DataTables (`thead tr`, `overflow: auto hidden` natif de la peau) défile dans la carte : ses puces au-delà du bord sont coupées, comme dans la base. Le test exclut le contenu des défileurs et contrôle le défileur lui-même.
- Décidé en autonomie (sous-forum, 1er sujet à 0,95 écran, `sous-forum.mjs` l.668) : les deux en-têtes de 48 px (au lieu de 45) poussent le 1er sujet à 636 px sur 667 (0,954), au-delà du seuil. Seuil inchangé. Le retrait haut des contrôles DataTables (`#topics_wrapper`) passe de 12 à 6 px : 1er sujet à 630 px, comme la base. La recherche est donc à 6 px sous l'en-tête de la carte, sans filet entre eux. À regarder sur capture.
- Décidé en autonomie (pagination à 320 px) : la pagination L5 mesure 304 px, et la carte ne laisse que 272 px de contenu à 320 px : 8 px de débordement d'écran. Correctif : la pagination s'étend sur toute la largeur de la carte (marges de −16 px, comme `#topics`). Elle reste centrée et à la même place que la base de 336 à 767 px. À 320 px, « ‹ » et « › » touchent les bords internes de la carte.

## Ticket 5.3 — groupes du plateau dans la carte (construit, 2026-10-24)

- Décidé en autonomie (A3, filet de « mon groupe ») : le filet gauche des en-têtes de groupe est retiré sur mobile, « mon groupe » compris (règle l.5822 retirée, filet de 4 px de l.13257 retiré). Mon groupe se distingue parce qu'il est ouvert et placé en premier. Au bureau, le filet de 4 px reste (égal à la base de 768 à 1920 px).
- Décidé en autonomie (A4, ombre) : la section mobile perd son ombre, comme la carte 5.1. Aucune bordure ni filet ajouté.
- Décidé en autonomie (A8, Q30.7) : aucune icône d'en-tête ajoutée, contrairement à la maquette (`fa-user-friends`).
- Décidé en autonomie (A5) : 10 px entre deux groupes, comme avant ; la maquette en donne 8.
- Décidé en autonomie (cartes de personnages, changement visible) : la carte prend 8 px de chaque bord et la grille garde 8 px de retrait. À 375 px, chaque carte de personnage passe de 177,5 à 167,5 px de large, et sa ligne de statut de 123,5 à 113,5 px. Avec le vrai Bootstrap, le statut synthétique « [Statut Elias Kurano] » passe sur deux lignes : les cartes du 1er groupe montent de 166 à 181,2 px. Accepté : c'est l'effet direct de la géométrie demandée (comme les lignes du forum en 5.2). Contenu, ordre, avatar, nom, pastille PNJ et PV égaux à la base. À regarder sur capture avec un vrai statut long.
- Titre long : à 375 px, « Syllabus des Archivistes Itinérants du Grand Marais » tient sur deux lignes ; l'en-tête monte à 48,6 px, sans débordement. `min-width: 0` non ajouté (inutile, `scrollWidth` = vw).
- Le texte « Groupe » reste retiré par le JS (« Nerys » au lieu de « Groupe Nerys » sur la maquette) : JS non modifié.
- P4 (correctif de revue) : à ≤ 767 px sans `mobile-mode`, les groupes gardent le rendu d'origine (filet de 4 px, fond `bg-elevated`), égal à la base. Prouvé en forçant `innerWidth` à 791 (cas de la barre qui déborde) ; l'état ne se reproduit pas seul sur la fixture avec Bootstrap.
- Icône native du titre : `img` synthétique ajoutée devant « Groupe Nerys » dans la fixture ; elle reste à gauche du titre. Avec une image en tête, le JS ne retire pas « Groupe » (comportement natif, inchangé).

## Ticket 5.4 — pastilles d'état de la cloche et de l'enveloppe (2026-10-24)

- Décidé en autonomie (bureau compact, 768 à 991 px) : le plan attend la pastille visible « portée par l'original à 768 ». Mesure sur la base `601ab19` : de 768 à 991 px (PLT-04), la barre est un menu repliable, sans clone ; menu fermé, cloche et enveloppe ont une boîte 0 × 0, rien n'est visible. Rendu de base gardé (JS et menu non touchés). Le test contrôle, à 768 et 769 px, le menu fermé (aucune pastille visible, égal à la base), puis le menu ouvert par le bouton de la barre (original visible, pastille d'état). Report consigné dans `deferred-work.md`. À regarder : faut-il un repère de non-lu sur le bouton du menu compact ? Correctif de revue : la bascule 767 ↔ 768 ouvre aussi le menu compact à chaque étape 768, dans le même onglet, et vérifie l'original visible en pastille d'état, puis le referme.
- Décidé en autonomie (couleur de bordure du masque) : le retrait de `border-color` ne change pas la largeur des bordures (0 avant et après), mais la couleur calculée passe de `rgb(189, 33, 48)` à `--kr-primary-dark` (hérité). Le contrôle couleurs de `typographie-formes` compare aussi cette couleur ; le masque `CARTES_TICKET54` pose donc `border-color: var(--kr-primary-dark) !important` sur la base, pour l'égaliser. Il vit dans le test, pas dans la peau.
- Décidé en autonomie (fixtures du routeur) : `kramail-reception.html` et `sous-forum-debuter.html` envoient aussi vers `cartes-pastilles` (règles dédiées avant les règles génériques) ; `typographie-formes.html` passe par la règle « fixture » (citée par deux suites). Deux cas existants de `router.test.mjs` suivent ce fait.
- Décidé en autonomie (`.kd-field.is-invalid`) : non mesuré par le fragment `pastilles` (absent des fixtures de la barre) ; les sélecteurs de la règle ne le visent pas. Couvert par la zone `kramail`.
- À regarder sur capture (375×667 et 1280×720, Kraland clair et Empire Brun sombre) : lisibilité du « ! » et du chiffre, contour de la pastille sur la barre de nation. En Kraland clair, `#c41e3a` reste voisin de l'ancien rouge.

## Ticket 5.5 — étiquettes de catégorie, PNJ compris (2026-10-24)

- A2 (marque native PNJ `.btn-danger.xmini`, `#pnj` de palette-nation-etats) : nouvelle règle `html.kr-theme-enabled .btn.btn-danger.xmini` en (0,3,1), liste combinée, sans priorité forcée. Fond et bordure `--kr-arm-bg`, texte `--kr-arm-ink`, 700, rayon plein. Elle bat `.btn-danger:hover` et `:active:hover` de Bootstrap : survol égal au repos (mesuré par survol forcé).
- Décidé en autonomie (taille de la marque sous 768 px) : la peau impose à tout `.btn` mobile `font-size: var(--kr-font-button)`, `padding: 12px 20px` et `min-height: 44px`, en priorité forcée. Sans priorité forcée nouvelle, la règle A2 ne peut pas l'emporter : la marque reste à 14 px et 46 px de haut sous 768 px, comme la base. Au bureau, `.xmini` est déjà à 12 px. Le test compare donc la taille de la marque à la base, pas à 12 px. Graisse (400 → 700) et rayon (4 px → plein) changent : la boîte s'élargit d'environ 1 px, et la pièce courante voisine glisse d'autant (position exclue de sa comparaison, le reste égal). À regarder : faut-il une marque PNJ de 12 px sur mobile (priorité forcée de plus, ou retrait de la cible tactile de 44 px) ?
- Question pour Arnaud (constat #1 de la revue, reporté) : sous 768 px, la marque native PNJ (`.btn-danger.xmini`) reste en 14 px et 46 px de haut, car la règle `.btn` mobile de la peau (`font-size: var(--kr-font-button)`, `padding: 12px 20px`, `min-height: 44px`, en priorité forcée) l'emporte ; le `verify` de l'entrée 5 demande 12 px 700. Deux voies : garder 14 px sur mobile (rendu actuel, égal à la base), ou retoucher l'exclusion de `.xmini` dans la règle `.btn` mobile (la marque n'y serait plus prise et passerait en 12 px, mais sa cible tactile de 44 px et sa géométrie changeraient). Laquelle choisis-tu ?
- Revue, constat #2 corrigé : la règle A2 ne déclare plus `font-size` ; la taille vient de l'origine `.xmini` (12 px au bureau).
- A3 (compteur de groupe `.dashboard-section-header .badge`, bureau et mobile) : étiquette de catégorie (fond et bordure arm-bg, texte arm-ink). Il classe, il ne signale pas. Seule la fixture typographie-formes en porte un (`#pastille-groupe`) ; plateau-qualite-usage n'en a pas. Le fragment `pastilles` (5.4) ne le compare plus à la base (sorti de `horsListe`).
- A4 (tags) : `.forum-tags a` sous 768 px en étiquette de catégorie ; à l'appui, paire de survol (`--kr-arm-bg-hover` / `--kr-arm-ink-hover`). L'encre de l'appui passe par la redéfinition de `--kr-arm-ink` dans la règle `:active`, que la couleur du tag lit déjà en priorité forcée : aucune priorité forcée de plus. Au bureau, aucune règle : liens non stylés, comme la base. Les tags natifs `span.tagforum` gardent leur rendu « · #tag » (report dans `deferred-work.md`).
- Constat (tags mobiles) : sur la fixture, sous 768 px, le tableau `table.dataTable` est masqué (`display: none`) par la peau mobile du forum ; les tags n'ont pas de boîte, dans la base comme ici. Couleurs et contraste sont relevés sur les styles calculés, sans élément visible. `.forum-tags` n'existe que dans la fixture synthétique : à regarder sur le site réel si la classe y apparaît.
- A5 (compteurs de contact du kramail) : `a.list-group-item[href^="kramail/"] > .badge:not(:empty)` ajouté en tête de la règle d'état (fond `--kr-status-unread`, texte `--kr-bg-surface`), comme « NOUVEAU MESSAGE » du sous-forum. En tête pour garder la chaîne de `AVANT_TICKET54` (P14). Page dérivée dans le test : deux compteurs remplis, dont celui d'un contact actif (`list-group-item active`, P6) : la règle d'état gagne sur la paire inverse. Vides : invisibles, comme la base.
- Décidé en autonomie (détecteur et miroir) : `CARTES_TICKET55` et `AVANT_TICKET55` vivent dans `tests/e2e/lib/variantes.mjs`. `typographie-formes` les pose sur sa base tant qu'elle précède l'entrée. Le sélecteur des tags du contrôle statique suit la forme minifiée du bundle (`td:first-child` au lieu de `td:nth-child(1)`).
- Décidé en autonomie (routeur) : `dashboard-card-pnj` reste aussi dans la règle de l'épopée 4 (doublon sans effet, les zones s'ajoutent). Aucune règle de fichier ajoutée : les fixtures `palette-nation-etats.html`, `forum-index-rp.html` et `jeu-materiel.html` sont citées par cartes-pastilles et passent par la règle « fixture ».
- Décidé en autonomie (`#col-leftest-stats .btn-success`) : les caractéristiques sont repérées par ce sélecteur ; la fixture n'a pas `alert12x`.
- Décidé en autonomie (bases antérieures) : le fragment `nettoyage` de typographie-formes (base `00b0786`) pose le masque `CARTES_TICKET55` sur sa base. Le fragment `groupes` de cartes-pastilles (base `a7f0463`) ne peut pas recevoir de css (P8) : fond, bordure et couleur du « PNJ » des cartes y sont neutralisés des deux côtés (`sansPnj55`), la géométrie reste comparée. Les deux sont à retirer quand ces bases contiennent l'entrée 5.
- À regarder sur capture (375×667 et 1280×720, Kraland clair et Empire Brun sombre) : lisibilité de « PNJ » sur la carte, contour de la marque sur la couleur de nation, compteur de groupe à côté de « guilde » et « [mod] ».

## Ticket 5.6 — refactor sweep (construit, 2026-10-24)

- Retraits inertes seulement, sans changement de rendu : `--kr-badge-danger-border` et `--kr-badge-pnj` retirés de `:root` (aucun lecteur avant, ni en CSS, ni en JS, ni dans les tests) ; masque `CARTES_TICKET51` éteint dans `cybermonde-carte.mjs` et `kramail-redaction.mjs` (base `origin/feature/next`, qui contient 5.1 : le masque ne posait rien) ; condition de retrait écrite pour `sansPosition55`.
- Décidé en autonomie (Ask First « `var(` trouvé au relevé avant ») : sans objet. Le relevé avant ne trouve que les deux déclarations (l.76 et l.77), aucun `var(` dans la feuille, le template, les tests ou les fixtures. Les deux jetons sont retirés.
- Décidé en autonomie (Ask First « écart d'une suite après T2 à T5 ») : sans objet. `KR_FRAG=panneaux node tests/e2e/cybermonde-carte.mjs` (13 ok) et `node tests/e2e/kramail-redaction.mjs` (340 ok) donnent les mêmes lignes ok/FAIL avant et après ; zones `cartes-pastilles`, `kramail`, `cybermonde` vertes.
- Décidé en autonomie (`--kr-badge-danger`) : gardé, nom et valeur. Seul lecteur : `.kd-field.is-invalid` de la rédaction du kramail.
- Décidé en autonomie (T3, T4) : les deux suites sont reprises telles qu'en `458dc03` (inverse exact des hunks de `21fed8d`, seul commit à les toucher depuis) ; `git diff 458dc03` vide pour chacune.
- Rappel, en attente de ta décision (aucune question nouvelle) :
  - D12 : bureau compact 768 à 991 px, cloche et enveloppe invisibles menu fermé (ticket 5.4).
  - D14 : `span.tagforum`, famille des étiquettes ou non (ticket 5.5).
  - D15 : marque PNJ mobile en 14 px / 46 px au lieu de 12 px (ticket 5.5).
  - Jetons A5 de la rétro 4 non lus par la peau : `--kr-font-page-title`, `--kr-space-5`, `--kr-space-6`, `--kr-margin-mobile`, `--kr-touch-target-dpad` (Bug 10).
  - O1 : fond de page teinté en clair (5.1, 5.2).
  - O2 : « À regarder sur capture » des tickets 5.2 à 5.5.
  - O3 : barres de PV des cartes de personnages en couleurs en dur (`#5cb85c`, `#f0ad4e`, `#d9534f`), renvoyées à « l'épopée 5 » par `palette-nation.mjs` ; aucun ticket 5.x ne les a prises.

## Rétro de l'épopée 5 — cartes et pastilles (2026-10-25)

Rapport : `epic-cartes-pastilles/epic-cartes-pastilles-retrospective.md`. Verdict machine : **rejected**. Tri de l'orchestrateur :

- **F1 (pas de fusion vers main), contesté.** Le Done when 3 dit « PR fusionnée sur `feature/next` ». `feature/next` est poussée à `55b14f0`, et la fusion vers `main` n'est pas un critère de l'épopée. Le verdict dépend de cette lecture : à toi de trancher, accepted-with-open-items ou rejected.
- **F2 (plan 5.6 contradictoire), corrigé.** Le gabarit vide en double est retiré, et la note T8 porte le `test:all` réel : 12777 ok, 0 FAIL, log `/tmp/kr-56-all.log`.
- **F3 (base auto-référente), rejeté.** `origin/feature/next` est la base voulue : on compare au dernier état poussé. Pendant le 5.6, elle valait `ca73215`, et non l'arbre testé. Le vide de comparaison n'existe qu'entre un push et la modification suivante.
- **F9 et A7, faits.** Le Done when 2 cite maintenant `forum-index`.
- **A8 (épinglage sur 5.2).** Il se fera à l'inception de l'épopée 6, dans son propre `tickets.toml`.
- **A6 (barres de PV en dur, template l.4345-4352).** Question pour toi : faut-il un ticket, et dans quelle épopée, sachant qu'il change le rendu ?
- **F10 et A5 (décisions en attente).** Marque PNJ mobile en 14 px, pastille du menu compact entre 768 et 991 px, `span.tagforum`, carte blanche sur page blanche en clair.
- **F5, F6, F7, F12 et A9 (reportés).** Les pages hors fixtures et les autres emplois de `.badge-danger` et `.btn-danger.xmini` seront relevés à l'épopée 9, ou à la prochaine capture sur le site réel.

## Inception de l'épopée 6 « Forum : activité et repères » (2026-10-25)

Découpe publiée dans `epic-forum/tickets.toml` (7 entrées). Elle a été faite en autonomie. Les hypothèses sont dans les Notes de `epic-forum/epic-forum.md`.

- Décidé en autonomie : la balle traçante est l'entrée 2, parce que l'entrée 1 est déjà construite. L'épingle sur `5.2` porte sur l'entrée 2.
- Décidé en autonomie : l'entrée la moins sûre, en 3, fusionne les trois fils d'Ariane (H12.3).
- Décidé en autonomie : une suite propre, `forum-activite.mjs`, avec sa zone dans le routeur.
- Hypothèses à confirmer :
  - Q27.1 : l'heure native est gardée.
  - Q27.2 : un forum sans message n'a pas de flèche.
  - Q27.3 : l'icône vient de la liste latérale, avec repli sur l'icône native.
  - Q27.4 : flèche vers le dernier message, ligne de sujet vers le premier non lu.
  - Q28.1 et Q28.2 : liens du fil d'Ariane en couleur du texte, cibles de 44 px.
  - Q28.3 : la barre du bas suit l'en-tête.
- À trancher :
  - Q27.5 et Q27.6 : « Jeu (RP) » répété ; description et modérateurs du sous-forum. Aucune entrée ne les change.
  - Accès du compte aux sujets Staff, pour le relevé en lecture seule de l'entrée 4 (hitl).
  - Essai des ancres `#msg…` sur vrai téléphone, l'émulation donnant l'inverse (H10).
- Rappel, en attente de ta décision :
  - choix de 6.1 : Staff exclu, colonnes Sujets et Messages sur ordinateur. L'entrée 6 s'y plie.
  - D14 : `span.tagforum` et « guilde ».

## Ticket 6.2 — index mobile : ligne de 72 px, flèche et « premier non lu » (construit, 2026-10-25)

Points « Ask First » du plan tranchés en autonomie, option conservatrice à chaque fois :

- **Correctif d'ancres non retiré.** Il est réduit à `#flap` sous 768 px (largeur lue à l'évaluation). Les ancres `#msg…` ne sont plus touchées. Le retirer en entier reste possible, mais c'est un retrait de comportement : à toi de trancher.
- **Pas de `scroll-padding-top` ni de `scroll-margin-top`.** L'en-tête du message ancré peut rester sous la barre fixe de 60 px. C'est déjà le cas sur ordinateur dans la base. La suite vérifie que le message est dans la fenêtre, pas que son en-tête est visible.
- **Pas de primauté de l'ancre après une bascule de seuil.** `restoreScrollAfterReload` remet le défilement en pixels. Le hash est gardé, et le défilement est égal à la base.
- **Ligne de sujet du sous-forum et Staff non touchés.** Staff à 375 px est égal à la base (vérifié).
- **Racine `/forum` gardée dans la règle.** Elle porte `kr-page-forum-index` et reçoit les 72 px.
- **Pas de JS de repositionnement après Messages:V3.** Le message ancré reste dans la fenêtre sans aide (fixtures, deux injections).
- **Aucun seuil ni tolérance changé.** `typographie-formes.mjs` (`nettoyage`) a reçu le masque `LIGNE_INDEX_TICKET62` sur sa base, comme pour les entrées 5.x. Voir le Plan Change Log.

À vérifier par toi :

- Essai sur vrai téléphone (H10) : ouvre une flèche de l'index et un « premier non lu ». Le message doit être à l'écran. Son en-tête peut être sous la barre.
- Captures à 375×667, clair et sombre : forum sans message de l'index RP, racine-groupes, sujet ouvert sur `#msg6801395`.

## Ticket 6.3 — un seul fil d'Ariane pour l'index et le sous-forum (construit, 2026-10-25)

Points « Ask First » du plan, tranchés en autonomie. Les quatre derniers sont conservateurs. Le premier ne l'est pas :

- **« ⏪ » retiré à l'index aussi, à confirmer.** C'est un changement de rendu de l'index fait sans ton accord. DESIGN ne demande ce retrait qu'au sous-forum. Je l'ai fait pour que l'index et le sous-forum aient le même rendu, ce qui est l'objet du ticket. Le retour en arrière est simple : reposer l'icône à l'index.
- **« Tous les forums » gardé comme premier niveau de l'index** (choix de 6.1), libellé inchangé.
- **Sujet laissé à 6.4.** Son fil garde sa classe et son rendu de base. La suite le vérifie égal à `5042afd`. Le critère « même rendu aux trois niveaux » du ticket passe donc à 6.4.
- **Branche post/FAB intacte.** La page de réponse garde son fil en style en ligne, sans bouton « + ». La page hors forum `/regles/avancees` garde son fil et son bouton « + ». Les deux sont vérifiées égales à la base.
- **Aucun masque au-delà des Tasks.** Masques posés seulement dans `forum-index.mjs` (hors-périmètre) et `typographie-formes.mjs` (`echelle-forum`, `nettoyage`). Chacun est posé sur la base seulement. Les deux harnais ont reçu une option de script d'init : voir le Plan Change Log.
- **Aucun seuil ni aucune tolérance changés.**
- **Style en ligne `!important` du h1 du sous-forum non touché** (`forumHeading.style.cssText`). Règles du h1 et de `.forum-subforum-*` non fusionnées.
- **Lien du fil en couleur du texte, pas en accent** (Q28.1), comme la base.
- **Repli final « Catégorie » au sous-forum** (revue, constat 3). Sans entrée active dans la liste latérale et avec un bouton natif réduit à son icône, le lien du fil affiche « Catégorie » au lieu d'être vide. Libellé générique, pas une catégorie réelle écrite en dur (interdit par le plan). À changer si tu préfères un autre mot.
- **Catégorie longue : lien borné à la moitié du fil** (revue, constat 4). Le libellé du lien est tronqué par une ellipse au-delà de 50 % de la ligne ; le niveau courant garde le reste. Le libellé passe dans un `span.forum-mobile-breadcrumb-label`, car la règle mobile générique force le lien en `inline-flex !important`, où l'ellipse ne s'applique pas au texte nu.

À vérifier par toi :

- Captures à 375×667, clair et sombre : index RP, sous-forum « Débuter » avec un titre long (ellipse du courant), sous-forum avec une catégorie longue (ellipse du lien), page de réponse.
- Sur le vrai site, en lecture seule : un sous-forum dont l'entrée active de la liste latérale porte un libellé différent du bouton natif. Le fil doit afficher le libellé de la liste (L4).

## Ticket 6.4 — en-tête de sujet mobile dans Communauté, Débats et Staff (construit, 2026-10-25)

Points « Ask First » du plan, tranchés en autonomie dans le sens prudent :

1. **Sujet fermé avec lien « répondre » natif.** « Répondre » suit la présence du lien natif, pas le cadenas. La fixture fermée n'a pas de lien : aucun « Répondre », deux « Nouveau sujet ». La variante cadenas + lien garde ses deux « Répondre ».
2. **« Nouveau sujet » partagé avec le sous-forum.** Le style standard n'est posé que sous la garde du sujet (`body.kr-forum-sujet`, posée par le module). Le sous-forum reste égal à la base. L'harmonisation du sous-forum reste à décider.
3. **Styles en ligne `!important` du h1 et des `.forum-top`.** Ils sortent du JS vers la feuille (classes `forum-thread-heading` et `forum-thread-top-bottom`). La règle générique `h1.page-header { margin-bottom: 10px !important }` battait la marge basse du h1 : elle est réécrite en place en `h1.page-header:where(:not(.forum-thread-heading))`, sans nouvel `!important` (compte inchangé à 3290). Le fond passe par `background-color: transparent`, car le build réécrit le raccourci `background: transparent` en `background: 0 0`.
4. **Couleur des liens du fil (Q28.1).** Couleur du texte, comme le fil commun de 6.3.
5. **Méta du `.forum-top` du haut.** Gardée telle quelle.
6. **Structure Staff supposée.** La fixture Staff reprend la structure RP, parent `forum/staff/coulisses-50101`, entrée active « Staff ». Elle ne prouve que l'indépendance à la catégorie.
7. **Seuils et tolérances.** Aucun n'a changé.
8. **Fixture `forum-sujet.html`.** Elle n'a pas changé. Elle n'a qu'un seul `.forum-top` : la barre du bas n'y est donc pas attendue. Les quatre nouvelles fixtures portent les deux barres.
9. **Barre du bas (Q28.3).** Même rendu que celle du haut, avec sa marge droite de 52 px.
10. **Variante `locked` de `forum-mobile.mjs`.** Elle n'a pas changé. La fixture fermée couvre le cadenas.

Écarts à connaître :

- **Catégorie de `forum-sujet.html` : « Forum HRP », pas « Jeu (HRP) ».** La liste latérale de cette fixture est vide : le fil prend le repli du libellé de menu (`FORUM_MENUS`). Sur le vrai site, il prend le texte de l'entrée active de la liste latérale.
- **Le fil du sujet est 12 px plus bas qu'avant.** Il prend la marge commune de 4 px de 6.3 au lieu des 16 px en ligne de l'ancien fil. Le titre du sujet n'est plus enrichi : le niveau courant est du texte seul, comme à l'index et au sous-forum.
- **Masques posés sur les bases d'avant le ticket** (`ENTETE_TICKET64`, `filSujetTicket64`). Ils sont posés dans `forum-index.mjs` (hors-périmètre), dans `typographie-formes.mjs` (`echelle-forum`, `nettoyage`) et dans `forum-activite.mjs` (bascule du sujet). Chacun doit être retiré au réalignement des bases (sweep 6.7 ou action A4 de la rétro 5).

À vérifier par toi :

- **Le relevé de l'inventaire (§1), à valider (hitl, non bloquant pour le build).** En particulier, pour ton compte, le lien « répondre » apparaît sur les sujets fermés.
- Captures à 375×667, en clair et en sombre : un sujet Communauté, un sujet Débats, un sujet fermé, un sujet HRP. Vérifier le fil commun, les deux barres et « Nouveau sujet » en bouton standard.

- **Question : liens « lien » et « liste des messages » absents du sujet mobile.** La barre native masquée les emporte. C'était déjà vrai en RP et HRP, et 6.4 l'étend à Communauté, Débats et Staff. Les remettre, par exemple dans le « ••• » de 6.5, ou les laisser hors du mobile ? Reporté dans deferred-work.

## Ticket 6.5 — bouton « ••• » commun au forum et au kramail (construit, 2026-10-25)

Points « Ask First » du plan, tranchés en autonomie dans le sens prudent :

1. **Liens « lien » et « liste des messages » du sujet mobile.** Ils ne sont pas ajoutés au « ••• ». Le « ••• » du forum est attaché à un message, alors que ces liens portent sur le sujet : les y mettre changerait le sens du bouton. La question reste ouverte (voir plus bas).
2. **Classes d'accroche.** `kr-msg-more`, `kramail-actions-mobile` et `kramail-post-kebab` sont gardées à côté de `kr-more`. Aucune n'est renommée.
3. **Style standard limité au « ••• ».** Seul le « ••• » du forum passe au bouton standard. Les autres actions du message (citer, éditer, profil…) gardent la règle générique (bordure `--kr-border-strong`, texte `--kr-text-primary`). L'harmonisation des voisins reste à décider.
4. **ARIA du kramail.** `aria-label="Autres actions"` est posé sur les trois boutons par la fonction commune. `aria-expanded` reste au forum seulement.
5. **Taille du glyphe au kramail.** L'icône de 18 px devient le glyphe « ••• » de 14 px, graisse 700, espacé de 1 px. Il est identique sur les trois pages (règle commune `.kr-more-glyph`).
6. **Couche des secondaires du forum.** En mobile, la barre d'un message ouvert prend `position: relative; z-index: 991`, entre le voile Bootstrap (990) et le mini-chat (999 annoncé). Après revue, la valeur 1000 du build initial a été abaissée.
   - Mesuré sur fixture, avec `#flap` posé en mémoire et ouvert par le bouton MC flottant, au-dessus d'un message ouvert : les actions secondaires couvertes rendent le panneau du mini-chat, pas la barre.
   - Le `z-index` calculé de `#flap` est 1050 : la règle `#flap { z-index: 1050 !important }` bat `.mobile-mode .mini-chat-overlay` (999) par l'id.
   - La barre est aussi au-dessus du voile simulé (990).
   - Non mesuré : la barre « Envoyer » fixe du forum (`button.btn-primary.pull-right`, z-index 90). Aucune fixture n'a à la fois des messages et cette barre. Par la cascade, une barre de message ouvert qui passe sous la barre « Envoyer » s'affiche au-dessus d'elle (991 > 90, même contexte racine). Sur la base, elle restait dessous. À vérifier sur un vrai sujet qui a un formulaire de réponse.
7. **Seuils et tolérances.** Aucun n'a changé.
8. **Fixtures.** Aucune n'a changé. Le voile, les thèmes et les variantes sont faits en mémoire.
9. **Survol et pression.** Le « ••• » du forum prend les états du bouton standard, sans règle nouvelle. Le kramail garde les siens.
10. **Largeur du « ••• » du forum.** Elle passe de 48 à 44 px (valeur de DESIGN).

Écarts à connaître :

- **Voile simulé du forum.** Le « ••• » du forum n'ouvre pas un menu Bootstrap : aucun voile n'est posé après lui. Le contrôle pose le voile résiduel d'un autre menu là où Bootstrap le met, dans le contexte d'empilement racine (dernier enfant de `body`). Au kramail, le voile est posé juste après le bouton, comme Bootstrap.
- **Glyphe du kramail : 18 → 14 px.** Glyphe texte au lieu de l'icône Font Awesome `fa-ellipsis-v`. Le bouton garde sa place, ses couleurs et son menu.
- **Masques posés sur les bases d'avant le ticket** (`PLUS_TICKET65`, `plusTicket65`). Ils sont posés dans `forum-index.mjs` (hors-périmètre), `cartes-pastilles.mjs` (forum), `palette-nation.mjs` (pages mobiles), `typographie-formes.mjs` (`echelle-forum`, `nettoyage`) et `kramail-redaction.mjs` (non-régression au pixel, bundle « avant » = `feature/next`). Chacun doit être retiré au réalignement des bases (sweep 6.7 ou action A4 de la rétro 5).

À vérifier par toi :

- Captures à 375×667, en clair et en sombre : un sujet (message fermé puis ouvert), la réception du kramail (menu ouvert), un kramail lu (menu ouvert). Vérifier le même « ••• » sur les trois et l'accès aux actions.

- **Question rappelée : liens « lien » et « liste des messages » absents du sujet mobile.** Les mettre dans un « ••• » propre au sujet (pas celui des messages), ailleurs, ou les laisser hors du mobile ?

## Ticket 6.6 — icône de forum lue dans la liste latérale, forum sans message, dernier message à droite (construit, 2026-10-25)

Points « Ask First » du plan, tranchés en autonomie dans le sens prudent :

1. **Compteurs sur ordinateur.** Les colonnes Sujets et Messages restent en place : chiffres à droite, couleur héritée, inchangée. Aucun « N sujets · N messages » sur ordinateur (voir la question rappelée plus bas).
2. **Repli de l'icône.** Une ligne n'a pas d'icône dans ces cas : URL absente de la liste, liste absente, entrée sans `span.lefticon`. Aucune place n'est réservée et rien n'est inventé ; la ligne reste. Constat : si la liste latérale est partielle, les noms d'un même groupe ne sont pas alignés (racine, 2e groupe ; colonne composée).
3. **Entrée désactivée.** Une entrée désactivée (classe `disabled`, `aria-disabled="true"` ou attribut `disabled`) compte comme absente : pas d'icône. La ligne reste dans l'index.
4. **Flèche de 34 px.** Ordinateur seulement : 34 × 34, à 10 px du bord. Couleurs, bordure, rayon et survol ne changent pas. Le bouton n'est pas passé au bouton standard. La cellule garde `padding-right: 52px` (8 px entre le texte et la flèche). La flèche mobile reste à 44 px.
5. **Écart avec le sous-forum.** Le ticket touche l'index seulement : le sous-forum ne change pas. Le contrôle « même rendu que le sous-forum » de `forum-index.mjs` reçoit une exception nommée (`EXCEPTION_TICKET66`). Elle couvre 3 points :
   - `color` de l'auteur ;
   - `width` et `height` du bouton → ;
   - `width`, `height` et `transform` du groupe du bouton (centrage à -17 px au lieu de -16 px).

   L'alignement à droite de la cellule n'est pas mesuré par ce contrôle : il n'est donc pas dans l'exception. Le fragment `ligne` de `forum-activite` le vérifie.

   Toute autre divergence reste rouge : la contre-épreuve sur la graisse de l'auteur passe au rouge.
6. **Racine `/forum`.** Incluse. Les lignes de son 2e groupe sont absentes de la liste RP : elles n'ont pas d'icône. `forum-racine.html` n'a pas de liste : aucune icône.
7. **Icône image.** L'`img` est clonée avec son `src` d'origine, sans remplacement. Seul le premier élément de `span.lefticon` (`i` ou `img`) est cloné : ni les nœuds texte, ni l'`id` (retiré du clone et de ses descendants, pour ne pas dupliquer un id de la liste).
8. **Auteur sur mobile.** Inchangé (`--kr-text-primary`, 600).
9. **Graisse du nom.** Inchangée (400).
10. **`span.tagforum`.** Inchangé.
11. **Couleur et taille de l'icône.** L'icône est décorative (`aria-hidden`) et ne reçoit pas les clics (`pointer-events: none`). Couleur `--kr-text-secondary`, taille de police du nom, 1,25 em de large, centrée, marge droite `--kr-space-1`. Mêmes règles sur mobile et sur ordinateur.
12. **Seuils et tolérances.** Aucun n'a changé.
13. **Contraste de l'auteur.** `--kr-text-accent` atteint au moins 4,5:1 sur le fond de la ligne dans les 16 variantes, à 1280 px. Aucun arrêt.
14. **Fixtures.** Aucune n'a changé. Les variantes (entrée désactivée, image, sans icône, sans liste, lien absolu, colonne composée, nom long) sont faites en mémoire.

Écarts à connaître :

- **Masques posés sur la base d'avant le ticket** (`LIGNE_TICKET66`, `ligneTicket66`). Ils sont posés dans 3 suites :
  - `cartes-pastilles.mjs` : fragment `lignes` ;
  - `typographie-formes.mjs` : `echelle-forum` et `nettoyage` ;
  - `forum-activite.mjs` : `seuil`, `bureau`, `fil` et bascule.

  Il faut les retirer au réalignement des bases (sweep 6.7 ou action A4 de la rétro 5).
- **Peau coupée.** Sans la peau, à 375 px, le script pose déjà un style en ligne sur `#col-right`, avant comme après le ticket. Le contrôle compare donc `#col-right` au bundle de base (peau coupée), pas à la page sans script.

À vérifier par toi :

- Captures à 375×667, 1280, 1440 et 1920 px, en clair et en sombre : index RP, Communauté, racine à groupes. Vérifier l'icône avant le nom, l'alignement des noms quand une ligne n'a pas d'icône, et le dernier message à droite près de la flèche.

- **Question rappelée (ticket 6.1) : compteurs sur ordinateur.** DESIGN veut « N sujets · N messages » en `text-secondary`. L'index garde les colonnes Sujets et Messages, alignées sur Msg et Vus du sous-forum. Faut-il garder les colonnes, ou passer au texte de DESIGN ?

## Ticket 6.7 — refactor sweep de l'épopée 6 (construit, 2026-10-25)

Points « Ask First » du plan, tranchés en autonomie dans le sens prudent :

1. **Bases partagées et action A4.** Les bases partagées ne bougent pas : `forum-index` 81512a3, `cartes-pastilles` 21fed8d, `typographie-formes` d953969, 62fd47d et 00b0786, `palette-nation` 6685df5. Leurs masques 6.x sont gardés. Leur condition de retrait nomme maintenant le ticket qui porte l'action A4 de la rétro 5 (extinction des masques 3 à 6). Ce ticket est à créer à la rétro de l'épopée 6. Plus aucune condition ne dit « sweep 6.7 ».
2. **Valeur des flèches de tri.** `var(--kr-space-1)` (4 px) au lieu de 6 px, sous-forum mobile seulement. La puce triée rétrécit de 2 px. Les 5 puces restent visibles, d'au moins 44 × 44, sans débordement, à 375, 700 et 767 px. Aucun arrêt.
3. **Règles mortes d'avant 6.2.** `forum-topic-stats-mobile` (et `.stats-sep`) est retirée après revue : la classe était propre au userscript et n'est plus posée depuis `ce0b012` (9 `!important` en moins, 3281). Les quatre autres (`forum-description-wrapper`, `forum-stats-wrapper`, `forum-thread-detail`, `forum-thread-metadata`) ne sont pas retirées. Elles sont signalées dans `deferred-work.md`, section « Reports du ticket 6.7 ».
4. **`EXCEPTION_TICKET66`.** Gardée. Sa condition : « Retrait : quand le sous-forum suit la Ligne de forum (flèche 34 px, auteur en accent, dernier message à droite) ; décision d'Arnaud en attente (revue-manuelle.md, harmonisation du sous-forum), puis ticket qui l'aligne ».
5. **Constantes de `forum-activite.mjs`.** Les cinq constantes et leurs variables `KR_SCRIPT_AVANT*` restent. Elles valent toutes `'810901f'` (fin de l'épopée 6, avant 6.7). Aucune fusion.
6. **Masques 3/4 inertes de `kramail-redaction.mjs`** (`ESPACEMENT_AVANT` et voisins, base auto-référente). Non touchés : ils reviennent à A4.
7. **Seuils et tolérances.** Aucun n'a changé.
8. **Fixtures.** Aucune n'a changé.

Écarts à connaître :

- **Nouveau masque `FLECHES_TICKET67`.** Le plan ne l'avait pas prévu. Trois comparaisons à une base d'avant 6.7 voyaient l'écart voulu des flèches : 2 px de moins sur la puce triée, puces suivantes décalées. Il s'agit de `forum-activite#entete`, `forum-index#hors-perimetre` et `typographie-formes#nettoyage`. J'ai suivi la convention du dépôt : une feuille miroir à 4 px, posée sur la base seule et gardée par son détecteur `AVANT_TICKET67`. Tout autre écart reste rouge. Sa condition de retrait : pour `forum-activite`, le réalignement de ses bases sur un SHA qui contient 6.7 (action de la rétro de l'épopée 6) ; pour `forum-index` et `typographie-formes` (bases partagées), le ticket A4. Autre option : annuler la réécriture des flèches et reporter D4. C'est à toi de trancher.
- **Masques retirés.** Dans `forum-activite.mjs`, les options `entete64` et `ligne66` de `ouvrir` sont retirées avec leur pose, ainsi que les 4 lignes « info » 6.6. Toutes les bases sont réalignées sur 810901f. Dans `kramail-redaction.mjs`, `PLUS_AVANT` est retiré : il était déjà inerte.

Action pour la rétro de l'épopée 6 :

- Réaligner les bases de `forum-activite` (810901f) sur un SHA qui contient 6.7 et y retirer `FLECHES_TICKET67`.
- Créer le ticket qui porte l'action A4 de la rétro 5 : réaligner les bases partagées, puis éteindre les masques 3 à 6 et `FLECHES_TICKET67`.

Questions toujours en attente (rappel) :

- Alignement de Staff (D2, D3, D5).
- Coins bas de la racine en sombre (D6).
- `span.tagforum` (D10).
- Correctif d'ancres limité à `#flap` (D11).
- Liens « lien » et « liste des messages » du sujet mobile (D12).
- Compteurs sur ordinateur.
- Harmonisation du sous-forum (« Nouveau sujet », flèche 34 px, `EXCEPTION_TICKET66`).
- Q27.5, Q27.6.
- O1 (fond de page teinté).

Reportés à la rétro de l'épopée 6 (faisables sur une page dérivée en mémoire, hors du périmètre du sweep) :

- D7 : accordéon ou modale `.panel-default` sur une page `/forum/*`.
- D13 : barre d'un message ouvert (z-index 991) au-dessus de la barre « Envoyer », sur un sujet avec formulaire de réponse.

À vérifier par toi :

- Sous-forum mobile à 375 et 767 px : la flèche de tri est plus près du libellé, les puces sont alignées et le fondu à droite est intact. À 768 px, les flèches ne changent pas.

## Backlog 11 — suites e2e sur bases à jour, sans masque (construit, 2026-10-25)

Plan : `_bmad-output/backlog/story-suites-e2e-sur-bases-a-jour-sans-masque-plan.md`. Aucun changement du thème, du template ni du bundle. Les bases partagées sont réalignées sur `6270c81`, dont le bundle est identique à HEAD. Les comparaisons deviennent des gardes de régression.

Points « Ask First » du plan, tranchés en autonomie dans le sens prudent :

1. **Bases dédiées hors liste.** Non réalignées : `typographie-formes` d68ab55, 4d97496, 8631c45, 3b1da55, fe77411, 1590761, 5ff22d3, 2db3b4c ; `cartes-pastilles` a7f0463, 601ab19, 59567f0 ; `palette-nation` d521cc8. Leurs masques gardent leur code. Leur condition suit le format « Retrait : au prochain ticket qui modifie <zone> ; il réaligne <constante> sur un SHA récent après contrôle absolu de <décision> ».
2. **Nettoyage (4.10).** `COMMIT_NETTOYAGE` passe à `6270c81` pour R1 à R6. Une base dédiée `COMMIT_MEDIAS_410 = '00b0786'` (variable `KR_SCRIPT_AVANT_MEDIAS_410`) porte seule le check « base M1/M2 d'avant 4.10 », le rendu qui change à 768 px et la base relevée à 769 px (A8). Essai de retrait des masques de `ouvrirNettoyage` : tous retirés, 405 ok et 0 FAIL sans eux. La base M1/M2 est ouverte telle quelle, sous le seul gel des animations.
3. **Neutralisations d'empreinte de `forum-index`** (`paire`, `texteColore`, `composantsHerites`, `COMPOSANTS_TICKET4/5`, `sujetStandard`) : retirées, avec l'import de `lib/variantes.mjs`. Elles sont couvertes par palette-nation (3.2, 3.3, 3.4) et forum-activite (6.4).
4. **Retrait des attributs d'infobulle (`COLONNE`).** D'abord l'injection en début de document, en gardant le retrait : 2 tours sous charge verts. Ensuite, le retrait seul : au calme 16 ok ; sous charge (`KR_CONCURRENCY=8`, zones cartes-pastilles et typographie-formes en parallèle) 2 tours verts, 16 ok chacun. **Résultat : la correction locale est retirée.** `#col-right` est comparé tel quel à la page servie sans userscript.
5. **Contrôle absolu 3.4 sur les pages de référence (`pages4`).** La première version du check était rouge sur HEAD (8 FAIL). Elle exigeait aussi, en sombre, un bouton standard en fond de surface et texte de la nation. Or beaucoup de `.btn-default` des pages ont des règles propres (actions rapides, flèches, dates de message). Le check est donc réduit à l'absolu « aucun gris de Bootstrap en texte, fond ou bordure des composants », sur les 16 variantes. Il est vert sur HEAD et rouge sur 6685df5 (8 FAIL : sujet, sous-forum, index RP, réception, à 375 et 1280 px ; plateau vert). Le sombre du bouton standard reste couvert par le check absolu de la fixture. **À trancher par toi** : faut-il un absolu sombre propre aux pages ? Il demanderait d'abord d'écrire quelles règles propres des `.btn-default` sont voulues.
6. **4.4 compact.** Un check absolu 12 px existe déjà sur la pagination compacte (`typographie-formes`, fragment compact). Rien d'ajouté. `COMMIT_COMPACT` (3b1da55) n'est pas réaligné.
7. **Décisions de non-changement.** Le tableau de palette et `forum-index#hors-perimetre` deviennent des gardes de régression. Libellés : « égal au bundle de base (6270c81) ». Pas de contrôle absolu ajouté.
8. **Constantes de `kramail-redaction`** (`JETONS_REDEFINIS`, `TEXTE_SECONDAIRE_CLAIR`, `COMPOSANTS_TICKET4`, `ECHELLE_TICKET45/47`, `RAYONS_TICKET48`, `ESPACEMENT_TICKET49`, `AVANT_TICKET45/47/48/49`) : gardées. Leur condition : « Retrait : à la décision d'Arnaud sur les bases auto-référentes (action A9) ».
9. **`EXCEPTION_TICKET66`** : non touchée (ce n'est pas un masque de base).
10. **Seuils, tolérances, fixtures** : aucun changé.

Masques gardés, avec leur condition :

- **TF1** (`CARTES_TICKET54/55` sur `COMMIT_AVANT` d68ab55) : au prochain ticket qui modifie les étiquettes et pastilles, après contrôle absolu des entrées 5.4 et 5.5.
- **TF2** (`LEGENDES_TICKET45` sur `COMMIT_BOUTONS` et `COMMIT_MODALES`) : au prochain ticket qui modifie les boutons, après contrôle absolu des légendes des compétences en 12 px.
- **TF3** (miroir `ECHELLE_TICKET45` sur `COMMIT_ECHELLE`) : au prochain ticket qui modifie l'échelle des titres, après contrôle absolu des titres.
- **TF7** (médias décalés sur `COMMIT_RAYONS` 5ff22d3) : au prochain ticket qui modifie les rayons, après contrôle absolu des rôles C4, K8, K7 et P.
- **CP5** (`sansPnj55` sur `COMMIT_AVANT_53`) : au prochain ticket qui modifie les groupes du plateau, après contrôle absolu de l'étiquette « PNJ » des cartes.
- **CP6** (`sansPosition55` sur `COMMIT_AVANT_55`) : au prochain ticket qui modifie les étiquettes de catégorie, après contrôle absolu de la position de la marque PNJ.
- **Base M1/M2** (00b0786) : sans masque. Retrait de la base : au prochain ticket qui modifie les médias 768/769 du kramail ou du changelog ; il remplace ses trois contrôles par un contrôle absolu de M1 et M2 à 768 px.

Constantes signalées dans `lib/variantes.mjs` : 31 exports orphelins retirés (masques des tickets 4.1 à 6.7). Gardées : `REGLES_CARTE_TICKET51`, utilisée par `REGLES_CARTE_TICKET52` (cartes-pastilles). `RETRAITS_TICKET49` et `ECARTS_TICKET49` n'ont pas d'utilisateur hors du fichier, mais `lib/variantes.mjs` les emploie lui-même (exceptions de la grille d'espacement, `PROPRIETES_ESPACEMENT_TICKET49`) : gardées.

Écart de harnais : une commande d'essai a lancé toutes les suites e2e en arrière-plan. Je l'ai arrêtée en moins de 2 minutes. Tout tournait sur fixtures locales et `git status` ne montrait aucun changement inattendu.

À vérifier par toi : rien de visuel (aucun changement produit). La preuve finale `npm run test:all` revient à l'orchestrateur, sur machine calme.

## Backlog 13

- Decision (orchestrateur, 2026-10-28) : Arnaud a demandé le même fond neutre pour les caractéristiques, sans le restreindre au plateau. Les caractéristiques de Bâtiments, Matériel et Employés sont donc couvertes. Ces pages chargent les caractéristiques natives (`.btn-group-xs.center`), que le template déplace dans `#col-leftest-stats`. Elles prennent le fond neutre du bouton standard de leur page. Sur ces pages aussi, seul `btn-success` est neutralisé. La règle vise la colonne des caractéristiques, pas `alert12`, qui est aussi la classe de « Prier » (`btn-primary`). Dans les fixtures, `#col-leftest-stats` ne contient aucun autre `.btn-success`.
- À vérifier par toi : caractéristiques au fond neutre sur le plateau, Bâtiments, Matériel et Employés, en Kraland clair et Empire Brun sombre, à 375 et 1280 px.

## Backlog 9 — jauges PM et PP du mini-profil (construit, 2026-10-28)

- Chaque jauge lit maintenant sa valeur dans son propre bouton (`a.alert141`, `a.alert142`, `a.alert143`). Le maximum vient de la barre de la colonne suivante.
- Le test `typographie-formes#nettoyage` masque les largeurs des jauges (`MASQUE_JAUGES_9`), car sa base garde les anciennes valeurs fausses. Retirer ce masque quand la base du nettoyage passera après le backlog 9.
- À vérifier par toi : sur `/jouer/plateau` à 375 px, mini-profil plié puis déplié, PV, PM et PP affichent chacun leur propre valeur.

## Backlog 12 — « Envoyer » du forum et panneaux des pages dérivées (construit, 2026-10-28)

- La barre d'un message ouvert ne passe au-dessus du voile Bootstrap (z-index 991) que si `.dropdown-backdrop` est présent. Ailleurs, « Envoyer » reste atteignable.
- Les accordéons et les modales gardent leur peau : les règles du panneau forum mobile excluent `.panel-group > *` et `.modal *`.
- Doute : le cas « Envoyer » sous une barre fixe est peut-être rare sur un vrai sujet. À vérifier par toi sur un sujet réel à 375 px.

## Inception de l'épopée 8 — notifications (2026-10-28)

- 5 entrées : 1 ligne de notification (texte 14/15 px, dates 13 px, date au-dessus du texte sur mobile) ; 2 popup de 900×800 à la cloche sur ordinateur (hitl) ; 3 sélecteur de personnage à 16 px du haut ; 4 refactor sweep ; 5 captures de validation (hitl). Chaînées, car elles touchent toutes `router.mjs` et `report-non-lu.mjs`.
- Décidé en autonomie : « ordinateur » se lit au clic avec `isMobileMode()`. Le mobile garde l'`openReport` natif. Le popup 900×800 remplace le fragment `fenetre` 600×600. Le filet « non lu » passe sur le `tr` en mobile.
- À trancher par toi : faut-il accepter un seul `!important` contre la marge en ligne de 10 px du bandeau (entrée 3), si rien d'autre ne la bat ?
- À vérifier par toi (entrée 2) : un clic sur la cloche ouvre-t-il un popup de 900×800 sur ton navigateur ? Attention, ce clic marque tes notifications comme lues. Aucun agent ne le fera.
- Le bureau compact 768-991 px, où la cloche est invisible menu fermé (D12), a été examiné et n'est pas repris. Ta décision est toujours attendue (rétro 5, A5).

## Inception de l'épopée 7 « Kramail : même thème que le forum » (2026-10-28)

- Découpe faite en autonomie dans `epic-kramail-mobile/tickets.toml` (10 entrées), à partir de ta demande du 2026-10-23. Les hypothèses sont dans les Notes de l'épopée. CAP-8 est étendu dans la spec : il couvre maintenant ordinateur et mobile.
- Entrées, dans l'ordre :
  1. gardes de page, suite `kramail-theme` et dossiers en onglets sur mobile ;
  2. lecture d'un message comme un message de sujet ;
  3. en-tête ;
  4. listes comme la liste des sujets ;
  5. rédaction comme le formulaire de réponse ;
  6. retrait de `--kd-*` ;
  7. « Envoyer » dans le flux ;
  8. Contacts ;
  9. vrai téléphone et captures (hitl) ;
  10. refactor sweep.
- À valider par toi : les entrées 1, 2 et 5 partent sur les hypothèses ci-dessous ; tu peux les corriger avant ou après.
  - Q31.1 : onglets pleine largeur sous le titre, boutons à icône dessous.
  - Q31.2 : « Nouveau message » non libellé.
  - Q31.3 : barre de 5 outils et « Plus ».
  - Q22.1 : « Répondre » et « Répondre à tous » libellés.
- Conflit de sources : EXPERIENCE.md garde le « non lu » du kramail tel qu'il est rendu aujourd'hui. Ta décision du 2026-10-23 l'aligne sur le forum ; l'entrée 4 suit ta décision.
- Toujours en attente de toi :
  - A1, push ou fusion ;
  - A9, base figée de `kramail-redaction` ;
  - D11, ancres.
  Le sweep ne les traite que si tu as tranché.
- Entrée 9 (hitl) : points D et E du protocole P2 sur ton téléphone, après le sweep.

## Inception de l'épopée 9 « Plateau et confort mobile » (2026-10-28)

- Découpe faite en autonomie : 12 entrées dans `epic-plateau-confort-mobile/tickets.toml`. Les entrées 9.9 (kramail) et 9.10 (notifications) attendent les sweeps 7.10 et 8.4.
- À trancher par toi :
  - entrée 7 (Q30.5) : ce ticket reste-t-il dans cette épopée ? Voir rétro 5, A6 ;
  - Q24.2, Q30.6, Q32.2 à Q32.4 et Q20.
- Spike 3 : relevé des pages mobiles hors fixtures, sous ton mandat de lecture du site réel.
- Hypothèses retenues :
  - marge mesurée sur le texte, cartes de section à 8 px des bords ;
  - Q7 : nom en 15 px, avec des points de suspension ;
  - Q24.1 : tuiles de 64 px gardées ;
  - Q29 : rendu du ticket 1.4 gardé ;
  - largeur de 320 px ajoutée aux contrôles ;
  - captures des épopées 5 et 6 faites dans 9.11.

## Spike 9.3 — relevé des pages mobiles hors fixtures (construit, 2026-10-28)

- 17 URL relevées en lecture seule, à 375×667, en Kraland clair et en Empire Brun sombre. Hors cartes, le texte de `#col-right` touche les bords (0 px). Les cartes de section sont conformes : 8 px du bord, contenu à 16 px.
- Les cibles manquent surtout en largeur, car la règle mobile ne force que la hauteur à 44 px. Exemples :
  - Organisations : 21 cibles sur 43 à 32-34 px de large ;
  - sélecteurs de carte : 28 px de haut.
- Bug trouvé : sur mobile, des boutons `.hidden` d'Événements s'affichent (le `!important` de la règle mobile bat `.hidden`). À reprendre par 9.4.
- À faire par toi : le Chrome dédié n'est pas connecté à Kraland. Interface, Contacts, recherche et modération du forum ne sont pas relevés. Ouvre une session dans ce Chrome si tu veux que le relevé soit complété.

## Bug 9.6 — décisions d'orchestration (2026-10-28)

- Mini-chat sur téléphone : `MiniChat:FAB` fait foi. L'ancien `initMobileMiniChat` est retiré. Sur un vrai téléphone, il ajoutait une × sans effet dans `#flap` et détournait le lien natif quand le thème est coupé. À revoir si tu préfères un autre comportement pour le mini-chat.
- La superposition mobile et le panneau des compétences restent masqués en mode mobile : le panneau est passé dans le mini-profil au TASK-1.6. Ils sortent donc du chemin mobile plutôt que d'être « restaurés ».

## Ticket 7.1 — à vérifier avec une session (2026-10-28)

- La page Signaler d'un kramail (`…-8-<id>`) est exclue de la garde de rédaction par hypothèse. Aucune fixture ni session ne permet de voir si elle utilise le formulaire `post_msg`. À vérifier quand une session Kraland sera ouverte dans le Chrome dédié.

## Ticket 9.2 — carte de personnage étroite (2026-10-28)

- Sous 200 px de large, une carte affiche le nom sous l'avatar, aligné à gauche. Le centrer rogne les points de suspension de la deuxième ligne sous Chromium (« Crapaudière-.. »). Le statut reste centré en dessous. À trancher : accepter tel quel, ou aligner aussi le statut à gauche dans ces cartes.
- À 1512 px, les cartes des autres groupes font 168 px. Elles passent donc au nom dessous et ne sont plus identiques à l'avant 9.2.

## Ticket 9.1 — marge latérale de 16 px (2026-10-28)

- Les colonnes ajoutées après le chargement d'une page mobile passent de 10 ou 15 px à 0 px, sur toutes les pages, y compris hors du périmètre du ticket. Aucun test ne couvre ce cas. À trancher : accepter ce changement ou garder l'ancienne valeur.
- `SANS_MARGE_PAGE` neutralise la marge du 9.1 dans les comparaisons à la base de cartes-pastilles et typographie-formes. Ces suites ne contrôlent donc plus la valeur de la marge : seule confort-mobile le fait. Le masque doit disparaître quand les bases seront ré-ancrées après la fusion (backlog 11).
- La fixture `aide.html` est synthétique et la route `/aide` est supposée. Il reste à relever le chemin et la structure réels de l'Aide, en lecture seule.

## Relevé du site réel du 2026-10-29 : suites données

- 7.1, page Signaler : l'hypothèse « pas de formulaire » est infirmée. La page utilise le formulaire `post_msg` complet et déborde à 375 px (`#accordion`, scrollWidth 390). Ajouté au périmètre du 7.5 (rédaction).
- 7.2 : un message tient sur une page, sans fil. La fixture n'a pas les deux formes réelles de l'auteur, la ligne des destinataires ni la signature. Le sélecteur de l'expéditeur (`.cartouche strong a`, template ~l.6280) rate la forme réelle la plus courante : sur mobile, le lien de l'expéditeur pointe vers `#`. Transmis à impl-72.
- 9.1, Aide : la route `/aide` est confirmée, la marge de 16 px est juste. La fixture `aide.html` a une structure plus riche que la page réelle (colonne `col-md-6`, ni panneau ni `h1`). La fenêtre `/help` (ouverte par `openHelp`) a un autre gabarit, non gardé, texte à 0 px du bord : à traiter dans le 9.4 ou en report.
- Spike 9.3 complété : Interface et Contacts relevés (sans garde, texte à 0 px du bord sur Interface, cibles de 20 à 34 px). Sur mobile, Contacts reçoit à tort la peau du forum : ajouté au 7.8. Recherche et modération du forum introuvables sur ce compte.


## Ticket 8.2 — popup 900×800 de la cloche (construit, 2026-10-29)

- Vérification sans clic, après fusion. L'orchestrateur la fait dans le Chrome dédié, en lecture seule, sur une page de jeu à 1280 px ou plus. Dans la console de la page : `openReport.krReportPopup === true` doit valoir `true`. Ensuite : `const o = window.open; window.open = (...a) => console.log(a); openReport(); window.open = o;` doit afficher `width=900,height=800` dans les options, sans ouvrir de fenêtre ni envoyer de requête vers `/report`. Aucun clic sur la cloche : ce clic marquerait les notifications comme lues. Les tests simulent le bac à sable (window local, `unsafeWindow` = page), mais seul ce constat prouve l'appel depuis le `onclick` sous Tampermonkey.
- À faire par toi lors de ta passe finale : la même procédure de console sous Firefox avec Tampermonkey (fonction exportée par `exportFunction`). Si le marqueur manque ou si les options restent en 600×600, consigne-le ici.
- Les options du popup (barre d'outils, défilement, etc.) sont recopiées de `main.js` (kraland-7.0.9). Seules la largeur et la hauteur changent. Si le site change ces options, le userscript garde les anciennes ; un test compare désormais ces options à celles de `tests/e2e/vendor/parler/main.js` et signale une dérive quand la copie de main.js est rafraîchie. À trancher : accepter, ou relire les options natives au clic.
- Peau coupée, la cloche garde le popup natif de 600×600, y compris quand la peau est coupée sans rechargement de la page. Choix pris par défaut (garde de peau des nouveaux modules, M10). À revoir si tu veux le 900×800 sans la peau.
- De 768 à 991 px, la cloche reste invisible tant que le menu est fermé (D12, ta décision attendue) ; menu ouvert, elle ouvre le popup 900×800.
- Vérifié le 2026-10-29 après fusion (5f5d299), Chrome dédié, Tampermonkey réel, `/accueil` rechargé, 1280 px, Empire Brun sombre : `openReport.krReportPopup === true`, et `openReport()` sous `window.open` sondé appelle `report`, `private_report`, `width=900,height=800,…` ; aucun clic, aucune requête vers `/report`. Reste Firefox, pour la passe finale d'Arnaud.

## Ticket 8.3 — sélecteur de personnage à 16 px du haut (construit, 2026-10-29)

- Sans `!important`, comme tu l'as décidé. Sur `/report`, le `padding-top` du body passe de 60 px à 6 px (`calc(var(--kr-space-4) - 10px)`). Avec la marge en ligne de 10 px du bandeau, que la peau ne touche pas, le sélecteur commence à 16 px du haut, de 375 à 1920 px, popup 900×800 compris. Aucun écart ne reste sur les fixtures.
- Hypothèse à vérifier lors de ta passe finale : la marge en ligne du bandeau vaut 10 px sur le vrai `/report` (relevé t_f45d2cfb, repris par la fixture). Si le site la change, le haut du bandeau bouge d'autant. Sur ton navigateur, le sélecteur doit toucher presque le haut de la fenêtre, avec une bande de 16 px environ.
- Les marges gauche, droite et basse de 10 px du bandeau restent natives. La marge latérale de 16 px relève de l'épopée 9.
- Les autres fenêtres sans barre de navigation (aperçu `help.php?p=prev`, fenêtre `/help`) ne sont pas traitées. Elles ont peut-être la même bande vide de 60 px ; ce n'est pas vérifié.
- Aucun partage avec le sélecteur de l'en-tête du kramail (7.3) : la règle est gardée par `kr-page-report`, et le bandeau de `/report` n'a pas d'autre règle que la règle générique `.bg-primary`, inchangée.
- `confort-mobile` (`hors-perimetre`) compare `/report` à un bundle de base figé (9b6851a). Le contenu y remonte de 54 px. Sur `/report` seulement, les ordonnées sont recalées de l'écart des deux `padding-top` du body, borné à 54 px exactement (60 px sur la base, 6 px testé) ; tout autre écart fait échouer le contrôle. La base est figée : le recalage ne se retire pas seul. Il est à supprimer au relèvement de `COMMIT_AVANT` sur un SHA qui contient 8.3 (fait en 8.4), tâche ajoutée à l'entrée 8.4. Un décalage d'une autre origine reste détecté (contre-épreuve : onglets décalés de 5 px, rouge).

## Ticket 7.3 — en-tête du kramail (2026-10-29)

- Sur la lecture, il n'y a pas de sélecteur de personnage : le titre natif d'un message porte le sujet, pas le nom. Le fil d'Ariane donne « Kramail › Personnage › sujet », avec le lien de Réception (ou d'Envoi) du compte. Le verify cite kramail-lecture pour le menu : ce point est lu comme valant pour l'en-tête seul. À trancher : accepter ainsi, ou ajouter un sélecteur sur la lecture (qui mènerait à la Réception d'un autre personnage).
- Au bureau, la liste gagne le sélecteur à la place du nom, alors que la colonne de gauche liste déjà les personnages. À trancher : le garder, ou le réserver au mobile.
- Au bureau, la liste et la lecture perdent la bordure basse en couleur primaire, la graisse de 500 et le survol en accent des boutons du titre : elles prennent l'en-tête du sous-forum (bordure #eee, boutons en 400, survol Bootstrap). La rédaction garde son rendu, survol en `--kr-text-accent` compris (revue : A4 appliqué, palette-nation contrôle le survol sur la rédaction).
- Menu de personnage : au clavier, l'option prend le fond de survol et un contour primaire de 2 px (`:focus-visible`, mobile et bureau) ; Entrée sur une option suit son lien. Le contrôle de cartes-pastilles exige désormais au moins autant de règles `:focus` que la base. Contour retenu en `:focus-visible` seul : un contour au survol de la souris n'était pas demandé.
- La catégorie du menu (« (Compte Membre) ») passe de `--kr-text-muted` à `--kr-text-secondary` : le jeton atténué tombait à 2,54:1 dans 6 variantes claires et sous 4,5:1 dans les variantes sombres.
- Sur mobile, le libellé du fil vient du titre actif de la colonne de gauche (« Kramail ») et pointe vers `kramail`. À vérifier sur le site que cette adresse mène bien à la Réception du compte courant.

## Ticket 9.13 — Membres et fenêtre d'aide (en revue, 2026-10-29)

- Page Membres : `/communaute/membres` n'est pas une liste de membres, c'est la fiche du compte connecté en édition (relevé releve-aide). Ses 7 boutons d'édition `span.btn-group-xs > a.btn` (icône `fa-edit` seule, padding 8px) mesurent 33,8 × 44 px. La fixture les reproduit à 34 px sur la base (padding et largeur d'icône posés en ligne). Correctif : `min-width` de 44 px, limité à `#myTabContent` ; la fiche d'un autre membre n'a ni `#myTabContent` ni `.btn-group-xs`.
- Fenêtre `/help` sur ordinateur : relevé à 1280 px, `#content` en padding-left 0 et padding-right 48px, `.row` en margin-left 0, textes à 0 px. Les fixtures reproduisent cet effet de `main.css` par un style en ligne. Le CSS du ticket est mobile seul : 768 à 1280 px restent égaux à la base. Aucune marge sur ordinateur, à trancher (fidélité de `/help` au bureau et parent de `#content` : relevé séparé du coordinateur en cours).
- Page Membres : le relevé du 2026-10-29 (releve-membres) plaçait un `li` à 4 px du bord à 375 px. La fixture ne le reproduit pas. Probablement un onglet `ul#myTab` dont seule la boîte touche le bord. À vérifier sur le site.
- `/help/staff` : les `.well` passent à 8 px des bords comme une carte de section (H4.1), premier texte à 24 px au plus ; sans cela, le texte des cellules serait à 40 px. Choix de rangement pris seul.
- Les liens `td > a` agrandis sont limités aux `.well` : seule `/help/staff` en a (25, aucun dans une phrase) ; `/help/password` et `/help/defkra` n'ont ni `.well` ni `td > a`.
- Les liens de texte de `/help` (`p > a`, `pre > a`) restent au fil du texte (exception H9.1), non agrandis.
- L'exclusion des modales (`:where(:not(.modal *))`) n'a pas de contrôle : aucune fixture de ces pages ne contient de modale.

## Ticket 9.5 — cibles du plateau mobile (2026-10-29)

- Groupes du plateau : sur la base, l'accordéon ne s'animait pas du tout. Sa transition était invalide (deux fonctions de temps, valeur calculée `all 0s`). Il s'anime maintenant sur 0,3 s. À vérifier à l'œil : accepter cette animation ou garder le repli instantané.
- Le ticket cite un bouton réglages du mini-profil à 32 px. Cette règle (`.mobile-mini-profile-settings`) était morte : aucun élément ne porte la classe. Elle est supprimée. Le vrai bouton, `.mobile-mini-profile-manage-btn`, faisait déjà 44 × 45.
- Grille d'actions du plateau : elle est masquée en mobile. Son plancher de 44 px n'a donc aucun effet visible. Les accès rapides faisaient déjà 44 px ; le plancher est seulement rendu explicite.
- Cartes à plusieurs actions : leur structure native n'a pas été relevée. Le test suppose trois liens frères dans la même ligne. À vérifier sur une vraie carte.
- Pièces de la croix : leurs lignes gardent le rythme de la croix (50 px) ; seule la pièce reçoit un plancher de 44 px.
- Au survol, une action de carte grossit de 10 % (`transform: scale(1.1)`) : 2,2 px de plus par côté à 44 px. L'écart entre deux actions est de 8 px : il reste 5,8 px, sans contact. Avec un écart de 6 px, il resterait 3,8 px. Rien de changé.
- Repli des deux accordéons : la hauteur maximale dépliée reste à 5000 px. La transition part donc de 5000 px, et non de la hauteur réelle : en début de repli, la hauteur visible ne baisse pas pendant un temps mort. Accepté par la revue du 9.5, non corrigé.
- Groupes repliés au chargement : la transition, devenue valide, les faisait se replier sous les yeux en 0,3 s (saut d'environ 180 px). Corrigé : l'état initial est posé sans animation.
- Les deux accordéons ne s'animent plus si le système demande moins d'animations (`prefers-reduced-motion: reduce`).
- D9.1 (report, hors périmètre du 9.5) : selon la revue, sur la base, un groupe replié ne se replie plus après un aller-retour 767 -> 768 -> 767 px (`collapsed` reste à 900 px). Sur fixture, chaque changement de largeur recharge la page (2 rechargements sur 2), et les boîtes reviennent à l'état initial, en base comme en 9.5 : le défaut n'est pas reproduit. Non corrigé ; à vérifier sur un téléphone ou une fenêtre réelle.
- Comparaisons à la base : plateau-qualite-usage (cartes) et typographie-formes (boutons, nettoyage) posent `CIBLES_TICKET95` sur leur bundle de base, tant que la base précède l'entrée. À retirer quand ces suites compareront à un SHA postérieur.
- Trouvé à la fusion (test:all) : la fixture des Règles (`palette-nation.html`, servie à `/regles/avancees`) porte une carte du plateau ; ses actions à 44 px allongent la page de 5 px. Le fragment `forum-activite#fil` pose désormais `CIBLES_TICKET95` sur son bundle de base (6270c81), comme plateau-qualite-usage et typographie-formes. Contre-épreuve : bundle sans 9.5, rouge.

## Ticket 8.4 — Refactor sweep des notifications (construit, 2026-10-29)

- `confort-mobile` compare désormais `/report` au bundle d'abbe7be, qui contient 8.3. Le recalage vertical provisoire et son contrôle borné à 54 px sont retirés. Sur l'ancienne base (9b6851a), seuls les 4 contrôles `/report` de `hors-perimetre` diffèrent (8.3) ; aucun autre écart nouveau.
- Conséquence à connaître : avec une base aussi récente, les comparaisons « égal au bundle de base » de `confort-mobile` prouvent seulement que rien n'a bougé depuis abbe7be.
- La règle générique `.bg-info` exclut maintenant la ligne du journal de `/report`, au lieu d'être battue par la section `/report`. Rendu identique (suites vertes). Les autres `.bg-info`, y compris sur `/report`, gardent la règle générique.
- Le masque du titre de la ville (768 px) de `confort-mobile` est devenu inerte. Il n'est pas retiré ici : il relève de l'épopée 9 (report consigné dans `deferred-work.md`).
- Taille du texte à 14 px sur ordinateur : aucun test ne la distingue des 14 px natifs de Bootstrap. Report consigné, rien à faire de ton côté.
- Écart du déplacement de la taille 14 px dans le bloc ordinateur : une table imbriquée dans une cellule du journal passe de 14 à 15 px sur mobile, car elle hérite de la règle mobile. Mesuré : 54 écarts à 375 px, 0 à 1280 px. Ce cas est absent de la fixture et reste hypothétique sur le site. La règle n'est pas restaurée.
- `npm run test:all` reste à lancer une fois, machine calme, sur le SHA de fusion (verify de l'entrée).

## Ticket 9.8 — forum mobile, marge et cibles (2026-10-29)

- Écart au ticket : recherche et modération non couvertes faute de relevé, à acter par Arnaud. Elles sont absentes du relevé réel et du spike 9.3 (introuvables sur ce compte) : pas de fixture, pas de correctif.
- Nouveau sujet : Tags non couvert, faute de relevé. La page n'a été relevée que hors connexion ; le champ Tags est absent de la fixture `forum-nouveau-sujet.html`.
- Messages du forum : sur mobile, ils deviennent des cartes à 8 px des bords. La lecture du kramail partage leurs règles mais ne change pas, d'où un écart visuel entre les deux. À trancher : accepter, ou étendre au kramail (entrée 9). Le contrôle `lecture` de kramail-theme mesure le message de forum de référence sans la marge de page : lié à D3 ; à revoir si les cartes à 8 px s'étendent au kramail.
- Alerte de tête (« Bienvenue », « Sujet Bloqué ! ») : la place réservée à la croix passe de 35 à 44 px, et la croix devient une cible de 44 × 44, sur tout le forum sauf Staff. Staff exclu, à trancher par Arnaud avec l'alignement de Staff (`epic-plateau-confort-mobile.md`, l.65) : la catégorie `/forum/staff[/…]` ne reçoit pas `kr-page-forum` et reste égale à la base.
- Le forum ne reçoit pas la classe `kr-marge-mobile` : ses en-têtes portaient déjà 16 px et la marge de ligne les doublait (32 px). Seules les pièces collées au bord reçoivent la marge : pied, ligne « Par … », titres, formulaire de rédaction, messages.
- Restent sous 44 px, hors périmètre : boutons `.btn` (épopée 4), lien « clic » au fil du texte (exception H9.1), libellés de formulaire sans contrôle associé, liens d'auteur recouverts par la ligne touchable de l'index.
- Sous 360 px, le libellé « Message » de la rédaction est décalé par `text-indent` (texte à 16 px, boîte à 4 px). Le padding de la règle mobile y est verrouillé en `!important`.
- Suites sœurs : trois masques conditionnés à une base sans `kr-page-forum` (typographie-formes `nettoyage`, forum-index `hors-perimetre`, cartes-pastilles `forum`), à retirer quand leur commit de base dépassera 9.8. Un changement permanent : dans kramail-theme `lecture`, le message de forum de référence est mesuré sans la marge de page, faute de quoi la carte à 8 px du forum s'opposerait au kramail (point des messages ci-dessus).

## Ticket 8.5 — captures des notifications (2026-10-29)

Verdict d'Arnaud à sa passe finale. Captures hors dépôt dans `/Users/arnaud/kraland-css-captures/8.5/`, prises sur le bundle construit depuis 49d31df (worktree `wt/8.5`). Elles viennent des fixtures `cloche-notifications.html` (servie à `/accueil`) et `report-non-lu.html` (servie à `/report/perso-000000`), avec le vrai Bootstrap 3.3.7, sous réseau confiné et `window.open` remplacé par une sonde. Aucun clic, aucun accès au site réel ni au vrai `/report`. Font Awesome 5.6.3 (version du site) est servi depuis une copie locale dans /tmp, pour les captures seulement : sans lui, les fixtures n'affichent pas d'icônes. Le logo cassé (« Kraland ») vient de la fixture : l'image est bloquée par le confinement. Scripts jetables : `/Users/arnaud/kraland-css-captures/8.5/captures.mjs` (captures, sortie dans `journal.json`), `mesure.mjs` et `mesure2.mjs` (taille du sélecteur avec et sans peau, règle responsable, position des dates et du texte, bords, haut du bandeau à 375 et 900 px ; sortie dans `/Users/arnaud/kraland-css-captures/8.5/mesures.txt`). Les chemins du worktree `kraland-css-wt85` y sont écrits en dur. Captures, mesures et scripts copiés par l'orchestrateur dans `/Users/arnaud/kraland-css-captures/8.5/`, qui survit au redémarrage. Chaque PNG a été ouvert et contrôlé.

Captures (`<v>` vaut `kraland` pour Kraland clair, ou `empire-brun-dark` pour Empire Brun sombre) :

- `mobile-375-cloche-<v>.png` (375×667, ×2) : barre mobile, la cloche en premier à gauche (cible 44 × 44), sa pastille « 3 » en haut à droite de la cloche, puis l'enveloppe et le globe. Pastille de 16 px : rouge à texte blanc en clair, sable à texte foncé en sombre. `mobile-375-cloche-zoom-<v>.png` montre la barre seule. L'ouverture reste native sur mobile (Q17) : rien n'est montré au clic.
- `mobile-375-notifications-<v>.png` (375×667) : page des notifications. Le sélecteur de personnage est à 16 px du haut. Chaque ligne affiche la date au-dessus du texte (texte sur toute la largeur), avec un filet de 4 px sur la hauteur entière de chaque ligne non lue (rouge en clair, sable en sombre). `mobile-375-notifications-pleine-<v>.png` montre la page entière : ligne à cellule unique, paragraphe `.bg-info` hors tableau (règle générique) et pagination.
- `ordinateur-1280-cloche-<v>.png`, `ordinateur-1440-cloche-<v>.png`, `ordinateur-1920-cloche-<v>.png` (1280×720, 1440×900, 1920×1080, ×2) : page de jeu avec la barre complète. La cloche de `.navbar-right` porte sa pastille « 3 » et `elementFromPoint` la touche à chaque largeur. Les fichiers `ordinateur-<largeur>-cloche-zoom-<v>.png` cadrent la droite de la barre.
- `popup-900x800-notifications-<v>.png` (900×800) : rendu ordinateur de la page dans la taille du popup. Le sélecteur est à 16 px du haut et la colonne de date de 100 px est conservée. Les lignes non lues ont le filet de 4 px et la teinte à 14 % sur la cellule de date.

Défauts visuels constatés (à trancher, rien de corrigé ici) :

- **Sélecteur de personnage à 9,5 px sur ordinateur** (popup 900×800, et toute largeur ≥ 768). Ce n'est pas propre à `/report` : la règle globale `.form-control.form-control { font-size: .95rem }` (`kraland-theme.css` ~l.642) se calcule sur le `font-size: 10px` que Bootstrap 3 pose sur `html`. Elle vaut donc 9,5 px pour tout `input` et tout `select` `.form-control` sur ordinateur, contre 14 px sans la peau (mesuré sur la fixture, peau coupée). Le mobile n'est pas touché (16 px). Défaut antérieur à l'épopée, très visible dans le popup.
- Dates mal alignées dans le popup : sur une ligne non lue, la date commence à 12 px du bord (retrait voulu par 8.1, après le filet) ; sur une ligne lue, elle commence à 5 px. La colonne des dates est donc en dents de scie. Le texte (14 px) est aussi 1 px plus bas que la date (13 px).
- Mobile : la ligne qui porte un lien est plus haute (35 px de la date au texte, contre 24 ailleurs), à cause de la cible tactile générique des liens. C'est un écart connu depuis 8.1, qui relève de l'épopée 9.
- Popup et mobile : le tableau, les onglets, le paragraphe `.bg-info` et la pagination touchent le bord gauche de la fenêtre (0 px). La marge de 16 px n'est pas appliquée à `/report` ; elle relève de l'épopée 9.
- Onglets « Rapport » et « Combats » à 375 px : l'icône touche le libellé, sans espace (« ★Rapport »). À 900 px, l'espace existe.
- Cloche sur ordinateur : la pastille est collée au glyphe. À 1280 px, elle le chevauche de 2 à 3 px selon le moment de l'animation `kr-bell-swing`, qui fait pivoter la cloche (la capture en fige un moment). Sur mobile, la pastille couvre volontairement le coin haut droit de la cloche.
- Barre identique en Kraland clair et en Empire Brun sombre (gris `navbar-inverse`) : seule la pastille et le logo changent de couleur. Simple constat, la barre n'est pas dans le périmètre de l'épopée.

## Ticket 9.10 — Notifications mobiles : marge de 16 px et cibles de 44 px (2026-10-29)

- Structure de `/report` vérifiée seulement sur la fixture synthétique. La règle `body.mobile-mode > :is(p, .pagination)` suppose que le paragraphe et la pagination sont posés directement dans `body`, sans `.container`. À vérifier sur le site. Relevé du vrai /report tenté par l'orchestrateur le 2026-10-29 : cloche active (pastille « ! »), GET /report interdit, structure non vérifiée. Si aucun `p` réel, réduire la règle à `.pagination`.
- Bandeau du sélecteur : gardé à sa marge native de 10 px (boîte) et à 16 px du haut (8.3). Le texte du sélecteur est à 24 px des bords.
- La boîte de la pagination est déplacée à 16 px du bord (la première page commence à 16 px).
- Liens au fil du texte des lignes (56 × 44, venus de PHASE 5) : non touchés (exception H9.1).
- Fusion : conflit attendu avec 9.8 dans `tests/e2e/confort-mobile.mjs` (liste `PAGES`/`HORS`) et dans `tests/e2e/lib/router.mjs` (mots-clés de la marge).
- Aucun masque ajouté. `npm run test:all` reste à lancer une fois, machine calme, sur le SHA de fusion.

## Ticket 9.7 — cercle et barre de PV des cartes en jetons (2026-10-29)

- Niveau 5 en sombre (corrigé à la revue indépendante) : le mélange avec la couleur du texte le rendait plus pâle que le niveau 4. En sombre, il se mélange désormais au fond de surface (`color-mix(in srgb, var(--kr-danger) 75%, var(--kr-bg-surface))`) et reste plus sombre que le 4, comme en clair. Un test le vérifie dans les 16 variantes. Contraste minimal du cercle en sombre : 4,10:1. À vérifier à l'œil : distinction des niveaux 4 et 5.
- Le danger sert ici un état de santé, hors de la réserve « blocages » de H5.5.
- Le ticket demande un « contraste du texte du cercle ≥ 4,5:1 », mais le cercle n’a pas de texte. Seuil appliqué : 3:1, celui d’un élément graphique. Minimum en clair : cercle 4,70:1, barre 4,10:1. En sombre : ≥ 6,45:1.
- Piste du cercle : `rgba(0,0,0,0.1)` devient `--kr-border-default` (0,08 en clair), un peu plus pâle.
- Aucune fixture n'a de barre de PV. Le test en injecte une par carte. La structure native de la barre reste à vérifier sur une vraie carte.
- Le minifieur réécrit `grayscale(100%)` en `grayscale()`. Les deux sont équivalents.
- Comparaisons à la base : cartes-pastilles (groupes) retire les classes de PV des relevés, et typographie-formes (nettoyage) exclut `stroke` des cercles. Les deux tant que la base précède l'entrée (`AVANT_TICKET97`), à retirer au recalage de COMMIT_AVANT_53 et COMMIT_NETTOYAGE.
- Worktree : `node_modules` est un lien symbolique non suivi, à ne pas embarquer.

## Bug 15 — dates du popup des notifications (2026-10-29)

- Correctif : sur ordinateur (≥ 768 px), la date des lignes lues prend le même retrait de 12 px que celle des non lues. Mesure sur la fixture à 900×800 : avant, « lue 5, non lue 12 » ; après, 12 px partout. Filet, teinte, tailles et mobile inchangés.
- Décalage vertical de 1 px (texte 1 px plus bas que la date, lignes lues et non lues) : non corrigé. Il ne vient pas de la règle du retrait, mais des tailles de 8.1 (date à 13 px, texte à 14 px, même hauteur de ligne relative). Le corriger toucherait les tailles ou le haut des cellules. À trancher par Arnaud : laisser, ou ouvrir un ticket.
- Ligne à cellule unique : non lue, 12 px (règle de 8.1, inchangée) ; lue, retrait natif de 5 px, inchangé. Ce n'est pas la colonne des dates. À signaler si Arnaud veut aussi aligner ce texte.
- Masque ajouté dans `report-non-lu#confort` : l'abscisse des dates des lignes lues est retirée de la comparaison ordinateur à la base 8420e3a (ordonnée gardée). Il ne s'active que si la base ne contient pas le correctif ; à retirer au recalage de `COMMIT_AVANT_910`.
- Vérifié sur fixture synthétique seulement ; vrai `/report` non consulté.

## Ticket 7.4 — listes Réception, Envoi et Corbeille (construit, 2026-10-29)

- Non lu : seul l'état lu (`far fa-envelope-open`) a été relevé sur le site. Le module suppose qu'un message non lu porte `i.fa-envelope` sans `fa-envelope-open`. Les fixtures dérivées posent `fa fa-envelope` sur le 3e message. À vérifier sur un vrai kramail non lu.
- Mobile : la case à cocher prend la place du bouton → du sous-forum, dans une cellule de 44 × 44 à droite. Un toucher dans cette cellule, même hors de la case, la coche. La maquette la plaçait peut-être à gauche : à trancher.
- Mobile : les en-têtes de tri ne sont pas repris (thead masqué). Le « + » reste accessible par « ••• », cloné par MobileEnhancer.
- La ligne entière est touchable sur mobile seulement. Au bureau, le tableau natif reste, comme au sous-forum.
- Les icônes du message (important, répondu, lu) restent visibles en tête de titre sur mobile. Le sous-forum masque son icône de dossier ; ici, elles portent une information (important, répondu).
- Pas de préfixe « Dernier : » devant l'auteur : la cellule est l'expéditeur (ou les destinataires dans Envoi), pas un dernier message.
- « Afficher N lignes » est maintenant visible sur mobile, à 44 px, à côté de la recherche (comme au sous-forum). L'ancienne règle le masquait.
- Menu « ••• » de la liste sur mobile : sur la base, il s'ouvrait calé à droite du bouton et sortait de l'écran par la gauche (x = -122 px à 375 px). « Tout sélectionner » était donc injoignable. Il s'ouvre désormais sous le rang des boutons, calé à gauche du titre. La lecture garde l'ancien calage.
- Panneau de la liste au bureau : le `padding: 0` de `.panel-body` (règle kramail existante) est gardé. Il n'est pas aligné sur la carte du sous-forum : écart visuel possible, à voir.
- Comparaison « égal à la base » de kramail-redaction#regression : le tableau `#topics` des listes est retiré des deux rendus tant que le bundle « avant » ne contient pas `Kramail:Liste` (masque auto-retiré).
- kramail-theme#entete-menu : sur mobile, le clic extérieur de fermeture se fait sur le titre du panneau. En (5, 400), il tombait sur le lien étiré d'une ligne pleine largeur et ouvrait le message.
- Masques des comparaisons « égal à la base » (suites sœurs) : `#topics` et `#topics_wrapper` des listes retirés des deux rendus par `RETIRER_LISTE_TICKET74` (`tests/e2e/lib/variantes.mjs`), tant que la base de la suite ne contient pas `Kramail:Liste`. Concernés : cartes-pastilles (comparer : bureau, kramail), forum-activite#plus, confort-mobile#hors-perimetre, typographie-formes#echelle-forum (filtre MASQUE74) et #nettoyage. Garde par le chemin `/kramail/…` hors `/kramail/post/`, car la base 6270c81 ne pose pas encore `kr-page-kramail-liste`. Chaque masque porte son « retrait au recalage de COMMIT_* ».
- typographie-formes#nettoyage : le contrôle M1/M2 (bundle testé seul, 768 contre 769 px) garde `#topics` (option `garderListe`), sur une page à part pour la réception. Il n'est plus sauté.
- Contrôles réécrits, pas masqués (changement voulu, permanent) :
  - echelle-forum : l'expéditeur se lit sur `td:nth-child(3) > a.nomargin`, car la cellule est en `display: contents` sur mobile.
  - rayons : le cas « ligne » K8 de la réception est retiré, car les lignes sont à plat comme au sous-forum. La réception, dérivée en mémoire (DataTables, un message non lu), gagne les rôles communs du sous-forum : pastille P, recherche C4 et pagination C4 (mobile). Le nombre de pastilles n'est pas comparé à la base 5ff22d3, qui n'en pose pas (retrait au recalage de COMMIT_RAYONS).
  - espacement : les cas « liens » et « liens-marge » de la réception sont retirés. Les limiter à `.panel-body a:not(#topics a)` n'est pas faisable : dans la fixture, hors de `#topics`, le corps n'a aucun lien, et le contrôle échouerait sur « aucun élément ». La perte est définitive pour la réception. Les liens des lignes suivent la ligne du sous-forum (kramail-theme, fragment liste).
- Envoi, question pour Arnaud : dans l'Envoi, une enveloppe fermée veut sans doute dire « pas encore lu par le destinataire », pas « non lu par moi ». Décision provisoire du coordinateur : le signal « non lu » (classe, pastille, filet) est limité à la Réception et à la Corbeille. L'Envoi est reconnu au chemin `…-1`. Relevé en lecture seule sur le site réel le 2026-10-29 : Réception `kramail/<perso>-<id>-0`, Envoi `…-1`, Corbeille `…-2`, et la ligne de l'Envoi porte `fa fa-envelope` (enveloppe fermée). Faut-il un signal distinct dans l'Envoi (par exemple « NON LU PAR LE DESTINATAIRE »), ou aucun ?
- Mobile : quand le menu de personnage est ouvert, toucher une ligne pour le fermer ouvre aussi le message, car le lien étiré couvre toute la ligne. À trancher : faut-il absorber ce premier toucher ?
- Le toucher dans la cellule de case ne coche la case que sur mobile (`body.mobile-mode` lu au moment du clic). Au bureau, le tableau natif reste inchangé.

## Bug 14 — champs à 9,5 px sur ordinateur (2026-10-29)

- Textarea : décision prise (orchestrateur, 2026-10-29, « retrait 6 × 12 natif ») : la règle `:where(textarea)` est supprimée. Le textarea prend le 6 × 12 natif : son texte est aligné à 12 px, comme le select voisin (forum-nouveau-sujet, 1280 px ; il était décalé de 4 px). Taille inchangée (`textarea.form-control.form-control`).
- Masques ajoutés (écart voulu, base corrigée par `CORRIGER_BUG14` de `tests/e2e/lib/variantes.mjs`, sans effet sur une base qui contient déjà le correctif) : `typographie-formes.mjs` (bases `avantEchelle`, `avantEchelleForum`, `avantEspacement`, `avantNettoyage`, `avantMedias410`) et `forum-activite.mjs` (`baseFil`). Retrait au recalage des COMMIT_* au-delà du bug 14.
- `kramail-redaction#regression` (capture pleine page « lecture 375 px », 30 pixels, écart max de 2 par canal) : échec sous charge (load ~40), vert relancé seul. Flake présumé, non lié (mobile inchangé).
- Non couverts par les fixtures, à voir lors de la passe manuelle : la recherche DataTables (`.input-sm`, 12 px natif) et le select de la modale d'ordre sur ordinateur.
- Le ticket cite la base 2bdc8e1 ; base réellement mesurée et notée dans le plan : 5638f29.
- `npm run test:all` reste à lancer une fois, machine calme, sur le SHA de fusion.

## Ticket 7.5 — rédaction du kramail sur le formulaire de réponse du forum (construit, 2026-10-29)

- Signaler (`-8-`) est reclassé en rédaction (`kr-page-kramail-compose`) : Destinataires y est actif, et le débordement horizontal à 375 px (scrollWidth 390) disparaît. À vérifier sur un vrai Signaler.
- Signaler sur mobile : la page perd le fil « Kramail › Personnage › Répondre » de la lecture, au profit du h1 simple des rédactions.
- Kramail:Lecture : la garde « formulaire post_msg » est supprimée. Elle était morte : une page avec ce formulaire est une rédaction, jamais une lecture.
- Bureau : la carte du formulaire, les libellés en majuscules et la barre de 18 outils à 24 px sont retirés. La barre et les menus BBCode sont natifs, comme au forum. Dans les fixtures, Font Awesome est vide : les boutons natifs y mesurent 12 × 4 px, sans valeur visuelle. Voir le rendu réel.
- Libellé « Destinataires » au bureau : 14 px natifs en casse normale, comme les autres libellés (`.kd-label` sans taille). La marge droite `clamp(…, calc(16.6667% - 103px), …)` garde son calibrage sur l'ancien mot : le test `libelle` vérifie qu'il tient dans sa colonne.
- Libellé « Destinataires » sur mobile (correctif de revue) : il passait en 14 px, majuscules, `--kr-text`, par la règle mobile générale `.form-group label`. Il prend la typographie des libellés de l'éditeur V3 : `--kr-font-detail` (13 px), graisse 600, casse normale, sans espacement, `--kr-text-secondary`. kramail-theme#redaction compare désormais cette typographie à celle du libellé Expéditeur du forum, à chaque largeur.
- Mobile : la barre est celle du forum (5 outils et « Plus »). Les menus Smileys et Couleurs perdent leur feuille fixe : ils s'ouvrent dans le flux, comme au forum (menu Smileys de 946 px de haut, à faire défiler). La barre « Envoyer » fixe du kramail peut recouvrir le bas d'un menu ouvert. À voir avec l'entrée 7.
- Réserve basse : `padding-bottom: 64px` du formulaire reste propre au forum (frontière de l'entrée 7, relevée par la revue). Le `scroll-margin-bottom: 72px` des champs est étendu au kramail, car la barre « Envoyer » fixe y existe aussi. kramail-theme#redaction-defilement le vérifie à 375 px. Sur la base, le bas de la zone de texte et de la dernière case tombait sous « Envoyer ». À reprendre par l'entrée 7 si « Envoyer » quitte la barre fixe.
- « Envoyer » (bureau, barre fixe mobile) n'est pas touché : entrée 7.
- Focus clavier (correctif de revue) : sur mobile, la règle globale `.btn-toolbar .btn:focus-visible { outline: none }` masquait l'anneau, au kramail comme au forum. Une règle commune `form.kr-editor .btn-toolbar .btn:focus-visible` pose `2px solid var(--kr-highlight)`, décalé de 2 px. Le forum change donc aussi, volontairement. Le ticket 3.7 « focus clavier » a été abandonné, et le thème n'a pas de jeton de focus unique. Le choix suit le motif le plus courant de la feuille (navigation, PLT-12) : à confirmer. Les outils ont une transition `all` de 0,15 s : l'anneau apparaît en fondu.
- Sujet sur mobile : 44/0/12/16 (valeurs de l'Expéditeur du forum) au lieu de 44/12/12/16 sur la base.
- Bug 14 : aucune règle de taille ni de retrait de champ n'est écrite au bureau. L'éditeur n'en a pas eu besoin.
- La marge de page est posée sur le seul formulaire `post_msg`, pas sur la page entière (le kramail ne pose pas `kr-marge-mobile`).
- Masques des comparaisons « égal à la base », conditionnés à `AVANT_TICKET75`. Le marqueur est le sélecteur `:scope > .col-sm-10 > .input-group` du module Messages:V3, propre à l'entrée et stable à la minification. `RETIRER_REDACTION_TICKET75` ne retire plus que les lignes Sujet, Expéditeur, Message (barre comprise) et options. La ligne Destinataires et « Envoyer » restent comparés à la base. Les changements voulus de l'entrée sont posés à l'identique dans les deux rendus : cadre du formulaire, marge basse de la ligne Destinataires, typographie de son libellé, réserve de défilement. Suites concernées : typographie-formes (boutons, echelle-forum, rayons, espacement, nettoyage) et cartes-pastilles#etiquettes (règles `:focus` de l'ancienne barre). Chacun porte son « retrait au recalage de COMMIT_* ».
- Après fusion du bug 14 : typographie-formes#champs compare les champs du kramail sur mobile à 5638f29. Sujet, Expéditeur et Message (`input[c[1]]`, `select[c[2]]`, `textarea[message]`) sont masqués sous `AVANT_TICKET75`, au kramail et sur mobile seulement, avec retrait au recalage de COMMIT_CHAMPS.
- Astérisque des champs obligatoires : sa couleur d'accent était partie avec les anciens libellés. Elle est rétablie par une règle universelle sur la page de rédaction, Destinataires compris.

## Ticket 7.6 — palette privée --kd-* retirée au profit des jetons de rôle (construit, 2026-10-29)

- Décidé (coordinateur, après revue indépendante) : filet du doublon et contour de la croix ciblée en `--kr-text-primary`, fonds inchangés. Ils passent le 3:1 dans les 16 variantes (la revue annonce 5,11 à 7,31:1). Constat d'origine : sous 3:1 dès la base, dans 4 variantes sombres : Kraland 2,68:1, Paladium 2,43:1, Khanat 2,84:1 et Ruthvénie 2,72:1. l'accent était posé sur la teinte appuyée du même accent (`--kr-accent-tint-strong`, 32 %). L'exception `HERITES_CONTRASTE` du test est supprimée. À voir en vrai : le filet du doublon devient blanc cassé en sombre, sombre en clair.
- Filets de repos (champ, Contacts, panneau, pastille, pied) : hors du 3:1 (décision B6), comme les champs natifs du formulaire.
- Empire Brun clair : filets, contours de focus, icônes et soulignement d'accent passent de l'or `#C69100` (2,82:1 sur blanc) au brun `#8a5a00`. Le titre de section `.kd-sec` passe à `--kr-text-accent` dans les 16 variantes (avant : mélange privé à 65 %). À voir en vrai.
- Champ invalide et envoi bloqué : filet `#dc3545` → `--kr-danger` (`#c62828` en clair, `#ff8a80` en sombre). En sombre, l'ancien rouge tombait à 2,5–2,9:1. Le jeton `--kr-badge-danger` est retiré : la ligne « gardé, nom et valeur » plus haut (épopée 3) est caduque.
- Lueurs du focus (30 %) et du doublon (55 %), survol d'option (10 %) : restent sur `--kr-highlight`. Seuls les mélanges lus par deux règles ou plus deviennent des jetons de `:root`.
- Polices : passent au jeton les tailles exactes 13, 14 et 15 px, icônes comprises (croix et icône d'option mobiles en `--kr-font-detail`, icône Contacts mobile en `--kr-font-button`). Restent en dur : 11 et 12 px (12 px a deux jetons, rôle ambigu) et la saisie mobile à 16 px (anti-zoom iOS).
- Implémenté directement par l'agent de build, sans sous-agent d'implémentation. La revue « quick » a été faite par un relecteur indépendant.

## Ticket 7.8 — page Contacts en carte de section, boutons standard ou primaire (construit, 2026-10-29)

- « Pas un contact » (report 3.5, orange) : introuvable dans le relevé, les fixtures et la structure de /contacts. Rien n'est changé : à localiser (fiche d'un membre ?) dans un ticket à part.
- Boutons de catégorie : les couleurs d'état (danger, warning, info, success) disparaissent. Sans elles, les 5 icônes `fa-user` seraient identiques. Elles reçoivent donc un libellé visible, tiré du chemin : « Toutes », « n°1 » à « n°4 ». Le 6e bouton garde son texte natif « Catégories ». Les vrais noms de catégorie ne sont pas relevés (le `title` natif dit « Catégorie n°N »). À voir en vrai : libellés ou noms ?
- Catégorie courante en `btn-primary` : chemin exact, sinon « Toutes » quand le chemin n'a pas de suffixe `/N`.
- Fil mobile « Contacts › <texte du h1> » : le texte réel du h1 n'est pas relevé (« … »). La fixture suppose un nom de personnage. Le premier élément du fil reprend le libellé actif de la liste latérale (« Contacts »).
- Le relevé annonce 5 colonnes à l'en-tête (`th.sorting_asc ; th.sorting ×4` + case) ; la fixture suit ce compte. Si le site en a 6, rien ne casse : le tableau défile.
- Mobile : le tableau natif (case, nom, catégorie, actions, retrait) défile horizontalement dans la carte, sans réagencement en lignes du sous-forum. Boutons de ligne portés à 44 px de large. À voir en vrai : faut-il une ligne mobile dédiée ? Sur mobile, les deux boutons de la colonne Actions s'empilent : chaque ligne fait environ 120 px de haut. Aucun changement de code pour l'instant.
- Choix après revue : le bouton « Changer de catégorie » d'une ligne (`span[id^="ajax-t"] > a.btn`) garde sa classe d'état native, car elle dit la catégorie du contact. Il est exclu du retrait des couleurs d'état ; une ligne déjà catégorisée garde sa couleur. Les autres boutons de ligne et ceux de l'en-tête passent en standard.
- `contacts-couleurs` est déjà vert sur la base f48a01f : c'est une garde du contraste, pas une preuve rouge/vert.
- Implémenté directement par l'agent de build, sans sous-agent d'implémentation (route full calculée, consigne « quick »). La revue « quick » est faite par un relecteur indépendant.
- `kramail-theme#redaction-palette` est instable dès la base f48a01f. On observe 2 FAIL « croix-focus absent », sur une variante différente à chaque exécution. Le défaut ne vient pas de ce ticket, mais un `test:all` peut tomber dessus.

## Ticket 7.7 — « Envoyer » dans le flux sous le champ, au forum comme au kramail (construit, 2026-10-29)

- C1 : la règle « Envoyer » dans le flux vise désormais tout formulaire `post_msg` du forum et de la rédaction du kramail, avec ou sans barre d'outils (`.kr-editor` n'est plus requis). Un formulaire du forum sans barre d'outils perd sa barre fixe : à voir en vrai.
- C2 : sur mobile, le texte d'« Envoyer » passe de 16 px à `--kr-font-button` (14 px, DESIGN.md › send-button), au forum aussi. À trancher si 16 px était voulu. Le poids 600 et l'absence de bordure, que le forum tenait de l'ancienne barre fixe, sont gardés dans la règle commune.
- Masques des comparaisons « égal à la base », conditionnés à `AVANT_TICKET77` (lib/variantes.mjs) : typographie-formes (boutons : « Envoyer » mobile ; echelle-forum : « Envoyer » mobile ; nettoyage et sa bascule : ligne d'« Envoyer » vidée, réserves neutralisées, `RETIRER_ENVOYER_TICKET77`) et forum-activite#fil (même retrait). Chacun porte son « retrait au recalage de COMMIT_* ».
- C3 : au bureau, « Envoyer » du kramail perd sa forme propre (180 px, poids 600, ombre, filet de 1 px et retrait de 16 px au-dessus) et reprend le bouton primaire natif du forum, aligné à droite.
- C4 : les menus en feuille de la modale d'ordre (`.bootbox`, `inset: auto 8px 60px`) relèvent de son pied collant. Ils ne sont pas touchés.
- Pied de page et « Remonter en haut » : le pied de page n'est plus remis dans le flux sur les pages de rédaction ; il reprend la règle mobile commune (collant, z-index 1000). « Remonter en haut » passe de 64 px à 20 px au kramail, comme au forum. Il reste la colonne de droite (marge de 52 px d'« Envoyer »). À voir en vrai, en bas de page.
- `scroll-margin-bottom: 72px` (champs du forum et du kramail) est retiré avec la barre : un champ amené par le défilement peut toucher le bas de l'écran.
- z-index 991 du backlog 12 : inchangé, seul son commentaire change.

## Ticket 7.10 — Refactor sweep de l'épopée 7 (in-review, 2026-10-29)

- Base commune `d64c578` (feature/next après 7.1 à 7.8) : `kramail-theme`, `confort-mobile`, `cartes-pastilles`, `forum-activite` (`COMMIT_FIL`, `COMMIT_PLUS`), `typographie-formes` (boutons, echelle, echelle-forum, rayons, espacement, nettoyage) et `kramail-redaction` (A9). Elle contient aussi bug 14, bug 15, 8.4, 8.5 et des entrées 9.x : les masques de ces tickets deviennent inertes, gardés pour le sweep 9.12.
- Nettoyage (typographie-formes) : les exclusions à 768 px de la réception (7.3) et de la rédaction (7.5) sont désormais conditionnées sur la base dédiée `COMMIT_MEDIAS_410` (00b0786), pas sur la base du nettoyage. Sans cela, 6 FAIL sur `d64c578`. À confirmer : ces exclusions tomberont au recalage de `COMMIT_MEDIAS_410`.
- `nameControls` du forum laissé à part (sélecteurs différents), voir deferred-work.
- Rendu inchangé : aucun changement visible attendu.


## Rétro épopée 8 — notifications (2026-10-29)

- Rétro : `epic-notifications/epic-notifications-retrospective.md`, verdict **accepted-with-open-items** (critères déclarés). Les validations hitl de 8.2 et 8.5 attendent ta passe finale, comme tu l'as décidé : ce n'est pas un écart.
- Les captures de 8.5 datent de 49d31df, avant 9.10, le bug 14 et le bug 15. Elles montrent trois défauts corrigés depuis : à reprendre sur `HEAD` avant ta passe (A1).
- Le `test:all` vert qui contient l'épopée (18074 ok, sweep 7.10) n'est consigné que dans `/tmp`, sans SHA nommé (A2).
- À trancher par toi : Firefox (procédure de console, section 8.2) ; options du popup recopiées de `main.js` ou relues au clic ; bug 15, décalage de 1 px et ligne à cellule unique lue ; fenêtres sans barre (`help.php?p=prev`, `/help`).

## Ticket 7.9 — vrai téléphone et captures de validation (partie agent, in-review, 2026-10-29)

Ta décision : émulation par l'agent maintenant, ta passe sur vrai téléphone à la fin de tous les tickets. La partie hitl reste ouverte. Bundle de d8c8777, inchangé à 5d42ab5. Fixtures seulement, réseau confiné, aucun site réel.

### Points D et E en émulation

Le résultat complet et les limites sont dans `epic-modale-ordre/protocole-p2-vrai-telephone.md`, section 4. En bref : 32 cas sur 36 conformes. « Envoyer » est atteignable et ne couvre pas le texte saisi, au forum comme au kramail. Aucun envoi. La contre-épreuve sur f48a01f (avant 7.7) retrouve ton constat E : la barre fixe de 56 px couvre le texte.

**Écart E1 (7.9) : « Remonter en haut » couvre le bord droit du texte saisi, clavier ouvert.**

- Où : rédaction du kramail, mobile, quand la page a défilé de plus de 400 px. C'est le cas d'une réponse avec citation (Répondre) ou d'un long message. La fixture du forum n'a pas ce bouton : non mesuré au forum.
- Mesures, 375 px, viewport réduit à 350 px : bouton fixe de 36×44 px en x 331–367, y 271–315 (`right: 8px`, `bottom: 20px`, règle de 7.7). Le contenu du champ va jusqu'à x 346 : 15 px de chevauchement sur 44 px de haut, soit la fin d'environ 2 lignes. Le curseur est justement en bas de la zone visible quand on tape. Constaté dans les deux variantes, aux densités 2 et 3.
- Déduit de la même géométrie, non mesuré : sans clavier, une ligne de texte posée dans la bande des 35 à 79 px du bas de l'écran est aussi couverte. Le clavier rend juste ce cas fréquent.
- Avec un clavier qui ne réduit que le viewport visuel (mode `visuel`), le bouton reste sous le clavier : rien n'est couvert.
- 7.7 avait réservé sa colonne pour « Envoyer » (marge de 52 px), pas pour le champ. Aucun code n'est corrigé. À trancher : ouvrir un bogue (masquer le bouton pendant la saisie, ou réserver la colonne au champ) ou accepter.
- Recommandation de l'orchestrateur, appliquée (2026-10-29) : bogue `backlog/` 16 ouvert, piste « masquer le bouton pendant la saisie, mobile seulement ». Tu peux le refuser à ta passe finale.

Observation sans écart : la barre de navigation fixe de 60 px reste visible clavier ouvert. Elle prend 60 px sur les 350 visibles.

### Captures de validation (A8 de la rétro 6)

- Dossier : `/Users/arnaud/kraland-css-captures/7.9/`, nommées `page_largeur_variante.png`. Pages : `kramail-reception` face à `forum-sous-forum` (Débuter), `kramail-lecture` face à `forum-sujet`, `kramail-nouveau` face à `forum-reponse`, `kramail-contacts`. Largeurs : 1280, 1440, 1920 (densité 1) et 375×667 (mobile, densité 2). Variantes : `kraland-clair`, `empire-brun-sombre`. Page entière.
- Planches côte à côte, kramail à gauche, forum à droite : `/Users/arnaud/kraland-css-captures/7.9/planches/planche_<largeur>_<variante>.png` (8 planches ; Contacts face au sous-forum).
- Font Awesome 5.6.3 servi en local (copie du 8.5) ; pas d'images du site (logo, avatars), polices du Mac.
- À regarder : même en-tête de page, même carte de section et mêmes boutons entre la réception et le sous-forum ; même message entre la lecture et le sujet ; même formulaire et même « Envoyer » entre la rédaction et la réponse ; Contacts en carte de section, sur mobile en particulier (tableau qui défile, lignes d'environ 120 px, voir 7.8). Sur ordinateur, à 1440 par exemple, un petit carré vide apparaît en haut à droite de la carte « Boîte de réception » (icône de repli ?) : à vérifier en vrai.

### Captures des notifications reprises (8.5, A1 de la rétro 8)

- Dossier : `/Users/arnaud/kraland-css-captures/7.9/notifications/`, 22 PNG. Même script et mêmes noms que 8.5 (`/Users/arnaud/kraland-css-captures/8.5/`), relancé sur le bundle actuel. Mesures dans `mesures.txt`, journal des requêtes dans `journal.json` : seuls les logos `img7.kraland.org` sont refusés, le seul `/report` touché est la fixture.
- Trois défauts de 8.5 ne sont plus là : sélecteur de personnage à 14 px dans le popup (9,5 px avant) ; dates du popup alignées à 12 px (5 et 12 px en dents de scie avant) ; dates mobiles à 16 px du bord (12 avant).
- Restent à regarder sur les images : l'icône collée au libellé des onglets à 375 px, et la pastille collée à la cloche sur ordinateur. Les mesures ne couvrent pas ces deux points.
- Les captures de `/Users/arnaud/kraland-css-captures/8.5/` sont périmées (49d31df) : regarde celles-ci.

## Bug 16 — « Remonter en haut » sur le texte saisi, mobile (in-review, 2026-10-29)

Correctif : sur mobile, le bouton est masqué tant que la zone de texte du message (`form[name="post_msg"] textarea[name="message"]`) a le focus, en CSS seul (même masquage que le bouton en haut de page). Hors focus et sur ordinateur, rien ne change. Test : fragment `remonter` de `kramail-theme.mjs`.

Doutes, à trancher à ta passe finale :
- Le bouton disparaît dès que tu touches le champ, même quand il ne le recouvre pas. Pour remonter en haut pendant la rédaction, il faut d'abord quitter le champ (toucher ailleurs ou fermer le clavier). L'autre piste, réserver la colonne à droite du champ, coûtait 52 px de largeur de saisie.
- Critère 2, « touchable (≥ 44 px) » : le bouton mesure 36 px de large et 44 px de haut, comme à la base. Le test vérifie ces deux valeurs, sans élargir le bouton : l'élargir changerait sa place, que le critère demande de garder.
- La fixture de la réponse du forum n'a pas le bouton. Le test lui ajoute le lien natif du kramail, ainsi que 400 px de contenu au-dessus du formulaire et 900 px au-dessous, pour que la page défile de plus de 400 px. La fixture elle-même n'est pas modifiée. Je n'ai pas vérifié la vraie page de réponse du forum.
- Le clavier qui ne réduit que le viewport visuel (mode `visuel` de 7.9) n'est pas mesuré : en 7.9, le bouton y restait sous le clavier.

## Ticket 9.9 — Kramail mobile : marge de 16 px et cibles de 44 px (in-review, 2026-10-29)

- Hors périmètre, laissés tels quels : croix des destinataires `kd-chip-x` (34 × 32) et bouton Contacts `kd-contacts` (40 px), ce sont des `<button>` (épopée 4).
- Nom de l'auteur dans la liste : couvert par la ligne touchable, comme au forum (9.8, D6).
- Libellés « Sujet » et « Expéditeur » sous 44 px : libellés de champ, non contrôlés comme cibles.
- Le message lu devient une carte à 8 px des bords, comme au forum. D3 de 9.8 est levé : le fragment `lecture` de `kramail-theme` ne neutralise plus la marge du forum de référence.
- `confort-mobile#hors-perimetre` : la Réception entre dans le périmètre ; elle est remplacée par l'index Staff.
- Chevron de repli : boîte de 44 × 44, glyphe calé à droite, au même endroit que dans la base (21 px du bord de la carte).
- `typographie-formes` : deux écarts de mesure, tous deux avec « retrait au recalage de COMMIT_* ». `SANS_MARGE_PAGE` rend la marge au formulaire de rédaction (rendu réel inchangé : 4 px). `MASQUE_KRAMAIL_99` neutralise le chevron de la réception dans `nettoyage`, seulement contre une base sans la règle.
- `kramail-redaction` `regression` : `MASQUE_KRAMAIL_99` neutralise des deux côtés pied, carte du message lu, chevron et destinataires, seulement contre une base sans la règle ; « retrait au recalage de BASE_SHA ».
- **Tranché** (orchestrateur, mandat d'Arnaud) : le clic perdu sur « Envoyer » à 320 px (Répondre, Répondre à tous, Transférer, panneau des suggestions ouvert) est corrigé dans l'entrée. Le panneau se refermait au `mousedown` et la page remontait sous le doigt ; il se referme désormais au `click` hors du champ (template). Rouge avant, vert après.
- Revue indépendante « OK avec correctifs », appliqués :
  - La fermeture au clic extérieur est testée dans `redaction-dest` (clic sur le `h1` à 1280 px, tap à 320 px). Le test est rouge sans l'écouteur.
  - Un glissé de sélection parti du champ laisse le panneau ouvert, comme à la base : la fermeture exige un appui et un click hors du champ.
  - `confort` vérifie l'absence de `kr-marge-mobile` et compare l'ordinateur à 769 px.
  - Le masque de `typographie-formes` est renommé `SANS_MARGE_PAGE_99`.
- A9 : aucun chevron hors `.panel-default` sur les fixtures kramail et Contacts. À relever sur le site réel à la passe finale.
- Points 6 (`rogne` à largeur nulle) et 7 de la revue laissés de côté par l'orchestrateur.
- Conflits de fusion probables avec 9.8 et 9.10 : `confort-mobile.mjs`, `lib/router.mjs`, `router.test.mjs`, bloc mobile de `kraland-theme.css` après le FORUM.
- `test:all` reste à lancer (interdit à l'implémenteur).

## Ticket 9.11 — Parcours clés et captures de validation (in-review, 2026-10-29)

Captures sur fixtures, bundle de 7bec452, Kraland clair et Empire Brun sombre : `/Users/arnaud/kraland-css-captures/9.11/` (168 PNG, noms `page_largeur_variante[_etat].png`), planches dans `planches/`, scripts et journaux dans `travail/` (`parcours.txt` : mesures étape par étape).

À regarder à ta passe finale :
- Planches `parcours-1_375`, `parcours-1_1280`, `parcours-2_1280`, `parcours-2_375`, `parcours-3_375`, `parcours-4_375` : chaque étape des quatre parcours d'EXPERIENCE.md.
- `mini-profil` : plateau plié et déplié à 375 et 700 px.
- `cartes-personnages` : cartes à 1100, 1280 et 1500 px.
- `forum-epopees-5-6_1280` et `_375` : racine, index HRP, Débats, Communauté, sous-forum, sujet Communauté (rétro 5 A10, rétro 6 A8) ; index RP, sujet et réponse sont aussi aux quatre largeurs.
- Modale Dormir : `plateau-ordre_*_modale-dormir.png`, et `_modale-dormir-defilee` en 375 (avertissement resté en haut).
- Kramail contre forum : non refait, voir `/Users/arnaud/kraland-css-captures/7.9/`. Ces captures précèdent 9.9 : la marge mobile du kramail y est l'ancienne.

Parcours en émulation (375×667 tactile et 1280×720) : les quatre vont au bout, sans envoi ni requête `/report` ; aucun débordement horizontal. Écarts proposés en report, accord d'Arnaud attendu à la passe finale :
- D9.2 : barre d'onglets mobile, libellés longs plus larges que leur case de 75 px (case `flex: 1 1 0` de 75 px, libellé `nowrap` avec 32 px de padding). Personnage 96, Bâtiments 86, Employés 85 débordent sur toutes les pages, actifs ou non ; cibles chevauchées au bord droit ; barre de 385 px pour 375, qui défile de 10 px sur la page personnage et coupe Agir. Visible sur `perso_375_*.png`.
- D9.3 : première case des accès rapides plus haute de 8 px (52 contre 44), à cause de la marge `.btn + .btn` de 8 px (`kraland-theme.css` l.4895) qui bat celle de la grille ; pas lié à l'état actif. Sans gras ni filet en mobile : voulu. Visible sur `plateau_375_*.png`. Ces boutons s'affichent-ils sur le vrai plateau mobile ?
- D9.4 : /accueil absent de `KR_PAGE_CLASSES` (pas de `kr-marge-mobile`), texte à 0 px ; hors périmètre de l'épopée, à relever sur le vrai site.
- D9.5 : bouton Contacts de la rédaction du kramail (`kd-contacts`) à 105×40, sous 44 px ; écart connu, hors périmètre de 9.9 (épopée 4).

Limites :
- Le personnage des fixtures s'appelle « Joueur » ou « Perso d'Essai », pas « Nerys ».
- Les étapes sont enchaînées par fixtures (une page servie par lien suivi), pas par le vrai jeu ; l'enveloppe de P3 vient de la fixture de /accueil, `jeu-materiel` n'en ayant pas.
- Aucun vrai téléphone, aucun clavier virtuel : c'est l'objet de ta passe manuelle.
- Bloc de la croix à 12 px des bords (cibles, pas texte) : non reporté, à juger à l'œil.

## Rétro épopée 7 — kramail, même thème que le forum (2026-10-29)

- Rétro : `epic-kramail-mobile/epic-kramail-mobile-retrospective.md`. Verdict machine **rejected**, forcé par 7.9 resté `in-review` : la partie hitl attend ta passe finale, comme tu l'as décidé. Sur les preuves, le verdict serait **accepted-with-open-items**. Révision à ta main (A1).
- Le `test:all` vert qui contient l'épopée (18074 ok, `/private/tmp/kr-testall-710b.log`) est attribué à `d8c8777` d'après l'heure seulement. Les lignes de clôture des plans le disent.
- Six `test:all` de fusion sur dix étaient rouges (journaux 71, 73, 74, 75b, 76, 710). Ceux de 73, 74, 75b et 76 n'ont aucune attribution écrite ; la fusion de 7.5 (`0b27dc2`) a suivi de 2 minutes le rouge de 75b. Je les lis comme des faux FAIL de charge, sans preuve (A2).
- `kramail-redaction#regression`, « lecture 375 px » (capture pleine page octet pour octet) : rouge au `test:all` 76 et à mon `test:zone -- kramail` sous charge, vert au rejeu à concurrence 6 (1622 ok). Cas à surveiller.
- Ligne de clôture de 7.9 adaptée : partie agent commitée (6788cbf), sans fusion ni revue indépendante, hitl ouvert.
- Lignes de clôture « revue indépendante faite » des neuf autres plans : reprises de leurs Review Triage Logs et sections de revue, sans relecture des rapports de revue eux-mêmes.
- J'ai écrit les lignes de clôture dans les plans, ce que le workflow de rétro interdit d'ordinaire : c'était la demande explicite de l'orchestrateur. Les Result périmés (7.1, 7.4, 7.10) et l'historique de 7.3 ne sont pas réécrits.
- 1920 px : aucun test du kramail à cette largeur, seulement les captures de 7.9.
- Contacts sur mobile : tableau qui défile dans la carte (lignes d'environ 120 px), pas les lignes du sous-forum. Une ligne dédiée, ou tel quel ?
- Done when 2 : « lecture d'un fil » est sans objet (le kramail n'affiche jamais de fil, relevé de 7.2). Retirer les mots « et d'un fil » (A5) ?
- Signaler (rédaction depuis 7.5) et non-lu sur `i.fa-envelope` : jamais vus sur le site réel (A3).
- Captures de 7.9 antérieures à 9.9 et au bug 16 : à reprendre sur `HEAD` avant ta passe.
## Ticket 9.12 — Refactor sweep de l'épopée 9 (in-review, 2026-10-29)

- Implémentation faite directement par l'agent de l'entrée, sans sous-agent ; revue rapide (quick) faite par ce même agent : une revue indépendante reste à faire.
- CSS retiré ou fusionné : C1 à C6 du plan. Le comparateur jetable (styles calculés hors `--*` et boîtes de chaque élément, 492 cas) ne trouve aucun écart contre 7bec452. Compte de `!important` : 2943 (2946 avant).
- CSS écarté :
  - grille d'actions et `.dashboard-section-header` 12 px, en double entre ≥ 768 et ≤ 767 : la fusion rendrait la règle globale, contraire à la convention des media ;
  - `--kr-font-page-title` et `--kr-space-5/6` : jetons de l'échelle de DESIGN.md, gardés même s'ils ne sont pas lus ;
  - paddings `.col-sm-*` : encore vivants hors `mobile-mode` ;
  - nettoyage `.panel-info` du template (~l.9361) : il faut vérifier sur le site réel si le site pose ces styles lui-même.
- Bases recalées sur 7bec452, avec leurs masques retirés. Les huit premières suites ci-dessous ont toutes leurs bases recalées ; `plateau-qualite-usage` et `typographie-formes` gardent en plus des bases de preuve, listées au point suivant.
  - `report-non-lu` ;
  - `confort-mobile` (`COMMIT_AVANT_13` fusionné dans `COMMIT_AVANT`, `sansTitre` retiré) ;
  - `forum-index` ;
  - `kramail-redaction` ;
  - `kramail-theme` (`BASE_SHA`, `COMMIT_AVANT_99`) ;
  - `palette-nation` (`BASELINE4`) ;
  - `forum-activite` (sept bases) ;
  - `cartes-pastilles` (`COMMIT_AVANT_53/54/55` fusionnés dans `COMMIT_AVANT`) ;
  - `plateau-qualite-usage` (base des cartes) ;
  - `typographie-formes` (`COMMIT_BOUTONS`, `COMMIT_ECHELLE`, `COMMIT_ECHELLE_FORUM`, `COMMIT_RAYONS`, `COMMIT_ESPACEMENT`, `COMMIT_NETTOYAGE`, `COMMIT_CHAMPS`).
- Bases gardées, parce que ce sont des preuves d'avant un ticket (écarts attendus ou contrôle « le rendu change ») et non des bases d'égalité :
  - `kramail-theme` `PALETTE_BASE_SHA` 0b27dc2 (`ECARTS_PALETTE`, 7.6) ;
  - `palette-nation` `BASELINE5` d521cc8 et `BASELINE13` 7e69719 ;
  - `plateau-qualite-usage` base pv cb73530 (lit les anciennes couleurs en ligne) ;
  - `typographie-formes` : `COMMIT_AVANT` d68ab55, `COMMIT_MODALES` 8631c45, `COMMIT_COMPACT` 3b1da55, `COMMIT_TICKET6` 1590761, `COMMIT_TITRE_FORUM` 2db3b4c et `COMMIT_MEDIAS_410` 00b0786.
- **Doute** : le brief demandait de recaler `COMMIT_MEDIAS_410`. Je l'ai gardé, parce qu'il porte la précondition `AVANT_TICKET410`, le contrôle « rendu à 768 px changé » et A8, qui lit les blocs `(width>=769px)` de la base. Pour le recaler, il faut remplacer ces trois contrôles par un contrôle absolu des propriétés de M1 et M2 à 768 px ; c'est un autre ticket.
- Masques gardés, parce qu'ils sont encore actifs contre leur base :
  - `CORRIGER_BUG14` sur `COMMIT_MEDIAS_410` ;
  - `LEGENDES_TICKET45` et `CIBLES_TICKET95` sur `COMMIT_MODALES` (modale-ordre, modale-bbcode : 4 lignes « info écart » au journal) ;
  - `CARTES_TICKET54/55` sur `COMMIT_AVANT` d68ab55 ;
  - `AVANT_TICKET73/75` sur `COMMIT_MEDIAS_410` ;
  - `sansPalette13` et `C13.sousArbres` (backlog 13, à part par conception).
- Préconditions retirées avec le recalage :
  - `AVANT_TICKET55(avant55)` vrai (`cartes-pastilles`) ;
  - `AVANT_BUG14(avantChamps)` vrai (`typographie-formes#champs`), réduit au contrôle absolu `!AVANT_BUG14(userscript)`.
- Miroir `ECHELLE_TICKET45` retiré : sur une base postérieure à 4.5, il comparait le bundle à lui-même. Les tailles absolues des titres restent contrôlées par le fragment `echelle`.
- Exports devenus orphelins et retirés :
  - `lib/variantes.mjs` : `ECHELLE_TICKET45`, `MEDIAS_TICKET410`, `CARTES_TICKET92`, `AVANT_TICKET92`, `AVANT_TICKET97`, `sansClassesPv97` ;
  - `lib/marges.mjs` : `SANS_MARGE_PAGE`.
- `REGLES_CARTE_TICKET51`, `RETRAITS_TICKET49` et `ECARTS_TICKET49` ne sont pas orphelins : ils servent dans `lib/variantes.mjs` (l.143, 426, 437, 447, 494). Seul leur `export` n'a pas de lecteur extérieur ; laissé tel quel. `textesHorsMarge` et `premierTexte` (`lib/marges.mjs`, morts, sans appelant) sont retirés après la revue.
- Avertissements `no-loop-func` de `lint:js` (`kramail-theme` l.2048 et 2051, `report-non-lu` l.97) : non traités, sur des lignes que le sweep ne change pas.
- Comparateur jetable : un passage de l'implémenteur sur quatre a donné 1 cas d'écart, sans détail gardé. La revue indépendante l'a lancé 3 fois : 0 écart à chaque passage. Il détecte une mutation : un bundle à `--kr-touch-target: 43px` donne 104 écarts sur 104 cas. L'écart vu une fois était une instabilité de mesure.
- `test:all` reste à lancer (interdit à l'implémenteur).

## Rétro épopée 9 — plateau, confort mobile (2026-10-29)

- Rétro : `epic-plateau-confort-mobile/epic-plateau-confort-mobile-retrospective.md`. Verdict machine **rejected**, forcé par 9.11 resté `in-review` : les quatre parcours joués par toi (Done when 2) attendent ta passe finale. Sur les preuves, le verdict serait **accepted-with-open-items**. Révision à ta main (A1).
- Aucun `test:all` entièrement vert sur `HEAD` (`6fbdba0`) : 1 FAIL de charge en 912 (`kramail-theme#confort`), vert 2/2 rejoué seul par l'orchestrateur et vert ici (366 ok). Le dernier vert complet est `7bec452` (18463 ok). Un `test:all` machine calme sur `6fbdba0` réglerait la question (A4).
- Six fusions sur onze ont suivi un `test:all` rouge (journaux 91, 92, 9671, 96, 97, 98, 912). Seuls 9.5, 9.6 et 9.7 attribuent leurs FAIL par écrit. Je lis les autres comme des faux FAIL de charge, sans preuve. Les SHA des journaux sont déduits de l'heure.
- 9.1 a fusionné sur 8 FAIL, dont 6 dans sa suite `confort-mobile`, et sa fusion change `COMMIT_AVANT` sans `test:all` propre. `confort-mobile` est vert sur `HEAD` (912 ok), donc rien de visible aujourd'hui.
- `demarrage-mobile#desktop+pire-cas+m1+m-1+s1` (« au plus 4 documents en 6 s ») échoue dans cinq `test:all` de l'épopée et déjà à la rétro 7. Le stabiliser ou le lancer à part (A5) ?
- Marge « sur toutes les pages » : /accueil sans marge (D9.4), forum Staff exclu (9.8), /help sur ordinateur hors périmètre (9.13). À trancher (A2).
- `<button>` mobiles sous 44 px (`kd-contacts`, `kd-chip-x`) : exclus ici au nom de l'épopée 4, qui ne les a pas livrés. Personne ne les porte. Nouveau ticket, ou tels quels (A3) ?
- Les doutes de 9.8 sont numérotés D1 à D8, pas D9.n. Je ne les ai pas renumérotés.
- Lignes de clôture « revue faite » des plans : reprises des Review Triage Logs et sections de revue, sans relecture des rapports de revue. Le spike 9.3 n'a pas de revue.
- J'ai écrit les lignes de clôture dans les treize plans, ce que le workflow de rétro interdit d'ordinaire : c'était la demande explicite de l'orchestrateur. Les Result périmés ne sont pas réécrits.
- Rétro 7 : les captures de `/Users/arnaud/kraland-css-captures/7.9/` (12:45) ne sont toujours pas reprises après 9.9 ; seul le parcours kramail de 9.11 est postérieur.

## Épopée accueil mobile

Inception de l'épopée 10 « Page d'accueil mobile » (2026-10-29), faite en autonomie. Découpe dans `epic-accueil-mobile/tickets.toml`. Elle reprend D9.4 et l'action A2 de la rétro 9, pour /accueil seulement.

- Tickets, dans l'ordre :
  1. 10.1, spike : relevé du vrai /accueil, en lecture seule (hitl : tu ouvres une session Kraland dans le Chrome dédié) ;
  2. 10.2, fixture réaliste et suite `accueil-mobile` (après 10.1 et 9.1) ;
  3. 10.3, refonte mobile (hitl : session pour l'émulation sur le vrai site ; après 10.1, 10.2, 9.1, 5.1, 4.5, 4.2 et 3.3) ;
  4. 10.4, Refactor sweep (après 10.1 à 10.3).
- Hypothèses retenues :
  - ta demande tranche A2 pour /accueil ; Staff et /help restent ouverts ;
  - `covers` : CAP-10, CAP-6 et CAP-5, étendus à l'accueil ; H5.6 (CAP-4) reste en non-régression ;
  - carte de section, échelle et boutons existants : ce n'est pas un nouveau composant ;
  - classe `kr-page-accueil` et `kr-marge-mobile` sur `html`, motif `^/(?:accueil)?$` ; l'accueil déconnecté reçoit aussi la marge, effet accepté ;
  - refonte mobile seule : l'ordinateur ne change pas, l'ordre mobile actuel des blocs est gardé ;
  - pas de liste d'attentes dans la suite : 10.2 livre la fixture et les tests de l'existant, 10.3 écrit les fragments de la refonte ;
  - les fixtures d'accueil de `palette-nation` et `typographie-formes` restent ; leur fusion est un candidat du sweep ;
  - 10.3 reste une entrée ; si le spike relève trop d'écarts, elle se re-découpe avant de partir ;
  - épopée hors lots : `lots-de-livraison.md` n'est pas modifié ; les épopées 4 et 9 et la rétro 9 non plus.
- À trancher par toi :
  - quels blocs passent en carte de section (carte ministérielle comprise) ? Le carrousel est absent sur mobile : le faire revenir ?
  - l'ordre mobile des blocs change-t-il ?
  - la carte de section et l'échelle sur l'accueil dépassent DESIGN.md et EXPERIENCE.md : ton accord suffit-il, ou faut-il passer par `bmad-ux` ou `bmad-spec` ? Faut-il nommer l'accueil dans CAP-6 ?
  - ta demande vaut-elle décision sur A2 avant le relevé ?
  - reste de A2 (forum Staff, /help sur ordinateur) et pages secondaires de la question de l'épopée 4 (Événements…) : sans épopée responsable ;
  - faut-il ajouter une ligne 10 à `lots-de-livraison.md` ?

## Ticket 10.1 — relevé du vrai /accueil (in-review, 2026-10-30)

- Plan : `epic-accueil-mobile/spike-releve-du-vrai-accueil-mobile-375-et-ordinateur-plan.md`. Captures, squelettes assainis et scripts : `/Users/arnaud/kraland-css-captures/10.1/`, hors dépôt.
- Relevé en lecture seule, session ouverte, à 375, 320, 1280, 1440 et 1920 px. La cloche était active : aucune requête `/report`, aucun clic, `localStorage` intact.
- Constat mobile :
  - aucun bloc n'est une carte, les cinq blocs vont de bord à bord ;
  - le contenu est à 12-15 px des bords ;
  - 2 cibles sur 18 sont sous 44 px : la croix des nouvelles (27×26) et le lien des nouvelles (32×44) ;
  - titres « Nouvelles » à 11 px et « Forum » à 15 px ;
  - date des nouvelles à 10,2 px ;
  - aucun débordement.
- Limites :
  - un seul thème, Empire Brun sombre : passer en Kraland clair demande d'écrire `localStorage`, et ton accord manque ;
  - pas de rendu natif : la route ne voit pas le chargeur dev ;
  - le carrousel n'a pas été vu affiché, car `kr-hide-carousel` est posé chez toi.
- À trancher par toi :
  - **Le message du ministre est absent sur mobile.** Il est dans `#col-right`, masqué en entier avec le carrousel. Le garder absent, ou le faire revenir dans une entrée à part après 10.3 ?
  - Cartes proposées : Forum et Nouvelles avec en-tête de 48 px et titre de 17 px ; Bienvenue et Compteurs sans en-tête ; « Jouer » en bouton de 4.2 dans la marge, sans carte. D'accord ?
  - Ordre mobile gardé (Jouer, Bienvenue, Forum, Compteurs, Nouvelles) ? Les Nouvelles, seul contenu éditorial, arrivent en dernier.
  - Sur la ligne « A l'aide ! », l'icône `fa-medkit` de 50 px recouvre « Bug ? Problème ? ». La corriger dans 10.3 ?
- Recommandation : ne pas redécouper 10.3. Les écarts sont peu nombreux et homogènes, et la marge commune couvre déjà le pied.

## Ticket 10.2 — fixture de l'accueil et suite accueil-mobile (in-review, 2026-10-30)

- Plan : `epic-accueil-mobile/story-fixture-realiste-de-l-accueil-et-suite-e2e-accueil-mobile-plan.md`. Fichiers : `tests/e2e/fixtures/accueil.html`, `tests/e2e/accueil-mobile.mjs`, routeur et son test, skill `tester-kraland-css` (deux copies).
- La fixture reconstruit l'état natif, avant la peau. Le relevé 10.1 a vu le DOM après la peau, donc trois points sont supposés :
  - les compteurs sont dans `#col-t`, après `.ds_user` (le README le confirme, mais pas leur position exacte) ;
  - la fixture place deux `<hr>` dans `#col-t`, après `.ds_user` et avant « Forum » ;
  - le premier `.list-group` de `#col-left` n'a pas d'id : la peau le nomme `player-header-section`.
- Le bloc kramail natif de `#col-t` (retiré par la peau) est omis, car sa structure n'a pas été relevée.
- Les formulaires `#reconnect` et `#exit` (jeton) sont retirés, ainsi que les publicités.
- Les images hors Kraland (messages des ministres, avatar) pointent vers `img7.kraland.org`.
- Les textes tronqués par le relevé sont complétés par moi : légendes du carrousel, devise elmérienne, citation du pied.
- Le ticket demandait aussi des mesures de marge, de cibles et de titres (`lib/marges.mjs`). Elles sont écartées sur mandat : ce sont les écarts de 10.3.
- Le relevé comparé au bundle de base masque le numéro de version du pied (horodatage du build), comme dans confort-mobile. Ce n'est pas une liste d'écarts.
- Routage : une modification de `accueil.html` lance aussi palette-nation. Le routeur trouve le nom dans `palette-nation-accueil.html` (citation par sous-chaîne). C'est conservateur ; je n'ai pas renommé la fixture, nommée par le ticket.
- À trancher par toi : le mot-clé de l'accueil lance aussi palette-nation et typographie-formes (avant, un hunk `.page-accueil` élargissait au total). Garder ce routage ?
- Après la revue, les sections « TASK-2.3 - MESSAGE DE BIENVENUE » et « ACCUEIL - AMÉLIORATION COLONNE DROITE » visent aussi ces trois zones. Le contrôle réseau de la suite n'exclut qu'une requête : `version.json`, la vérification de version du thème, refusée par le confinement sur toute page.
- Revue indépendante : les correctifs sont appliqués (barre complète, `.mini-submenu` masqué, défileur des Nouvelles simulé en mobile, cloche en `href=""`, logos refusés).
- Font Awesome : la suite le sert sur option `KR_FA_DIR`, comme messages-v3. Aucune copie locale n'existe : sans elle, les icônes n'ont pas de glyphe. Le chevauchement de `fa-medkit` (50 px) sur la ligne « A l'aide ! » n'est donc pas vérifié en 10.2. 10.3 doit reproduire ce cas, avec une copie de Font Awesome ou une boîte imposée à l'icône, et l'écrire en rouge puis vert.
- Défileur des Nouvelles : la hauteur mobile de `ul.demo` est figée à 81 px, la valeur relevée à 375 px. À 320 px, la vraie hauteur n'a pas été relevée. À vérifier en émulation sur le vrai site en 10.3.
- Les images des ministres et du carrousel sont rendues en 1 × 1 px (GIF de la fixture, sans width ni height) : leur géométrie n'est pas représentative.
