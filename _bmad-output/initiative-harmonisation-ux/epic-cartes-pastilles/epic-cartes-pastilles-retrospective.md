---
epic: epic-cartes-pastilles
date: 2026-10-25
verdict: rejected
criteria: declared
headless: true
---

# Rétrospective : cartes de section et familles de pastilles

## Epic summary

- Épopée : `_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles` (id 5 de l'initiative). Elle couvre CAP-6 (`spec-harmonisation.md`).
- Tickets (`tickets.py status`) : les six sont `built` (state `review`) et `pending_tickets` est vide. Aucun n'est encore « fait ».
  - 5.1 Carte de section mobile commune ;
  - 5.2 Listes de sujets du forum dans la carte mobile ;
  - 5.3 Groupes du plateau dans la carte mobile ;
  - 5.4 Pastilles de la cloche et de l'enveloppe en couleur d'état non lu ;
  - 5.5 Étiquettes de catégorie sur un seul style, PNJ compris ;
  - 5.6 Refactor sweep (jetons de pastille morts, masques échus).
- Plages de commits (une par plan depuis `baseline_revision`, un commit par plage, aucune fusion) :
  - 5.1 `458dc03..21fed8d` ; 5.2 `21fed8d..a7f0463` ; 5.3 `a7f0463..601ab19` ;
  - 5.4 `601ab19..59567f0` ; 5.5 `59567f0..ca73215` ;
  - 5.6 `ca73215..55b14f0`, plage inférée jusqu'à `HEAD`.
- État git : `feature/next` = `origin/feature/next` = `55b14f0`, donc poussée. `origin/main` = `d5b38e5` ne contient ni l'épopée 3, ni la 4, ni la 5. Aucune PR. Seul fichier non suivi : une capture d'écran Vivaldi hors périmètre.
- Volume (`git_evidence.py`, `458dc03..55b14f0`) :
  - `kraland-theme.css` : +183/−164, 15 452 lignes ;
  - `tests/e2e/cartes-pastilles.mjs` : +1757/−50, 1707 lignes, 14 fragments ;
  - `tests/e2e/lib/variantes.mjs` : +218/−3, 736 lignes. Il porte 56 constantes `TICKET`/`AVANT`, contre 31 à la rétro 4 ; 24 viennent de l'épopée 5 ;
  - `tests/e2e/lib/router.mjs` +40/−10, `router.test.mjs` +92/−13, `palette-nation.mjs` +26/−14 ;
  - une seule fixture touchée : `plateau-qualite-usage.html`, +10/−3 ;
  - template JS **non modifié** ;
  - `deferred-work.md` +57, `revue-manuelle.md` +75, skills +5/−2 dans les deux copies.
- Preuves disponibles :
  - le fichier d'épopée et les six plans (revue quick en Review Triage Log ; rouge avant et contre-épreuves consignés) ;
  - les commits, `revue-manuelle.md` et `deferred-work.md` ;
  - aucun journal de session.

## Findings

Les points déjà en attente d'Arnaud dans `revue-manuelle.md` ne sont pas repris comme découvertes. Ils sont reliés au verdict dans « Acceptance verdict » (F10 les regroupe pour mémoire).

### F1. Pas de PR ni de fusion vers main

- Source : `git branch -vv` (`feature/next` à jour avec l'origine, `origin/main` à `d5b38e5`) ; « Done when » n° 3 de `epic-cartes-pastilles.md`.
- Constat : feature/next est poussée (`revue-manuelle.md`, section 5.1 : push autorisé le 2026-10-24 jusqu'à `317b5b7`, puis jusqu'à `55b14f0`). La clause « PR fusionnée » n'est pas remplie. Le Done when nomme `feature/next` comme cible, mais le dépôt livre par fusion vers main, sur accord d'Arnaud. Les épopées 3, 4 et 5 sont toutes absentes de main.
- Disposition : **fix now** (action A1, avec l'accord d'Arnaud). Même traitement que F9 de la rétro 3 et F1 de la rétro 4.
- Leçon amont : le Done when d'épopée devrait dire « fusionnée sur main » ou « poussée sur feature/next ». La cible actuelle se confond avec la branche de travail.

### F2. Plan 5.6 : `test:all` contradictoire, sections en double

- Source : `epic-cartes-pastilles/plan-5.6*.md`, Implementation Notes (T8) et section Result.
- Constat : T8 dit « `npm run test:all` non lancé dans cette passe ». Le Result annonce « test:all : 12777 ok », chiffre identique à celui de 5.5, alors que 5.6 retire des masques et touche deux suites. Le plan contient deux paires de sections « Review Triage Log » et « Result » ; la première paire est restée au gabarit « (à remplir…) ». Rien ne prouve un `test:all` sur `55b14f0`. Les zones rejouées ici sont vertes (voir Behavior verification), mais elles ne couvrent pas tout.
- Disposition : **fix now** (action A3).
- Leçon amont : le Result d'un plan doit citer la commande, le SHA et le compte tirés de la passe elle-même, jamais recopiés du ticket précédent.

### F3. Non-régression auto-référente de `kramail-redaction` et `cybermonde-carte`

- Source : `tests/e2e/kramail-redaction.mjs` l.35-44 et `tests/e2e/cybermonde-carte.mjs` l.82-86 (`bundleAvant()` lit `origin/feature/next`) ; plan 5.6 (extinction de `CARTES_TICKET51` dans ces deux suites).
- Constat : depuis le push, `origin/feature/next` vaut `HEAD`. Les fragments de non-régression comparent donc le bundle à lui-même et ne peuvent plus échouer. 5.6 a restauré ces deux suites au contenu de `458dc03` en s'appuyant sur cette base : la restauration est verte par construction. Déjà signalé en F6/A6 de la rétro 4, toujours ouvert.
- Disposition : **fix now** (action A2).
- Leçon amont : une base de comparaison doit être un SHA figé ou `origin/main`, pas une branche que le travail lui-même fait avancer.

### F4. Les conditions de retrait des masques 5.x ne se déclencheront jamais

- Source : `tests/e2e/lib/variantes.mjs`, constantes `CARTES_TICKET51` à `CARTES_TICKET55` et détecteurs `AVANT_TICKET5x`.
- Constat : chaque masque porte « Condition de retrait : quand le bundle de base de la suite contient l'entrée 5.x (le détecteur l'éteint de lui-même) ». Les bases des suites concernées sont des commits figés (`00b0786`, `62fd47d`, `81512a3`, `a7f0463`, `59567f0`…), qui ne contiendront jamais ces entrées. Les masques ne s'éteindront donc pas seuls. L'échafaudage grossit d'une épopée à l'autre : 56 constantes, 736 lignes ; `cartes-pastilles.mjs` atteint 1707 lignes.
- Disposition : **fix now** (action A4), à coupler avec A2.
- Leçon amont : une condition de retrait doit nommer un événement qui arrivera (fusion sur main, changement de base), et un ticket doit le porter.

### F5. Frontière 5.1/5.2 : la carte s'applique à tout `.panel-default` mobile

- Source : `kraland-theme.css`, règle commune « Carte de section », `body.mobile-mode .panel-default:where(:not(.panel-group > *, .modal *))` ; `deferred-work.md`, reports 5.1 et 5.2 (pages /forum hors fixtures, accordéon ou modale sur /forum).
- Constat : la règle couvre de fait toutes les pages mobiles à panneau, y compris les règles, Cybermonde, l'Interface, le kramail et toutes les pages /forum, et pas seulement les pages des fixtures. Les exclusions ne retirent que l'accordéon et les modales. Les pages hors fixtures ne sont vérifiées ni par test ni par capture.
- Disposition : **defer** (action A9, vérification visuelle).
- Leçon amont : une règle commune large demande une liste des pages touchées, et chacune doit être vue au moins une fois.

### F6. Frontière 5.4/5.5 : `.badge-danger` et `.btn-danger.xmini` changent de famille en bloc

- Source : `kraland-theme.css`, règle d'état non lu (liste combinée l.~794, `border-color` retiré) et nouvelle règle `html.kr-theme-enabled .btn.btn-danger.xmini` ; `kraland-userscript-template.js` l.4153 (seul emploi connu côté JS).
- Constat : tout `.badge-danger` passe en couleur « non lu », quel que soit son sens. Tout `.btn-danger.xmini` prend le style de la marque PNJ (arm-bg/arm-ink, rayon plein). Les fixtures ne montrent que les emplois visés. Tout autre emploi sur le site réel changerait de famille sans qu'aucun test le voie. Lu dans la source, non mesuré sur le site.
- Disposition : **defer** (action A9, relevé des emplois).
- Leçon amont : quand un ticket restyle une classe native entière, la spec doit lister ses emplois sur le site, ou la règle doit être restreinte au contexte visé.

### F7. Règle kramail retirée sans restriction à `.panel-default`

- Source : diff de `kraland-theme.css`, suppression de `body.page-kramail .panel-heading` (retrait 12 16, fond transparent, filet).
- Constat : la règle visait tous les en-têtes de panneau du kramail. La carte ne reprend que les `.panel-default`. Un panneau d'une autre classe sur le kramail retomberait sur le style natif de Bootstrap (AGENTS.md : « Retirer une règle de la peau peut révéler un défaut natif »). Les fixtures ne contiennent que des `.panel-default` ; le risque est faible.
- Disposition : **defer** (inclus dans A9).

### F8. Rouge avant de 5.1 joué sur `317b5b7`, pas sur la base `458dc03`

- Source : plan 5.1 ; `git show --stat 458dc03` (seuls `deferred-work.md` et `typographie-formes.mjs` changent).
- Constat : la base déclarée ne diffère du bundle utilisé que par des tests. Le rouge avant est donc équivalent.
- Disposition : **accept**.

### F9. Done when 2 vise `sous-forum.mjs`, mais c'est `forum-index.mjs` qui change

- Source : « Done when » n° 2 et Source conflict de `epic-cartes-pastilles.md` ; plan 5.2 ; diff de `tests/e2e/forum-index.mjs`.
- Constat : `sous-forum.mjs` n'est pas modifié, seuils compris. Le seuil de pleine largeur (0,95) tient parce que `#topics_wrapper` passe de 12 à 6 px de retrait haut. La pleine largeur est testée dans `forum-index.mjs`, ce que le fichier d'épopée signale déjà en conflit de source. Le critère reste rédigé comme s'il devait changer `sous-forum.mjs`.
- Disposition : **fix now** (action A7, réécrire le critère).

### F10. Écarts de CAP-6 en attente d'Arnaud (pour mémoire)

- Source : `revue-manuelle.md`, sections 5.1 à 5.6 ; `deferred-work.md` ; Open questions de l'épopée.
- Constat, liste des points ouverts :
  - marque PNJ mobile en 14 px (5.5, constat 1 reporté) ;
  - bureau compact 768-991 px : pastille invisible quand le menu est fermé (5.4) ;
  - `span.tagforum` non traité (5.5) ;
  - carte blanche sur page blanche en Kraland clair (O1 de 5.6) ;
  - « article » et « Dernier sujet » absents des fixtures (Open questions de l'épopée) ;
  - couleurs des barres de PV en dur dans le template l.4345-4352, prises par aucun ticket (O3 de 5.6) ;
  - `after` des épopées 6 et 7 non épinglés (`tickets.py status`, `unpinned_after`).
- Disposition : décisions d'Arnaud (actions A5, A6, A8).

### F11. `test:changed` contourné et captures « À regarder » non produites

- Source : plans 5.2, 5.3 et 5.4 (`test:changed` non lancé, élargi au `test:all`) ; O2 de 5.6.
- Constat : la boucle courte prévue par AGENTS.md n'a pas servi, et le temps a été pris par des `test:all` répétés. Les captures de validation visuelle ne sont pas produites : même constat que A11 de la rétro 4.
- Disposition : **fix now** pour les captures (action A10). Le contournement de `test:changed` est consigné sans action.

### F12. Transitions non couvertes

- Source : `deferred-work.md`, reports 5.1 à 5.3 (repli sans transition du module et de l'accordéon ; bascule mobile/bureau du forum non couverte).
- Constat : ces lacunes sont connues et notées. Aucune régression constatée.
- Disposition : **defer**.

## Behavior verification

Contrôle uniquement par les fixtures Playwright, sur machine calme (charge ~1,5), bundle commité de `55b14f0`, sans rebuild :

- `KR_LOGDIR=/tmp/retro5/logs npm run test:zone -- cartes-pastilles sous-forum` : exit 0, 3620 ok, 0 FAIL.
  - Détail : cartes-pastilles 2266, sous-forum 1098, forum-index 150, jeu-identite 106.
- `KR_LOGDIR=/tmp/retro5/logs2 npm run test:zone -- typographie-formes palette-nation kramail cybermonde plateau` : exit 0, 7225 ok, 0 FAIL.
  - Détail : typographie-formes 4402, palette-nation 1354, kramail-redaction 340, cybermonde-carte 123, croix 693, breakpoint-switch 112, plateau-profil-mobile 60, plateau-qualite-usage 35, jeu-identite 106.
- `npm run test:router` : « Routeur conforme ».

Limites : les verts de `kramail-redaction` et `cybermonde-carte` ne prouvent rien sur la non-régression (F3). `test:all` n'a pas été lancé (contrainte de cette rétro). Aucune capture, aucun site réel.

## Previous-retro follow-through

Actions de `epic-typographie-formes-retrospective.md` :

- A1 Livrer : **partiel**. Push fait (`revue-manuelle.md` 5.1 : `317b5b7`, puis `55b14f0` sur l'origine), mais sans PR ni fusion vers main (F1).
- A2 `.forum-title` à 15 px : **fait** (`317b5b7` « fix: keep forum card names at 15px on mobile »).
- A3 Ordre du pied Bootbox : aucune preuve trouvée.
- A4 Titres `h5` d'options : aucune preuve trouvée.
- A5 Jetons morts : **non fait**. 5.6 a retiré les jetons morts de l'épopée 5, pas ceux de l'épopée 4, et les rappelle dans `revue-manuelle.md`.
- A6 Extinction des masques et base non auto-référente : **partiel**. `CARTES_TICKET51` est éteint dans deux suites, mais sur une base auto-référente (F3). Les masques des épopées 3 et 4 sont gardés tant que main n'est pas fusionné (F4).
- A7 Limite de `GEL_NETTOYAGE` : aucune preuve.
- A8 Mesures du plan 4.9 : aucune preuve.
- A9 Note sur les votes : aucune preuve.
- A10 `kr-theme-enabled` avant capture : **fait** (`458dc03` : le fragment `nettoyage` signale « html.kr-theme-enabled absent »).
- A11 Captures de validation : **non fait** (O2 de 5.6, F11).
- A12 `AGENTS.md` (`kr-theme-enabled`, liste combinée) : **non fait**. Aucune mention dans `AGENTS.md`.

## Action items

Toutes les actions sont des propositions ; Arnaud n'en a décidé aucune.

- A1. Livrer les épopées 3, 4 et 5 : fusion vers main (ou PR), avec l'accord d'Arnaud, puis `test:all` sur machine calme et sur le SHA exact. Responsable : Arnaud (accord), agent (préparation).
- A2. Rendre non auto-référentes les bases de `kramail-redaction.mjs` et `cybermonde-carte.mjs` (SHA figé ou `origin/main`). Rejouer ensuite la restauration de 5.6 avec un rouge avant réel. Ticket de correction.
- A3. Corriger le plan 5.6 : retirer les sections en double et remplacer le « 12777 ok » par le résultat d'un vrai `test:all` sur `55b14f0`, ou noter qu'il n'a pas été lancé.
- A4. Plan d'extinction des masques des épopées 3, 4 et 5 dans `variantes.mjs`, avec des conditions de retrait atteignables (bases réalignées après fusion). À porter par un ticket.
- A5. Décisions d'Arnaud sur les écarts de CAP-6 : PNJ mobile en 14 px, pastille du bureau compact 768-991, `span.tagforum`, carte blanche sur page blanche en clair (O1), ainsi que les rappels D12, D14 et D15.
- A6. Ouvrir un ticket pour les couleurs des barres de PV en dur (template l.4345-4352), épopée à choisir par Arnaud.
- A7. Réécrire le Done when 2 de l'épopée : la pleine largeur se teste dans `forum-index.mjs`, et `sous-forum.mjs` reste inchangé.
- A8. Épingler les `after` de l'initiative : l'épopée 6 (forum) sur 5.2 et l'épopée 7 (kramail mobile) sur 5.1, dans le `tickets.toml` de l'initiative.
- A9. Vérifier en capture, sur fixtures ou avec mandat en lecture seule, les pages mobiles hors fixtures qui reçoivent la carte (/forum/*, règles, Interface, Cybermonde, panneaux non `.panel-default` du kramail). Relever aussi les emplois de `.badge-danger` et `.btn-danger.xmini` sur le site.
- A10. Produire les captures de validation de l'épopée 5 pour Arnaud : 1280, 1440, 1920 et 375×667, Kraland clair et Empire Brun sombre. Elles reprennent l'A11 de la rétro 4.
- A11. Reporter les actions non prouvées de la rétro 4 : A3, A4, A5 (jetons morts de l'épopée 4), A7, A8, A9 et A12.

## Acceptance verdict

**rejected** (critères déclarés : « Done when » de `epic-cartes-pastilles.md`).

1. Critères success de CAP-6 sur le jeu, le forum, le sous-forum et le kramail : **largement tenus** par les tests sur fixtures. Il reste des écarts, tous déjà en attente d'Arnaud (F10) : PNJ mobile en 14 px, pastille du bureau compact, `span.tagforum`, contraste carte/page en clair, « article » et « Dernier sujet » absents. Réserves nouvelles : portée large de la carte (F5) et des familles de pastilles (F6).
2. Suite `sous-forum` mise à jour pour R6 : **tenu en substance**. Le comportement est testé dans `forum-index.mjs`, et `sous-forum.mjs` reste vert sans modification. La rédaction du critère est à réconcilier (F9).
3. PR fusionnée, bundle et `version.json` régénérés, `test:all` vert avec au moins un test par décision : **non tenu**.
   - Bundle et `version.json` sont régénérés à chaque commit, et chaque décision a son fragment dans `cartes-pastilles.mjs`.
   - Il n'y a ni PR ni fusion (F1).
   - Aucun `test:all` n'est prouvé sur `55b14f0` (F2).
4. Vérifié à 1280, 1440, 1920 et 375×667, Kraland clair et Empire Brun sombre, fixtures synthétiques : **tenu par les tests**. Largeurs et variantes sont couvertes, la seule fixture touchée est synthétique. Aucune validation visuelle humaine n'est listée (F11).

Le critère 3 suffit au rejet. Après A1 et A3 (fusion et `test:all` prouvé sur le SHA exact), puis les décisions d'Arnaud sur F10, les preuves soutiendraient **accepted-with-open-items** (open items : F3, F4, F5, F6). Cette révision appartient à Arnaud.

## Open questions

- La fusion vers main se fait-elle en un lot (épopées 3 à 5) ou une épopée à la fois ? AGENTS.md demande une PR à la fois, avec `version.json` et le bundle repris de la base à chaque rebase.
- `.badge-danger` et `.btn-danger.xmini` ont-ils sur le site d'autres emplois que ceux visés (F6) ?
- Le kramail ou les pages /forum ont-ils des panneaux qui ne sont pas des `.panel-default` (F7) ?
- La carte blanche sur page blanche en Kraland clair (O1) appelle-t-elle un fond de page teinté, et dans quelle épopée ?
- Les barres de PV relèvent-elles de la palette (épopée 3) ou d'un nouveau ticket ?

## Assumptions

- Épopée résolue par le chemin `_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles` donné par l'appelant. La rétro précédente est `epic-typographie-formes`.
- `pending_tickets` est vide : les six tickets sont traités comme terminés côté construction.
- Verdict `rejected` posé sans décision humaine (mode headless), sur le seul critère 3 non tenu. Les écarts du critère 1 sont laissés à l'arbitrage d'Arnaud.
- Toutes les actions sont des propositions.
- Plage de 5.6 inférée jusqu'à `HEAD` (`55b14f0`).
- Aucun journal de session disponible. Les preuves sont les plans, les commits, `revue-manuelle.md` et `deferred-work.md`.
- « PR fusionnée » est traité comme dans les rétros 3 et 4 : critère non tenu tant qu'il n'y a pas de fusion sur accord d'Arnaud, le push sur `feature/next` ne suffisant pas.
- Revue de diff à périmètre réduit : pas de `bmad-review` ni de sous-agent. J'ai appliqué moi-même, dans le fil, les lentilles adversarial, edge-case et verification-gap au diff `458dc03..55b14f0`, limité à `kraland-theme.css` et `tests/`. L'accent était mis sur les frontières entre tickets ; le template n'a pas changé.
- Vues agrégées calculées en ligne à partir de `tickets.py status` et `git_evidence.py`. Aucun outil de graphe de dépendances n'a été lancé.
- `tickets.py status` signale que `plan-racine-forum.md` est ignoré : je n'ai pas tranché ce point, hors périmètre de l'épopée 5.
- Build non relancé : l'arbre est propre et le bundle commité est à jour.
- Pas de `test:all`, pas de site réel, pas de Chrome 9222/9223, pas de capture.

---

Rapport : `_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/epic-cartes-pastilles-retrospective.md`, verdict **rejected**, 11 actions proposées.
