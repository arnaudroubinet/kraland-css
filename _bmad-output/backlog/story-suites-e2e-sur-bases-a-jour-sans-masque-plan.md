---
title: 'Les suites e2e comparent à des bases à jour, sans masque de ticket ni course d''injection'
type: 'refactor'
ticket: '11'
created: '2026-10-25'
status: 'built'
baseline_revision: '6270c8173746fc4a4dde8b26da7ff422670cdbd7'
route: 'full'
risk: 'medium'
review: 'quick'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/backlog/story-suites-e2e-sur-bases-a-jour-sans-masque.md'
  - '_bmad-output/backlog/story-suites-e2e-sur-bases-a-jour-sans-masque-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/epic-forum-retrospective.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/epic-cartes-pastilles-retrospective.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-refactor-sweep-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '_bmad-output/initiative-harmonisation-ux/revue-manuelle.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
  - 'tests/e2e/lib/variantes.mjs'
  - 'tests/e2e/lib/router.mjs'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:**

- Les épopées 3 à 6 ont posé des masques de test (miroirs, neutralisations, transformation des médias) sur des bases figées d'avant leurs tickets. Leurs conditions de retrait renvoient au « ticket A4 », c'est-à-dire ce ticket.
- Bases visées : `forum-index` `81512a3`, `cartes-pastilles` `21fed8d`, `typographie-formes` `d953969`, `62fd47d` et `00b0786`, `palette-nation` `6685df5`. Il faut y ajouter les cinq bases de `forum-activite` à `810901f`, qui ne contiennent pas 6.7.
- Un contrôle de peau coupée mobile compare du DOM avec une injection à `<body>` : `forum-index#peau-coupee`. Il tient aujourd'hui par un retrait local des attributs d'infobulle (6.6), non par une injection en début de document.

**Approach:**

- Réaligner chaque base visée sur `6270c81`, une suite à la fois. Retirer les masques devenus inertes et leurs constantes orphelines. Une décision encore prouvée seulement par la base reçoit d'abord un contrôle absolu.
- Pour chaque base, une contre-épreuve : `KR_SCRIPT` = bundle de l'ancienne base, avec un FAIL nommé attendu.
- `forum-index#peau-coupee` injecte en début de document, avec la technique de `forum-activite` (`enTete` et `debut`). Preuve sous charge sur deux tours, plus une contre-épreuve d'écart réel et retardé.
- Les masques des bases dédiées qui restent (hors liste du ticket) gardent leur code. Leur condition est réécrite pour nommer un événement à venir.

**SHA cible : `6270c81` (HEAD de `feature/next` au relevé).**

- Il contient 6.7.
- Son bundle est identique à celui de `4dde75f`, puisque `6270c81` n'ajoute que la rétro. Aucun détecteur `AVANT_*` n'y est vrai (inventaire §1).
- C'est un SHA figé, pas une branche (rétro 5, F3).
- Après le ticket, toute régression des pages visées sur ces suites passe au rouge, ce qui fait de la base une garde de régression. La preuve des décisions vient des contrôles absolus (inventaire §3).

## Boundaries & Constraints

**Always:**

- L'inventaire fait foi. Tout écart va au Plan Change Log avec sa raison.
- Une suite à la fois, dans l'ordre des tâches. Chaque réalignement est vérifiable seul : comptes ok/FAIL avant et après, contre-épreuve, `test:router`.
- Supprimer le code des masques retirés plutôt que le neutraliser. Supprimer les imports et constantes de `variantes.mjs` qui n'ont plus d'utilisateur (inventaire §2.6).
- Contrôle absolu ajouté **avant** le retrait du masque ou le réalignement qu'il remplace, et vu rouge sur l'ancien bundle, puis vert sur HEAD.
- Chaque masque gardé porte une raison et une condition de retrait qui nomme un événement à venir. Forme : « Retrait : au prochain ticket qui modifie <zone> ; il réaligne <constante> sur un SHA récent après contrôle absolu de <décision> ». Jamais « ticket A4 », jamais « quand la base contient l'entrée ».
- MAX_CITING : aucun jeton ne passe de 3 à 4 suites (inventaire §5). Dans `forum-index`, écrire « en début de document », jamais le nom de la directive d'en-tête du userscript. Relevé `TOKEN_RE` refait sur l'arbre fini.
- `npm run test:router` après chaque modification sous `tests/`, même d'un commentaire.
- Contre-épreuves et bundles jetables hors dépôt (`$TMPDIR`). Exemple : `git show 81512a3:kraland-userscript-main.user.js > "$TMPDIR/kr-81512a3.user.js"`.
- Les Ask First sont **tranchés dans le sens prudent par l'implémenteur**, sans attendre. Il applique le choix écrit et le consigne dans `revue-manuelle.md`, nouvelle section « Backlog 11 » en fin de fichier.

**Ask First (choix prudent écrit, appliqué) :**

1. **Bases dédiées hors liste** :
   - `typographie-formes` : `d68ab55`, `4d97496`, `8631c45`, `3b1da55`, `fe77411`, `1590761`, `5ff22d3`, `2db3b4c` ;
   - `cartes-pastilles` : `a7f0463`, `601ab19`, `59567f0` ;
   - `palette-nation` : `d521cc8`.

   Prudent : non réalignées. Leurs masques (TF1, TF2, TF3, TF7, CP5, CP6) gardent leur code. Leur condition est réécrite au format Always, avec la zone (ex. TF7 : « au prochain ticket qui modifie les rayons »).
2. **`nettoyage` (4.10)** : réaligner `COMMIT_NETTOYAGE` vide trois contrôles qui exigent un bundle d'avant 4.10 : l.1944, `change` l.2047 et A8 l.2042 (inventaire §2.5). Prudent :
   - `COMMIT_NETTOYAGE` passe à `6270c81` pour les comparaisons R1 à R6 ;
   - une base dédiée `COMMIT_MEDIAS_410 = '00b0786'` (avec sa variable `KR_SCRIPT_AVANT_MEDIAS_410`) porte seule `avantNettoyageDecale`, `b0`, `b769` et le check l.1944 ;
   - sur cette base, n'y garder que les masques nécessaires : en retirer un à la fois et relancer `KR_FRAG=nettoyage`. Un masque dont le retrait laisse tout vert est retiré. Un masque dont le retrait fait rougir est gardé, avec sa condition « au prochain ticket qui modifie les médias 768/769 du kramail ou du changelog ».

   Option écartée : retirer M1/M2. Cela videraient trois contrôles.
3. **Neutralisations d'empreinte de `forum-index`** (FI15 à FI19 : `paire`, `texteColore`, `composantsHerites`, `COMPOSANTS_TICKET4/5`, `sujetStandard`) : inertes sur HEAD contre HEAD. Prudent : retirées. Elles sont couvertes par palette-nation (3.2, 3.3, 3.4), forum-activite l.969 (6.4) et le §3 de l'inventaire.
4. **Retrait des attributs d'infobulle (`COLONNE`, FI20)**. Le ticket demande l'injection en début de document « au lieu de la correction locale ». Prudent :
   - poser d'abord `debut` en gardant le retrait, et faire la preuve CA3 ;
   - ensuite, retrait seul des attributs, deux tours sous charge ;
   - tout vert : la correction locale est retirée ;
   - rouge sur un attribut d'infobulle : c'est un écart réel entre peau coupée et page native. La correction locale est remise, l'écart est consigné (`revue-manuelle.md` et `deferred-work.md`), et Arnaud tranche.
5. **Contrôle absolu 3.4 sur les pages de référence** (`palette-nation` `pages4`, check l.1198, aucun absolu ; inventaire §3). Prudent : avant de réaligner `BASELINE4`, ajouter sur `pages4` un check absolu. En clair : aucun gris de Bootstrap (`GRIS_BOOTSTRAP`, l.993) en texte, fond ou bordure des composants relevés. En sombre : bouton standard en fond de surface et texte de la nation, comme l.1087 et l.1095 sur la fixture. Il doit être rouge sur `6685df5` en `KR_SCRIPT`. Il ne doit pas l'être, ou la page ne porte aucun composant : arrêt, passage à Arnaud.
6. **4.4 compact** : `COMMIT_COMPACT` n'est pas réaligné (Ask First 1). Prudent : aucun ajout. En T1, vérifier qu'un check absolu 12 px existe sur la pagination compacte. S'il manque, le signaler dans la section « Backlog 11 », sans l'ajouter : le ticket qui réalignera `3b1da55` l'ajoutera.
7. **Décisions de non-changement** : tableau de palette l.1080 « comme avant le ticket » et `forum-index#hors-perimetre`. Prudent : elles deviennent des gardes de régression sur HEAD. Les libellés passent à « égal au bundle de base (6270c81) ». Pas de contrôle absolu ajouté.
8. **Constantes utilisées par `kramail-redaction`** (inventaire §2.6) : gardées, base auto-référente hors périmètre (A9). Leur condition devient : « Retrait : à la décision d'Arnaud sur les bases auto-référentes (action A9) ».
9. **`EXCEPTION_TICKET66`** : pas un masque de base. Prudent : non touchée.
10. **Seuils, tolérances, fixtures** : aucun changé. Si l'un doit changer, le build s'arrête et Arnaud tranche.

**Never:**

- Toucher `kraland-theme.css`, `kraland-userscript-template.js`, ou modifier `kraland-userscript-main.user.js` à la main.
- Modifier une fixture, un seuil ou une tolérance. Capture HTML brute dans le dépôt.
- Toucher les bases de `kramail-redaction` et `cybermonde-carte`.
- Réaligner sur une branche (`origin/...`) plutôt que sur un SHA.
- Réaligner une base avant d'avoir le contrôle absolu de la décision qu'elle prouvait seule.
- Site réel, `/report`, Chrome 9222/9223. Git qui écrit (commit, branche, stash, reset) sans accord.

## I/O & Edge-Case Matrix

| Scénario | Entrée / état | Attendu | Si écart |
|----------|---------------|---------|----------|
| Suite réalignée, bundle courant | chaque suite visée, sans `KR_SCRIPT` | 0 FAIL ; mêmes contrôles qu'en T1, sans les lignes « info écart accepté » des masques retirés | contrôle en moins non expliqué : arrêt |
| `forum-index`, ancien bundle | `KR_SCRIPT` = bundle `81512a3` | FAIL dans `hors-perimetre` (« rendu identique au bundle « avant » ») et dans `mobile`/`bureau` (6.1) | tout vert : la base ne mord pas, arrêt |
| `forum-activite`, ancien bundle | `KR_SCRIPT` = bundle `810901f` | FAIL dans `ligne` (l.1734, → 32 px, ou l.1685) ; sous-forum l.572 et l.591 rouges | tout vert : arrêt |
| `cartes-pastilles`, ancien bundle | `KR_SCRIPT` = bundle `21fed8d` | FAIL dans `forum`, `lignes`, `bureau` (« égaux au bundle de base ») et dans les absolus 5.2 à 5.5 | idem |
| `palette-nation`, ancien bundle | `KR_SCRIPT` = bundle `6685df5` | FAIL dans `composants-largeurs` : nouveau check absolu 3.4 `pages4` et l.1198 | nouveau check vert : arrêt (Ask First 5) |
| `typographie-formes` `echelle-forum` | `KR_SCRIPT` = bundle `d953969` | FAIL `echelle-forum` (égalité) et absolus 4.7 l.1172/1180 | idem |
| `typographie-formes` `espacement` | `KR_SCRIPT` = bundle `62fd47d` | FAIL `espacement` et absolus 4.9 l.1562/1624/1663 | idem |
| `typographie-formes` `nettoyage` | `KR_SCRIPT` = bundle `00b0786` | FAIL R1 à R6 (égalité) et l.2142 (médias 768/769 présents) | idem |
| `nettoyage` M1/M2 | bundle courant, `COMMIT_MEDIAS_410` = `00b0786` | l.1944, `change` et A8 (`blocs === 3`) verts | rouge : base dédiée mal câblée |
| Peau coupée en début de document | `forum-index` `KR_FRAG=peau-coupee`, 375 et 1440, sous charge, deux tours | vert ; injection constatée avant `<body>` (`__krInjection.body` faux) | rouge sur infobulle : Ask First 4 |
| Contre-épreuve CA3 | bundle jetable : HEAD + écart réel retardé sur `#col-right`, peau coupée seulement | `peau-coupee` rouge, nommé | vert : le contrôle ne voit pas l'écart, arrêt |
| Routeur | arbre fini | « Routeur conforme » ; aucun jeton de 3 à 4 suites | jeton à 4 : réécrire la phrase |

</frozen-after-approval>

## Code Map

Lignes = `6270c81` ; détail dans l'inventaire.

- `tests/e2e/forum-activite.mjs` :
  - `COMMIT_AVANT` l.84, `COMMIT_FIL` l.613, `COMMIT_ENTETE` l.894, `COMMIT_PLUS` l.1224, `COMMIT_LIGNE` l.1479 → `'6270c81'` ;
  - pose de `FLECHES_TICKET67` l.146-149 : supprimée ;
  - import de `FLECHES_TICKET67` et `AVANT_TICKET67` : retiré ;
  - en-tête l.50 et l.1477-1478 (« seul masque FLECHES67 ») : réécrits, aucun masque.
- `tests/e2e/forum-index.mjs` :
  - `COMMIT_AVANT` l.77 → `'6270c81'` ;
  - option `jetons` et sa pose l.94 : supprimées ; option `fil` et ses poses l.95-120 : supprimées ;
  - EMPREINTE l.609-690 : `paire`, `texteColore`, `composantsHerites`, `sujetStandard` retirés ; `composants` l.773 sans `COMPOSANTS_TICKET4/5` ;
  - libellés `hors-perimetre` l.794-808 (Ask First 7) ;
  - `open()` l.87 : option `debut` copiée de `forum-activite` (`enTete`, l'`eval` dès `document.documentElement`, `__krInjection`) ;
  - `peau-coupee` l.844-866 : `debut: true` des deux côtés, check d'état de l'injection, `COLONNE` selon Ask First 4 ;
  - imports.
- `tests/e2e/cartes-pastilles.mjs` :
  - `COMMIT_AVANT` l.78 → `'6270c81'` ;
  - options `plus65` et `ligne66` (l.191-204) : supprimées, avec leurs passages aux appels ;
  - `ORIGINE_TICKET64` l.516-521 et son info : supprimés ;
  - `LIGNE_INDEX_TICKET62` en `masque` dans `lignes` l.647 : supprimé ;
  - lignes « info écart accepté » de ces masques : supprimées ;
  - conditions de `sansPnj55` l.1089 et `sansPosition55` l.1481 (Ask First 1) ;
  - imports.
- `tests/e2e/palette-nation.mjs` :
  - nouveau check absolu 3.4 sur `pages4`, à placer près de l.1198 (Ask First 5) ;
  - `BASELINE4` l.962 → `'6270c81'` ;
  - `secondaire`, `cartes`, `plus65` retirés des appels sur `avant4` (l.1025, l.1150-1160) ;
  - options d'`ouvrir` l.184-203 supprimées si plus utilisées ;
  - libellé l.1080 (Ask First 7) ;
  - imports.
- `tests/e2e/typographie-formes.mjs` :
  - `echelle-forum` :
    - `COMMIT_ECHELLE_FORUM` l.1008 → `'6270c81'` ;
    - `medias410` retiré de `avantEchelleForum` l.1011 ;
    - masques l.1201-1215 et assertion l.1218 : supprimés ;
  - `espacement` :
    - `COMMIT_ESPACEMENT` l.1495 → `'6270c81'` ;
    - `medias410` retiré l.1496 ;
    - `CARTES_TICKET53` l.1606 : supprimé ;
  - `nettoyage` (Ask First 2) :
    - `COMMIT_NETTOYAGE` l.1676 → `'6270c81'` ;
    - nouvelle `COMMIT_MEDIAS_410 = '00b0786'` et sa variable d'environnement ;
    - `avantNettoyageDecale` l.1679 lu sur cette base ;
    - l.1944, `b0` l.1953, `b769` l.1959 sur cette base ;
    - masques de `ouvrirNettoyage` l.1887-1916 : posés seulement quand `script` est le bundle de `COMMIT_MEDIAS_410`, réduits au nécessaire ;
    - comparaisons R à 768 contre `avantNettoyage` (HEAD) ;
  - conditions de TF1 l.323, TF2 l.539, TF3 l.928-930, TF7 l.1237 (Ask First 1) ;
  - en-tête l.14-108 (`KR_SCRIPT_AVANT_*`) mis à jour ;
  - imports.
- `tests/e2e/lib/variantes.mjs` :
  - constantes et détecteurs sans utilisateur (inventaire §2.6) : supprimés ;
  - conditions des constantes gardées : réécrites (Ask First 1, 2, 8) ;
  - aucune condition « A4 » ni « détecteur l'éteint » restante ;
  - `REGLES_CARTE_TICKET51`, `RETRAITS_TICKET49`, `ECARTS_TICKET49` (sans utilisateur avant le ticket) : signalés, non retirés.
- `_bmad-output/initiative-harmonisation-ux/revue-manuelle.md` : section « Backlog 11 » en fin de fichier.
- `_bmad-output/initiative-harmonisation-ux/deferred-work.md` : statut sous « Reports du ticket 6.6 » (course des infobulles).

## Tasks & Acceptance

**Execution:**

- [ ] T1 : relevé avant, consigné au Plan Change Log :
  - `git rev-parse HEAD` → `6270c81…` ; `git diff --quiet 6270c81 -- kraland-userscript-main.user.js` → 0 (bundle de travail = bundle cible) ;
  - comptes ok/FAIL, suite par suite, avec `node tests/e2e/<suite>.mjs` : `forum-activite`, `forum-index`, `cartes-pastilles`, `palette-nation`, `typographie-formes`, `sous-forum` ;
  - `npm run test:router` ;
  - relevé `TOKEN_RE` des jetons de l'inventaire §5. Recréer `$TMPDIR/b11/jetons.mjs` s'il manque : il compte, par jeton, les fichiers de `SUITES` qui le citent ;
  - bundles des sept anciennes bases dans `$TMPDIR` : `81512a3`, `810901f`, `21fed8d`, `6685df5`, `d953969`, `62fd47d`, `00b0786` ;
  - Ask First 6 : présence d'un check absolu 12 px de pagination compacte.
- [ ] T2 : **`forum-activite`**. Les cinq bases passent à `6270c81`, la pose FLECHES67 est retirée, l'en-tête est réécrit. Ensuite :
  - suite entière verte ;
  - contre-épreuve `KR_SCRIPT=$TMPDIR/kr-810901f.user.js` : FAIL nommés dans `ligne` ;
  - `node tests/e2e/sous-forum.mjs` sur le même bundle : l.572 et l.591 rouges ;
  - `test:router`.
- [ ] T3 : **`forum-index`**, en deux temps.
  - Option `debut` d'abord, avec la preuve CA3 (T8) en gardant `COLONNE`. Puis Ask First 4.
  - Puis le réalignement :
    - `COMMIT_AVANT` → `6270c81` ;
    - suppression de `jetons`, `fil` et des neutralisations FI15 à FI19 ;
    - libellés `hors-perimetre`.
  - Ensuite : suite verte ; contre-épreuve `KR_SCRIPT=$TMPDIR/kr-81512a3.user.js`, FAIL nommés dans `hors-perimetre`, `mobile` et `bureau` ; `test:router`.
- [ ] T4 : **`cartes-pastilles`**. `COMMIT_AVANT` passe à `6270c81`. CP1 à CP4 et leurs infos sont retirés. Ensuite :
  - suite verte ;
  - contre-épreuve `KR_SCRIPT=$TMPDIR/kr-21fed8d.user.js` : FAIL nommés dans `forum`, `lignes`, `bureau` et les absolus 5.2 à 5.5 ;
  - les assertions de détecteurs l.1529-1531 restent vertes, sinon on les adapte aux seules bases dédiées ;
  - `test:router`.
- [ ] T5 : **`palette-nation`**.
  - Check absolu 3.4 `pages4` d'abord : rouge avec `KR_SCRIPT=$TMPDIR/kr-6685df5.user.js`, vert sur HEAD.
  - Puis `BASELINE4` → `6270c81`, retrait de PN1 à PN3 sur `avant4`, libellé l.1080.
  - Ensuite : suite verte ; contre-épreuve sur le même bundle, FAIL nommés dans `composants-largeurs` ; `test:router`.
- [ ] T6 : **`typographie-formes`**, trois pas séparés. Chaque pas finit par `KR_FRAG=<fragment>` vert, sa contre-épreuve rouge et `test:router` :
  - T6a `echelle-forum`, contre-épreuve `kr-d953969` ;
  - T6b `espacement`, contre-épreuve `kr-62fd47d` ;
  - T6c `nettoyage` avec la base dédiée M1/M2 (Ask First 2) :
    - retrait des masques un à un, chaque essai consigné ;
    - contre-épreuve `kr-00b0786` : FAIL R1 à R6 et l.2142 ;
    - puis la suite entière.
- [ ] T7 : **`lib/variantes.mjs`** :
  - suppression des constantes orphelines ;
  - réécriture des conditions gardées ;
  - `grep -nE 'A4|détecteur l.éteint|contient l.entrée' tests/e2e` vide, hors noms de repères ;
  - `node tests/e2e/kramail-redaction.mjs` : comptes égaux à T1 ;
  - suites T2 à T6 relancées une fois ;
  - `test:router`.
- [ ] T8 : **CA3** sur `forum-index#peau-coupee` (après T3, puis sur l'arbre fini).
  - Charge : `KR_FRAG=peau-coupee node tests/e2e/forum-index.mjs`, lancé deux fois. Chaque fois, en parallèle de `npm run test:zone -- cartes-pastilles` et `npm run test:zone -- typographie-formes`, avec `KR_CONCURRENCY=8`. Les deux tours sont verts et le check d'état montre l'injection avant `<body>`.
  - Contre-épreuve : un bundle jetable `$TMPDIR/kr-ecart-retarde.user.js`, copie de HEAD plus un ajout. Quand la peau est coupée (`kr-theme-enabled` à `false`), un `setTimeout` court, sous l'attente de stabilité de la suite, ajoute un élément visible dans `#col-right`. Lancé avec `KR_SCRIPT`, `peau-coupee` doit être rouge, avec un nom. Si le contrôle reste vert, réduire le délai ; s'il reste vert à 0, arrêt.
  - Statut écrit sous « Reports du ticket 6.6 » de `deferred-work.md`.
- [ ] T9 : `revue-manuelle.md`, section « Backlog 11 » :
  - les dix Ask First et le choix appliqué ;
  - les masques gardés, avec leurs conditions ;
  - le résultat d'Ask First 4 et d'Ask First 6 ;
  - les constantes sans utilisateur signalées ;
  - les essais de retrait de T6c.
- [ ] T10 : vérification finale (Verification).

**Acceptance Criteria:**

- Given `tests/e2e`, when on cherche « A4 » dans les conditions de retrait, then rien. Chaque masque restant (TF1, TF2, TF3, TF7, CP5, CP6, constantes de `kramail-redaction`, masques nécessaires de la base M1/M2) a une raison et une condition qui nomme un événement à venir (CA1).
- Given `forum-activite.mjs`, `forum-index.mjs`, `typographie-formes.mjs`, when on cherche `FLECHES_TICKET67`, then rien. La seule exception possible est la base M1/M2, si T6c a prouvé qu'il le faut, avec sa condition (CA1).
- Given chaque base réalignée, when `KR_SCRIPT` vaut le bundle de l'ancienne base, then la suite donne au moins un FAIL nommé par décision concernée. Ou bien la décision est couverte par le contrôle absolu désigné au §3 de l'inventaire (CA2).
- Given `forum-index#peau-coupee`, when il tourne deux fois sous charge, then il est vert et injecte en début de document. Given le bundle d'écart retardé, then il est rouge (CA3).
- Given l'arbre fini, when `npm run test:router`, `npm run lint:css`, `npm run lint:js` tournent, then « Routeur conforme » et 0 erreur. Aucun jeton ne passe de 3 à 4 suites. Puis `npm run test:all`, lancé par l'orchestrateur sur machine calme, donne 0 FAIL (CA4).
- Given `git diff --stat 6270c81`, then aucun changement dans `kraland-theme.css`, `kraland-userscript-template.js`, `kraland-userscript-main.user.js`, `tests/e2e/fixtures/`.

## Implementation Notes

- Hypothèses du planificateur :
  - H1 : `risk: 'medium'`. Rien ne change dans le produit. Le risque est de vider un contrôle : les contre-épreuves et l'inventaire §3 le bornent.
  - H2 : réaligner sur HEAD transforme les comparaisons en gardes de régression. Avec `KR_SCRIPT` ancien, la base HEAD ne reçoit plus de masque (détecteurs faux), donc les comparaisons rougissent. C'est la preuve CA2.
  - H3 : ordre du plus simple au plus couplé. `forum-activite` n'a qu'un masque. `typographie-formes` vient en dernier : ses pas partagent `ouvrirNettoyage` et `variantes.mjs`.
- Pièges :
  - `cartes-pastilles` : `KR_SCRIPT_AVANT` remplace aussi les trois bases dédiées (l.79, 83, 87). Les contre-épreuves passent par `KR_SCRIPT`, jamais par `KR_SCRIPT_AVANT`.
  - `forum-index`, option `debut` : `enTete` lève une erreur sans `<meta charset="utf-8">`. Les quatre fixtures l'ont. Le côté natif (`src: null`) ne reçoit pas de script, mais reçoit le même `enTete`, pour comparer deux DOM identiques en dehors du userscript.
  - `run-at` est à 3 suites : ne pas l'écrire dans `forum-index`. `data-toggle` est déjà à 7 (non bloquant).
  - `typographie-formes` l.1218 (`AVANT_TICKET47(base)`) casse au réalignement : on le supprime, on ne l'inverse pas.
  - Après T6c, `avantNettoyageDecale === avantNettoyage` si les deux lisent HEAD. Le check l.1944 doit lire la base M1/M2.
  - `test:all` sous charge donne de faux FAIL : rejouer la suite seule. La preuve finale se fait sur machine calme, par l'orchestrateur.
  - `test:all` ne lance pas `test:router` : le lancer à chaque modification sous `tests/`.
  - Les descriptions de `lib/router.mjs` (l.36, l.63, l.70) parlent du « bundle d'avant le ticket ». Les corriger seulement si elles deviennent fausses (`lib/` ne compte pas pour MAX_CITING).

- Notes de l'implémenteur (2026-10-25) :
  - Base de réalignement `6270c81` : son bundle est identique à HEAD. Les comparaisons réalignées sont des gardes de régression, sans masque.
  - `forum-index` n'a pas de zone propre : il se lance par `node tests/e2e/forum-index.mjs` (zone « forum »).
  - Outils jetables hors dépôt, dans `$TMPDIR/b11/` : `compte.mjs` (jetons montés au-delà de 3 contre `tests/e2e` de 6270c81), `jetons.mjs`, `purge.cjs` (retrait d'exports par espree), `detect.mjs` (détecteurs 5.3, 5.4 et 5.5 de cartes-pastilles par base).
  - `typographie-formes` : un premier script d'édition a ancré sur une mauvaise occurrence et dupliqué du contenu. Le fichier a été reconstruit depuis `git show 6270c81:tests/e2e/typographie-formes.mjs` (lecture seule, sans checkout), puis les éditions refaites avec des ancres uniques.
  - Incident : une commande d'essai a lancé toutes les suites e2e en arrière-plan. Arrêtées par `pkill` en moins de 2 minutes ; fixtures locales seulement ; aucun changement inattendu dans `git status`.
  - Après la revue quick (quatre constats, Review Triage Log), les Verification commands ont été relancées sur l'arbre corrigé (Result).
  - Un commentaire ajouté à `typographie-formes` citait « ci-dessus », jeton qui serait passé de 3 à 4 suites. Reformulé en « plus haut » ; relevé final : 0 jeton monté.

## Verification

Commandes, dans l'ordre, sur l'arbre fini :

```bash
npm run test:router
npm run lint:css
npm run lint:js
node "$TMPDIR/b11/jetons.mjs" . forum-activite,forum-index,cartes-pastilles,palette-nation,typographie-formes <jetons §5>
for b in 81512a3 810901f 21fed8d 6685df5 d953969 62fd47d 00b0786; do git show $b:kraland-userscript-main.user.js > "$TMPDIR/kr-$b.user.js"; done
KR_SCRIPT="$TMPDIR/kr-81512a3.user.js" node tests/e2e/forum-index.mjs            # FAIL attendus : hors-perimetre, mobile, bureau
KR_SCRIPT="$TMPDIR/kr-810901f.user.js" node tests/e2e/forum-activite.mjs         # FAIL attendu : ligne
KR_SCRIPT="$TMPDIR/kr-810901f.user.js" node tests/e2e/sous-forum.mjs             # FAIL attendus : l.572, l.591
KR_SCRIPT="$TMPDIR/kr-21fed8d.user.js" node tests/e2e/cartes-pastilles.mjs       # FAIL attendus : forum, lignes, bureau, 5.2 à 5.5
KR_SCRIPT="$TMPDIR/kr-6685df5.user.js" KR_FRAG=composants-largeurs node tests/e2e/palette-nation.mjs  # FAIL attendu : 3.4 pages4
KR_SCRIPT="$TMPDIR/kr-d953969.user.js" KR_FRAG=echelle-forum node tests/e2e/typographie-formes.mjs
KR_SCRIPT="$TMPDIR/kr-62fd47d.user.js" KR_FRAG=espacement node tests/e2e/typographie-formes.mjs
KR_SCRIPT="$TMPDIR/kr-00b0786.user.js" KR_FRAG=nettoyage node tests/e2e/typographie-formes.mjs
KR_SCRIPT="$TMPDIR/kr-ecart-retarde.user.js" KR_FRAG=peau-coupee node tests/e2e/forum-index.mjs   # FAIL attendu : peau-coupee
```

Suites vertes sur le bundle courant, avec un compte par suite et la différence avec T1 expliquée :

- `node tests/e2e/forum-activite.mjs`
- `node tests/e2e/forum-index.mjs`
- `node tests/e2e/cartes-pastilles.mjs`
- `node tests/e2e/palette-nation.mjs`
- `node tests/e2e/typographie-formes.mjs`
- `node tests/e2e/sous-forum.mjs`
- `node tests/e2e/kramail-redaction.mjs`

CA3 : deux tours de `peau-coupee` sous charge (T8), verts.

Final : `npm run test:all`, lancé par l'orchestrateur sur machine calme, et non par l'implémenteur.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | `tests/e2e/lib/variantes.mjs:59`, `:72`, `:109` | `COMPOSANTS_TICKET4`, `ECHELLE_TICKET45`, `AVANT_TICKET45` ne portent que la condition A9 alors qu'elles servent hors `kramail-redaction` (sélecteur de `palette-nation`, TF2, TF3, `titre-forum`) | fondé | patch (fixed) | grep : `palette-nation` et `typographie-formes:543`, `:934`, `:2140` les importent |
| 2 | quick | `tests/e2e/typographie-formes.mjs:1676`, `:1911` | `avantNettoyageDecale` ne sert plus qu'à un check sur chaînes, équivalent à `AVANT_TICKET410(avantMedias410)` ; nom et libellé trompeurs | fondé | patch (fixed) | `grep -n avantNettoyageDecale` : 2 lignes, aucune page ouverte avec |
| 3 | quick | plan (T7, Result), `revue-manuelle.md` (Backlog 11), `deferred-work.md:166` | « 32 exports orphelins retirés » : le diff en retire 31 | fondé | patch (fixed) | `git diff 6270c81 -- tests/e2e/lib/variantes.mjs \| grep -cE '^-export'` = 31 ; `^export` 88 → 57 |
| 4 | quick | `deferred-work.md:164` | l'entrée « Masques 3/4 inertes de `kramail-redaction.mjs` » renvoie encore à A4, sans statut | fondé | patch (fixed) | aucune ligne `status:` sous l'entrée ; Ask First 8 l'a renvoyée à A9 |

## Plan Change Log

- T1, relevé avant (bundle courant, machine calme) : forum-activite 889 ok, forum-index 150, cartes-pastilles 2266, palette-nation 1354, typographie-formes 4402, sous-forum 1110, kramail-redaction 340 ; 0 FAIL partout.
- T2, `forum-activite` sur kr-810901f : les FAIL sont dans `entete` (2 FAIL, TH « Sujet » à 234.8 au lieu de 232.8), pas dans `ligne`. Raison : 810901f contient déjà 6.6 ; seul l'écart 6.7 (flèches de tri à 4 px) le sépare de 6270c81, et il se voit dans l'en-tête. La décision 6.6 reste prouvée par les contrôles absolus du fragment `ligne`.
- T3, `forum-index` sur kr-81512a3 : en plus des FAIL attendus (hors-perimetre, mobile, bureau), `peau-coupee` est rouge à 375 px. C'est l'effet attendu du retrait de `COLONNE` (Ask First 4) : l'ancien bundle laisse les attributs d'infobulle en peau coupée.
- T4, `cartes-pastilles` sur kr-21fed8d : le check « détecteurs 5.4 et 5.5 justes » rougit dès sa première assertion, le contrôle absolu 5.4 du bundle testé (« 0 règle(s) »). Il ne prouve donc pas les détecteurs eux-mêmes sur l'ancien bundle. Ils ont été vérifiés à part (`detect.mjs`) : 21fed8d et a7f0463 vrais pour 5.3/5.4/5.5 ; HEAD faux pour les trois ; 601ab19 faux/vrai/vrai ; 59567f0 faux/faux/vrai. Justes.
- T5, `palette-nation` : le check absolu de `pages4` est dans les fragments `composants-pages-*`, et non `composants-largeurs`. La contre-épreuve s'est faite sur ces fragments et sur la suite entière.
- T5, Ask First 5 : la moitié sombre prévue (bouton standard en fond de surface et texte de la nation) était rouge sur HEAD (8 FAIL) : beaucoup de `.btn-default` des pages ont des règles propres. Le check est réduit à « aucun gris de Bootstrap en texte, fond ou bordure des composants », sur les 16 variantes. Vert sur HEAD ; rouge sur 6685df5 (8 FAIL, 4 pages × 2 largeurs, plateau vert). Le sombre du bouton standard reste couvert par le check absolu de la fixture. Signalé à Arnaud (revue-manuelle, Backlog 11).
- T6, nettoyage : R1 à R6, le rendu à 768 px et la bascule se comparent à la base `COMMIT_NETTOYAGE` (6270c81). La base M1/M2 (`COMMIT_MEDIAS_410`, 00b0786) porte seule le check « base M1/M2 d'avant 4.10 », `change` et A8 (la base décalée `avantNettoyageDecale` est retirée à la revue, constat 2). T6c : tous les masques de `ouvrirNettoyage` ont été retirés (essai sans eux : 405 ok, 0 FAIL).
- T6 : fichier reconstruit depuis `git show 6270c81` après une édition fautive (Implementation Notes).
- T7 : 31 exports orphelins retirés de `lib/variantes.mjs` (1145 → 754 lignes). La mention `PAGINATION_TICKET44` du JSDoc d'`ECHELLE_TICKET45` est retirée. Les commentaires de `lib/router.mjs` qui citaient les masques `PLUS_TICKET65` et `LIGNE_TICKET66` parlent maintenant des suites « qui le comparent au bundle de base » ; zones inchangées.
- T9 : le skill `tester-kraland-css` (deux copies) citait les masques 6.4, 6.5 et 6.6 sur les bases d'avant le ticket. Ces mentions sont retirées.
- Revue quick, constat 1 : `COMPOSANTS_TICKET4`, `ECHELLE_TICKET45` et `AVANT_TICKET45` servent hors de `kramail-redaction`. Leur JSDoc donne maintenant les deux usages : A9 pour `kramail-redaction` ; TF3 (échelle des titres, `COMMIT_ECHELLE`) pour `ECHELLE_TICKET45` ; TF2 (boutons, `COMMIT_BOUTONS` et `COMMIT_MODALES`) et le check `titre-forum` pour `AVANT_TICKET45`. `COMPOSANTS_TICKET4` reste le sélecteur de contrôle absolu de `palette-nation` (`SEL_COMPOSANTS4`, dont « aucun gris de Bootstrap ») : cet usage n'est pas un masque.
- Revue quick, constat 2 : `avantNettoyageDecale` retirée de `typographie-formes`. Le check devient « nettoyage : base M1/M2 d'avant 4.10 (00b0786 : média (width>=769px) présent) », `assert.ok(AVANT_TICKET410(avantMedias410))`. Les commentaires du fragment ne parlent plus de base décalée pour le nettoyage.
- Revue quick, constat 3 : 31 exports retirés de `lib/variantes.mjs`, et non 32 (`^export` : 88 → 57). Chiffre corrigé ici, dans `revue-manuelle.md` et dans `deferred-work.md`.
- Revue quick, constat 4 : l'entrée « Masques 3/4 inertes de `kramail-redaction.mjs` » de `deferred-work.md` reçoit un statut qui la renvoie à A9 (Ask First 8).

## Result

SHA de départ : `6270c81` (HEAD, branche `feature/next`), arbre de travail non commité. Aucun changement de `kraland-theme.css`, `kraland-userscript-template.js`, `kraland-userscript-main.user.js` ni `tests/e2e/fixtures/` (`git diff --stat 6270c81`).

Comptes, bundle courant (avant T1 / après T7, 0 FAIL partout, exit 0) :

| Suite | Avant | Après | Différence |
|---|---|---|---|
| forum-activite | 889 | 889 | — |
| forum-index | 150 | 158 | +8 checks d'état « injection en début de document » |
| cartes-pastilles | 2266 | 2266 | — |
| palette-nation | 1354 | 1364 | +10 : check absolu gris de `pages4` (Ask First 5) |
| typographie-formes | 4402 | 4402 | — |
| sous-forum | 1110 | 1110 | — |
| kramail-redaction | 340 | 340 | — |

Contre-épreuves `KR_SCRIPT` (toutes exit 1) :

- forum-index, kr-81512a3 : 19 ok, 139 FAIL (hors-perimetre : sous-forum, sujet, Staff « rendu égal au bundle de base » ; mobile ; bureau ; racine ; classe de page ; peau-coupee à 375 px).
- forum-activite, kr-810901f : 2 FAIL dans `entete` (Plan Change Log).
- sous-forum, kr-810901f : 7 FAIL.
- cartes-pastilles, kr-21fed8d : 1589 ok, 677 FAIL (contraste 48, etiquettes 444, forum 28, groupes 34, lignes 22, pastilles 94, statique 7, bureau à 768/769).
- palette-nation, kr-6685df5 : 750 ok, 614 FAIL, dont « composants égaux au bundle de base » sur les 5 pages × 2 largeurs et le nouvel absolu gris (8 FAIL).
- typographie-formes : echelle-forum sur kr-d953969, 180 ok / 120 FAIL ; espacement sur kr-62fd47d, 617 / 413 ; nettoyage sur kr-00b0786, 322 / 83 (« styles calculés égaux à la base », « lignes du forum :active », statique « aucun média (max-width: 768px) », A8, « rendu changé par M1/M2 »).
- forum-index `peau-coupee`, kr-ecart-retarde : 8 ok, 8 FAIL « #col-right identique à la page native ».

CA3 : `peau-coupee` sous charge (`KR_CONCURRENCY=8`, zones cartes-pastilles et typographie-formes en parallèle). Après T3 : 2 tours verts, 16 ok chacun. Sur l'arbre fini : 2 tours verts, 16 ok chacun ; le check d'état montre l'injection en début de document des deux côtés.

Masques retirés :

- forum-activite : pose `FLECHES_TICKET67` ; bases à 6270c81.
- forum-index : options `jetons` et `fil` d'`open` (masques 6.3, 6.4, 6.5, 6.7), neutralisations d'empreinte (`paire`, `texteColore`, `composantsHerites`, `COMPOSANTS_TICKET4/5`, `sujetStandard`), lignes « écart accepté », retrait des attributs d'infobulle (`COLONNE`) ; `COMMIT_AVANT` à 6270c81.
- cartes-pastilles : CP1 à CP4 et leurs infos ; `COMMIT_AVANT` à 6270c81.
- palette-nation : options `secondaire`, `cartes`, `plus65` d'`ouvrir` et infos « écart accepté » de `pages4` ; `BASELINE4` à 6270c81.
- typographie-formes : masques d'echelle-forum, d'espacement et de `ouvrirNettoyage` (tous) ; bases à 6270c81, base M1/M2 dédiée sans masque.
- lib/variantes.mjs : 31 exports orphelins.

Masques gardés : TF1, TF2, TF3, TF7, CP5, CP6, constantes de `kramail-redaction` (A9) et `EXCEPTION_TICKET66` (pas un masque de base). Chacun porte une condition qui nomme un événement à venir (revue-manuelle, Backlog 11).

Contrôles finaux : `npm run test:router` « Routeur conforme » ; `npm run lint:css` exit 0 ; `npm run lint:js` exit 0 (0 erreur, 1 avertissement préexistant dans `report-non-lu.mjs`) ; 0 jeton passé de 3 à 4 suites ; `diff -r .hermes/skills .claude/skills` vide. `npm run test:all` (orchestrateur) : un premier passage sous charge (RimWorld, charge 20 à 27) a donné des FAIL hors périmètre (`modale-ordre`, `breakpoint-switch`), verts rejoués seuls (367 contrôles, exit 0) ; sur machine calme, 13697 ok, 0 FAIL en 212 s, exit 0. `!important` : 3281, inchangé.

Relance après la revue quick (constats 1 à 4), arbre corrigé : comptes verts identiques au tableau ci-dessus (889, 158, 2266, 1364, 4402, 1110, 340 ; 0 FAIL) ; contre-épreuves identiques (forum-index 139 FAIL, forum-activite 2, sous-forum 7, cartes-pastilles 677, palette-nation 614, echelle-forum 120, espacement 413, nettoyage 83, écart retardé 8 ; toutes exit 1). Le check « nettoyage : base M1/M2 d'avant 4.10 » est vert sur le bundle courant et sur kr-00b0786 (il porte sur la base, pas sur le bundle testé). CA3 : 2 nouveaux tours de `peau-coupee` sous charge, 16 ok, 0 FAIL. `test:router` conforme, `lint:css` et `lint:js` exit 0, 0 jeton monté à 4 suites, skills identiques, produit et fixtures inchangés.
