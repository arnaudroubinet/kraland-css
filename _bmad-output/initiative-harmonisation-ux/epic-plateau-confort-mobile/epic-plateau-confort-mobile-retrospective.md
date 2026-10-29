---
epic: epic-plateau-confort-mobile
date: 2026-10-29
verdict: rejected
criteria: declared
headless: true
---

# Rétrospective : plateau, confort mobile

## Epic summary

- Épopée : `_bmad-output/initiative-harmonisation-ux/epic-plateau-confort-mobile` (id 9 de l'initiative). Elle couvre CAP-10 : avatar de 70 px et nom dessous sur les cartes étroites au bureau ; cibles non textuelles ≥ 44×44 px sur mobile (48 pour la croix) ; marge latérale de 16 px « sur toutes les pages ».
- Tickets (`tickets.py status`), dans l'ordre de construction :
  - 9.1 marge latérale de 16 px, socle et pages de jeu : `built` ;
  - 9.2 carte de personnage selon sa propre largeur, avatar de 70 px : `built` ;
  - 9.3 spike, relevé des pages mobiles hors fixtures : `built` ;
  - 9.4 pages secondaires, marge et cibles : `built` ;
  - 9.5 plateau mobile, cibles des cartes, des groupes et du mini-profil : `built` ;
  - 9.6 bug, démarrage réel sur téléphone : `built` ;
  - 9.7 cercle et barre de PV sans couleurs en dur : `built` ;
  - 9.8 forum mobile, marge et cibles : `built` ;
  - 9.9 kramail mobile, marge et cibles : `built` ;
  - 9.10 notifications mobiles, marge et cibles : `built` ;
  - 9.13 membres et fenêtre d'aide, marge et cibles : `built` ;
  - 9.12 refactor sweep : `built` ;
  - 9.11 parcours clés et captures de validation (hitl) : `in-review`.
- Les douze tickets `built` sont au state `review` : aucun n'est encore « fait ».
- `pending_tickets` (clé absente de la sortie, dérivé à la main) : **9.11**, `in-review`. La partie agent est faite en émulation (`9759352`). La partie hitl (Done when 2) attend la passe finale d'Arnaud, reportée par lui à la fin de tous les tickets.
- Commits de l'épopée (commit de ticket, puis fusion dans `feature/next`) :
  - 9.6 `fb674d8`, fusion `0a15486` ; masques `59d5673`, fusion `bf8c41f` ; rebuild `a541a52` ;
  - 9.3 `f9383ba`, commité directement sur `feature/next` ;
  - 9.2 `4540719`, fusion `de4c079` ;
  - 9.1 `c820993`, fusion `9b6851a` ;
  - 9.4 `ec66ba6`, fusion `724c5c1` ;
  - 9.13 `5916cab` (relevé `034a820`), fusion `be44760` ;
  - 9.5 `0045caa`, fusion `cb73530` ;
  - 9.8 `01a8aae`, fusion `49d31df` ;
  - 9.10 `3ca5bc9`, fusion `fde18e7` ;
  - 9.7 `9408411`, fusion `693f307` ;
  - 9.9 `225fef2`, fusion `7bec452` ;
  - 9.11 `9759352`, commité directement sur `feature/next` ;
  - 9.12 `db81317`, fusion `6fbdba0`.
- Ordre réel des fusions (heures de `git log`) : 9.6, 9.2, 9.1, 9.4, 9.13, 9.5, 9.8, 9.10, 9.7, 9.9, 9.12. Il diffère de l'ordre de construction : 9.2 a été fusionné avant 9.1, et 9.13 avant 9.5.
- Plages des plans, par `baseline_revision` : 9.1 et 9.2 `e203f87` ; 9.3 et 9.6 `22b5582` ; 9.4 `9b6851a` ; 9.5 `724c5c1` ; 9.7 `cb73530` ; 9.8 `724c5c1` ; 9.9 `d8c8777` ; 9.10 `8420e3a` ; 9.13 `034a820` ; 9.11 et 9.12 `7bec452`. Les plages sont entrecoupées des épopées 7 et 8. Le volume est donc mesuré sur les seuls commits de l'épopée (`git show --numstat`).
- Volume, hors bundle et `version.json` :
  - `kraland-theme.css` +435/−280 ; la feuille passe de 15570 à 15308 lignes (toutes épopées confondues) ;
  - `kraland-userscript-template.js` +98/−244 ; 11211 → 11039 lignes ;
  - `confort-mobile.mjs` +877/−46 (830 lignes aujourd'hui), `plateau-qualite-usage` +312/−11, `forum-activite` +210/−52, `kramail-theme` +172/−16, `lib/marges.mjs` +139/−38 (101 lignes), `report-non-lu` +132/−13, `demarrage-mobile` +123/−9, `typographie-formes` +129/−179, `cartes-pastilles` +74/−99 ;
  - nouvelles fixtures synthétiques : `secondaires-*.html`, `aide*.html`, `forum-index-hrp`, `forum-index-debats`, `forum-nouveau-sujet`, `forum-reponse-bloquee`, `plateau-cartes-noms`, `demarrage-plateau`.
- `!important` dans la feuille : 3281 (`e203f87`) → 2943 (`6fbdba0`), toutes épopées confondues. Les plans ne déclarent aucun nouvel `!important` net.
- Jetons posés : `--kr-margin-mobile: 16px` (l.39), `--kr-touch-target: 44px` (l.40), `--kr-touch-target-dpad: 48px` (l.42), alias `--kr-marge-page` (l.6924).
- Preuves disponibles : fichier d'épopée, `tickets.toml`, les treize plans, commits, `revue-manuelle.md` (sections 9.x), `deferred-work.md` (reports 9.x, D9.2 à D9.5, reports du sweep), journaux `test:all` dans `/private/tmp/kr-testall-9*.log`, captures dans `/Users/arnaud/kraland-css-captures/9.11/`. Aucun journal de session.

## Findings

Les points déjà en attente d'Arnaud dans `revue-manuelle.md` ne sont pas repris comme découvertes. F10 les regroupe pour mémoire.

### F1. Machine verdict forcé par 9.11 resté `in-review`

- Source : `tickets.py status epic-plateau-confort-mobile` (9.11 : `in-review`, `hitl: true`) ; plan 9.11, Result ; Done when 2 (« Arnaud joue les quatre parcours clés »).
- Constat : la règle de la rétro rend le verdict machine **rejected** dès qu'un ticket est inachevé. Ici, l'inachèvement est voulu : Arnaud a fixé sa passe manuelle à la fin de tous les tickets. Le Done when 2 ne peut pas être tenu avant cette passe.
- Disposition : **defer** (action A1). La décision appartient à Arnaud.

### F2. CAP-10 « sur toutes les pages » : trois trous de marge

- Source : `KR_PAGE_CLASSES` (template l.307-316) ; D9.4 (`deferred-work.md`, plan 9.11) ; plan 9.8 (Staff exclu) ; plan 9.13, Never (marge de `/help` sur ordinateur).
- Constat : `kr-marge-mobile` couvre les pages de jeu, /aide, les pages secondaires, /help et /report ; le forum et le kramail ont leurs propres gardes. Trois cas restent hors de la règle :
  - /accueil : absent de `KR_PAGE_CLASSES`, texte à 0 px du bord à 375 px (D9.4, trouvé par l'émulation de 9.11, pas par les suites) ;
  - forum Staff : exclu par 9.8, décision en attente ;
  - /help sur ordinateur : hors périmètre de 9.13 (« Never : marge de `/help` sur ordinateur », non reproductible sur fixture : 15 px contre 0 px relevé sur le site).
- Disposition : **defer** (action A2). /accueil demande un relevé du vrai site avant décision ; Staff et /help à trancher par Arnaud.
- Leçon amont : le spike 9.3 a relevé les pages hors fixtures, mais la liste de pages n'a jamais été confrontée à l'ensemble des `body.page-*` connus. Une épopée « toutes les pages » commence par l'inventaire de toutes les pages.

### F3. Frontière avec l'épopée 4 : les `<button>` sous 44 px

- Source : Boundaries de l'épopée (« les boutons relèvent de l'épopée 4 ») ; D9.5 (`button.kd-contacts` 105×40) ; `revue-manuelle.md`, section 9.9 (`kd-chip-x` 34×32, `kd-contacts` 40 px, « ce sont des `<button>` (épopée 4) »).
- Constat : l'épopée exclut les boutons et renvoie à l'épopée 4. L'épopée 4 ne les a pas livrés à 44 px sur mobile. Le critère CAP-10 « chaque cible non textuelle ≥ 44×44 » n'est donc pas tenu sur ces boutons, et aucune épopée ne les porte.
- Disposition : **defer** (action A3) : un ticket de backlog qui reprend les `<button>` mobiles sous 44 px, ou une décision d'Arnaud de les laisser.

### F4. Cibles qui débordent ou se chevauchent, vues par l'émulation seule

- Source : D9.2 (barre d'onglets mobile : Personnage 96 px, Bâtiments 86, Employés 85 dans des cases de 75 px ; barre de 385 px pour un écran de 375) ; D9.3 (première case des accès rapides 52 px au lieu de 44, `kraland-theme.css` l.4895).
- Constat : les suites mesurent la taille de chaque cible, pas le recouvrement entre cibles voisines ni l'égalité des cases. Les deux défauts ont été trouvés par 9.11, comme F1 de la rétro 7 (le ticket de vérification final trouve ce qu'aucune suite ne voit).
- Disposition : **defer** (D9.2 et D9.3 déjà reportés). Leçon amont : un test de cible mesure aussi `elementFromPoint` au centre et aux bords de chaque cible (règle AGENTS.md « Couvert n'est pas invisible »), pas seulement sa boîte.

### F5. `test:all` : six fusions sur onze sur un `test:all` rouge

- Source : `/private/tmp/kr-testall-91.log` (15265 ok, 8 FAIL : 6 `confort-mobile`, 2 `demarrage-mobile`), `-92` (1 FAIL `demarrage-mobile`), `-9671` (19 FAIL, attribués dans le plan 9.6), `-96` (1 FAIL `demarrage-mobile`), `-97` (4 FAIL `demarrage-mobile`, attribués à la charge dans le plan), `-98` (1 FAIL `demarrage-mobile`), `-912` (1 FAIL `kramail-theme#confort`). Verts : `-94` (15685), `-95b` (16492), `-910` (16988), `-913` (16150), `-99` (18463).
- Constat :
  - les journaux précèdent la fusion d'une minute ; leur arbre est déduit de l'heure, comme aux rétros 7 et 8 ;
  - seuls 9.5 (`revue-manuelle.md`, section 9.5), 9.6 et 9.7 (plans) attribuent leurs FAIL par écrit ;
  - 9.1 a fusionné sur 8 FAIL, dont 6 dans sa propre suite `confort-mobile`. Sa fusion change `COMMIT_AVANT` (`e203f87` → `de4c079`) après le rouge, sans `test:all` propre ; le premier vert suivant est celui de 9.4 ;
  - aucun `test:all` entièrement vert n'existe sur `HEAD` (`6fbdba0`) ; le dernier vert est `7bec452` (18463 ok). L'unique FAIL de 912 est vert 2/2 rejoué seul (orchestrateur) et vert ici (Behavior verification).
- Disposition : **fix now** (action A4), sans urgence : un tableau des `test:all` de l'épopée dans `revue-manuelle.md`, avec SHA, total et attribution de chaque FAIL. Même action que A2 de la rétro 7, non faite.

### F6. Flake `demarrage-mobile#desktop+pire-cas+m1+m-1+s1` jamais stabilisé

- Source : FAIL dans cinq `test:all` de l'épopée (91, 92, 96, 97, 98), message « /forum : au plus 4 documents en 6 s » et « la boucle s'arrête » ; déjà vu à la rétro 7 (`-73.log`) ; plan 9.5 (« temporels sous charge »).
- Constat : c'est le premier FAIL de l'épopée en fréquence. Il est toujours lu comme faux FAIL de charge, jamais corrigé ni isolé. Un nouveau cas instable apparaît en 912 : `kramail-theme#confort`, bascule 767 > 768 > 767 de la réception (« textes égaux au bundle de base `7bec452` »).
- Disposition : **defer** (action A5) : stabiliser le cas (budget de temps lié à la charge), ou le lancer à part, hors du parallélisme de `test:all`.

### F7. Result des plans périmés

- Source : plans 9.1 (« Provisoire, avant revue indépendante… non commité »), 9.2, 9.4, 9.5, 9.6, 9.10, 9.13 (« in-review… ni built ni commit »), 9.12 (« Reste : revue indépendante… »).
- Constat : même défaut que F4 des rétros 7 et 8. Les treize tickets sont commités et onze sont fusionnés, mais aucun plan n'avait de ligne de clôture.
- Disposition : **fix now**, appliqué par cette rétro à la demande de l'orchestrateur : une ligne « Clôture (orchestrateur, 2026-10-29) » dans chacun des treize plans. Les Result eux-mêmes ne sont pas réécrits.

### F8. Identifiants D hors schéma D9.n

- Source : plan 9.8 (doutes D1 à D8) ; plan 9.11 (« Numérotation à partir de D9.2 (seul D9.1 existe, plan 9.5) »).
- Constat : 9.8 numérote ses doutes D1 à D8, en collision avec les D d'autres épopées. 9.5 et 9.11 suivent D9.n. L'action A7 de la rétro 6 est donc partiellement tenue.
- Disposition : **accept** (sans renumérotation : les D1-D8 de 9.8 sont rangés sous sa section de `revue-manuelle.md`). Leçon : un D est toujours D<épopée>.<n>.

### F9. Trois mécanismes de marge

- Source : `KR_PAGE_CLASSES` (`kr-marge-mobile`) ; plan 9.8 (marges par pièce du forum) ; plan 9.9 (gardes `kr-page-kramail*`) ; jeton commun `--kr-margin-mobile`.
- Constat : la marge de 16 px passe par trois chemins selon la page. Ils partagent le jeton, et `lib/marges.mjs` les mesure tous. C'est une divergence de motif voulue et documentée dans les plans, pas un défaut.
- Disposition : **accept**.

### F10. Points en attente d'Arnaud (pour mémoire)

- Source : `revue-manuelle.md`, sections 9.1 à 9.13 ; `deferred-work.md`, reports 9.x.
- Points principaux :
  - 9.2 : constat 4 (nom à gauche, statut centré) ;
  - 9.5 : D9.1 (groupe qui ne se replie plus après 767 > 768 > 767 sur la base, non reproduit sur fixture) ;
  - 9.7 : gradation du niveau 5 en sombre ;
  - 9.8 : D1 à D8, dont l'exclusion du forum Staff ;
  - 9.11 : D9.2 à D9.5 ;
  - 9.12 : C4 partiel (87 `44px` en dur), `COMMIT_MEDIAS_410` non réaligné ; A9 (chevron).

### Vues agrégées

- Architecture : pas de nouveau module InitQueue hors 9.6. 9.6 installe les fonctions mobiles après `DOMContentLoaded` sur vrai téléphone (largeur lue 980 puis 375). Les pages reçoivent leur classe par `KR_PAGE_CLASSES`, table unique. Aucune dépendance nouvelle relevée.
- Duplication : les cibles de 44 px restent écrites en dur à 87 endroits (`(min-width|width|height): 44px`). Le sweep a posé `--kr-touch-target` sans tout migrer (C4 partiel). **Defer** (déjà reporté).
- Taille : le template perd 146 lignes nettes, la feuille gagne 155 lignes sur ses seuls commits. `confort-mobile.mjs` passe à 830 lignes, routé par fragments ; pas de finding.
- Conventions : media queries `max-width: 767px` et `min-width: 768px` respectées d'après les plans ; gardes en `:where(html.kr-page-*)` ; masques 9.x posés avec condition de retrait, éteints au sweep (9.12), sauf `COMMIT_MEDIAS_410` non réaligné.
- Spec : CAP-10 tenu sur fixtures, à F2 et F3 près. Ajouts hors demande consignés dans les plans : couleurs des PV sur jetons (9.7), démarrage réel (bug 9.6).

### Revue du diff (lentilles adversarial, edge-case, verification-gap)

Faite dans le fil, sans `bmad-review` ni sous-agent : la portée est réduite aux plans, à leurs Review Triage Logs et aux commits de l'épopée. Le diff CSS n'a pas été relu hunk par hunk. Frontières examinées :

- 9.1/9.4/9.13 (liste `KR_PAGE_CLASSES`) : complète pour les pages relevées, /accueil oublié (F2).
- 9.9/épopée 4 (boutons) : trou de propriété (F3).
- 9.5/9.11 (onglets et accès rapides) : défauts vus par l'émulation seule (F4).
- 9.1/9.2 (fusion de 9.2 avant 9.1, `COMMIT_AVANT` changé à la fusion de 9.1) : cohérent sur `HEAD` (`confort-mobile` vert), non prouvé à la fusion (F5).
- 9.6/9.5/9.7 (`demarrage-mobile` sous charge) : F6.
- Aucun autre trou de frontière trouvé dans les preuves.

## Behavior verification

Contrôle par les fixtures Playwright locales, sur le bundle commité de `HEAD` (`6fbdba0`, arbre propre hors une capture d'écran non suivie, pas de rebuild) :

- `KR_CONCURRENCY=6 KR_LOGDIR=/tmp/retro9/logs npm run test:zone -- confort-mobile` : **912 ok, 0 FAIL**, VERT.
- Fragments un à un (`KR_FRAG`), tous verts : `kramail-theme#confort` (366 ok, 0 échec, le cas instable du `test:all` 912) ; `forum-activite#confort` ; `report-non-lu#confort` ; `plateau-qualite-usage#cartes` ; `plateau-qualite-usage#pv` ; `croix-directionnelle#jeton`.
- Cartes de 1100 à 1500 px (Done when 1) : couvertes par `plateau-qualite-usage#cartes`, qui mesure de 768 à 1920 px (plan 9.2).
- 1920 px (Done when 4) : mesuré par `plateau-qualite-usage#cartes` et vu par les captures de 9.11. `confort-mobile` n'a pas de 1920 : c'est une suite de marge mobile.
- `test:all` cités, non relancés : `-99.log` (18463 ok, 0 FAIL, `7bec452`), `-912.log` (18438 ok, 1 FAIL de charge, arbre de `6fbdba0` déduit de l'heure).
- Parcours clés : émulés par 9.11 (52 étapes, 36 sans écart, 14 avec écart, 2 non applicables). Non rejoués ici.

Limites : aucun site réel, aucun vrai téléphone, pas de Chrome 9222/9223, pas de nouvelle capture, pas de `test:all`.

## Previous-retro follow-through

Rétro précédente dans l'ordre : `epic-notifications/epic-notifications-retrospective.md` (épopée 8). La rétro de l'épopée 7, faite le même jour, est suivie aussi.

Épopée 8 :

- A1, captures refaites : **fait** par 7.9 (`6788cbf`, `/Users/arnaud/kraland-css-captures/7.9/notifications/`).
- A2, SHA du `test:all` vert : **partiel**. La rétro 7 a déduit `d8c8777` de l'heure ; jamais relancé sur un SHA prouvé. Même défaut ici (F5).
- A3, lignes de clôture et champ review : **fait** (lignes de clôture dans les plans de l'épopée 8 ; `review: quick` partout). Reconduit ici (F7).
- A4, relevé du vrai /report : **non fait**. La cloche était active le 2026-10-29 (`revue-manuelle.md`, section 9.10), donc pas de GET permis.
- A5, leçon d'alignement entre états : **aucune preuve trouvée**. L'inception de l'épopée 9 précède la rétro 8.

Épopée 7 :

- A1, captures à reprendre après 9.9 et le bug 16 : **partiel**. Le parcours P3 de 9.11 (kramail mobile) est capturé à 14:47, après la fusion de 9.9 (14:30). Les captures de `/Users/arnaud/kraland-css-captures/7.9/` datent de 12:45 : non reprises.
- A2, tableau des `test:all` de l'épopée 7 : **non fait** (aucun tableau dans `revue-manuelle.md`).
- A3, relevé du kramail réel : **aucune preuve trouvée**.
- A4, ticket de migration des `body.page-kramail*` : **non fait** (175 sélecteurs sur `HEAD`, aucun ticket).
- A5, retirer « et d'un fil » du Done when 2 : **non fait** (Arnaud).
- A6, leçon sur la réserve basse : pas encore applicable, aucune inception depuis.

## Action items

Toutes les actions sont des propositions ; Arnaud n'en a décidé aucune.

- A1. À la passe finale d'Arnaud : jouer les quatre parcours clés en Kraland clair et Empire Brun sombre, et valider les planches de `/Users/arnaud/kraland-css-captures/9.11/planches/`. Ensuite, passer 9.11 à `built` ou `done` et réviser le verdict. Responsable : Arnaud.
- A2. Marge « sur toutes les pages » : relevé en lecture seule de /accueil sur le vrai site, puis décision sur /accueil (D9.4), le forum Staff (9.8) et /help sur ordinateur. Responsable : orchestrateur (relevé, sous le mandat de lecture), Arnaud (décision).
- A3. Ouvrir un ticket pour les `<button>` mobiles sous 44 px (D9.5 `kd-contacts`, `kd-chip-x`), laissés entre l'épopée 4 et celle-ci, ou noter la décision de les laisser. Responsable : orchestrateur (backlog), Arnaud (décision).
- A4. Consigner dans `revue-manuelle.md` les `test:all` de fusion de l'épopée 9 (SHA, total, attribution de chaque FAIL), puis lancer un `test:all` sur `6fbdba0`, machine calme, pour avoir un vert sur `HEAD`. Responsable : orchestrateur.
- A5. Stabiliser `demarrage-mobile#desktop+pire-cas+m1+m-1+s1` (« au plus 4 documents en 6 s ») ou le sortir du parallélisme de `test:all` ; surveiller `kramail-theme#confort` (bascule de la réception). Responsable : orchestrateur (ticket).
- A6 (leçon de processus). Une épopée « toutes les pages » ouvre par l'inventaire de tous les `body.page-*` connus ; un test de cible vérifie aussi le recouvrement (`elementFromPoint`) des cibles voisines (F2, F4). À ajouter aux règles communes des prochaines inceptions, avec A6 de la rétro 7 et A5 de la rétro 8. Responsable : orchestrateur (inception).

## Acceptance verdict

**rejected** (verdict machine ; critères déclarés : « Done when » d'`epic-plateau-confort-mobile.md`).

Le rejet est forcé par le ticket inachevé **9.11** (`in-review`, hitl). Ce n'est pas un défaut de construction : Arnaud a lui-même reporté sa passe à la fin de tous les tickets. Sur les preuves, les critères se lisent ainsi :

1. Critères success de CAP-10 et cartes de 1100 à 1500 px : **tenus sur fixtures**, à F2 et F3 près. Avatar de 70 px et nom dessous mesurés de 768 à 1920 px (`plateau-qualite-usage#cartes`) ; cibles de 44 px et croix de 48 px (`confort-mobile`, `croix-directionnelle#jeton`, fragments `#confort`) ; marge de 16 px sur les pages couvertes. Hors : /accueil, Staff, `<button>` sous 44 px, et D9.2 et D9.3 vus par l'émulation.
2. Arnaud joue les quatre parcours clés : **non tenu** (A1). L'émulation de 9.11 les mène au bout, avec les écarts D9.2 à D9.5.
3. Livraison : **tenu en partie**. Fusions sur `feature/next`, bundle et `version.json` régénérés, au moins un fragment par décision. Mais aucun `test:all` entièrement vert sur `HEAD` : 1 FAIL de charge en 912, vert rejoué seul (F5).
4. Largeurs et variantes : **tenu**. Tests à 375, aux seuils 767-769 et à 1280 (`confort-mobile`, `plateau-qualite-usage`), à 1440 et 1920 par `plateau-qualite-usage#cartes` et les captures ; Kraland clair et Empire Brun sombre dans les captures ; fixtures synthétiques, aucune capture HTML brute.

Si Arnaud tient la passe finale pour hors de l'épopée, ou une fois cette passe faite, les preuves soutiennent **accepted-with-open-items**. Open items : F2 (/accueil, Staff, /help), F3 (`<button>`), F4 (D9.2, D9.3), F5 (vert sur `HEAD`), F6 (flakes) et les décisions de F10. Cette révision lui appartient.

## Open questions

- Le verdict doit-il attendre la passe finale, ou 9.11 peut-il passer `built` sur sa seule partie agent ?
- /accueil doit-il recevoir la marge de 16 px (D9.4) ?
- Le forum Staff reste-t-il exclu de la marge mobile ?
- Les `<button>` mobiles sous 44 px relèvent-ils d'un nouveau ticket, ou restent-ils tels quels ?

## Assumptions

- Épopée résolue par le chemin donné par l'appelant ; `tickets.py status` a répondu, sans clé `pending_tickets` : la liste est dérivée à la main ([9.11]).
- La rétro est faite quand même, en headless ; le verdict machine est **rejected** pour cette seule raison.
- La partie hitl de 9.11 est lue comme en attente de la passe finale, par décision d'Arnaud.
- Les journaux `test:all` de `/private/tmp` sont attribués aux arbres des fusions d'après leur heure (une minute avant chaque fusion). Leurs SHA ne sont pas prouvés.
- Les totaux de 9.9 (18463 ok, 0 FAIL) et de 9.12 (18438 ok, 1 FAIL de charge, vert 2/2 rejoué seul) viennent de l'orchestrateur et concordent avec `-99.log` et `-912.log`.
- Les FAIL isolés de `demarrage-mobile` sont lus comme des faux FAIL de charge, faute d'attribution écrite dans 9.1, 9.2, 9.6 (journal 96) et 9.8.
- Le bug 9.6 et ses masques (`59d5673`) sont comptés dans l'épopée 9.
- Les lignes de clôture « revue faite » reprennent les Review Triage Logs et les sections de revue des plans, sans relire les rapports de revue eux-mêmes.
- Aucun journal de session. Les preuves sont les plans, les commits, `revue-manuelle.md`, `deferred-work.md`, les journaux de `/tmp` et les captures de 9.11.
- Revue de diff à portée réduite, faite dans le fil, sans `bmad-review` (voir « Revue du diff »).
- Toutes les actions sont des propositions.
- Écritures faites à la demande de l'orchestrateur, en plus de ce document : une ligne de clôture dans les treize plans (le workflow de rétro interdit d'ordinaire de modifier les plans ; la demande explicite de l'orchestrateur prime, comme à la rétro 7), et la section « Rétro épopée 9 » de `revue-manuelle.md`. Pas de `test:all`, pas de site réel, aucune écriture git, aucune modification du code ni des tests.
