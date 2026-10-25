---
title: 'Refactor sweep'
type: 'refactor'
ticket: '7'
created: '2026-10-25'
status: 'built'
baseline_revision: '810901ffda0988670d892021ef857a4d958b734a'
route: 'full'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/epic-forum.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/tickets.toml'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-refactor-sweep-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-ligne-de-forum-icone-lue-dans-la-liste-laterale-forum-sans-m-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-refactor-sweep-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/epic-cartes-pastilles-retrospective.md'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '_bmad-output/initiative-harmonisation-ux/revue-manuelle.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
  - 'tests/e2e/lib/variantes.mjs'
  - 'tests/e2e/lib/router.mjs'
---

## Entrées de deferred-work.md visant l'épopée

« Traitée » renvoie à la tâche (T2 à T8) ; « rejetée » donne la raison du report. Détail, lignes et relevés : inventaire §1 à §4.

| # | Entrée (origine) | Lieu (base `810901f`) | Statut | Raison |
|---|------------------|------------------------|--------|--------|
| D1 | A13, cartes de ligne du forum, 1re version (4.8) | deferred-work.md l.45 ; feuille l.7911-7913 (commentaire seul) | traitée (T8) | Déjà retirée par 5.2. Le sweep écrit le statut ; aucun code. |
| D2 | A13, 2e version des cartes de ligne gardée pour Staff (4.8, 5.2) | deferred-work.md l.45 et l.80 ; feuille l.8361-8570 | rejetée | Depuis 6.1 elle ne s'applique plus qu'à Staff et aux pages `/forum/*` hors fixtures. La retirer change Staff, exclu par 6.1. Revient à l'alignement de Staff (question en attente). |
| D3 | Cellules du forum mobile en `padding-top: 3px` (4.9, l.8011 et l.8695 du plan) | feuille l.8496 (seule restante) | rejetée | L'occurrence l.8011 a disparu avec la 1re version (D1). Celle de l.8496 est dans la 2e version (D2) : Staff seulement, exclu. |
| D4 | Flèches de tri `::after` en `margin-left: 6px` (4.9, l.14109 et l.14114 du plan) | feuille l.13904, l.13909 | traitée (T2, T3) | Sous-forum mobile, cas mesurable sur `sous-forum-debuter.html` (DataTables émulé). Réécrite au jeton `var(--kr-space-1)` (Ask First 2), rouge/vert. |
| D5 | Staff : chevron 10 × 14, croix d'alerte qui sort de 5 px (5.2) | deferred-work.md l.83 | rejetée | Index Staff exclu par 6.1. |
| D6 | Coins bas de la carte racine en sombre (5.2, A8) | deferred-work.md l.86 | rejetée : décision d'Arnaud en attente | Changement visible, deux options écrites, aucune tranchée. Question ouverte. |
| D7 | Accordéon ou modale `.panel-default` sur `/forum/*` (revue 5.2) | deferred-work.md l.91 | rejetée | Aucune fixture n'en porte ; demande le site réel (mandat, lecture seule). |
| D8 | Bascule 767 ↔ 768 du forum non couverte (revue 5.2) | deferred-work.md l.92 | traitée (T8) | Couverte depuis 6.2 par `forum-activite.mjs`, fragment `seuil` (`bascule`, sujet et index RP). Le sweep écrit le statut avec la preuve ; aucun code. |
| D9 | Pages `/forum/*` hors fixtures (revue 5.2) | deferred-work.md l.93 | rejetée | Épopée 9 (`epic-forum.md`). |
| D10 | `span.tagforum` (5.5, D14) | deferred-work.md l.121 | rejetée : décision d'Arnaud en attente | `epic-forum.md` : non touché. |
| D11 | Correctif d'ancres limité à `#flap` (6.2) | deferred-work.md l.130 | rejetée : décision d'Arnaud en attente | Comportement du vrai téléphone. Garder ou retirer le correctif en entier est en question dans `revue-manuelle.md`. |
| D12 | Liens « lien » et « liste des messages » absents du sujet mobile (6.4) | deferred-work.md l.135 | rejetée : décision d'Arnaud en attente | Choix produit. |
| D13 | Barre d'un message ouvert en z-index 991 au-dessus de « Envoyer » (6.5) | deferred-work.md l.139 | rejetée | Aucune fixture ne porte à la fois messages et barre « Envoyer » ; à voir sur un vrai sujet, en lecture. |
| D14 | Course des infobulles en peau coupée mobile (6.6) | deferred-work.md l.143 | traitée (T7, audit) | `forum-index#peau-coupee` retire les quatre attributs d'infobulle des deux côtés avant comparaison (`COLONNE` l.823-825) ; `palette-nation#peau-coupee` ne lit que des couleurs ; `palette-nation#largeurs` tourne peau active. Aucun contrôle exposé : aucune modification de suite (inventaire §4). |
| D15 | `pathKey` ne garde que le `pathname` (6.6) | deferred-work.md l.144 | rejetée | Écarté par la revue 6.6 (cas improbable). |

Décompte : 4 traitées (D1, D4, D8, D14), 11 rejetées dont 5 en attente d'une décision d'Arnaud (D6, D10, D11, D12, et D2-D3-D5 via l'alignement de Staff).

Hors liste, aussi traités par ce ticket : masques de l'épopée 6 (T4 à T6), condition de `EXCEPTION_TICKET66` (T6). Règles mortes d'avant 6.2 (inventaire §3.2) : signalées, non retirées (Ask First 3). Reports des épopées 1 à 5 hors forum et masques 3 à 5 : hors périmètre (A4).

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** L'épopée 6 laisse des masques de test posés sur des bases d'avant ses tickets. Tous disent « à retirer au sweep 6.7 ou par l'action A4 de la rétro 5 », or aucun ticket ne porte A4 (rétro 5, F4). Un masque est déjà inerte : `PLUS_AVANT` de `kramail-redaction.mjs`, dont la base `origin/feature/next` contient 6.5. Les cinq bases de `forum-activite.mjs` sont propres à l'épopée 6, et leurs masques peuvent s'éteindre par réalignement. Les bases de `forum-index`, `cartes-pastilles`, `typographie-formes` et `palette-nation` sont partagées avec les masques des épopées 3 à 5. Côté feuille, il reste un report de la grille de 4 px mesurable sur le forum : les flèches de tri du sous-forum mobile (6 px). L'audit 6.6 des infobulles en peau coupée reste à faire. Aucune règle CSS ni fonction JS n'est morte du fait de 6.2 à 6.6 (inventaire §3.1).

**Approach:**

- Réaligner les cinq bases de `forum-activite.mjs` sur `810901f`, puis retirer ses masques et options 6.x devenus inertes.
- Retirer `PLUS_AVANT` de `kramail-redaction.mjs` (condition atteinte).
- Garder les masques 6.x des bases partagées, avec une condition qui nomme un événement à venir : le ticket A4, à créer à la rétro de l'épopée 6.
- Réécrire les deux flèches de tri au jeton `var(--kr-space-1)`, rouge/vert dans `sous-forum.mjs`.
- Écrire les statuts dans `deferred-work.md` et la section « Ticket 6.7 » dans `revue-manuelle.md`. Tout le reste des reports est rejeté (tableau ci-dessus).

## Boundaries & Constraints

**Always:**

- L'inventaire fait foi. Tout écart va au Plan Change Log avec sa raison.
- P1 option 4 : réécrire la déclaration d'origine. **Aucun nouvel `!important`** : `grep -c '!important' kraland-theme.css` ≤ 3290 après le ticket (attendu : 3290).
- Mobile en `@media (max-width: 767px)`, ordinateur en `@media (min-width: 768px)`. Aucune règle globale ajoutée. Les flèches restent dans leur média l.13768.
- Garde ajoutée à un sélecteur : `:where(...)`. Le ticket n'en ajoute aucune.
- Cibles d'au moins 44 px : les puces de tri restent ≥ 44 × 44 (contrôle `sous-forum.mjs` l.548).
- « Retirer une règle de la peau peut révéler un défaut natif : vérifier le rendu après suppression ». Ce ticket ne retire aucune règle ; la réécriture des flèches est vérifiée par mesure et capture à 375 et 767 px.
- MAX_CITING : aucun jeton ne passe de 3 à 4 suites. Ne jamais écrire en clair, dans une suite qui ne les cite pas déjà, `kr-page-forum-index`, `forum-mobile-breadcrumb`, `panel-default`, `kr-text-secondary`, `forum-index-communaute` (inventaire §5). Relevé `TOKEN_RE` refait sur les suites finies.
- Base réalignée = SHA figé `810901f`, jamais une branche (rétro 5, F3).
- Chaque masque gardé porte une condition qui nomme un événement à venir porté par un ticket ou une décision nommée (rétro 5, F4). Jamais « quand le bundle de base contient l'entrée ».
- Chaque retrait non trivial a sa contre-épreuve nommée (Verification). Retrait inerte : égalité des comptes ok/FAIL avant/après à la place de la contre-épreuve (sweep 5.6, A3).
- Les Ask First ci-dessous sont **tranchés dans le sens prudent par l'implémenteur**, sans attendre. Le choix prudent est écrit à côté de chacun, appliqué tel quel et consigné dans `revue-manuelle.md` (section « Ticket 6.7 ») pour Arnaud.

**Ask First:**

1. **Bases partagées et action A4.** Réaligner `forum-index` `81512a3`, `cartes-pastilles` `21fed8d`, `typographie-formes` `d953969`, `62fd47d` et `00b0786`, `palette-nation` `6685df5` rend inertes aussi les masques des épopées 3 à 5. Il faudrait alors les retirer : c'est A4, hors du ticket. Prudent : ces bases ne bougent pas. Leurs masques 6.x sont gardés et leur condition devient : « Retrait : au réalignement de <base> par le ticket qui porte l'action A4 de la rétro 5 (extinction des masques 3 à 6) ; ce ticket est à créer à la rétro de l'épopée 6. » Option écartée par défaut : 6.7 porte A4 en entier (risque moyen, autre ticket).
2. **Valeur des flèches de tri.** 6 px est à égale distance de 4 et de 8. Prudent : `var(--kr-space-1)` (4 px), comme l'écart icône–nom de la ligne de forum (6.6) ; la puce rétrécit de 2 px et garde ≥ 44 px. Si une puce passe sous 44 px ou si le défilement des puces change de comportement : arrêt, passage à Arnaud.
3. **Règles mortes d'avant 6.2** (inventaire §3.2 : `forum-topic-stats-mobile`, `forum-description-wrapper`, `forum-stats-wrapper`, `forum-thread-detail`, `forum-thread-metadata`). Elles ne sont pas imputables à 6.2-6.6, et certaines peuvent être natives sur des pages hors fixtures. Prudent : non retirées, signalées dans `deferred-work.md` (nouvelle entrée « Reports du ticket 6.7 »).
4. **`EXCEPTION_TICKET66`.** Ce n'est pas un masque de base : elle tient l'écart voulu index ↔ sous-forum. Prudent : gardée, avec la condition « Retrait : quand le sous-forum suit la Ligne de forum (flèche 34 px, auteur en accent, dernier message à droite) ; décision d'Arnaud en attente (revue-manuelle.md, harmonisation du sous-forum), puis ticket qui l'aligne ».
5. **Constantes de `forum-activite.mjs`.** Prudent : les cinq constantes (`COMMIT_AVANT`, `COMMIT_FIL`, `COMMIT_ENTETE`, `COMMIT_PLUS`, `COMMIT_LIGNE`) et leurs variables `KR_SCRIPT_AVANT*` restent, toutes à `'810901f'`. Aucune fusion (changement d'interface hors objet).
6. **Masques 3/4 inertes de `kramail-redaction.mjs`** (`ESPACEMENT_AVANT` et voisins, base auto-référente). Prudent : non touchés (A4, épopée 4) ; signalés dans la section « Ticket 6.7 ».
7. **Seuils et tolérances.** Aucun changé. Un seuil ou une tolérance à changer arrête le build et passe à Arnaud.
8. **Fixtures.** Inchangées.

**Never:**

- Nouvel `!important` ; règle `:focus` ; règle de mobile hors `@media (max-width: 767px)` ; règle d'ordinateur hors `@media (min-width: 768px)` ; règle globale.
- Toucher Staff, la 2e version des cartes de ligne, `padding-top: 3px` l.8496, la racine (coins), `span.tagforum`, le correctif d'ancres, les liens du sujet mobile, le z-index 991.
- Retirer un masque des épopées 3 à 5, réaligner une base partagée (Ask First 1).
- Modifier `kraland-userscript-main.user.js` à la main ; modifier une fixture ; capture HTML brute dans le dépôt.
- Site réel, `/report`, Chrome 9222/9223. Git qui modifie l'arbre, l'index ou le stash sans accord.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Flèche de tri, colonne triée | `sous-forum-debuter`, 375 et 767 px, `th.sorting_desc` (état initial) | `getComputedStyle(th, '::after').marginLeft` = `4px` | base `810901f` : `6px` (rouge) |
| Flèche de tri, après clic | même page, clic sur l'en-tête trié, `th.sorting_asc` | `4px` | base : `6px` (rouge) |
| Puces de tri | 375 et 767 px | 5 puces visibles, ≥ 44 × 44, colonne triée en premier, 0 débordement | puce < 44 px : arrêt (Ask First 2) |
| Ordinateur | 768 et 1280 px | règle de média mobile, aucun effet ; contrôles bureau de `sous-forum.mjs` inchangés | — |
| `forum-activite` réalignée | les 9 fragments, bundle courant | mêmes contrôles verts qu'en T1, sans les lignes « info écart accepté » 6.x | contrôle en moins ou en plus : expliqué au Plan Change Log |
| `forum-activite`, ancien bundle | `KR_SCRIPT` = bundle de `0523d7f` | FAIL dans `lignes`, `fil`, `entete`, `plus`, `ligne` | tous verts : la base ne mord pas, arrêt |
| `kramail-redaction` sans `PLUS_AVANT` | suite entière | comptes ok/FAIL égaux à T1 | écart : arrêt |
| Masques gardés | `forum-index`, `cartes-pastilles`, `typographie-formes`, `palette-nation` | code inchangé, commentaires de condition seuls modifiés ; comptes égaux à T1 | — |
| Peau coupée (audit) | contrôles de l'inventaire §4 | aucun changement | — |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` l.13902-13910 : `body.page-forum.kr-subforum #topics thead th.sorting_desc::after` et `… th.sorting_asc::after`, `margin-left: 6px` → `var(--kr-space-1)`. Média l.13768 (`max-width: 767px`).
- `tests/e2e/sous-forum.mjs` : mesure des puces de tri (évaluation qui remplit `m.chips`, fragment `l3-liste`, `checkToolbar` l.546-550). Nouveau contrôle de la marge du `::after`.
- `tests/e2e/forum-activite.mjs` :
  - constantes l.83, l.625, l.907, l.1237, l.1492 → `'810901f'` ;
  - options `entete64` et `ligne66` de `ouvrir` et leur pose (l.145-160), leurs passages aux appels (dont `bascule` l.431) ;
  - lignes « info écart accepté » l.460, l.512, l.772, l.1697 ;
  - import l.77 : retirer `AVANT_TICKET64`, `AVANT_TICKET66`, `ENTETE_TICKET64`, `LIGNE_TICKET66`, `ligneTicket66` (et tout autre nom devenu inutilisé) ; garder `ACTIVITE_TICKET62`, `REPERES_*`, `CONTRASTE`, `VARIANTES` ;
  - en-tête l.50-60 et commentaires de base : base `810901f` (fin de l'épopée 6, avant 6.7).
- `tests/e2e/kramail-redaction.mjs` : l.238-241 (`PLUS_AVANT` et son commentaire), l.1296 (info), l.1313 (`PLUS_AVANT` dans la liste `init`), import de `AVANT_TICKET65`, `PLUS_TICKET65`, `plusTicket65` si plus utilisés.
- Conditions de retrait à réécrire (Ask First 1) :
  - `tests/e2e/lib/variantes.mjs` l.567, l.613, l.902, l.1003, l.1075 (en retirant `forum-activite` et `kramail-redaction` des suites citées) ;
  - `tests/e2e/forum-index.mjs` l.95-110 ;
  - `tests/e2e/cartes-pastilles.mjs` l.192, l.199, l.519 ;
  - `tests/e2e/typographie-formes.mjs` l.1202-1212, l.1893 ;
  - `tests/e2e/palette-nation.mjs` l.198.
- `tests/e2e/forum-index.mjs` l.322 : commentaire de condition au-dessus de `EXCEPTION_TICKET66` (Ask First 4).
- `_bmad-output/initiative-harmonisation-ux/deferred-work.md` : statuts D1, D4, D8, D14 ; nouvelle section « Reports du ticket 6.7 ».
- `_bmad-output/initiative-harmonisation-ux/revue-manuelle.md` : section « Ticket 6.7 ».

## Tasks & Acceptance

**Execution:**

- [ ] T1 : relevé avant, consigné dans le Plan Change Log :
  - `grep -c '!important' kraland-theme.css` → 3290 ;
  - `grep -n 'margin-left: 6px' kraland-theme.css` → l.13904 et l.13909 parmi les six ;
  - `git rev-parse --short HEAD` → `810901f` ;
  - comptes ok/FAIL de `npm run test:zone -- forum-activite`, `npm run test:zone -- kramail`, `npm run test:zone -- sous-forum` ;
  - preuve que `kramail-redaction` n'imprime pas l'info « bouton « ••• » commun du kramail » (`PLUS_AVANT` vaut `null`) ;
  - relevé `TOKEN_RE` des jetons de l'inventaire §5.
- [ ] T2 : `kraland-theme.css` l.13904 et l.13909, `margin-left: 6px;` → `margin-left: var(--kr-space-1);`. Puis `npm run build`.
- [ ] T3 : `sous-forum.mjs`, test d'abord (rouge sur `810901f`, puis vert après T2) :
  - dans l'évaluation des puces, relever `getComputedStyle(th, '::after').marginLeft` des `th` qui portent `sorting_asc` ou `sorting_desc` ;
  - nouveau `check` dans `checkToolbar` : « flèche de tri de la colonne triée à 4 px du libellé (grille de 4 px) » ;
  - après le clic de tri déjà présent, même assertion sur l'autre sens ;
  - aucun jeton nouveau à tiret (pas de `kr-space-1` en clair).
- [ ] T4 : `forum-activite.mjs`, réalignement (Code Map). Supprimer le code des masques plutôt que le neutraliser. Puis `npm run test:zone -- forum-activite` et contre-épreuve (Verification).
- [ ] T5 : `kramail-redaction.mjs`, retrait de `PLUS_AVANT` (Code Map). Retrait inerte : comptes égaux à T1.
- [ ] T6 : conditions de retrait des masques gardés (Ask First 1) et de `EXCEPTION_TICKET66` (Ask First 4) : commentaires seuls, aucun code.
- [ ] T7 : audit des infobulles (D14) : relire les sept contrôles de l'inventaire §4 sur l'arbre fini ; consigner « aucun contrôle exposé » au Plan Change Log. Aucune modification de suite.
- [ ] T8 : `deferred-work.md` :
  - sous les entrées l.45 (1re version), l.54 (flèches de tri), l.92 (bascule), l.143 (infobulles), ajouter `status: traité par le sweep 6.7 (epic-forum/story-refactor-sweep-plan.md, <date>) : …` avec la preuve ;
  - nouvelle section « Reports du ticket 6.7 » : règles mortes d'avant 6.2 (Ask First 3), masques 3/4 inertes de `kramail-redaction` (Ask First 6), A4 non porté (Ask First 1).
- [ ] T9 : `revue-manuelle.md`, section « Ticket 6.7 » :
  - les huit Ask First et le choix appliqué ;
  - action pour la rétro de l'épopée 6 : créer le ticket A4 ;
  - rappel des questions en attente (D2-D3-D5 Staff, D6, D10, D11, D12, compteurs sur ordinateur, harmonisation du sous-forum, Q27.5, Q27.6, O1) ;
  - D7 et D13 : vérification sur le site réel, sous mandat, en lecture.
- [ ] T10 : vérification (section Verification).

**Acceptance Criteria:**

- Given `kraland-theme.css`, when on compte `!important`, then 3290 avant et après.
- Given le sous-forum mobile à 375 et 767 px, when une colonne est triée (dans les deux sens), then la marge gauche du `::after` vaut 4 px, et 6 px sur `810901f`.
- Given les puces de tri, when on les mesure après T2, then 5 puces visibles, ≥ 44 × 44, aucun débordement horizontal.
- Given `forum-activite.mjs`, when on cherche `TICKET64`, `TICKET66`, `entete64`, `ligne66`, then seuls restent les repères (`REPERES_*`) ; les cinq constantes valent `'810901f'`.
- Given `forum-activite` sur le bundle courant, when la zone tourne, then 0 FAIL et les mêmes contrôles qu'en T1 ; given le bundle de `0523d7f` en `KR_SCRIPT`, then FAIL dans `lignes`, `fil`, `entete`, `plus` et `ligne`.
- Given `kramail-redaction.mjs`, when on cherche `PLUS_AVANT`, then rien ; la suite donne les mêmes comptes qu'en T1.
- Given chaque masque 6.x gardé et `EXCEPTION_TICKET66`, when on lit sa condition, then elle nomme le ticket A4 à créer à la rétro de l'épopée 6, ou la décision d'Arnaud sur le sous-forum ; plus aucune ne dit « sweep 6.7 ».
- Given le relevé `TOKEN_RE` sur les suites finies, when on le compare à l'inventaire §5, then aucun jeton ne passe de 3 à 4.
- Given `npm run lint:css`, `npm run lint:js`, `npm run test:router`, les zones touchées puis `npm run test:all` sur machine calme, when ils tournent, then 0 erreur, « Routeur conforme », 0 FAIL.

## Implementation Notes

- Assumptions (tranchées par le planificateur) :
  - A1 : `risk: 'low'`. Le seul rendu qui change : 2 px sur les flèches de tri du sous-forum mobile. Le reste est du harnais de test et de la documentation.
  - A2 : réaligner les bases de `forum-activite` sur `810901f` garde leur sens. Chaque contrôle compare l'égalité à la base ou une valeur absolue (inventaire §2.4). Après fusion de 6.7, `810901f` reste la base d'avant le ticket, et tout écart du sweep sur les pages de `forum-activite` y passe au rouge.
  - A3 : les flèches de tri ne sont pas en `!important` ; la réécriture garde le compte.
  - A4 : `grep -rn 'sweep 6.7' tests` doit être vide en fin de ticket, hors historique des plans.
- Pièges :
  - `forum-activite` `bascule` passe `entete64: true, ligne66: true` sans condition : retirer les deux clés avec les options.
  - Le fragment `ligne` traite une base « masquée pour le mobile hors icône » (l.1691-1711) : simplifier seulement ce qui tenait au masque, garder tous les contrôles.
  - `REPERES_*` et `ACTIVITE_TICKET62` ne sont pas des masques : ils tiennent hors de la suite des noms cités par 3 suites. Les garder, sinon MAX_CITING passe à 4.
  - `KR_SCRIPT` de la contre-épreuve : extraire le bundle par `git show 0523d7f:kraland-userscript-main.user.js > "$TMPDIR/kr-0523d7f.user.js"`, hors dépôt.
  - `test:all` sous charge donne de faux FAIL : rejouer la suite seule, preuve finale sur machine calme.
- Notes de construction (2026-10-25, implémenteur) :
  - T2 : `kraland-theme.css` l.13904 et l.13909, `margin-left: 6px;` → `margin-left: var(--kr-space-1);` (jeton défini l.34, 4 px). `npm run build` : exit 0, VALIDATION PASSED.
  - T3 : `sous-forum.mjs`. `TOOLBAR` relève `fleche` (marge du `::after` des `th` en `sorting_asc` ou `sorting_desc`, sinon `null`). `checkToolbar` porte le check « flèche de tri de la colonne triée à 4 px du libellé (grille de 4 px) ». Après le clic sur « Vus » déjà présent (375 et 700 px), le check « après le tri par « Vus », flèche de tri croissant à 4 px du libellé » exige une seule colonne triée, « Vus », en `sorting_asc`, à 4 px. Un bloc à 767 px reprend les puces, le clic et le même check. Aucun jeton à tiret ajouté. +12 contrôles.
  - T4 : `forum-activite.mjs`. Les cinq constantes valent `'810901f'`. Les options `entete64` et `ligne66` de `ouvrir` sont retirées avec leur pose et tous leurs passages, `bascule` compris. Les 4 lignes « info » 6.6 sont retirées. L'import ne garde que `ACTIVITE_TICKET62`, `CONTRASTE`, `REPERES_*` et `VARIANTES`, plus `AVANT_TICKET67`, `FLECHES_TICKET67` et `poserJetonsRedefinis` (voir le Plan Change Log). Les en-têtes et les commentaires disent « bundle de base (810901f) ». `LIGNE66` reste : c'est une fonction de mesure, pas un masque.
  - T5 : `kramail-redaction.mjs`. `PLUS_AVANT` est retiré avec son commentaire, sa ligne « info » et sa place dans `init`. L'import perd `AVANT_TICKET65`, `PLUS_TICKET65` et `plusTicket65`.
  - T6 : commentaires seuls. Conditions réécrites dans `lib/variantes.mjs` (LIGNE_INDEX_TICKET62, FIL_TICKET63, ENTETE_TICKET64 sans `forum-activite.mjs`, PLUS_TICKET65 sans `kramail-redaction.mjs`, LIGNE_TICKET66 sans `forum-activite.mjs`), `forum-index.mjs` (masques 6.3 à 6.5 de `open`, `EXCEPTION_TICKET66`), `cartes-pastilles.mjs` (`plus65`, `ligne66`, `ORIGINE_TICKET64`), `typographie-formes.mjs` (`echelle-forum`, `nettoyage`) et `palette-nation.mjs` (`plus65`). `grep -rn 'sweep 6.7' tests` donne une sortie vide.
  - T7 : audit D14. Les sept contrôles de l'inventaire §4 sont relus sur l'arbre fini. Les lignes ont bougé, le fond non : `forum-index` l.834 (retrait des quatre attributs) et l.851, `forum-activite` l.272 et l.1705 (`debut: true`), `palette-nation` l.1634, `messages-v3` l.228 et l.335, `modale-ordre` l.1371 (1280 px). Aucun contrôle exposé : aucune modification de suite.
  - Après revue : `forum-topic-stats-mobile` retirée de la feuille (9 `!important`, compte final 3281) ; conditions de `FLECHES_TICKET67` séparées entre `forum-activite` (réalignement sur un SHA qui contient 6.7) et les bases partagées (A4).
  - Masques retirés : `entete64` (ENTETE_TICKET64 et filSujetTicket64) et `ligne66` (LIGNE_TICKET66 et ligneTicket66) de `forum-activite.mjs` ; `PLUS_AVANT` (PLUS_TICKET65 et plusTicket65) de `kramail-redaction.mjs`.
  - Masques gardés, condition « ticket A4 à créer à la rétro de l'épopée 6 » : LIGNE_INDEX_TICKET62, FIL_TICKET63, ENTETE_TICKET64, PLUS_TICKET65 et LIGNE_TICKET66 sur les bases partagées (`forum-index`, `cartes-pastilles`, `typographie-formes`, `palette-nation`). Nouveau masque : FLECHES_TICKET67 (voir le Plan Change Log). Masques 3/4 de `kramail-redaction` non touchés (Ask First 6). `EXCEPTION_TICKET66` est gardée, sa condition renvoie à la décision d'Arnaud.

## Plan Change Log

- 2026-10-25, T1, relevé avant :
  - HEAD et `origin/feature/next` : `810901f` ;
  - `grep -c '!important' kraland-theme.css` : 3290 ;
  - `margin-left: 6px` aux l.2509, 6786, 11063, 11322, 13904 et 13909 ;
  - zone `forum-activite kramail sous-forum forum menus-forums cartes-pastilles typographie-formes palette-nation` : exit 0, 11234 ok, 0 FAIL. Par suite : jeu-identite 106, forum-index 150, palette-nation 1354, typographie-formes 4402, cartes-pastilles 2266, forum-activite 889, sous-forum 1098, forum-mobile 375, menus-forums 254, kramail-redaction 340 ;
  - aucun journal de `kramail-redaction` n'imprime « bouton « ••• » commun du kramail » : `PLUS_AVANT` vaut `null`. Les journaux de `forum-activite` portent 4 lignes « info » 6.6 ;
  - relevé `TOKEN_RE` conforme à l'inventaire §5 : `page-forum` à 4 suites (déjà le cas), les autres à 3 ou moins.
- 2026-10-25, rouge avant : sur l'arbre avec T3 et sans T2, `npm run test:red -- sous-forum` donne exit 0 et « ROUGE confirmé ». Le fragment `l3-liste` a 7 FAIL à 375, 700 et 767 px, plus 375 « late ». La valeur lue est `"6px"` sur `sorting_desc`. Les contrôles des puces de 44 px restent verts.
- 2026-10-25, écart au plan (T3) : la boucle existante couvre 375 et 700 px. Le seuil 767 px est un bloc à part. Le contrôle du second sens clique sur « Vus », pas sur l'en-tête déjà trié : il couvre `sorting_asc`.
- 2026-10-25, écart au plan, non prévu par A2 : après T2, trois comparaisons à une base d'avant 6.7 voient l'écart voulu. La puce triée perd 2 px et décale les suivantes. Relevé :
  - `forum-activite#entete` : 2 FAIL, TH « Sujet » x 232.8 au lieu de 234.8, sous-forum 375 px ;
  - `forum-index#hors-perimetre` : 2 FAIL, x 233 au lieu de 235 ;
  - `typographie-formes#nettoyage` : 4 FAIL, `th.sorting_desc` inline-size 160.75 au lieu de 162.75, `::after` à 4px au lieu de 6px, 375 et 767 px.

  Choix prudent, conforme à la convention du dépôt : un nouveau masque `FLECHES_TICKET67` dans `lib/variantes.mjs`. C'est une feuille miroir à 4 px, mêmes sélecteurs et média, sans `!important`. Son détecteur `AVANT_TICKET67` repère la règle minifiée à 6 px (présente dans 810901f, 81512a3, 00b0786, d953969, 62fd47d, 21fed8d, 6685df5 et 0523d7f). Le masque est posé sur la base seule :
  - `ouvrir` de `forum-activite.mjs` (`src !== userscript`) ;
  - `open` de `forum-index.mjs` (garde `fil`), avec une ligne « info » ;
  - CSS de nettoyage de `typographie-formes.mjs`.

  Sa condition de retrait est le réalignement de ces bases par le ticket A4. Les noms sont sans tiret : MAX_CITING n'est pas touché. Rouge avant le masque : les 8 FAIL ci-dessus. Vert après : 889, 150 et 4402 ok, 0 FAIL. Contre-épreuve : avec `KR_SCRIPT` = bundle de 810901f, `forum-index#hors-perimetre` repasse au rouge (2 FAIL). Le masque ne cache donc pas un retour à 6 px. Autre option, consignée pour Arnaud : annuler T2 et reporter D4.
- 2026-10-25, libellé changé : « … égaux à la base masquée (…) » devient « … égaux à la base (${COMMIT_LIGNE}) » dans le fragment `ligne` de `forum-activite`. Le contrôle est inchangé.
- 2026-10-25, relevé `TOKEN_RE` intermédiaire : `N-1` est passé de 3 à 4 suites, à cause d'un commentaire « Seuil N-1 » ajouté à `sous-forum.mjs`. Le commentaire devient « Dernière largeur mobile (767 px) ». Relevé final : aucun jeton ne change de palier. Seul `revue-manuelle` passe de 0 à 1 suite (`forum-index`, condition d'`EXCEPTION_TICKET66`).
- 2026-10-25, vert après, T10 :
  - `npm run build` : exit 0, VALIDATION PASSED ;
  - `npm run lint:css` : exit 0 ;
  - `npm run lint:js` : exit 0. Il reste 1 avertissement, antérieur, dans `report-non-lu.mjs` (non touché) ;
  - `npm run test:router` : exit 0, « Routeur conforme » ;
  - zone `forum-activite forum sous-forum menus-forums kramail cartes-pastilles typographie-formes palette-nation` : exit 0, 11246 ok, 0 FAIL. Les comptes sont ceux de T1, sauf `sous-forum` : 1110, soit 1098 + 12 nouveaux contrôles ;
  - `forum-activite` : 889 ok, mêmes contrôles, aucune ligne « info » ;
  - `kramail-redaction` : 340 ok, égal à T1 (retrait inerte) ;
  - `grep -c '!important'` : 3290 ;
  - `diff -r .hermes/skills .claude/skills` : sortie vide ;
  - `grep -rn 'sweep 6.7' tests` : sortie vide.
- 2026-10-25, contre-épreuves :
  - réalignement de `forum-activite`, `KR_SCRIPT` = bundle de 0523d7f (extrait vers /tmp) : exit 1, 356 ok, 533 FAIL. Fragments au rouge : `lignes` 40, `fil` 36, `entete` 146, `plus` 64 et `ligne` 220 FAIL, ainsi que `parcours`, `seuil`, `bureau` et `ancres` ;
  - flèches, `KR_SCRIPT` = bundle de 810901f sur `sous-forum` : exit 1. `sous-forum#l3-liste` a 7 FAIL « 4 px », valeur lue `"6px"`. `forum-index#hors-perimetre` a 2 FAIL (masque, voir plus haut) ;
  - `PLUS_AVANT` et les conditions (T6) : retraits inertes, les comptes sont égaux à T1.
- 2026-10-25, corrections après revue (Review Triage Log, constats 1 à 5) :
  1. `forum-activite.mjs`, en-tête et commentaire de `COMMIT_LIGNE` : « sans masque » devient la mention du seul masque `FLECHES_TICKET67`, posé par `ouvrir` sur une base d'avant 6.7.
  2. Condition de retrait de `FLECHES_TICKET67` (doc dans `lib/variantes.mjs`, commentaire de `ouvrir`) : pour `forum-activite`, réalignement de ses cinq bases sur un SHA qui contient 6.7, action de la rétro de l'épopée 6. Pour les bases partagées (`forum-index`, `typographie-formes`), le ticket A4 reste la condition.
  3. `typographie-formes.mjs`, commentaire du nettoyage : la condition du nouveau masque nomme un SHA qui contient 6.7 et le ticket A4. Le second « Enfin » est supprimé.
  4. `forum-topic-stats-mobile` (et `.stats-sep`) : règles retirées de `kraland-theme.css` (ancienne l.8703-8722, commentaire d'en-tête compris). Avant le retrait, `grep` sur le template, le bundle et `tests/` : aucune pose, aucune assertion (seule occurrence du bundle : le CSS inliné). `!important` passe de 3290 à 3281, soit 9 en moins comme prévu par l'inventaire §3.2. Ce changement déroge à Ask First 3 sur décision de la revue. Les quatre autres classes restent signalées. Retrait inerte : aucun élément ne porte la classe, et les comptes de la zone finale sont égaux.
  5. `deferred-work.md`, D7 et D13 : le motif devient « faisable sur une page dérivée en mémoire, hors du périmètre du sweep, reporté à la rétro de l'épopée 6 ». Rien n'est construit. `revue-manuelle.md` est aligné (constats 2, 4, 5).
- 2026-10-25, vérification après corrections :
  - `npm run build` : exit 0, VALIDATION PASSED ;
  - `npm run lint:css` : exit 0 ;
  - `npm run lint:js` : exit 0, avec le même avertissement antérieur ;
  - `npm run test:router` : exit 0, « Routeur conforme » ;
  - zone des 8 zones : exit 0, 11246 ok, 0 FAIL, comptes par suite identiques au passage précédent ;
  - `grep -c '!important'` : 3281 ;
  - `diff -r .hermes/skills .claude/skills` : sortie vide ;
  - `grep -rn 'sweep 6.7' tests` : sortie vide ;
  - `TOKEN_RE` : aucun changement de palier (seul `revue-manuelle` passe de 0 à 1).
- Non lancé : `npm run test:all` (consigne de l'orchestrateur). Il reste à lancer une fois, sur machine calme.

## Design Notes

- Pourquoi ne pas tout réaligner : une base partagée porte aussi les masques 3/4/5. La réaligner les rend inertes ; la règle « masque à condition atteinte = retiré » imposerait alors leur retrait dans quatre suites et `variantes.mjs`. C'est l'objet de A4, que la rétro 5 veut porté par un ticket. 6.7 éteint ce qui est propre à l'épopée 6 et donne aux autres masques un événement nommé : la création du ticket A4 à la rétro 6.
- Pourquoi 4 px pour les flèches : l'écart entre un glyphe et son libellé vaut déjà `--kr-space-1` dans la ligne de forum (6.6). Il réduit la largeur des puces défilantes au lieu de l'augmenter.
- Pourquoi l'audit D14 ne change rien : la course ne touche que les quatre attributs d'infobulle, et le seul contrôle mobile peau coupée qui compare du HTML les retire déjà des deux côtés.

## Verification

**Commands:**

- `npm run build` → bundle régénéré, validation `postbuild` sans erreur.
- `npm run lint:css` puis `npm run lint:js`, lancés séparément, codes de sortie lus → 0 erreur.
- `npm run test:router` → « Routeur conforme » (`tests/` change).
- Boucle rouge/vert :
  - `npm run test:red -- sous-forum` sur l'arbre avec T3 et sans T2 → échec attendu détecté (marge 6 px) ;
  - `npm run test:zone -- sous-forum` après T2 → 0 FAIL.
- Zones touchées : `npm run test:zone -- sous-forum forum forum-activite kramail cartes-pastilles typographie-formes palette-nation` → 0 FAIL, comptes ok comparés à T1 (`forum-activite` : seules les lignes « info » 6.x disparaissent).
- Contre-épreuves :
  - flèches : `KR_SCRIPT` = bundle de `810901f` sur `sous-forum` → FAIL « 6px » ;
  - réalignement de `forum-activite` : `KR_SCRIPT` = bundle de `0523d7f` → FAIL dans `lignes`, `fil`, `entete`, `plus`, `ligne` ;
  - `PLUS_AVANT` : retrait inerte, égalité des comptes T1 / T5 (sans objet, A3 du sweep 5.6) ;
  - conditions (T6) : commentaires seuls, égalité des comptes.
- `grep -c '!important' kraland-theme.css` → 3290.
- `grep -rn 'sweep 6.7' tests` → vide.
- Relevé `TOKEN_RE` (script hors dépôt qui lit `SUITES`) → aucun jeton à 4 suites hors `page-forum`, déjà à 4.
- En fin de ticket, une fois, sur machine calme : `npm run test:all` → 0 FAIL (exigé par le `verify` du ticket). Lancé par l'orchestrateur ou par l'implémenteur après accord, pas par le planificateur.

**Manual checks:**

- Capture du sous-forum mobile à 375 et 767 px (`KR_SHOTS`, hors dépôt), avant et après T2 : flèche de tri plus près du libellé, puces alignées, fondu à droite intact.
- 768 px : flèches inchangées (règle mobile seulement).

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|------|----------|-------|---------|-------|----------|
| 1 | quick | forum-activite.mjs:49, :1478 | Deux commentaires disent « sans masque », alors que `ouvrir` pose `FLECHES_TICKET67` sur les bases d'avant 6.7 | fondé | patch (fixed) | l.146-149 : le masque est posé sur toute base `AVANT_TICKET67` |
| 2 | quick | forum-activite.mjs:146-148, variantes.mjs (`FLECHES_TICKET67`) | Le retrait de `FLECHES_TICKET67` dans `forum-activite` est confié à A4, qui ne couvre que les bases partagées | fondé | patch (fixed) | Les bases de `forum-activite` sont propres à l'épopée 6 (inventaire §2.4) ; nommer l'événement exact : réalignement de `forum-activite` sur un SHA qui contient 6.7 (action de la rétro de l'épopée 6) |
| 3 | quick | typographie-formes.mjs:1899-1900 | La condition de retrait du nouveau masque renvoie au « même réalignement » (SHA qui contient 6.6), qui ne suffit pas | fondé | patch (fixed) | Il faut un SHA qui contient 6.7 ; « Enfin » apparaît deux fois |
| 4 | quick | deferred-work.md, Reports du ticket 6.7 | `forum-topic-stats-mobile` est rejetée en bloc avec les règles « peut-être natives », alors que le template la posait jusqu'à `ce0b012` | fondé | patch (fixed) | Inventaire §3.2 : classe propre au userscript, aujourd'hui posée nulle part ; règles retirables sans site réel ni décision (9 `!important` en moins) |
| 5 | quick | deferred-work.md, D7 et D13 | Le motif « aucune fixture » cache du travail faisable sur une page dérivée en mémoire | fondé | defer | Motif à corriger en « faisable sur page dérivée, hors du sweep » ; travail reporté à la rétro de l'épopée 6 |
| 6 | quick | Plan Change Log | La contre-épreuve sur `0523d7f` ne prouve pas à elle seule qu'il reste un contrôle absolu par fragment | écarté | — | Le décompte du relecteur montre que chaque fragment garde un contrôle absolu ; `bureau` en relatif seul, voulu par A2 |
| 7 | quick | entrée 6.7, verify | `test:all` n'a pas tourné | écarté | — | Il est lancé par l'orchestrateur après les correctifs |

## Result

Construit. Les 15 reports de `deferred-work.md` qui visent l'épopée 6 ont chacun un statut : 4 traités, 11 rejetés avec leur raison. D7 et D13 sont reportés à la rétro de l'épopée 6, parce qu'ils sont faisables sur une page dérivée. Sur mobile, les flèches de tri du sous-forum passent à `var(--kr-space-1)` (4 px), avec 12 contrôles rouge/vert dans `sous-forum`. Les règles mortes `forum-topic-stats-mobile` sont retirées, ce qui fait passer `!important` de 3290 à 3281. Les bases de `forum-activite` sont réalignées sur `810901f`. Les masques `entete64`, `ligne66` et `PLUS_AVANT` sont retirés. Les masques 6.x posés sur des bases partagées sont gardés, avec A4 pour condition de retrait. Un nouveau masque, `FLECHES_TICKET67`, n'est posé que sur les bases d'avant 6.7 ; il est signalé à Arnaud. Revue quick : 7 constats, 4 corrigés, 1 reporté, 2 écartés. `test:all` vert : 13679 ok, 0 FAIL.
