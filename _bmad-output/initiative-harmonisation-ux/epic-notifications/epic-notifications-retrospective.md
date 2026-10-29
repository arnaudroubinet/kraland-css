---
epic: epic-notifications
date: 2026-10-29
verdict: accepted-with-open-items
criteria: declared
headless: true
---

# Rétrospective : notifications

## Epic summary

- Épopée : `_bmad-output/initiative-harmonisation-ux/epic-notifications` (id 8 de l'initiative). Elle couvre CAP-9 (`spec-harmonisation.md`, l.49-51).
- Tickets (`tickets.py status`) : les cinq sont `built` (state `review`). `pending_tickets` est vide : aucun ticket n'est inachevé. Aucun n'est encore « fait ».
  - 8.1 Ligne de notification : texte 14/15 px, dates 13 px, date au-dessus du texte sur mobile ;
  - 8.2 Sur ordinateur, la cloche ouvre les notifications dans un popup de 900×800 (hitl) ;
  - 8.3 Le sélecteur de personnage commence à 16 px du haut ;
  - 8.4 Refactor sweep ;
  - 8.5 Captures de validation pour Arnaud (hitl).
- 8.2 et 8.5 sont des hitl. Arnaud a décidé le 2026-10-28 de les faire vérifier en émulation, puis de faire sa passe manuelle à la fin de tous les tickets (`revue-manuelle.md`, l.10). Une validation visuelle absente n'est donc pas un écart : elle attend la passe finale.
- Commits de l'épopée (un commit par ticket, puis une fusion dans `feature/next`) :
  - 8.1 `f24c332`, fusion `e203f87` ;
  - 8.2 `787d882` (inconnue levée en lecture seule), `a8ab09f`, fusion `5f5d299`, puis `034a820` (constat après fusion dans le Chrome dédié) ;
  - 8.3 `9f41971`, fusion `abbe7be` ;
  - 8.4 `936c3af`, fusion `8420e3a` ;
  - 8.5 `d486c1f` et `443ebc4`, fusion `2bdc8e1`.
- Plages des plans, par `baseline_revision` : 8.1 `db25ad4..c8c4082`, 8.2 `c8c4082..5f5d299`, 8.3 `5f5d299..abbe7be`, 8.4 `abbe7be..49d31df`, 8.5 `49d31df..HEAD` (inférée). Elles sont entrecoupées des épopées 7 et 9 et des bugs 14 et 15 (`git_evidence.py` : 21, 5, 3, 10 et 27 commits). Le volume est donc mesuré sur les seuls commits de l'épopée.
- Volume, hors bundle et `version.json` :
  - `kraland-theme.css` +90/−25 (8.1 +72/−15, 8.3 +7, 8.4 +11/−10). Section `/report` aujourd'hui l.790-891 ;
  - `kraland-userscript-template.js` +31/−1 (module `Notifications:Popup`, l.1201-1228) ;
  - `tests/e2e/report-non-lu.mjs` +186/−29 (547 lignes) ; nouvelle suite `cloche-notifications.mjs` (272 lignes) et nouvelle fixture synthétique `cloche-notifications.html` (99 lignes) ;
  - `confort-mobile.mjs` +19/−19 : recalage ajouté par 8.3, retiré par 8.4 ;
  - `router.mjs` +14/−5, `router.test.mjs` +15/−1 ; `palette-nation.mjs` +2/−1 ; skills +3/−2 dans chaque copie ;
  - `revue-manuelle.md` +52, `deferred-work.md` +6.
- Travaux liés, hors épopée : bug 15 (`a05a8e9`, fusion `d94bdb7`, dates en dents de scie du popup) et bug 14 (`0ee4f40`, champs `.form-control` à 9,5 px), tous deux relevés par les captures de 8.5 (`5638f29`). Entrée 9.10 (`3ca5bc9`, marge mobile de 16 px sur `/report`).
- Preuves disponibles : fichier d'épopée, `tickets.toml`, les cinq plans (rouge avant, contre-épreuves, Review Triage Log), commits, `revue-manuelle.md`, `deferred-work.md`, journaux `test:all` dans `/private/tmp`. Aucun journal de session : l'analyse des leçons de processus se limite à ce que disent les plans.

## Findings

Les points déjà en attente d'Arnaud dans `revue-manuelle.md` ne sont pas repris comme découvertes. F8 les regroupe pour mémoire.

### F1. Frontière 8.1 / 8.5 : dates en dents de scie, trouvées par les captures et pas par la suite

- Source : plan 8.1, Implementation Notes (retrait de la date non lue à `--kr-space-3`, sans règle pour la date lue) ; `revue-manuelle.md`, section 8.5 (« sur une ligne lue, elle commence à 5 px ») ; bug 15, `a05a8e9` (`kraland-theme.css` l.838-842, contrôle « bug 15 » de `report-non-lu`).
- Constat : 8.1 pose un retrait de 12 px sur la seule cellule de date non lue. Ses critères mesurent chaque ligne, jamais l'alignement des dates entre lignes lues et non lues. La suite était verte (1024 ok) avec la colonne en dents de scie. Seules les captures de 8.5 l'ont montré. Le bug 15 a corrigé l'écart et ajouté le contrôle manquant.
- Disposition : **accept** (corrigé par le bug 15). Restent deux points à trancher, décrits dans la section Bug 15 de `revue-manuelle.md` : le texte 1 px plus bas que la date, et la ligne à cellule unique lue à 5 px.
- Leçon amont : quand un ticket donne un retrait à un seul état d'une colonne, son verify mesure aussi l'alignement de la colonne entre les états. Le ticket de captures (rétro 5, A10 ; rétro 6, A8) a prouvé sa valeur : il a trouvé deux défauts (bug 14, bug 15) qu'aucune suite ne voyait.

### F2. Captures de 8.5 antérieures à trois correctifs

- Source : plan 8.5, Result (« prises sur le bundle construit depuis 49d31df ») ; commits postérieurs qui changent `/report` : `3ca5bc9` (9.10, marge de 16 px), `a05a8e9` (bug 15), `0ee4f40` (bug 14, sélecteur `.form-control`).
- Constat : les 22 captures de `/Users/arnaud/kraland-css-captures/8.5/` montrent le sélecteur à 9,5 px, la colonne des dates en dents de scie et le contenu collé au bord gauche. Ces trois défauts sont corrigés sur `HEAD`. Si Arnaud fait sa passe finale sur ces fichiers, il jugera un rendu périmé.
- Disposition : **fix now** (action A1). Reprendre les captures sur `HEAD` avec les scripts conservés (`captures.mjs`), avant la passe finale.

### F3. `test:all` vert, mais hors des documents de l'épopée

- Source : Done when 3 de `epic-notifications.md` ; plans 8.1 à 8.5, Result (« `npm run test:all` non lancé ») ; `/private/tmp/kr-testall-710b.log` (2026-10-29 12:32, 18074 ok, 0 FAIL, `cloche-notifications` et `report-non-lu` compris) ; fusion `fe3550f` à 12:26.
- Constat : aucun plan ni `revue-manuelle.md` ne consigne de `test:all` sur un SHA qui contient l'épopée. Le seul vert trouvé est celui du sweep 7.10, qui contient 8.1 à 8.5. Son journal, dans `/tmp`, ne nomme pas le SHA. La règle commune de l'épopée (en-tête de `tickets.toml` : « un seul test:all à la fin sur machine calme et sur le SHA exact, ou le plan dit qu'il n'a pas été lancé ») est tenue par la seconde branche seulement. La preuve du Done when 3 repose donc sur un fichier temporaire.
- Disposition : **fix now** (action A2). Consigner dans `revue-manuelle.md` le `test:all` vert et son SHA. Arnaud ou l'orchestrateur relance sur `d8c8777` si le SHA n'est pas établi.
- Leçon amont : l'orchestrateur qui lance le `test:all` de fusion écrit son SHA et son total dans le plan ou dans `revue-manuelle.md`, et non dans `/tmp` seulement.

### F4. Sections Result et frontmatter des plans périmés

- Source : plans 8.1 à 8.4, Result (« Provisoire, implémenteur ; revue indépendante à faire […] non commité ») ; plans 8.3 et 8.4, frontmatter (`review: ''` alors que `lenses_ran: ['quick']` et un Review Triage Log existent).
- Constat : la règle « une seule section Result » (rétro 6, A6) est tenue. Mais les Result décrivent l'état d'avant la revue et la fusion, alors que les quatre tickets ont été revus, fusionnés et poussés. Un lecteur des plans seuls croit le travail non commité.
- Disposition : **fix now** (action A3), sans urgence : une ligne de clôture par plan (SHA de fusion, revue faite).
- Leçon amont : à la fusion, l'orchestrateur ajoute au Result une ligne « fusionné en `<sha>`, revue <n> faite ».

### F5. Règle de taille 14 px sur ordinateur sans rouge

- Source : `kraland-theme.css` l.827-830 ; plan 8.4, Result (« S3, règle 14 px retirée : exit 0 ») ; `deferred-work.md` (report du sweep 8.4).
- Constat : le `body` de Bootstrap fait déjà 14 px. Aucun contrôle ne distingue donc la règle du rendu natif. La règle reste, car elle porte le jeton de DESIGN.md, mais elle n'est protégée par aucun test.
- Disposition : **defer** (déjà consigné dans `deferred-work.md`).

### F6. Déplacement S3 de 8.4 : table imbriquée de 14 à 15 px sur mobile

- Source : plan 8.4, Implementation Notes (« Écart […] 54 écarts à 375 px, 0 à 1280 px ») ; `revue-manuelle.md`, section 8.4.
- Constat : le sweep promettait un comportement inchangé. La revue a trouvé un écart sur un cas absent de la fixture. L'écart a été documenté, pas corrigé.
- Disposition : **accept** (écart consigné, cas hypothétique sur le site). À ne plus relever dans les rétros suivantes.

### F7. Preuves sur fixture seulement : le vrai `/report` n'a jamais été vu

- Source : plan 8.3 (marge en ligne de 10 px tirée du relevé t_f45d2cfb) ; `revue-manuelle.md`, section 9.10 (« cloche active […] GET /report interdit, structure non vérifiée ») ; section Bug 15 (« vrai /report non consulté »).
- Constat : la règle de sécurité de `/report` a été tenue partout : aucun agent n'a chargé la page, et toute la preuve vient de `report-non-lu.html`. Le revers : la marge de 10 px du bandeau (8.3), l'hypothèse d'un tableau `.table` unique (8.1, l.846) et les `p` posés dans le `body` (9.10) ne sont vérifiés que sur la fixture.
- Disposition : **defer** (action A4). Un relevé en lecture seule est possible quand la cloche n'est pas active (exception d'AGENTS.md). Sinon, Arnaud le fait à sa passe finale.

### F8. Points en attente d'Arnaud (pour mémoire)

- Source : `revue-manuelle.md`, sections 8.2, 8.3, 8.4, 8.5 et Bug 15.
- Points :
  - 8.2 : procédure de console sous Firefox (`exportFunction`). Chrome et Tampermonkey sont vérifiés (`034a820`). Options natives recopiées de `main.js`, ou relues au clic ;
  - 8.3 : marge en ligne de 10 px sur le vrai `/report` ; fenêtres `help.php?p=prev` et `/help` non traitées ;
  - 8.5 : verdict visuel (voir F2) ; onglets à 375 px (icône collée au libellé) ; pastille collée à la cloche sur ordinateur ;
  - bug 15 : décalage vertical de 1 px ; ligne à cellule unique lue.

### Vues agrégées

- Architecture : un seul module JS ajouté (`Notifications:Popup`, InitQueue, priorité 100). Il ne dépend que de `isMobileMode()` et de `isThemeEnabled()` et suit le motif `unsafeWindow` existant (template ~l.385). Aucune dépendance nouvelle ni cycle.
- Duplication : `open()` est réécrit dans `cloche-notifications.mjs` comme dans `report-non-lu.mjs`. C'est la convention des suites (une fonction par suite sur les helpers de `lib/`), pas un doublon propre à l'épopée. Dans la feuille, le retrait de 12 px de la date est posé deux fois sur ordinateur (l.832-835 pour la date non lue, l.840-842 pour toutes les dates, ajouté par le bug 15). La première n'ajoute plus rien que pour la cellule unique non lue. **Accept** : redondance mineure, à confier au prochain ticket qui touche ces lignes.
- Taille : la feuille (15368 lignes) et le template (11033) grandissent de +65 et +30 nets. Rien de nouveau à signaler côté taille.
- Conventions : aucun `!important` ajouté (plans 8.1, 8.3, 8.4) ; gardes en `:where(html.kr-page-report)` ; liste combinée pour le commun ; mobile en `max-width`, ordinateur en `min-width`. La règle mobile générique des tableaux est gardée par `:where(html:not(.kr-page-report))` (l.4829-4834) au lieu d'être battue, et `.bg-info` par `:not(:where(…))` (l.791) : P1 option 4 est respectée. Aucun masque de test n'a été ajouté par 8.1 à 8.5. Le masque `sansDatesLues` vient du bug 15 (`report-non-lu.mjs` l.445-446) et nomme sa condition de retrait.
- Spec : CAP-9 est tenu sur fixtures. Aucun comportement non demandé n'a été ajouté, à deux choix près, consignés : le retour au 600×600 natif quand la peau est coupée au clic (8.2, garde M10), et la teinte de 14 % retirée sur mobile (8.1).

### Revue du diff (lentilles adversarial, edge-case, verification-gap)

Faite dans le fil, sans `bmad-review` ni sous-agent : la portée est réduite au diff des commits de l'épopée, à la section `/report` de la feuille et au module `Notifications:Popup`. Frontières examinées : 8.1/8.3 (même section, même suite), 8.3/8.4 (recalage de `confort-mobile`), 8.1/bug 15, 8.1/9.10, 8.2/D12.

- 8.3/8.4 : recalage borné ajouté puis retiré au relèvement de `COMMIT_AVANT` sur `abbe7be`. Grep vide (plan 8.4). Propre.
- 8.2/D12 : cloche invisible menu fermé de 768 à 991 px. Tranché par Arnaud le 2026-10-28 (A5 : rendu de base). Rien à faire.
- 8.1/9.10 : 9.10 a réécrit le padding mobile des cellules (l.858-863) avec `--kr-marge-page` et un repli à `--kr-space-3`. Les contrôles de 8.1 restent verts (`report-non-lu#mobile`, 384 ok sur `HEAD`).
- 8.2 : la garde `isMobileMode() || !isThemeEnabled()` est relue au clic, et le cas « bac à sable » prouve l'appel par `w.open`. Aucun autre trou trouvé. Firefox reste non prouvé (F8).
- F1 est le seul défaut de frontière trouvé, et il est déjà corrigé.

## Behavior verification

Contrôle par les fixtures Playwright locales, sur le bundle commité de `d8c8777` (arbre propre, pas de rebuild) :

- `KR_LOGDIR=/tmp/retro8/logs npm run test:zone -- report cloche` : exit 0, 1353 ok, 0 FAIL, RÉSULTAT : VERT. Détail : `cloche-notifications` 179 (5 fragments : barre, compact, mobile, bascule, peau) et `report-non-lu` 1174 (7 fragments : popup, bureau, mobile, bascule, portée, haut, confort).
- `test:all` cité, non relancé : `/private/tmp/kr-testall-710b.log`, 18074 ok, 0 FAIL, sur l'arbre du sweep 7.10 qui contient l'épopée (F3).

Limites : aucun site réel, aucune cloche, aucun `/report`, pas de Chrome 9222/9223, pas de capture. L'appel depuis le `onclick` réel n'est prouvé que sous Chrome et Tampermonkey, par la console de l'orchestrateur (`034a820`).

## Previous-retro follow-through

- L'épopée précédente dans l'ordre (`epic-kramail-mobile`, id 7) n'a pas de fichier de rétrospective : il n'y a pas d'action de rétro 7 à suivre. Ce n'est pas l'absence d'actions en attente.
- L'épopée 8 a repris comme règles communes (en-tête de `tickets.toml`) des actions des rétros 5 et 6. Leur sort ici :
  - rouge avant sur la base et contre-épreuve : **tenu** dans les plans 8.1 à 8.4 (Result, « Rouge avant » et « Contre-épreuves ») ; 8.5 n'a pas de code ;
  - aucun masque nouveau (rétro 5, F4 ; rétro 6, A2) : **tenu** par 8.1 à 8.5. Le masque du bug 15 nomme sa condition de retrait ;
  - boucle `test:zone`, puis un `test:all` sur le SHA exact (rétro 5, F2 et F11) : **partiel** (F3) ;
  - une seule section Result (rétro 6, A6) : **tenu**, mais les Result sont périmés (F4) ;
  - identifiants D8.n (rétro 6, A7) : **tenu** (D8.1 dans le plan 8.1). Aucune collision trouvée ;
  - transitions 767 ↔ 768 dans les deux sens (rétro 5, F12) : **tenu** (fragments `bascule` de `report-non-lu` et de `cloche-notifications`, `report-non-lu#haut`) ;
  - captures de validation (rétro 5, A10 ; rétro 6, A8) : **tenu** par 8.5 (22 PNG), à reprendre sur `HEAD` (F2) ;
  - livraison (rétro 5, A1 ; rétro 6, A1) : **tranché** par Arnaud le 2026-10-28, « pas de fusion vers main » (`revue-manuelle.md`, l.8). L'open question du Done when 3 de l'épopée est donc close.

## Action items

Toutes les actions sont des propositions ; Arnaud n'en a décidé aucune.

- A1. Reprendre les captures de 8.5 sur `HEAD` (après 9.10, bug 14 et bug 15) avec `/Users/arnaud/kraland-css-captures/8.5/captures.mjs`, en corrigeant ses chemins écrits en dur vers `kraland-css-wt85`. Mettre à jour la section 8.5 de `revue-manuelle.md` : retirer les trois défauts corrigés. Responsable : orchestrateur, avant la passe finale d'Arnaud.
- A2. Consigner dans `revue-manuelle.md` le `test:all` vert qui contient l'épopée 8 (18074 ok, sweep 7.10) et son SHA exact. Si le SHA ne peut pas être établi, relancer un `test:all` sur machine calme sur `d8c8777`. Responsable : orchestrateur.
- A3. Ajouter aux Result des plans 8.1 à 8.4 une ligne de clôture (SHA de fusion, revue faite), et remplir `review` dans le frontmatter des plans 8.3 et 8.4. Responsable : orchestrateur.
- A4. Relever en lecture seule le vrai `/report` quand la cloche n'est pas active : marge en ligne du bandeau, nombre de tableaux `.table`, `p` et pagination directement dans le `body`. Sinon, ajouter ces points à la passe finale d'Arnaud. Responsable : orchestrateur (sous mandat de lecture) ou Arnaud.
- A5 (leçon de processus). Quand un ticket donne un style à un seul état d'une liste ou d'une colonne (lu/non lu, actif/inactif), son verify mesure aussi l'alignement entre les états (F1). À reprendre dans les règles communes des prochaines inceptions. Responsable : orchestrateur (inception).

## Acceptance verdict

**accepted-with-open-items** (critères déclarés : « Done when » d'`epic-notifications.md`).

1. Critères success de CAP-9, sans chargement de `/report` à l'avance : **tenus sur fixtures**. Popup 900×800 sur ordinateur (`cloche-notifications`, sonde `window.open`, aucune requête vers `/report` à aucune largeur) ; texte 14 px et dates 13 px ; sur mobile, date au-dessus, texte 15 px sur toute la largeur, filet sur la ligne ; sélecteur à 16 px (`report-non-lu#haut`). Restent pour la passe finale : Firefox (8.2) et le vrai `/report` (F7).
2. Suite `report-non-lu` mise à jour (filet non lu avec la date au-dessus) : **tenu** (fragments `mobile`, `popup`, `bureau`, `bascule`, `portee`, `haut`).
3. Livraison : **tenu**, dans la lecture décidée par Arnaud (travail livré sur `feature/next`, pas de fusion vers main). Les cinq fusions sont sur `feature/next`, poussée (`origin/feature/next` = `d8c8777`). Bundle et `version.json` sont régénérés. Chaque décision a son fragment de test. Le `test:all` vert (18074 ok) n'existe que dans `/tmp`, sans SHA nommé (F3, A2).
4. Vérifié à 1280, 1440, 1920 et 375×667, Kraland clair et Empire Brun sombre, sur fixtures synthétiques, sans capture HTML brute dans le dépôt : **tenu par les tests**. Seule fixture nouvelle : `cloche-notifications.html`, synthétique. La validation visuelle hitl attend la passe finale d'Arnaud, comme il l'a décidé : ce n'est pas un écart.

Open items : F2 (captures périmées), F3 (`test:all` non consigné), F4 (Result périmés), F5 et F7 (reportés), ainsi que les décisions de F8.

## Open questions

- Firefox : la procédure de console de la section 8.2 donne-t-elle le marqueur et `width=900,height=800` ?
- Options du popup : garder la copie de `main.js` (détectée par test si elle dérive) ou relire les options natives au clic ?
- Bug 15 : laisser le décalage vertical de 1 px et la ligne à cellule unique lue à 5 px, ou ouvrir un ticket ?
- Fenêtres sans barre (`help.php?p=prev`, `/help`) : ont-elles la même bande vide que `/report` avant 8.3 ?

## Assumptions

- Épopée résolue par le chemin `_bmad-output/initiative-harmonisation-ux/epic-notifications` donné par l'appelant ; `tickets.py status` a répondu.
- `pending_tickets` est vide (absent de la sortie, et aucun ticket hors `built`) : les cinq tickets sont terminés côté construction.
- Les validations hitl de 8.2 et 8.5 sont lues comme en attente de la passe finale, par décision d'Arnaud du 2026-10-28, et non comme un manque.
- Done when 3 lu selon la décision A1 d'Arnaud (`revue-manuelle.md`, l.8) : livraison sur `feature/next`, sans fusion vers main.
- Le `test:all` de `/private/tmp/kr-testall-710b.log` est attribué à l'arbre de `fe3550f` ou `d8c8777`, d'après son heure (12:32, après la fusion de 12:26) et ses suites. Son SHA n'est pas prouvé (F3).
- Verdict machine `accepted-with-open-items` rendu sans décision humaine (mode headless).
- Toutes les actions sont des propositions.
- Plage de 8.5 inférée jusqu'à `HEAD` ; le volume est mesuré sur les seuls commits de l'épopée, car les plages sont entrecoupées des épopées 7 et 9.
- Aucun journal de session. Les preuves sont les plans, les commits, `revue-manuelle.md`, `deferred-work.md` et les journaux de `/tmp`.
- Revue de diff à portée réduite, faite dans le fil, sans `bmad-review` (voir « Revue du diff »).
- Pas de `test:all`, pas de site réel, pas de Chrome 9222/9223, pas de cloche ni de `/report`, pas de capture, aucune écriture git. Seul autre fichier écrit : la section « Rétro épopée 8 » de `revue-manuelle.md`.
