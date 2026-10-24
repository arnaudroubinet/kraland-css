---
epic: epic-typographie-formes
date: 2026-10-24
verdict: rejected
criteria: declared
headless: true
---

# Rétrospective : Typographie, boutons, rayons et espacements

## Epic summary

- Épopée : `_bmad-output/initiative-harmonisation-ux/epic-typographie-formes` (id 4 de l'initiative), couvre CAP-5 (`spec-harmonisation.md`).
- Tickets (`tickets.py status`) : les dix sont `built` (state `review`) ; `pending_tickets` est vide. Aucun n'est encore « fait ».
  - 4.1 Jetons d'échelle ; étiquettes et pastilles en 12 px gras ;
  - 4.2 Bouton de taille normale : 14 px, 34 px sur ordinateur, au moins 44 px sur mobile ;
  - 4.3 Modales Bootbox mobiles : « Valider » de taille normale et règles contradictoires retirées ;
  - 4.4 Bouton compact en 12 px pour les votes et la pagination ;
  - 4.5 Échelle typographique du plateau, du mini-profil et des en-têtes de panneau ;
  - 4.6 Matériel, Personnage, Bâtiments, Employés : échelle et ligne d'objet ;
  - 4.7 Échelle typographique du forum et du kramail ;
  - 4.8 Trois rayons : 4 px, 8 px et plein ;
  - 4.9 Grille d'espacement au pas de 4 px ;
  - 4.10 Refactor sweep.
- Plages de commits (une par plan, depuis `baseline_revision`, un commit par plage, aucune fusion) :
  - 4.1 `d68ab55..4d97496` ; 4.2 `4d97496..8631c45` ; 4.3 `8631c45..3b1da55` ; 4.4 `3b1da55..fe77411` ; 4.5 `fe77411..d953969` ;
  - 4.7 `d953969..1590761` puis 4.6 `1590761..5ff22d3` (ordre de construction inversé, justifié dans `revue-manuelle.md` l.189-198 par l'attente du mandat de relevé) ;
  - 4.8 `5ff22d3..62fd47d` ; 4.9 `62fd47d..00b0786` ;
  - 4.10 `00b0786..be63eea`, plage inférée jusqu'à `HEAD`.
- État git : tous les commits sont locaux sur `feature/next`, « en avance de 44 » sur `origin/feature/next` (`bcc7710`). Rien n'est poussé, aucune PR.
- Volume (`git_evidence.py`, `d68ab55..be63eea`) :
  - `tests/e2e/typographie-formes.mjs` : +2113/−64, 2049 lignes, 13 fragments, plus grosse suite du dépôt ;
  - `kraland-theme.css` : +746/−838 (net −92), 15 429 lignes ;
  - `tests/e2e/lib/variantes.mjs` : +372, 503 lignes ;
  - 7 fixtures synthétiques (`jeu-materiel`, `jeu-employes`, `jeu-batiments`, `jeu-plateau-objets`, `typographie-echelle`, `typographie-formes`, `typographie-forum-redaction`), sans jeton ni capture brute ;
  - `tests/e2e/lib/router.test.mjs` : +123 ;
  - template JS : +10/−7 (classe `html.kr-page-plateau`, styles en ligne).
- Preuves disponibles : fichier d'épopée, dix plans (Review Triage Log en revue quick, rouge avant et contre-épreuves consignés, aucune section `## Code Review` datée), inventaires de 4.8 et 4.9, commits, `revue-manuelle.md`, `deferred-work.md`. Aucun journal de session.

## Findings

Les points déjà en attente d'Arnaud dans `revue-manuelle.md` ne sont pas repris comme découvertes ; ils sont reliés au verdict dans « Acceptance verdict ».

### F1. Rien n'est livré : aucune PR, 44 commits locaux

- Source : `git branch -vv` ; « Done when » n° 3 de `epic-typographie-formes.md`.
- Constat : la condition « PR fusionnée sur `feature/next` » n'est pas remplie. Même cause que F9 et l'action 1 de la rétro `epic-palette-nation` : les épopées 3 et 4 s'empilent sans livraison.
- Disposition : **fix now** (action A1, avec l'accord d'Arnaud).
- Leçon amont : le « Done when » d'une épopée contient la livraison ; enchaîner l'épopée suivante avant de livrer la précédente grossit le lot à relire et repousse l'extinction des masques de test (F6).

### F2. Nom de forum des cartes mobiles à 17 px au lieu de 15

- Source : `kraland-theme.css` l.4782 (`h1, h2, h3 { font-size: var(--kr-font-section-title) !important; }`, bloc `@media (max-width: 767px)` ouvert l.4081, posé en 4.5) contre l.8035 (`.forum-title { font-size: var(--kr-font-forum-name); }`, sans `!important`, posé en 4.7) ; le JS crée `<h3 class="forum-title">` (`kraland-userscript-template.js` l.4899).
- Constat : sur mobile, la règle h1-h3 `!important` bat la taille du nom de forum ; le nom de carte vaut 17 px (`--kr-font-section-title`) et non 15 (`--kr-font-forum-name`). Les tests ne le voient pas : la fixture `palette-nation-textes.html` l.63 porte un `span.forum-title`, pas le `h3` réel, et `typographie-formes.mjs` ne mesure pas `.forum-title`. Lu dans la source, non mesuré dans un navigateur.
- Disposition : **fix now** (action A2).
- Leçon amont : frontière 4.5/4.7 ; une règle globale `!important` sur des balises (h1-h6) doit être confrontée aux composants créés par le JS, et la fixture doit reproduire la balise réelle.

### F3. Ordre du pied Bootbox mobile limité à deux classes de bouton

- Source : `kraland-theme.css` l.7061-7066 (`order: 2` pour `.btn-primary`, `order: 1` pour `.btn-default`) ; commentaire de la section 9h l.2235.
- Constat : le pied en colonne (4.3) range par `order` ; un bouton `.btn-danger`, `.btn-success` ou `.btn-warning` garde `order: 0` et remonte en tête de colonne, avant « Annuler ». Le commentaire 9h affirme que ces règles « reproduisent l'ordre natif » sans cette réserve. Aucune Bootbox à bouton de ce type n'est dans les fixtures ; présence sur le site non vérifiée.
- Disposition : **defer** (action A3).
- Leçon amont : une règle de rangement doit couvrir toutes les classes de bouton de Bootstrap, ou le commentaire doit dire sa limite.

### F4. h4-h6 mobiles forcés à 15 px, y compris des titres de rubrique à 13 px

- Source : `kraland-theme.css` l.4783 (`:is(h4, h5, h6):where(:not(.panel-heading > *), .panel-group *, .modal *) { font-size: var(--kr-font-name) !important; }`) ; `.kr-options-section-title` à 13 px l.2905, porté par des `h5` (template l.8650, 8657, 8689).
- Constat : sur mobile, tout h4-h6 hors des exclusions passe à 15 px `!important`. Si le panneau d'options n'est pas sous `.modal` ou `.panel-group`, ses titres de rubrique passent de 13 à 15 px. Conteneur non établi ; à mesurer.
- Disposition : **defer** (action A4, mesure puis décision).
- Leçon amont : même que F2.

### F5. Jetons déclarés jamais consommés et commentaire de ticket faux

- Source : revue adversariale (`bmad-review`) ; `kraland-theme.css` l.15049 (« leur taille relève des compacts (4.3) »).
- Constat :
  - `--kr-font-page-title`, `--kr-space-5`, `--kr-space-6`, `--kr-margin-mobile` et `--kr-touch-target-dpad` ne sont lus par aucune règle ;
  - le bouton compact relève de 4.4, pas de 4.3 ;
  - trois exclusions `16px !important` restent codées en dur (vers l.9746, 13013 et 15048).
- Disposition : **defer** (action A5, à joindre au prochain nettoyage).
- Leçon amont : le refactor sweep (4.10) cherche les règles mortes, pas les jetons morts ; l'ajouter à sa liste.

### F6. L'échafaudage de test grossit encore

- Source : `tests/e2e/lib/variantes.mjs` (503 lignes, 31 constantes `TICKET`/`AVANT`, dont `COMPOSANTS_TICKET4/5` et `AVANT_TICKET5` de l'épopée 3) ; plan 4.10 (« masques tous utiles ») ; `typographie-formes.mjs` 2049 lignes.
- Constat : l'action 4 de la rétro précédente (retirer l'échafaudage après fusion) n'a pas pu s'appliquer, faute de fusion. Les masques « bundle avant » s'empilent sur deux épopées. De plus, `kramail-redaction.mjs` l.38-44 compare à `origin/feature/next` : après le push, cette base deviendra le bundle courant et la comparaison sera auto-référente.
- Disposition : **defer** (action A6, déclenchée par la fusion).
- Leçon amont : chaque masque doit naître avec sa condition de retrait (la fusion de son épopée).

### F7. Sélecteurs déplacés dans `variantes.mjs` pour rester sous le plafond du routeur

- Source : plans 4.6, 4.8, 4.9 et 4.10 ; `tests/e2e/lib/router.mjs` l.201 (`MAX_CITING = 3`) et l.328-340 (citations comptées dans les fichiers de suites seulement).
- Constat : des sélecteurs cités par `typographie-formes.mjs` ont été déplacés dans `lib/variantes.mjs` pour ne pas dépasser trois suites citantes. Le routage par citation perd ces repères. Risque faible : un hunk sans mot-clé élargit au total.
- Disposition : **accept** (consigné ; à revoir si le routeur change).
- Leçon amont : un contournement d'outil doit être nommé comme tel dans le plan, ce qui est fait ici.

### F8. Comparaison de nettoyage aveugle aux transitions, mesures de 4.9 non refaites

- Source : `typographie-formes.mjs` l.1647 (`GEL_NETTOYAGE`) ; Plan Change Log du plan 4.9.
- Constat :
  - `GEL_NETTOYAGE` neutralise transitions et animations avant de comparer les styles calculés : une régression sur `transition` ou `animation` passerait. Aucune régression actuelle ;
  - le plan 4.9 garde des mesures de décalage datant de la simulation 8/8, alors que la livraison est en 4/8 (cellules), sans remesure.
- Disposition : **defer** (actions A7 et A8).
- Leçon amont : quand un arbitrage change la valeur livrée, le plan remesure ou barre les mesures obsolètes.

### F9. Note fausse dans le fichier d'épopée sur les votes

- Source : `epic-typographie-formes.md` (« aucun bouton de vote dans les fixtures du sujet ») contre `tests/e2e/fixtures/forum-sujet.html` l.26-28 ; `revue-manuelle.md` (« à corriger dans la rétro »).
- Constat : la fixture du sujet contient des boutons de vote. La note est à réconcilier. Cette rétro ne modifie pas le fichier d'épopée (mandat).
- Disposition : **fix now** (action A9, par Arnaud ou un ticket de réconciliation).
- Leçon amont : une note d'épopée s'appuie sur une recherche citée (fichier et ligne).

### F10. Faux échec sous charge dans le fragment `nettoyage`

- Source : `/tmp/retro4/test-zone.log` (1 FAIL, `reception kraland 767 px`, 202 éléments sur 223 différents, navbar au rendu Bootstrap natif dans la base) ; rejeu seul `KR_FRAG=nettoyage` : 405 ok, 0 FAIL.
- Constat : la base a été capturée sans la peau, sous charge (machine partagée, charge 4 à 10). Le rejeu isolé est vert. Pas de régression, mais la comparaison de base n'attend pas la pose de la peau.
- Disposition : **defer** (action A10).
- Leçon amont : rejoint le fait connu « faux FAIL sous charge » ; une base de comparaison doit vérifier `kr-theme-enabled` avant capture.

### F11. Ordre de construction 4.7 avant 4.6

- Source : `revue-manuelle.md` l.189-198.
- Constat : inversion justifiée et consignée (attente du mandat de relevé pour 4.6). Aucun effet sur les plages.
- Disposition : **accept**.

### Autres constats de revue, consignés sans action propre

- Coins des enfants de panneau non recalés (`.table`, `.list-group`, en-tête d'accordéon replié) : rejoint le point 4.4 en attente (« rayon aux seuls coins extérieurs »).
- Pied de modale mobile encore à 15/10 px littéraux, hors du périmètre Q11.
- `.btn-lg` et `.btn-sm` mobiles non mesurés, sans consommateur connu.
- Gardes `:where(body.page-forum)` au lieu de `html` ; coût de `:has()` et pose tardive de `kr-page-plateau` (risque de flash, non observé).
- Trou fractionnaire entre 767 et 768 px dans la liste combinée : convention du projet, faible.

## Behavior verification

- `node tests/e2e/run.mjs zone typographie-formes` (bundle commité à `be63eea`, arbre propre, build non relancé) : 4370 ok, 1 FAIL, 13 fragments. Le FAIL est `nettoyage reception kraland 767 px` (F10).
- Rejeu `KR_FRAG=nettoyage node tests/e2e/typographie-formes.mjs` : 405 ok, 0 FAIL, code 0.
- Conclusion : la suite de l'épopée est verte hors charge. `test:all` non lancé (machine partagée) ; les plans annoncent `test:all` vert à chaque ticket (4.10 : 10 447 ok, 0 FAIL, machine calme), ce qui est une déclaration de l'implémenteur, pas une preuve rejouée ici.
- Non couvert par les tests : `.forum-title` réel en `h3` (F2), Bootbox à bouton autre que default/primary (F3), titres `h5` du panneau d'options (F4).

## Previous-retro follow-through

Actions de `epic-palette-nation-retrospective.md` :

1. Livrer (push et PR) : **non fait** (F1).
2. Réconcilier la spec sur le focus (CAP-4) : non vérifié.
3. Halo de focus rouge Kraland : non vérifié.
4. Retirer l'échafaudage après fusion : **non fait**, condition non remplie ; l'échafaudage a grossi (F6).
5. Captures de validation 3.2 à 3.6 : non vérifié.
6. Tenir `deferred-work.md` et `revue-manuelle.md` : **partiellement fait** (`deferred-work.md` l.34-38 soldé par 4.3 ; points de 4.1 à 4.10 consignés dans `revue-manuelle.md`).
7. Contacts : non vérifié.
8. Garde-fou git : les plans 4.x mettent « git modifiant arbre/index/stash » dans « Never » ; présence dans `AGENTS.md` non confirmée.
9. Documenter `kr-theme-enabled` dans `AGENTS.md` : **non fait**.
10. Suites propres et rouge avant consigné : **fait** (suite `typographie-formes.mjs` propre, rouge avant et contre-épreuves dans chaque plan).

## Action items

Toutes les actions sont proposées ; aucune n'est décidée par Arnaud.

- A1. Livrer les épopées 3 et 4 : push et PR vers `feature/next`, avec l'accord d'Arnaud, puis un `test:all` machine calme sur le SHA exact. Responsable : Arnaud (accord), agent (préparation).
- A2. Corriger la taille de `.forum-title` mobile (15 px contre la règle h1-h3) et aligner la fixture sur le `h3` réel, avec rouge avant. Ticket de correction.
- A3. Étendre les règles `order` du pied Bootbox mobile aux autres classes de bouton, ou corriger le commentaire 9h ; vérifier d'abord si de telles Bootbox existent sur le site. Ticket de correction.
- A4. Mesurer les titres `h5.kr-options-section-title` sur mobile ; s'ils passent à 15 px, décider (Arnaud) puis exclure ou accepter.
- A5. Consommer ou retirer les jetons morts (`--kr-font-page-title`, `--kr-space-5`, `--kr-space-6`, `--kr-margin-mobile`, `--kr-touch-target-dpad`), corriger « compacts (4.3) » en « (4.4) » ; ajouter « jetons non lus » à la liste du refactor sweep.
- A6. Après fusion : plan d'extinction des masques de `variantes.mjs` (épopées 3 et 4) et base de `kramail-redaction.mjs` non auto-référente.
- A7. Documenter la limite de `GEL_NETTOYAGE` dans la suite, ou la restreindre aux propriétés animées.
- A8. Remesurer les décalages du plan 4.9 en 4/8, ou barrer les mesures 8/8.
- A9. Réconcilier la note sur les votes dans `epic-typographie-formes.md` (`forum-sujet.html` l.26-28).
- A10. Faire vérifier `kr-theme-enabled` avant la capture de base dans le fragment `nettoyage`.
- A11. Produire les captures de validation visuelle de l'épopée 4 pour Arnaud (1280, 1440, 1920 et 375×667 ; Kraland clair et Empire Brun sombre), aucune n'étant listée.
- A12. Reporter l'action 9 : documenter `kr-theme-enabled` et la liste combinée `@media (max-width: 767px), (min-width: 768px)` dans `AGENTS.md`.

## Acceptance verdict

**rejected** (critères déclarés : « Done when » de `epic-typographie-formes.md`).

1. Critères success de CAP-5 sur jeu, forum et kramail : **largement tenus** par les tests sur fixtures, avec des écarts :
   - écarts déjà en attente d'Arnaud (`revue-manuelle.md`) qui touchent ce critère : retrait vertical de 6 px du bouton ordinateur hors du pas de 4, cellules 4/8 (4.9) ; pages secondaires sous 12 px et 11 px du forum, du kramail et de l'accueil non traités (4.5, question d'inception) ; nom de forum en graisse 400 contre 700 dans `DESIGN.md` (4.7) ; pilules et onglets à 4 px (4.8, A1 à A14) ; icônes seules à 14 px sur mobile (4.2) ;
   - écart nouveau : nom de forum des cartes mobiles à 17 px au lieu de 15 (F2) ; à confirmer : titres `h5` d'options (F4).
2. « Valider » de la modale à la taille normale sur mobile : **tenu** (4.3, tests verts). Réserve F3 sur les autres classes de bouton.
3. PR fusionnée, bundle et `version.json` régénérés, `test:all` vert avec un test par décision : **non tenu**. Bundle et `version.json` sont régénérés à chaque commit, `test:all` est annoncé vert par les plans, mais aucune PR n'existe (F1).
4. Vérifié à 1280, 1440, 1920 et 375×667 sur Kraland clair et Empire Brun sombre, fixtures synthétiques : **tenu par les tests** (largeurs et variantes couvertes dans `typographie-formes.mjs`, fixtures synthétiques sans capture brute). Aucune validation visuelle humaine listée (A11).

Le critère 3 suffit au rejet. L'épopée devient acceptable après A1 et A2, et la décision d'Arnaud sur les points en attente du critère 1.

## Open questions

- Les Bootbox du site ont-elles des boutons `.btn-danger` ou `.btn-success` (F3) ?
- Le panneau d'options est-il sous `.modal` ou `.panel-group` sur mobile (F4) ?
- Les questions de l'épopée restent ouvertes : pages secondaires sous 12 px ; votes et pagination mobiles laissés à l'épopée 9 ; hypothèses Q8, Q9, Q11, Q12 et Q14 à confirmer.
- Les épopées 3 et 4 partent-elles dans une seule PR ou deux PR successives ?

## Assumptions

- Épopée résolue par le chemin `_bmad-output/initiative-harmonisation-ux/epic-typographie-formes` donné par l'appelant ; rétro précédente `epic-palette-nation`.
- `pending_tickets` vide : les dix tickets sont traités comme terminés côté construction.
- Verdict `rejected` posé sans décision humaine (mode headless), sur le seul critère 3 non tenu ; les écarts du critère 1 sont laissés à l'arbitrage d'Arnaud.
- Toutes les actions sont des propositions.
- Plage de 4.10 inférée jusqu'à `HEAD` (`be63eea`).
- Aucun journal de session disponible ; les preuves sont les plans, les commits et `revue-manuelle.md`.
- Revue de diff : skill `bmad-review`, lentilles adversarial, edge-case et verification-gap en sous-agents, sur le diff `d68ab55..be63eea` limité à `kraland-theme.css`, au template et à `tests/`. Les constats F2 et F3 ont été revérifiés dans la source ; les autres viennent des lentilles.
- Build non relancé : arbre propre, bundle commité à jour.
- Pas de `test:all`, pas de site réel, pas de capture visuelle ; outil de graphe de dépendances non lancé.
