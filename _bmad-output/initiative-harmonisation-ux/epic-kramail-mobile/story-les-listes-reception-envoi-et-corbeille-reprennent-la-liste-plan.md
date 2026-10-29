---
title: 'Les listes Réception, Envoi et Corbeille reprennent la liste des sujets du sous-forum'
type: 'feature'
ticket: '4'
created: '2026-10-29'
status: 'built'
baseline_revision: 'cb7353087f799160c6811a9d2f45e1c905cb8e10'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'invocation'
lenses_ran: ['quick']
review_loop_iteration: 1
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, les lignes de `#topics` du kramail (Réception, Envoi, Corbeille) sont des cartes à bordure en grille (~l.9248-9490), sans signal « non lu », avec des couleurs en dur (ombre et `:active` du menu « ••• », focus de la recherche) et un `padding: 10px` hors pas (l.9441) ; au bureau, la liste garde le tableau natif sans les valeurs du sous-forum.

**Approach:** Les lignes prennent la ligne de sujet du sous-forum (L1, L3, L5 mobile ; L1, L6 bureau) : même rendu calculé, lignes à plat dans la carte de section, ligne entière touchable sur mobile (lien du titre étiré), « non lu » signalé par la pastille « NON LU » et le filet `--kr-status-unread`, pagination de 44 px. L'ancien bloc « cartes » est retiré (P1 option 4) ; les actions de `Kramail:MobileEnhancer` (cases, « Tout sélectionner », lu/non lu, important) sont gardées.

## Boundaries & Constraints

**Always:** P1 option 4 (retirer l'ancien bloc, pas le battre) ; aucun nouvel `!important` (total ≤ 3180, base cb73530) ; gardes `:where(html.kr-page-kramail-liste)` ; mobile `max-width: 767px`, bureau `min-width: 768px` ; cibles ≥ 44 px ; ordre DOM natif des lignes et des cellules ; texte des cellules intact (DataTables recherche et trie dessus : libellé de pastille en attribut) ; fixtures synthétiques, dérivées en mémoire.

**Never:** barre d'onglets au bureau (Non-goal) ; rendu du forum modifié ; lecture et rédaction du kramail modifiées ; action de jeu ; bundle édité ; site réel.

**Décisions (Assumptions, autonome, doutes dans revue-manuelle.md, section « Ticket 7.4 ») :**
- A1 Non lu = icône `i.fa-envelope` sans `fa-envelope-open` dans la cellule du message (seul l'état lu `far fa-envelope-open` est relevé sur le site ; `fa-flag` = important, `fa-reply` = répondu).
- A2 Mobile : la case à cocher prend la place du bouton → du sous-forum (cellule de 44 × 44 à droite, au-dessus du lien étiré) ; un toucher dans la cellule coche la case.
- A3 Mobile : en-têtes de tri non repris (thead masqué, son « + » est cloné dans le titre par MobileEnhancer).
- A4 elementFromPoint au centre de la ligne vérifié sur mobile (ligne touchable) ; au bureau, ligne du tableau natif comme au sous-forum.
- A5 Bureau, dossiers : boutons natifs `btn-primary` (actif) et `btn-default`, déjà rendus ainsi ; vérifiés, inchangés.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Ligne lue mobile | reception/envoi/corbeille, 375 et 767 | tr, cellules, titre, nom, date aux valeurs calculées de sous-forum-debuter ; mêmes bords dans la carte ; centre → lien du titre | — |
| Ligne non lue | icône `fa fa-envelope` | `kr-topic-unread`, pastille « NON LU », filet (mobile) ou barre inset (bureau) `--kr-status-unread`, titre 700, 16 variantes | lu de nouveau (flagKramail) : classe et pastille retirées |
| Bureau | 768, 1280, 1440 | cellules, titre, nom, date, barre aux valeurs de sous-forum-debuter ; dossier actif primaire, autres standard | — |
| Sélection | case, « Tout sélectionner » | toucher la cellule coche la case ; « Tout sélectionner » (••• mobile, + natif bureau) coche toutes les cases | Envoi sans menu « + » : rien à cloner |
| Pagination | 3 pages, mobile | boutons ≥ 44 px atteints | Corbeille vide : aucune erreur |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` l.9171-9220 -- menu « ••• » du titre : ombre et `:active` en dur sous `:where(html:not(.kr-page-kramail-lecture))` ; unifier sur les règles jetons de la lecture (`--kr-shadow-lg`, `--kr-bg-active`).
- `kraland-theme.css` l.9246-9490 -- ancien bloc « DataTable contrôles », « cartes » et `#topics_wrapper .btn-group` (131 `!important`, rgba de focus, padding 10/14 hors pas) : retirer.
- `kraland-theme.css` l.13898-13919 (pastille commune), l.13923-13980 (L1), l.14025-14421 (L3), l.14567-14631 (L5), l.14636-14816 (L6) -- valeurs de référence du sous-forum. Ne pas toucher au forum sauf ajout d'un sélecteur kramail à la pastille commune. Nouveau bloc kramail (précédent 6.1, `:where(html.kr-page-forum-index) #col-right …` l.14830+) après le sous-forum.
- `kraland-userscript-template.js` `ForumTopics:Status` l.5048-5143 (processRow, pastille `data-kr-label`) et `ForumTopics:Pagination` l.5145-5198 (`compactPagination`, garde `page-forum`) -- modèle ; étendre la garde de la pagination à `kr-page-kramail-liste`.
- `kraland-userscript-template.js` `ForumTopics:MobileStats` l.5236-5245 `nameControls` -- placeholder et nom accessible de la recherche (labels à 0 px en CSS).
- `kraland-userscript-template.js` `Kramail:MobileEnhancer` l.5940-6053 -- clone du « + » et « Tout sélectionner » : garder tel quel.
- Nouveau module `Kramail:Liste` -- statut non lu (classe + pastille dans `p.nomargin`, hors `span#ajax-m` réécrit par flagKramail), contrôles nommés, toucher de la cellule de case ; relancé à `draw.dt` et par MutationObserver du tbody, idempotent.
- `tests/e2e/kramail-theme.mjs` -- fragments `liste`, `liste-actions`, `liste-couleurs`, `liste-dossiers` ; listes dérivées en mémoire (balisage DataTables, non lu, Corbeille garnie, checkAllKramail émulé) ; en-tête de commentaire.
- `tests/e2e/lib/router.mjs` l.108 -- fragments de kramail-theme.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/kramail-theme.mjs` -- fragments et dérivations -- rouges sur cb73530.
- [x] `kraland-userscript-template.js` -- module `Kramail:Liste`, garde de la pagination -- statut et cibles.
- [x] `kraland-theme.css` -- retrait de l'ancien bloc, bloc kramail mobile et bureau, pastille commune, menu « ••• » en jetons -- rendu du sous-forum.
- [x] `tests/e2e/lib/router.mjs` -- fragments enregistrés.
- [x] Suites sœurs mesurant `#topics` du kramail -- masques auto-retirés si l'écart est voulu.

**Acceptance Criteria:**
- Given une liste du kramail, when la page s'affiche à 375, 767, 768, 1280 et 1440 px, then la matrice est vérifiée par kramail-theme.
- Given le bundle de base cb73530, when `KR_SCRIPT=/tmp/kr74/base.user.js`, then les fragments de la liste sont rouges ; une mutation du module ou du CSS les rend rouges.
- Given la feuille, when on compte `!important`, then le total est ≤ 3180 ; aucune couleur en dur dans les règles de la liste.

## Implementation Notes

- CSS : l'ancien bloc « cartes » et « DataTable contrôles » est retiré (P1 option 4). Le nouveau bloc « KRAMAIL — LISTE (épopée 7, entrée 4) » est placé après le sous-forum. Mobile : enveloppe et contrôles aux valeurs L3. Lignes en flex, `td` intermédiaires en `display: contents`. Titre étiré (`::after`, inset 0). Case à droite dans une cellule de 44 × 44, au-dessus du lien. Filet gauche `--kr-status-unread`. Pagination copiée de L5. Bureau : valeurs L6 et barre inset non lue. La pastille commune du sous-forum gagne le sélecteur kramail.
- `#topics` hors de `#topics_wrapper` (Corbeille vide d'origine, sans DataTables) : largeur 100 %. Seul `#topics_wrapper #topics` déborde de 16 px de chaque côté (sinon le débordement horizontal est de 383 > 375).
- Menu « ••• » de la liste : il était hors écran sur la base (x = -122 px). Il est maintenant calé à gauche sous le rang des boutons (`.btn-group` en static, `.pull-right` relative). Ombre en `--kr-shadow-lg`. La lecture garde son calage.
- JS : nouveau module `Kramail:Liste` (priorité 27) : non lu, pastille, nom accessible des contrôles, toucher de la cellule de la case. La garde de `ForumTopics:Pagination` est étendue à `kr-page-kramail-liste`.
- `!important` : 3154 (base 3180).
- Masque commun `AVANT_TICKET74` / `RETIRER_LISTE_TICKET74` dans `tests/e2e/lib/variantes.mjs`, gardé par le chemin. kramail-redaction a son propre `AVANT_TICKET74`.

## Plan Change Log

- Ajout hors Code Map : correction du calage du menu « ••• » de la liste sur mobile. « Tout sélectionner » était injoignable sur la base, et la matrice (Sélection) l'exige.
- Ajout hors Code Map : kramail-theme#entete-menu. Le point du clic extérieur est déplacé sur mobile, car (5, 400) tombe sur le lien étiré d'une ligne.
- Suites sœurs : contrôles réécrits (echelle-forum expéditeur ; rayons ligne ; espacement liens) et masques auto-retirés (cartes-pastilles, forum-activite, confort-mobile, typographie-formes, kramail-redaction). Détail dans revue-manuelle.md, « Ticket 7.4 ».

## Review Triage Log

- Revue indépendante (itération 1), 10 points, tous appliqués :
  1. `nameControls` est rappelé par l'observateur, posé sur le parent de `#topics` pour voir l'enveloppe DataTables construite plus tard.
  2. Non-lu limité à la Réception et à la Corbeille (Envoi reconnu au chemin `…-1`). La question est posée à Arnaud dans revue-manuelle.md.
  3. Pagination longue (1 2 3 4 5 … 15) vérifiée à 320 et 375 px.
  4. Noms accessibles et placeholder vérifiés, au chargement et après reconstruction des contrôles.
  5. « Lu de nouveau » vérifié dans les deux sens.
  6. M1/M2 de nettoyage : option `garderListe`, la réception n'est plus sautée.
  7. Rayons de la réception : rôles pastille P, recherche C4 et pagination C4 ajoutés, sur une réception dérivée.
  8. « liens-marge » : perte définitive, consignée.
  9. Toucher de la cellule limité à `body.mobile-mode`, lu au clic ; un contrôle bureau est ajouté.
  10. Fermeture du menu de personnage par un toucher de ligne : consignée.

- Revue quick, diff contre cb73530. Rien à corriger dans le module : observateur idempotent (le second passage ne mute rien), clic limité à la première cellule hors `input` et `a`, garde par classe de page.
- Écarts relevés et consignés dans revue-manuelle.md, pas corrigés : `padding: 0` de `.panel-body` au bureau ; case à droite ; hypothèse A1 du non-lu.

## Verification

**Commands:**
- `npm run build` -- bundle régénéré, validation verte.
- `npm run test:zone -- kramail` puis zones sœurs (cartes-pastilles, palette-nation, forum-activite, typographie-formes, confort-mobile, sous-forum, forum) -- verts ou FAIL attribués.
- `KR_SCRIPT=/tmp/kr74/base.user.js KR_FRAG=liste,liste-actions,liste-couleurs,liste-dossiers node tests/e2e/kramail-theme.mjs` -- rouge.
- `npm run lint:css`, `npm run lint:js`, `npm run test:unit`, `npm run test:router` -- verts ; `diff -r .hermes/skills .claude/skills` vide.

## Result

Statut `in-review` après la revue indépendante (itération 1). Preuves locales du worktree (wt/7.4, base cb73530, non commité) :

- `npm run build` : validation verte. `!important` : 3154.
- `KR_FRAG=liste,liste-actions,liste-couleurs,liste-dossiers,entete-menu node tests/e2e/kramail-theme.mjs` : 119 ok, 0 échec. `liste-actions` seul : 43 ok.
- Rouge sur la base (`KR_SCRIPT=/tmp/kr74/base.user.js`, liste-actions) : 18 ok, 25 échecs.
- Contre-épreuves des nouveaux contrôles (liste-actions) :
  - garde de la pagination sans `kr-page-kramail-liste` : 2 échecs (pagination longue 320 et 375) ;
  - observateur neutralisé : 13 échecs (noms après reconstruction 9, lu de nouveau 4) ;
  - aria-label de la recherche faussé : 9 échecs (noms) ;
  - garde `mobile-mode` retirée : 3 échecs (clic bureau) ;
  - garde de l'Envoi retirée : 2 échecs (Envoi jamais non lu).
- Contre-épreuves précédentes (liste*, 93 contrôles) : non-lu 42 échecs, toucher de cellule 6, `.pull-right` static 4.
- test:zone en entier, tous verts :
  - kramail : 859 ok, 0 FAIL ;
  - typographie-formes : 4430 ok, 0 FAIL ;
  - confort-mobile : 936 ok, 0 FAIL.
- Avant la revue : cartes-pastilles 2302 ok, forum-activite 929 ok, palette-nation 1372 ok, sous-forum 1374 ok, forum 639 ok. Après la revue : `KR_FRAG=kramail,bureau` de cartes-pastilles vert.
- `KR_SCRIPT_AVANT=/tmp/kr74/base.user.js KR_FRAG=regression node tests/e2e/kramail-redaction.mjs` : 12 ok, relancé après la revue.
- lint:css 0 ; lint:js 0 (1 avertissement préexistant, report-non-lu.mjs inchangé) ; test:unit 57 pass ; test:router « Routeur conforme » ; `diff -r .hermes/skills .claude/skills` vide.
