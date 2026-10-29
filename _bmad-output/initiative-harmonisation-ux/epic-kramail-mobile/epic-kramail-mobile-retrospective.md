---
epic: epic-kramail-mobile
date: 2026-10-29
verdict: rejected
criteria: declared
headless: true
---

# Rétrospective : kramail, même thème que le forum

## Epic summary

- Épopée : `_bmad-output/initiative-harmonisation-ux/epic-kramail-mobile` (id 7 de l'initiative). Elle couvre CAP-8, élargi par Arnaud le 2026-10-23 (ordinateur et mobile, toutes les pages du kramail).
- Tickets (`tickets.py status`), dans l'ordre de construction :
  - 7.1 gardes de page, suite `kramail-theme` et dossiers en onglets sur mobile : `built` ;
  - 7.2 lecture d'un message sur le message de sujet du forum : `built` ;
  - 7.3 en-tête du kramail sur l'en-tête du sous-forum : `built` ;
  - 7.4 listes Réception, Envoi et Corbeille sur la liste des sujets : `built` ;
  - 7.5 rédaction sur le formulaire de réponse : `built` ;
  - 7.6 palette `--kd-*` retirée : `built` ;
  - 7.7 « Envoyer » dans le flux, au forum comme au kramail : `built` ;
  - 7.8 page Contacts : `built` ;
  - 7.10 refactor sweep : `built` ;
  - 7.9 vrai téléphone et captures (hitl) : `in-review`.
- Les neuf tickets `built` sont au state `review` : aucun n'est encore « fait ».
- `pending_tickets` : **7.9**. Son statut est `in-review`, pas `built`. La partie agent est faite en émulation (`6788cbf`). La passe sur vrai téléphone et la validation visuelle attendent la passe finale d'Arnaud, comme il l'a décidé le 2026-10-28 (`revue-manuelle.md`, l.10).
- Commits de l'épopée (commit de ticket, puis fusion dans `feature/next`) :
  - 7.1 `9acd8d6`, `3248bfd`, fusion `95119b8` ;
  - 7.2 `b3f03b2`, fusion `9fb2ff6` ;
  - 7.3 `0e39faa`, fusion `12da4c8` ;
  - 7.4 `27daeb0`, fusion `2e65328` ;
  - 7.5 `5f679de`, `2356a54` (fusion de `feature/next` dans la branche, bug 14), `fb8ee5c`, fusion `0b27dc2` ;
  - 7.6 `550e0b7`, fusion `f48a01f` ;
  - 7.8 `de77a12`, fusion `b6efd97` ;
  - 7.7 `40c1574`, fusion `d64c578` ;
  - 7.10 `1e09292`, fusion `fe3550f`, puis `d8c8777` (stabilise `kramail-theme#redaction-palette`) ;
  - 7.9 `6788cbf`, commité directement sur `feature/next`.
- Ordre réel : 7.8 a été fusionné avant 7.7 (`b6efd97` à 10:31, `d64c578` à 10:45). Les deux plans partent de la même base `f48a01f`.
- Plages des plans, par `baseline_revision` :
  - 7.1 `55ae556..95119b8` ;
  - 7.2 `95119b8..c8c4082` ;
  - 7.3 `c8c4082..cb73530` ;
  - 7.4 `cb73530..2e65328` ;
  - 7.5 `2e65328..0b27dc2` ;
  - 7.6 `0b27dc2..f48a01f` ;
  - 7.7 et 7.8 `f48a01f..d64c578` (base commune) ;
  - 7.10 `d64c578..d8c8777` ;
  - 7.9 `d8c8777..6788cbf` (coupée au commit du ticket, inférée).
- Les plages sont entrecoupées des épopées 8 et 9 et des bugs 9.6, 14 et 15. Le volume est donc mesuré sur les seuls commits de l'épopée (`git show --numstat`), sans `git_evidence.py` par plage.
- Volume, hors bundle et `version.json` :
  - `kraland-theme.css` +979/−1416 (net −437 ; 15392 lignes aujourd'hui) ;
  - `kraland-userscript-template.js` +471/−527 (net −56 ; 11039 lignes) ;
  - nouvelle suite `tests/e2e/kramail-theme.mjs` : +2130/−68, 2343 lignes aujourd'hui ;
  - `typographie-formes.mjs` +217/−183, `lib/variantes.mjs` +93/−232, `kramail-redaction.mjs` +107/−119, `forum-activite.mjs` +85/−77 ;
  - autres suites : moins de 50 lignes chacune (`palette-nation`, `cartes-pastilles`, `router`, `confort-mobile`, `jeu-identite`, `forum-mobile`) ;
  - nouvelles fixtures synthétiques : `contacts.html` (273 lignes), `kramail-lecture-recue.html` (245), `kramail-lecture-envoi.html` (243).
- `!important` dans la feuille : 3281 (base de 7.1) → 2946 (après 7.7, inchangé par 7.10). Aucun nouveau `!important` d'après chaque plan.
- `--kd-*` : 0 occurrence dans `kraland-theme.css` et dans le template (grep sur `HEAD`).
- Preuves disponibles : fichier d'épopée, `tickets.toml`, les dix plans, commits, `revue-manuelle.md` (sections 7.1 à 7.10 et 7.9), `deferred-work.md` (reports 7.1, 7.6, 7.8, 7.10), journaux `test:all` dans `/private/tmp/kr-testall-7*.log`, captures dans `/Users/arnaud/kraland-css-captures/7.9/`. Aucun journal de session : l'analyse des leçons de processus se limite à ce que disent les plans.

## Findings

Les points déjà en attente d'Arnaud dans `revue-manuelle.md` ne sont pas repris comme découvertes. F9 les regroupe pour mémoire.

### F1. Frontière 7.7 / 7.9 : « Remonter en haut » couvre le texte saisi, trouvé par l'émulation et pas par la suite

- Source : plan 7.7, Implementation Notes (« Remonter en haut » à 20 px) et `revue-manuelle.md`, section 7.7 (« Il reste la colonne de droite (marge de 52 px d'« Envoyer ») ») ; plan 7.9, Result (écart E1 : bouton de 36×44 px en x 331–367, contenu du champ jusqu'à x 346) ; bug 16 (fusion `ade3fbb`).
- Constat : 7.7 a retiré la barre fixe et le `scroll-margin-bottom: 72px` (section 7.7 de `revue-manuelle.md`). Il a mesuré qu'« Envoyer » ne couvre plus le champ. Il n'a pas mesuré « Remonter en haut » par rapport au champ. `redaction-defilement` exige que l'élément visé soit au premier plan, mais seulement au repos. La suite était verte avec le chevauchement. Seule l'émulation du clavier de 7.9 l'a montré. Le bug 16 l'a corrigé.
- Disposition : **accept** (corrigé par le bug 16, doutes de 16 en attente d'Arnaud).
- Leçon amont : même leçon que F1 de la rétro 8. Un ticket qui retire une réserve ou une barre fixe mesure tous les éléments fixes restants contre le champ, clavier simulé compris. Le ticket de vérification final a encore trouvé un défaut qu'aucune suite ne voyait.

### F2. Machine verdict forcé par 7.9 resté `in-review`

- Source : `tickets.py status epic-kramail-mobile` (7.9 : `status: in-review`, `hitl: true`) ; plan 7.9, Result (« partie hitl ouverte ») ; `revue-manuelle.md`, l.10.
- Constat : la règle de la rétro rend le verdict machine **rejected** dès qu'un ticket est inachevé. Ici, l'inachèvement est voulu : Arnaud a fixé sa passe manuelle à la fin de tous les tickets. Le Done when 3 (« vérifié clavier ouvert sur un vrai téléphone par Arnaud ») ne peut donc pas être tenu avant cette passe.
- Disposition : **defer** (action A1). La décision appartient à Arnaud.

### F3. `test:all` : plusieurs fusions sur un `test:all` rouge, attribué sans trace

- Source : `/private/tmp/kr-testall-71.log` (4 FAIL : `modale-ordre#largeurs`, `typographie-formes#boutons`), `-73.log` (1 FAIL, `demarrage-mobile` « au plus 4 documents en 6 s »), `-74.log` (1 FAIL, `palette-nation#etats-mobile`, confederation-libre 375 px), `-75b.log` (2 FAIL, `cartes-pastilles#etiquettes`, empire-brun-dark 375 px, 07:46, fusion `0b27dc2` à 07:48), `-76.log` (1 FAIL, `kramail-redaction#regression`), `-710.log` (2 FAIL, `kramail-theme#redaction-palette`). Verts : `-72.log` (15395 ok), `-77.log` (18017 ok), `-78.log` (17919 ok), `-710b.log` (18074 ok, 12:32).
- Constat : six `test:all` de fusion sur dix sont rouges. Les échecs ressemblent à des faux FAIL de charge : un seul cas, une seule variante, verts au `test:all` suivant. Mais aucun plan ni `revue-manuelle.md` ne consigne ces échecs ni leur attribution. Seuls deux sont corrigés par commit : 7.5 (`fb8ee5c`, 28 FAIL réels de `-75.log`) et 7.10 (`d8c8777`, `redaction-palette`, instable dès `f48a01f` selon le plan 7.8). Le seul vert qui contient toute l'épopée, 18074 ok, est dans `/tmp`. Son SHA (`d8c8777`) est déduit de l'heure, comme à la rétro 8 (F3).
- Disposition : **fix now** (action A2), sans urgence : un tableau des `test:all` de l'épopée dans `revue-manuelle.md`, avec SHA, total et attribution de chaque FAIL.
- Leçon amont : la leçon F3 de la rétro 8 n'était pas encore écrite quand l'épopée 7 a été construite. Elle vaut aussi pour les `test:all` rouges : l'orchestrateur qui fusionne sur un rouge attribué écrit l'attribution.

### F4. Result des plans périmés et sans ligne de clôture

- Source : plan 7.1, Result (« arbre de travail `wt/7.1` non commité ») ; plan 7.3, Result (« Revue indépendante non faite (mandat) », puis section « Après revue ») ; plan 7.4, Result (« Statut `in-review` après la revue indépendante […] non commité ») ; plan 7.10, Result (« Sweep construit sur la base d64c578, non commité. Le `test:all` reste à lancer »).
- Constat : même défaut que F4 de la rétro 8. Les dix tickets sont commités, neuf sont fusionnés, mais les Result décrivent l'état d'avant la fusion. Le plan 7.3 garde un « Historique (premier passage) » qui contredit sa section « Après revue ».
- Disposition : **fix now**, appliqué par cette rétro à la demande de l'orchestrateur : une ligne « Clôture (orchestrateur, 2026-10-29) » par plan. L'historique du plan 7.3 n'est pas réécrit.

### F5. Deux systèmes de gardes de page pour le kramail

- Source : `deferred-work.md`, « Reports du ticket 7.10 » (« Classes `body.page-kramail*` (environ 176 sélecteurs […]) non migrées ») ; `grep -c 'body.page-kramail' kraland-theme.css` : 175 sur `HEAD` ; Notes de l'épopée (« gardes […] retirées au sweep une fois sans lecteur »).
- Constat : 7.1 pose les gardes `html.kr-page-kramail*` à côté des classes `body.page-kramail*`. L'épopée prévoyait de retirer les secondes au sweep. Le sweep ne l'a pas fait, car la migration change la spécificité de chaque règle. Les deux écritures cohabitent, et 7.8 a dû écrire `:is(body.page-kramail, :where(html.kr-page-contacts) body)` (plan 7.8, Implementation Notes).
- Disposition : **defer** (déjà consigné, action A4 pour en faire un ticket).

### F6. Spec et as-built : « lecture d'un fil » et Contacts sur mobile

- Source : Done when 2 (« lecture d'un message et d'un fil ») ; plan 7.2, Review Triage Log A1 (« Un message par page, pas de fil », fixture `kramail-lecture-fil.html` retirée) ; `revue-manuelle.md`, section 7.8 (« le tableau natif […] défile horizontalement dans la carte, sans réagencement en lignes du sous-forum »).
- Constat : le relevé du site réel montre qu'une lecture du kramail n'affiche jamais de fil. Le critère « fil » est donc sans objet ; il reste écrit dans l'épopée et dans l'entrée 2. Sur mobile, Contacts reprend la carte et les boutons du forum, mais pas la ligne du sous-forum. Le Done when 2 ne l'exige pas mot pour mot (Description : « carte de section, en-tête, onglets »).
- Disposition : **accept** pour le fil (écart de spec, à ne plus relever). Contacts mobile : question en attente d'Arnaud (F9).
- Proposition : retirer « et d'un fil » du Done when 2 et de l'entrée 2 (action A5, réconciliation de spec, à appliquer par Arnaud).

### F7. Done when 5 : 1920 px seulement dans les captures

- Source : `grep -c 1920 tests/e2e/kramail-theme.mjs` : 0 ; en-tête de la suite (largeurs 375, 767, 768, 769, 1280, 1440) ; plan 7.9, Result (captures à 1280, 1440, 1920 et 375×667).
- Constat : aucune suite de l'épopée ne mesure le kramail à 1920 px. Les captures de 7.9 le couvrent, mais elles attendent l'œil d'Arnaud. Le reste du Done when 5 est tenu : 16 variantes dans les fragments `*-couleurs` et `redaction-palette`, fixtures synthétiques.
- Disposition : **defer**. Pas de règle propre à 1920 px dans l'épopée ; la passe visuelle d'Arnaud tranche.

### F8. Hypothèses du site jamais vérifiées en vrai

- Source : `revue-manuelle.md`, sections 7.1 (page Signaler), 7.3 (lien `kramail` du fil), 7.4 (non lu `fa-envelope` sans `-open`, Envoi), 7.5 (Signaler en rédaction), 7.8 (vrais noms des catégories, texte du h1, nombre de colonnes).
- Constat : 7.1 classait Signaler en lecture par hypothèse ; 7.5 l'a reclassé en rédaction, toujours sans l'avoir vu. Le non-lu de la liste repose sur une icône jamais relevée sur un vrai message non lu.
- Disposition : **defer** (action A3). Un relevé en lecture seule couvre la plupart des points. Ouvrir un kramail non lu le marquerait lu : ce point se fait sur la liste seule.

### F9. Points en attente d'Arnaud (pour mémoire)

- Source : `revue-manuelle.md`, sections 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.10, 7.9 et bug 16.
- Points principaux :
  - 7.3 : pas de sélecteur sur la lecture ; sélecteur au bureau ; perte de la bordure primaire au bureau ;
  - 7.4 : case à cocher à droite ; signal non lu dans l'Envoi ; toucher qui ferme le menu de personnage et ouvre le message ; `padding: 0` du panneau au bureau ;
  - 7.5 : anneau de focus des outils (forum compris) ; Signaler sans fil d'Ariane ;
  - 7.6 : filet du doublon blanc cassé en sombre ; Empire Brun clair en brun ;
  - 7.7 : C1 (formulaire du forum sans barre d'outils), C2 (« Envoyer » à 14 px au lieu de 16) ;
  - 7.8 : libellés « n°1 » à « n°4 » ; tableau qui défile sur mobile, lignes d'environ 120 px ;
  - 7.9 et bug 16 : petit carré vide en haut à droite de la carte « Boîte de réception » à 1440 px ; bouton masqué dès le focus du champ.

### Vues agrégées

- Architecture : modules ajoutés `Kramail:Lecture` (priorité 33), `Kramail:Liste` (27) et `Contacts:Page`, plus `Kramail:CharacterSwitcher` réécrit. Tous passent par InitQueue et des gardes de classe de page. Le sweep partage `nommerControlesListe` et `cocherAuToucher` entre `Kramail:Liste` et `Contacts:Page` (plan 7.10). Aucune dépendance nouvelle ni cycle relevé dans les plans. `Kramail:PostMobileEnhancer` (carte `kramail-msg-*`) est réécrit par 7.2.
- Duplication : `nameControls` du forum et `nommerControlesListe` du kramail font le même travail sur des sélecteurs différents. **Accept** (consigné au sweep, `deferred-work.md`). Les doubles gardes de F5 sont la principale duplication de l'épopée.
- Taille : la feuille perd 437 lignes nettes et le template 56 : l'épopée retire plus qu'elle n'ajoute (P1 option 4). La nouvelle suite `kramail-theme.mjs` fait 2343 lignes et 24 fragments en une épopée. Elle se lit encore par fragment, mais c'est la suite qui grossit le plus vite. Pas de finding : elle est découpée par fragments routés.
- Conventions : aucun nouvel `!important` (3281 → 2946). Gardes en `:where(html.kr-page-*)`. Masques conditionnés à la base, avec condition de retrait. Le sweep a retiré les masques 7.x, sauf `AVANT_TICKET73` et `AVANT_TICKET75`, gardés sur les bases dédiées `COMMIT_MEDIAS_410` et `COMMIT_CHAMPS` (`typographie-formes.mjs` l.117, l.2044-2045, l.2381 ; `lib/variantes.mjs` l.134-142). Une règle mobile de 7.3 gardée par la classe JS `mobile-mode` a été scindée en media queries à la revue (plan 7.3, constat 10).
- Spec : CAP-8 élargi est tenu sur fixtures (voir le verdict). Comportements ajoutés hors demande, tous consignés : « Envoyer » à 14 px et anneau de focus des outils, au forum aussi (7.5, 7.7) ; menu « ••• » de la liste recalé, car il sortait de l'écran sur la base (7.4) ; libellés des catégories de Contacts (7.8).

### Revue du diff (lentilles adversarial, edge-case, verification-gap)

Faite dans le fil, sans `bmad-review` ni sous-agent : la portée est réduite aux plans, à leurs Review Triage Logs et aux commits de l'épopée. Le diff complet de 979 lignes de CSS n'a pas été relu hunk par hunk. Frontières examinées : 7.1/7.5 (Signaler), 7.5/7.7 (réserve basse et `scroll-margin-bottom`), 7.7/7.9 (F1), 7.4/7.8 (doublon des contrôles), 7.2/7.3 (en-tête de la lecture), 7.6/7.8 (flake `redaction-palette`).

- 7.1/7.5 : Signaler exclu de `-compose` par 7.1, puis reclassé en rédaction par 7.5 (A1 du plan 7.5). Cohérent sur `HEAD`, mais jamais vu sur le site (F8).
- 7.5/7.7 : 7.5 étend `scroll-margin-bottom: 72px` au kramail à cause de la barre fixe ; 7.7 retire la barre et la marge. Le doute de 7.5 (« à reprendre par l'entrée 7 ») est soldé. C'est l'origine de F1.
- 7.4/7.8 : doublon voulu, puis factorisé par 7.10. Propre.
- 7.6/7.8 : `redaction-palette` instable dès `f48a01f` (plan 7.8), fusionné en l'état, puis stabilisé par `d8c8777` après le `test:all` rouge du sweep. Le défaut a traversé trois fusions (7.8, 7.7, 7.10) avant sa correction (F3).
- Aucun autre trou de frontière trouvé dans les preuves.

## Behavior verification

Contrôle par les fixtures Playwright locales, sur le bundle commité de `HEAD` (`9759352`, arbre propre hors une capture d'écran non suivie, pas de rebuild) :

- `KR_LOGDIR=/tmp/retro7/logs npm run test:zone -- kramail` (concurrence 16, machine chargée par un autre agent) : 1621 ok, 1 FAIL. L'échec est `kramail-redaction#regression`, « lecture 375 px : rendu identique avant / après (capture pleine page octet pour octet) ». C'est le même cas que le `test:all` 76.
- Rejeu `KR_CONCURRENCY=6 KR_LOGDIR=/tmp/retro7/logs2 npm run test:zone -- kramail` : **1622 ok, 0 FAIL**, VERT.
- Ce cas a donc échoué deux fois sous charge, sans défaut constaté au rejeu. Il s'ajoute à F3 : une comparaison octet pour octet d'une capture pleine page est sensible à la charge. Non attribué plus avant.
- `test:all` cité, non relancé : `/private/tmp/kr-testall-710b.log`, 18074 ok, 0 FAIL, sur l'arbre de `d8c8777` (déduit de l'heure, F3).
- Émulation clavier ouvert, D et E du protocole P2 : faite par 7.9 (`6788cbf`), 32 cas sur 36 conformes, les 4 autres sont l'écart E1 corrigé par le bug 16. Non rejouée ici.

Limites : aucun site réel, aucun vrai téléphone, pas de Chrome 9222/9223, pas de nouvelle capture.

## Previous-retro follow-through

Rétro précédente dans l'ordre : `epic-forum/epic-forum-retrospective.md` (épopée 6), section Action items.

- A1, livraison, push ou fusion vers main (Arnaud) : **tranché**. « Non pas de fusion vers main » (`revue-manuelle.md`, l.8). Le Done when 4 se lit comme la livraison sur `feature/next`.
- A2, éteindre les masques des épopées 3 à 6 sur les bases partagées (agent) : **fait** par le backlog 11 (`7e69719`, bases réalignées sur `6270c81`), puis bases relevées à `d64c578` par le sweep 7.10 (`1e09292`).
- A3, réaligner les bases de `forum-activite` (agent) : **fait** (`7e69719`, puis `COMMIT_FIL` et `COMMIT_PLUS` sur `d64c578` dans `1e09292`).
- A4, D13 et D7 sur page dérivée (agent) : D13 **sans objet** depuis 7.7 (plus de barre fixe ; `forum-activite#envoyer` vérifie le 991 au-dessus du voile 990, plan 7.7). D7 : **aucune preuve trouvée**.
- A5, injection en début de document contre la course des infobulles (agent) : **partiel**. `kramail-theme.mjs` injecte en début de document (Notes de l'épopée, plan 7.1). Aucune garde générique trouvée pour les autres suites.
- A6, corrections des plans 6.1, 6.2 et 6.7 (agent) : **aucune preuve trouvée** (non vérifié dans les plans de l'épopée 6).
- A7, identifiants D uniques par épopée (agent) : **tenu** à l'épopée 8 (D8.n) et à l'épopée 9 (D9.n, section 9.11). L'épopée 7 n'a pas créé d'identifiant D ; ses doutes sont nommés C1 à C4 (7.7) et A/B (7.2), propres à leur section.
- A8, captures des épopées 5 et 6 (agent) : **fait** par 9.11 (`9759352`, planches `forum-epopees-5-6_*`). Les captures kramail face au forum sont faites par 7.9.
- A9, base de `kramail-redaction` (Arnaud) : **tranché** (base figée, `revue-manuelle.md` l.13) et **appliqué** par 7.10 (`d64c578`).
- A10, décisions d'Arnaud sur F7 et F11 de la rétro 6 : **tranché** en bloc le 2026-10-28 (« je vais suivre ta recommandation », `revue-manuelle.md` l.8).

## Action items

Toutes les actions sont des propositions ; Arnaud n'en a décidé aucune.

- A1. À la passe finale d'Arnaud : points D et E sur vrai téléphone, au kramail et au forum, et validation des captures de `/Users/arnaud/kraland-css-captures/7.9/`. Les captures précèdent 9.9 (marge mobile du kramail) et le bug 16 : les reprendre avant la passe avec `/Users/arnaud/kraland-css-captures/7.9/travail/de.mjs captures`. Ensuite, passer 7.9 à `built` ou `done` et réviser le verdict. Responsable : orchestrateur (captures), Arnaud (passe et verdict).
- A2. Consigner dans `revue-manuelle.md` les `test:all` de fusion de l'épopée 7 : SHA, total, et attribution de chaque FAIL (F3). Responsable : orchestrateur.
- A3. Relevé en lecture seule du kramail réel : page Signaler, lien `kramail` du fil, icône d'une ligne non lue (liste seule, sans ouvrir le message), Contacts (noms de catégorie, texte du h1, colonnes). Responsable : orchestrateur, sous le mandat de lecture.
- A4. Ouvrir un ticket pour migrer les `body.page-kramail*` (175 sélecteurs) vers les gardes `html.kr-page-kramail*`, avec preuve de spécificité. Responsable : orchestrateur (backlog).
- A5 (réconciliation de spec). Retirer « et d'un fil » du Done when 2 de `epic-kramail-mobile.md` et de l'entrée 2 : le kramail n'affiche jamais de fil (relevé du 7.2). Responsable : Arnaud.
- A6 (leçon de processus). Un ticket qui retire une réserve, une barre fixe ou une marge de défilement mesure tous les éléments fixes restants contre le champ, clavier simulé compris (F1). À ajouter aux règles communes des prochaines inceptions, avec la leçon A5 de la rétro 8. Responsable : orchestrateur (inception).

## Acceptance verdict

**rejected** (verdict machine ; critères déclarés : « Done when » d'`epic-kramail-mobile.md`).

Le rejet est forcé par le ticket inachevé **7.9** (`in-review`, hitl). Ce n'est pas un défaut de construction : Arnaud a lui-même reporté sa passe à la fin de tous les tickets. Sur les preuves, les critères se lisent ainsi :

1. Critères success de CAP-8 sur mobile : **tenus sur fixtures**. Onglets libellés et actif souligné (`kramail-theme#onglets`, `#bascule`) ; Nouveau message, Contacts et « ••• » à 44 px ; « Envoyer » dans le flux, 48 px, couleur de nation, au forum et au kramail (`kramail-theme#envoyer`, `forum-activite#envoyer`) ; plus de barre fixe.
2. Composants du forum sur chaque page et plus de `--kd-*` : **tenu**, à F6 près. `--kd-*` : 0 occurrence. Le « fil » est sans objet. Contacts mobile garde son tableau dans la carte.
3. « Envoyer » vérifié clavier ouvert sur un vrai téléphone par Arnaud : **non tenu** (A1). L'émulation de 7.9 est conforme après le bug 16.
4. Livraison : **tenu**, dans la lecture décidée par Arnaud (`feature/next`, pas de main). Bundle et `version.json` régénérés à chaque fusion. Chaque décision a son fragment. Le `test:all` vert (18074 ok) n'existe que dans `/tmp`, avec un SHA déduit (F3).
5. Largeurs et variantes : **tenu par les tests** à 375, 767-769, 1280 et 1440 px et sur 16 variantes pour les couleurs. 1920 px n'est vu que par les captures (F7). Fixtures synthétiques, aucune capture HTML brute.

Si Arnaud tient la passe finale pour hors de l'épopée, ou une fois cette passe faite, les preuves soutiennent **accepted-with-open-items**. Open items : F3, F5, F6, F7, F8 et les décisions de F9. Cette révision lui appartient.

## Open questions

- Le verdict doit-il attendre la passe finale, ou 7.9 peut-il passer `built` sur sa seule partie agent ?
- Contacts sur mobile : faut-il une ligne dédiée, comme la liste des sujets, au lieu du tableau qui défile ?
- Le Done when 2 doit-il perdre « et d'un fil » (A5) ?
- Le petit carré vide en haut à droite de la carte « Boîte de réception » (7.9, 1440 px) existe-t-il sur le site réel ?

## Assumptions

- Épopée résolue par le chemin `_bmad-output/initiative-harmonisation-ux/epic-kramail-mobile` donné par l'appelant ; `tickets.py status` a répondu.
- `pending_tickets` = [7.9] (`status: in-review`). La rétro est faite quand même, en headless, et le verdict machine est **rejected** pour cette seule raison.
- La partie hitl de 7.9 est lue comme en attente de la passe finale, par décision d'Arnaud du 2026-10-28.
- Done when 4 lu selon la décision A1 d'Arnaud (`revue-manuelle.md`, l.8) : livraison sur `feature/next`, sans fusion vers main.
- Le `test:all` de `/private/tmp/kr-testall-710b.log` est attribué à `d8c8777` d'après son heure (12:32, après le commit de 12:26). Son SHA n'est pas prouvé (F3).
- Les échecs isolés des `test:all` rouges sont lus comme des faux FAIL de charge, faute d'attribution écrite ; ils sont verts au `test:all` suivant.
- `59d5673` (masques du bug 9.6) est exclu de l'épopée 7, malgré son heure (fusion `bf8c41f` du bug 9.6).
- Plage de 7.9 coupée à `6788cbf` ; le volume est mesuré sur les seuls commits de l'épopée.
- Aucun journal de session. Les preuves sont les plans, les commits, `revue-manuelle.md`, `deferred-work.md` et les journaux de `/tmp`.
- Revue de diff à portée réduite, faite dans le fil, sans `bmad-review` (voir « Revue du diff »).
- Toutes les actions sont des propositions.
- Écritures faites à la demande de l'orchestrateur, en plus de ce document : une ligne de clôture dans les dix plans, et la section « Rétro épopée 7 » de `revue-manuelle.md`. Pas de `test:all`, pas de site réel, aucune écriture git.
