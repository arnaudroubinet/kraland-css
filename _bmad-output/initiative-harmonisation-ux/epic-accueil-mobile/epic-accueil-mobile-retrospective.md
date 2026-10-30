---
epic: epic-accueil-mobile
date: 2026-10-30
verdict: rejected
criteria: declared
headless: true
---

# Rétrospective : page d'accueil mobile

## Epic summary

- Épopée : `_bmad-output/initiative-harmonisation-ux/epic-accueil-mobile` (id 10 de l'initiative, hors lots). Elle couvre CAP-10, CAP-6 et CAP-5 étendus à l'accueil, sur demande d'Arnaud du 2026-10-29. Elle reprend D9.4 et l'action A2 de la rétro 9 pour /accueil seulement.
- Tickets (`tickets.py status`), dans l'ordre de construction :
  - 10.1 spike, relevé en lecture seule du vrai /accueil (hitl) : `built` ;
  - 10.2 fixture réaliste et suite `accueil-mobile` : `built` ;
  - 10.3 refonte mobile, marge, cartes, cibles, titres (hitl) : `built` ;
  - 10.5 message du ministre sur mobile, en carte sous Bienvenue : `built` ;
  - 10.4 refactor sweep : `built`.
- Les cinq tickets sont `built`, au state `review` : aucun n'est encore « fait ».
- `pending_tickets` : `null` dans la sortie, et vide d'après les lignes (aucun ticket hors `built`).
- L'entrée 5 a été ajoutée en cours d'épopée (`59bedf0`), sur décision d'Arnaud après le spike (Notes de l'épopée, 2026-10-30).
- Commits de l'épopée (commit de ticket, puis fusion dans `feature/next`) :
  - inception `a2c1d92` ;
  - 10.1 `e2bcdd1`, commité directement sur `feature/next` ;
  - ajout de l'entrée 5 `59bedf0`, directement sur `feature/next` ;
  - 10.2 `e966d17`, fusion `d00e6f2` ;
  - 10.3 `d9f4361`, fusion `8263059` ;
  - 10.5 `9d03df3`, fusion `1e8e6e2` ;
  - 10.4 `c8ef8c1`, fusion `697c363`.
- Ordre réel des fusions : 10.2, 10.3, 10.5, 10.4, celui de la construction. L'historique est linéaire, sans autre épopée entre les commits.
- Chaque fusion diffère de la pointe de sa branche par le seul bundle et `version.json` (2 fichiers, 5 lignes : rebuild à la fusion, `git diff <pointe> <fusion> --stat`).
- Plages des plans, par `baseline_revision`, une par plan (`git_evidence.py`) :
  - 10.1 `a2c1d92..e2bcdd1` ;
  - 10.2 `e2bcdd1..d00e6f2` ;
  - 10.3 `d00e6f2..8263059` ;
  - 10.5 `8263059..1e8e6e2` ;
  - 10.4 `1e8e6e2..697c363` (dernière plage, coupée à `HEAD`, inférée).
- Chaque plage a 1 fusion, mesurée (`merge_count` = `merges_measured`) ; `binary_revisions` à 0 partout.
- Volume, hors bundle, `version.json` et fichiers BMad :
  - `kraland-theme.css` : +226/−234 (10.3), +73/−12 (10.5), +17/−38 (10.4). La feuille passe de 15308 à 15340 lignes ;
  - `kraland-userscript-template.js` : +3/−1 (10.3, une ligne de `KR_PAGE_CLASSES`). 11041 lignes ;
  - nouvelle suite `tests/e2e/accueil-mobile.mjs` : +259 (10.2), +360/−22 (10.3), +135/−22 (10.5). 710 lignes, 11 fragments ;
  - nouvelle fixture `tests/e2e/fixtures/accueil.html` : 336 lignes ;
  - `lib/router.mjs` +23/−8, `router.test.mjs` +31/−3, `tests/unit/identite.test.mjs` +2, skill `tester-kraland-css` (deux copies, une ligne).
- `!important` dans la feuille : 2943 (`a2c1d92`) → 2900 (10.3) → 2900 (10.5) → 2898 (`697c363`). Aucun nouveau `!important` : 10.3 retire les 43 de l'ancien bloc mobile, 10.4 en retire 2.
- `test:all` de l'épopée (`/private/tmp/kr-testall-10*.log`) :
  - `-102.log` (01:16, fusion `d00e6f2` à 01:17) : 18497 ok, 1 FAIL `kramail-theme#confort` ;
  - `-103.log` (02:41, fusion `8263059` à 02:42) : 18761 ok, 1 FAIL `kramail-theme#confort` ;
  - `-105.log` (03:34, fusion `1e8e6e2` à 03:34) : 18840 ok, 0 FAIL ;
  - `-104.log` (04:12, fusion `697c363` à 04:12) : 18840 ok, 0 FAIL.
- Preuves disponibles : fichier d'épopée, `tickets.toml`, les cinq plans, les commits, `revue-manuelle.md` (sections « Épopée accueil mobile » et Tickets 10.1 à 10.4), `deferred-work.md` (D9.4 repris), les journaux `test:all` ci-dessus et les journaux de fragment de `/var/folders/.../kraland-e2e-*`, captures et squelettes hors dépôt (`/Users/arnaud/kraland-css-captures/10.1/` et `10.3/`).
- Manquent : journaux de session ; captures de 10.5 (`kraland-css-captures/10.5/` jamais créé, session déconnectée) ; rapports des revues indépendantes, connus seulement par les Review Triage Logs et les Implementation Notes des plans.

## Findings

Les points déjà en attente d'Arnaud dans `revue-manuelle.md` ne sont pas repris comme découvertes. F10 les regroupe pour mémoire.

### F1. Done when 4 non tenu : le vrai /accueil connecté n'a jamais été vu après la refonte

- Source : Done when 4 de l'épopée ; plan 10.1, Result (relevé connecté le 2026-10-30, avant toute refonte) ; plan 10.3, Implementation Notes (« Vrai /accueil (session déconnectée) : HTML natif lu en mémoire… ») ; `revue-manuelle.md`, Ticket 10.3 (« À revoir connecté ») et Ticket 10.5 (« je n'ai fait ni vérification sur le site ni captures ») ; plan 10.5, Verification (« session du Chrome dédié déconnectée ce jour »).
- Constat :
  - le spike 10.1 a vu l'accueil connecté, mais avec la peau d'avant la refonte ;
  - 10.3 n'a vu que l'accueil déconnecté, rejoué dans un Chromium local avec le bundle du worktree : marge, cibles et en-tête Nouvelles conformes à 375 et 320 ;
  - 10.5 n'a rien vu du site ;
  - aucune mesure du vrai accueil connecté n'existe donc avec la peau livrée. Bienvenue, Jouer, Forum, ligne `/aide` et ministre ne sont mesurés que sur fixture.
- Disposition : **defer** (action A1). C'est le seul critère non tenu. Il ne demande qu'une session ouverte : l'agent peut faire l'émulation sous le mandat de lecture.
- Leçon amont : un ticket hitl qui dépend d'une session ouverte vérifie la session au départ. Sinon, il note dès le départ que son critère sur site restera ouvert, au lieu de le découvrir en cours de route.

### F2. Deux revues indépendantes sur trois trouvent l'ordre de l'accueil déconnecté faux

- Source : plan 10.3, Review Triage Log (« Revue indépendante : accueil déconnecté, formulaire et forum natif après les Nouvelles », high) ; plan 10.5, Review Triage Log (« (indépendante 1) Déconnecté : ministre au-dessus du formulaire », medium) ; Boundaries de l'épopée (« Hors périmètre : […] l'accueil déconnecté ») et Assumption (« l'entrée 3 vérifie que l'accueil déconnecté ne casse pas »).
- Constat :
  - les deux entrées qui touchent l'ordre (`order`) ont cassé l'accueil déconnecté. Leurs suites étaient vertes, et la revue indépendante a trouvé le défaut les deux fois ;
  - la variante déconnectée de la suite est dérivée en mémoire. Elle repose sur une supposition : « le bloc ajouté après `#col-t` […] est une supposition, faute de HTML brut versionné » (`revue-manuelle.md`, Ticket 10.3) ;
  - la présence du panneau du ministre en déconnecté est inconnue (Ticket 10.5).
- Disposition : **accept** pour les deux instances, corrigées et verrouillées par le fragment `deconnecte`. La structure déconnectée reste à confirmer (A1).
- Leçon amont : une frontière écrite « hors périmètre, mais ne doit pas casser » est un état à tester dès l'entrée qui pose la fixture (10.2), pas un cas que l'entrée de rendu découvre. Le spike relève les deux états quand l'épopée en nomme deux.

### F3. Les revues indépendantes trouvent ce que les suites vertes laissent passer

- Source : plan 10.3, Review Triage Log (garde `#content *` trop large, medium ; contrôle medkit « vert sans mesure quand masquée », medium ; retrait du premier texte non mesuré, low) ; plan 10.5, Review Triage Log (écarts entre cartes non mesurés, enfant inconnu de `#col-right` non couvert, `overflow: hidden` qui coupe le contenu) ; plan 10.2, Result (revue indépendante « OK avec correctifs », six correctifs de fixture).
- Constat :
  - 10.3 et 10.5 ont fusionné sur des suites vertes. Les revues indépendantes y ont trouvé sept trous réels : un ordre, une garde trop large, un faux vert, trois mesures manquantes et un débordement ;
  - le faux vert du medkit est le motif le plus net : un contrôle « sans recouvrement » réussit quand l'élément est masqué ;
  - chaque correctif a reçu sa contre-épreuve rouge (plans 10.3 et 10.5, Result).
- Disposition : **accept** (corrigés). C'est un point fort de l'épopée : la règle AGENTS.md « la vérification de l'implémenteur ne vaut pas approbation » a payé à chaque ticket de code.
- Leçon amont : un contrôle d'absence (recouvrement, débordement, élément masqué) asserte aussi l'état qu'il suppose. Sinon il réussit à vide.

### F4. Done when 3 démontré en partie : contraste des 16 variantes limité aux titres et aux compteurs

- Source : Done when 3 ; `tests/e2e/accueil-mobile.mjs`, fragment `contraste` (sélecteurs : titres de carte, `.kraland-metrics h4.count`, `.kraland-metrics p`) ; `kraland-theme.css`, bloc mobile de l'accueil : « Jouer » en paire `--kr-arm-bg` / `--kr-arm-ink` (l.~11628-11637), nom de Bienvenue, lignes du forum et nouvelles en `--kr-text-primary` (l.~11657, 11715, 11730, 11819).
- Constat :
  - les règles de couleur réécrites pour « Jouer », Bienvenue, les lignes du forum et les nouvelles ne sont pas mesurées dans les 16 variantes par `accueil-mobile` ;
  - elles réutilisent des paires de rôle déjà vérifiées ailleurs (épopée 3, paires d'action et texte sur surface). Le risque est donc faible ;
  - aucune suite ne lit ces sélecteurs de l'accueil en 16 variantes : `palette-nation.mjs` ne cite pas `accueil-play-btn` (grep), et seul l'accueil synthétique de `palette-nation-accueil.html` porte les compteurs et une ligne `.ds_forum`.
- Disposition : **defer** (action A3) : ajouter « Jouer », le nom de Bienvenue et les lignes du forum au fragment `contraste`, ou accepter la couverture par les paires de rôle.

### F5. `kramail-theme#confort` : le flake de la rétro 9 revient à deux fusions sur quatre

- Source : `/private/tmp/kr-testall-102.log` et `-103.log` (1 FAIL chacun, `kramail-theme#confort`) ; journaux de fragment `kraland-e2e-iNwwQp/kramail-theme_confort.log` et `kraland-e2e-H7Pknl/kramail-theme_confort.log` (« confort nouveau bascule 767>768>767 étape 2 (768) : textes égaux au bundle de base 7bec452 », idem pour `lecture-recue`) ; rétro 9, F6 et A5.
- Constat :
  - c'est le même cas que le FAIL de 912 à la rétro 9. L'épopée 10 ne touche pas le kramail ;
  - la reprise « verte, rejouée seule 2/2 » vient de l'orchestrateur. Aucun plan ni `revue-manuelle.md` ne l'écrit ;
  - rejoué seul ici sur `697c363` : 366 ok, 0 échec (Behavior verification) ;
  - les deux derniers `test:all` (105, 104) sont verts, à 18840 ok.
- Disposition : **defer** (action A4, reprise de A5 de la rétro 9, non faite).

### F6. `test:all` : SHA déduits de l'heure, attribution des FAIL non écrite

- Source : journaux `-102` à `-104` (aucun SHA dans le journal, en-tête `node tests/e2e/run.mjs all`) ; heures des fusions (`git log`) ; plans 10.2, 10.3 et 10.5 (aucun total de `test:all`) ; plan 10.4, Result (« `test:all` reste à lancer par le coordinateur ») ; rétro 9, A4.
- Constat :
  - chaque journal finit dans la minute de la fusion. Son arbre est déduit de l'heure, comme aux rétros 7, 8 et 9 ;
  - le vert final `-104.log` (18840 ok) a été lancé avant la fusion `697c363` : il a duré 333 s et `c8ef8c1` date de 04:06. Comme la fusion ne diffère de `c8ef8c1` que par le bundle rebuildé et `version.json`, la feuille et le template testés sont bien ceux de `HEAD` ;
  - aucun plan n'écrit le `test:all` de sa fusion, ni l'attribution des FAIL de 102 et 103.
- Disposition : **fix now**, appliqué par les lignes de clôture (F7), qui citent chaque journal. Leçon déjà écrite (A4 de la rétro 9) : le lanceur de `test:all` écrit le SHA testé dans le journal.

### F7. Result des plans périmés

- Source : plan 10.1, Result (« Clôture : spike en revue ; aucune revue indépendante faite ») ; plan 10.5, Result (« Rien n'est commité. ») ; plan 10.4, Result (« Rien n'est commité. ») ; plans 10.2 et 10.3, sans ligne de fusion.
- Constat : même défaut que F7 de la rétro 9 et F4 des rétros 7 et 8. Les cinq tickets sont commités et quatre sont fusionnés, mais aucun plan ne le dit.
- Disposition : **fix now**, appliqué par cette rétro à la demande de l'orchestrateur : une ligne « Clôture (orchestrateur, 2026-10-30) » à la fin de chacun des cinq plans. Les Result eux-mêmes ne sont pas réécrits.

### F8. Spec et as-built : E10.5, DESIGN.md et EXPERIENCE.md en retard sur la décision du ministre

- Source : E10.5 de l'épopée (« carrousel absent sur mobile (`#col-right` masqué) », « ordre mobile actuel des blocs ») ; Notes de l'épopée, Decision du 2026-10-30 (entrée 5) ; plan 10.5, Result (`#col-right` affiché en colonne flex, ministre entre Bienvenue et Forum) ; `ux-harmonisation/EXPERIENCE.md` l.55 (ligne Accueil : seuls les compteurs en accent changent) ; `DESIGN.md`, Carte de section (jeu, forum et kramail, pas l'accueil) ; Source conflicts de l'épopée.
- Constat :
  - E10.5 décrit encore `#col-right` masqué et l'ordre d'avant l'entrée 5. L'as-built suit la décision d'Arnaud : le texte du critère est périmé, pas le code ;
  - les conflits de source notés à l'inception (DESIGN.md, EXPERIENCE.md, CAP-6 sans l'accueil) sont toujours ouverts. Aucun fichier de la spec ni de l'UX n'a changé dans l'épopée.
- Disposition : **accept** pour l'écart d'E10.5 (décision d'Arnaud, à ne plus relever). Réconciliation proposée (action A5).

### F9. Code mort sur le vrai site : `.kr-ministerial-card` et `transformMinisterialAlert`

- Source : plan 10.1, F11 (« `transformMinisterialAlert` n'agit pas : le message du ministre est un `.panel`, pas une `.alert` ») ; `kraland-theme.css` l.11456-11473 (bureau) et l.11672-11690 (mobile, `.kr-ministerial-card`) ; `revue-manuelle.md`, Ticket 10.4 (« La règle `.kr-ministerial-card` mobile reste sans cas réel connu […] gardée pour les fixtures synthétiques »).
- Constat : 10.3 a réécrit le style mobile de la carte ministérielle synthétique, puis 10.5 a stylé le vrai panneau par un autre chemin. Les deux coexistent ; seule la fixture `palette-nation-accueil.html` exerce le premier.
- Disposition : **defer**. Décision d'Arnaud (déjà posée en 10.4) : retirer la règle, ses contrôles et la transformation, ou les garder pour un éventuel bandeau `.alert`.

### F10. Points en attente d'Arnaud (pour mémoire)

- Source : `revue-manuelle.md`, sections « Épopée accueil mobile » et Tickets 10.1 à 10.4.
- Points principaux :
  - inception : CAP-6 et l'accueil, passage par `bmad-ux` ou `bmad-spec`, ligne 10 de `lots-de-livraison.md`, reste de A2 (forum Staff, /help sur ordinateur) ;
  - 10.1 : ordre mobile gardé, avec les Nouvelles en dernier ;
  - 10.2 : routage du mot-clé de l'accueil vers palette-nation et typographie-formes ;
  - 10.3 : medkit masqué plutôt que réduit ; en-tête Nouvelles passé de l'accent à la surface ; cartes blanches sur fond blanc en clair ; flash possible avant `DOMContentLoaded` ;
  - 10.5 : titre du ministre sur deux lignes ; onglets de drapeaux sur deux lignes ; panneau servi en déconnecté ? ; liens texte du message sous 44 px ; chevron de repli non exercé ;
  - 10.4 : garde des cartes toujours recopiée dix fois ; `.kr-ministerial-card` (F9).

### Vues agrégées

- Architecture : aucun module InitQueue ajouté. Le seul changement JS est une ligne de `KR_PAGE_CLASSES` (`^/(?:accueil)?$`, `kr-page-accueil` et `kr-marge-mobile`), avec un test unitaire de motif (`identite.test.mjs`, positifs et négatifs). La marge commune `:where(html.kr-marge-mobile)` est réutilisée telle quelle, et elle corrige aussi le pied (F9 du spike).
- Couplage des règles génériques : pour éviter tout nouvel `!important`, 10.3 et 10.5 posent des exclusions de l'accueil dans des règles communes. On compte 19 occurrences de `kr-page-accueil` hors du bloc de l'accueil : `.list-group-item.active` l.1106-1109 (hors media), « Empiler les colonnes » l.4413-4416, listes l.4453-4474 et l.4734-4760, l.5447, chevron l.6974. **Accept** : c'est le prix de −45 `!important`, documenté dans les plans. Une règle commune réécrite plus tard doit garder ces exclusions.
- Duplication : la garde des quatre cartes est recopiée dix fois. 10.4 l'a raccourcie, sans la factoriser (classe JS écartée, fenêtre avant `DOMContentLoaded`). Deux gardes de page cohabitent : `body.page-accueil` (bureau, JS) et `html.kr-page-accueil` (mobile). Même motif que F5 de la rétro 7. **Accept** : le bureau est hors périmètre.
- Taille : la feuille gagne 32 lignes nettes sur l'épopée et le template 2. La nouvelle suite fait 710 lignes en 11 fragments routés. Pas de finding.
- Conventions : règles mobiles en `@media (max-width: 767px)`, gardes en `:where(html.kr-page-accueil)`. Une exception justifiée : la garde ajoutée à la règle globale l.1106, hors media (plan 10.3, Implementation Notes). Le couplage à 4.9 est contourné par une marge négative (−16 px, l.11545). L'écart de 8 px la verrouille (plan 10.5), mais un changement de la marge commune des panneaux la cassera en silence côté rendu : seul le test d'écart le verra.
- Spec : E10.1 à E10.4 tenus sur fixture (voir le verdict). Ajouts hors demande, tous consignés : accueil déconnecté traité (formulaire, lignes natives, « Se souvenir de moi » à 13 px) ; libellés des compteurs en texte secondaire et sans capitales ; repli des URL longues du message.

### Revue du diff (lentilles adversarial, edge-case, verification-gap)

Faite dans le fil, sans `bmad-review` ni sous-agent. La portée est réduite aux plans, à leurs Review Triage Logs, au diff du template, aux gardes et aux règles de couleur du bloc mobile. Le diff CSS (524 lignes) n'a pas été relu hunk par hunk. Frontières examinées :

- 10.1/10.2 (relevé après la peau contre fixture native) : trois positions natives supposées (`revue-manuelle.md`, Ticket 10.2). Le vrai rendu connecté ne les a pas confirmées (F1).
- 10.2/10.3 (`COMMIT_AVANT` = `e2bcdd1`) : la base du bureau reste fixe, et le rouge de 10.3 est prouvé par `KR_SCRIPT`. Cohérent.
- 10.3/10.5 (numérotation `order`, colonne `#col-right`) : deux fois le même trou côté déconnecté (F2). Sur `HEAD`, l'ordre déconnecté est verrouillé par le fragment `deconnecte`.
- 10.5/10.4 (constats 7 et 8) : le plan 10.5 les écrit en entier (Implementation Notes), et 10.4 les reprend (Intent, points 3 et 4). L'orchestrateur signale qu'ils n'avaient été transmis que par leurs numéros au premier envoi. Ce n'est vérifiable dans aucun fichier : voir Assumptions.
- 10.3/4.9 (`DECLARATIONS_ESPACEMENT_TICKET49`) : le sélecteur figé par 4.9 oblige la marge négative de 10.5 (vues agrégées).
- Aucun autre trou de frontière trouvé dans les preuves.

## Behavior verification

Contrôle par les fixtures Playwright locales, sur le bundle commité de `HEAD` (`697c363`, arbre propre, pas de rebuild, charge moyenne 1,7) :

- `KR_CONCURRENCY=6 KR_LOGDIR=/tmp/retro10/logs npm run test:zone -- accueil-mobile` : **400 ok, 0 FAIL**, VERT (11 fragments).
- `npm run test:router` : « Routeur conforme », code 0.
- `KR_FRAG=confort node tests/e2e/kramail-theme.mjs` (le cas de F5) : 366 ok, 0 échec.
- `test:all` cités, non relancés : `-105.log` et `-104.log` (18840 ok, 0 FAIL).
- Vrai /accueil : non exercé (F1).

Limites : aucun site réel, aucun vrai téléphone, pas de Chrome 9222/9223, pas de nouvelle capture, pas de `test:all`.

## Previous-retro follow-through

Rétro précédente dans l'ordre des `epics` : `epic-plateau-confort-mobile/epic-plateau-confort-mobile-retrospective.md` (épopée 9).

- A1, passe finale des quatre parcours et passage de 9.11 (Arnaud) : **non fait**. 9.11 est toujours `in-review` (`tickets.py status epic-plateau-confort-mobile`).
- A2, marge « sur toutes les pages » (orchestrateur, Arnaud) : **fait pour /accueil**. Le relevé est fait (10.1, `e2bcdd1`) et la classe est posée (10.3, `d9f4361`, template l.316-317). Staff et /help sur ordinateur : **non tranchés** (`revue-manuelle.md`, section « Épopée accueil mobile », « reste de A2 »).
- A3, ticket des `<button>` mobiles sous 44 px (orchestrateur, Arnaud) : **aucune preuve trouvée**. Aucun `tickets.toml` ne cite `kd-contacts` ni `kd-chip-x`.
- A4, tableau des `test:all` de l'épopée 9 et vert sur `6fbdba0` (orchestrateur) : **tableau non fait** (aucun dans `revue-manuelle.md`). Un vert sur `HEAD` est obtenu plus tard, sur `1e8e6e2` et `697c363` (`-105.log`, `-104.log`), et il couvre l'épopée 9.
- A5, stabiliser `demarrage-mobile#desktop+pire-cas…`, surveiller `kramail-theme#confort` (orchestrateur) : **non fait**. `demarrage-mobile` n'échoue dans aucun `test:all` de l'épopée 10. `kramail-theme#confort` échoue deux fois (F5).
- A6, inventaire des `body.page-*` et recouvrement des cibles voisines (orchestrateur, inception) : **partiel**. Le toucher aux cinq points (`elementFromPoint`, `lib/marges.mjs` l.67-94) est appliqué par 10.3 (I/O, « touchées aux 5 points »). La règle n'est écrite ni dans l'épopée 10 ni dans des règles communes d'inception. L'inventaire ne s'applique pas à une épopée d'une seule page.

## Action items

Toutes les actions sont des propositions ; Arnaud n'en a décidé aucune.

- A1. Dès qu'Arnaud ouvre une session Kraland dans le Chrome dédié : émulation en lecture seule du vrai /accueil connecté à 375×667 et 320 px, avec le bundle de `HEAD`. Mesurer E10.1 à E10.4 (marge, cibles aux cinq points, cartes, échelle), le ministre sous Bienvenue et le carrousel absent, sans clic ni `/report`. Les captures vont dans `kraland-css-captures/10.5/`. Confirmer aussi, en déconnecté, la structure supposée et la présence du panneau (F1, F2). Ensuite, réviser le verdict. Responsable : orchestrateur (sous le mandat de lecture), Arnaud (session).
- A2 (leçon de processus). Un ticket hitl vérifie la session au départ et écrit tout de suite si son critère sur site restera ouvert. Une frontière « hors périmètre, ne doit pas casser » entre dans la fixture dès l'entrée qui la pose. Un contrôle d'absence asserte l'état qu'il suppose (F1, F2, F3). Responsable : orchestrateur (règles communes des inceptions, avec A6 de la rétro 9).
- A3. Étendre le fragment `contraste` d'`accueil-mobile` à « Jouer », au nom de Bienvenue et aux lignes du forum, ou écrire que la couverture par les paires de rôle suffit (F4). Responsable : orchestrateur (backlog).
- A4. Stabiliser `kramail-theme#confort` (bascule 767 > 768 > 767, « textes égaux au bundle de base 7bec452 ») ou le sortir du parallélisme de `test:all`. Faire écrire au lanceur le SHA testé dans le journal (F5, F6 ; reprend A4 et A5 de la rétro 9). Responsable : orchestrateur (ticket).
- A5. Réconciliation de spec, à appliquer par Arnaud : réécrire E10.5 (ministre affiché sous Bienvenue, seul `#myCarousel` masqué sur mobile, ordre Jouer, Bienvenue, Ministre, Forum, Compteurs, Nouvelles). Trancher les conflits de source de l'inception : accueil dans la Carte de section de DESIGN.md, ligne Accueil d'EXPERIENCE.md, CAP-6 (F8). Responsable : Arnaud (décision), `bmad-spec` ou `bmad-ux` s'il le veut.
- A6. Décider du sort de `.kr-ministerial-card` et de `transformMinisterialAlert`, sans cas réel connu (F9). Responsable : Arnaud.

## Acceptance verdict

**rejected** (verdict machine ; critères déclarés : « Done when » d'`epic-accueil-mobile.md`). Aucune décision humaine.

Les cinq tickets sont `built` : le rejet n'est pas forcé par un ticket inachevé. Il vient d'un critère non tenu, le Done when 4. Sur les preuves, les critères se lisent ainsi :

1. E10.1 à E10.4 à 320, 375×667, 700 et 767 px, deux variantes, bascule dans les deux sens : **tenu sur fixture**. Les fragments `marge`, `cibles`, `cartes`, `echelle` et `bascule` (`LARGEURS_E10 = [320, 375, 700, 767]`) sont rouges sur la base et verts sur `HEAD` (400 ok).
2. Bureau égal à la base de 768 à 1920 px, E10.5 sur les deux supports : **tenu**. Le fragment `bureau` couvre 768, 769, 1280, 1440 et 1920 contre `e2bcdd1`, le fragment `carrousel` couvre 1280 et 375, et le sweep compare les styles calculés jusqu'à 3840 px (0 écart). E10.5 est lu selon la décision du ministre (F8).
3. Couleurs dans les 16 variantes : **tenu en partie**. Titres de carte et compteurs sont mesurés ; « Jouer », Bienvenue, les lignes du forum et les nouvelles ne le sont pas sur l'accueil (F4).
4. Vrai /accueil en émulation à 375×667, sans écart : **non tenu** (F1). Seul l'accueil déconnecté a été rejoué avec la peau de 10.3. Il n'y a ni HTML brut ni capture dans le dépôt.
5. Livraison : **tenu**. Fusions sur `feature/next` (fusion locale, sans PR GitHub, comme aux épopées précédentes), bundle et `version.json` régénérés, au moins un fragment par décision, `test:all` vert à 18840 ok sur l'arbre de `697c363` (SHA déduit, F6), `test:router` vert.

Une fois A1 fait sans écart, les preuves soutiennent **accepted-with-open-items**. Open items : F4 (contraste partiel), F5 (flake), F8 (réconciliation de spec), F9 (code mort) et les décisions de F10. Arnaud peut aussi tenir le Done when 4 pour reporté à sa passe finale et réviser le verdict lui-même.

## Open questions

- Le Done when 4 attend-il une session ouverte pour l'agent (A1), ou la passe finale d'Arnaud ?
- Le panneau du ministre est-il servi aux visiteurs déconnectés ? La variante de la suite le suppose.
- La couverture du contraste par les paires de rôle suffit-elle pour « Jouer » et les textes de l'accueil (F4) ?
- E10.5 et les fichiers UX doivent-ils être réécrits après la décision du ministre (F8) ?

## Assumptions

- Épopée résolue par le chemin donné par l'appelant. `tickets.py status` a répondu avec `pending_tickets: null` ; les cinq lignes sont `built`, la liste des inachevés est donc vide.
- Le verdict machine est **rejected** à cause du Done when 4 non tenu, sans décision humaine. Il n'est pas forcé par un ticket inachevé.
- Les journaux `test:all` de `/private/tmp` sont attribués aux arbres des fusions d'après leur heure ; leurs SHA ne sont pas prouvés. L'arbre de `-104.log` est lu comme celui de `697c363`, car la fusion ne diffère de `c8ef8c1` que par le bundle rebuildé et `version.json`.
- La reprise verte 2/2 des FAIL de 102 et 103 vient de l'orchestrateur, sans trace écrite. Elle concorde avec le vert de `kramail-theme#confort` rejoué ici.
- Revues indépendantes : 10.2, 10.3 et 10.5 sont connues par leurs plans. L'approbation de 10.4 vient de l'orchestrateur : le plan 10.4 n'inscrit qu'une revue quick par sous-agent (1 low). Le spike 10.1 n'a pas de revue indépendante (plan 10.1).
- Constats 7 et 8 de 10.5 « transmis par numéros seulement au premier envoi » : signalé par l'orchestrateur comme un défaut du coordinateur, sans trace dans les fichiers. Le plan 10.5 porte leur texte complet, et 10.4 les a appliqués. C'est une leçon de processus, pas un finding : une consigne passée d'un agent à l'autre porte son texte, pas son numéro.
- Aucun journal de session. Les preuves sont les plans, les commits, `revue-manuelle.md`, les journaux de `/tmp` et les sorties de `git_evidence.py`.
- Revue de diff à portée réduite, faite dans le fil, sans `bmad-review` (voir « Revue du diff »).
- Toutes les actions sont des propositions.
- Écriture faite à la demande de l'orchestrateur, en plus de ce document : une ligne de clôture à la fin de chacun des cinq plans. Le workflow de rétro interdit d'ordinaire de modifier les plans ; la demande explicite de l'orchestrateur prime, comme aux rétros 7 et 9. Pas de `deferred-work.md` : le workflow ne l'exige pas, et les reports de l'épopée sont dans `revue-manuelle.md`. Pas de `test:all`, pas de site réel, aucune écriture git, aucune modification du code, des tests ni du bundle.
