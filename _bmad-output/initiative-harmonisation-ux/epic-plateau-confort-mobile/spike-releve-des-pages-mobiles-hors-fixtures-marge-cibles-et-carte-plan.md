---
title: 'Spike : relevé des pages mobiles hors fixtures (marge, cibles et cartes)'
type: 'chore'
ticket: 3
created: '2026-10-28'
status: 'built'
baseline_revision: '22b5582c946bc879e45b9116cb9d70ebb039934e'
route: 'full'
route_source: 'auto'
risk: 'low'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/_bmad-output/initiative-harmonisation-ux/epic-plateau-confort-mobile/epic-plateau-confort-mobile.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** les entrées 4 (pages secondaires) et 8 (forum) visent des pages sans fixture : on ne sait pas, page par page, quel texte est à moins de 16 px du bord, quelles cibles sont sous 44 px, ni comment se posent les cartes de section à 375×667.

**Approach:** relever en lecture seule sur le site réel (mandat d'Arnaud), par le Chrome dédié (CDP 9223, chargeur dev sur 4848), à 375×667 mobile et tactile, en Kraland clair et Empire Brun sombre : marge du texte, cibles sous 44 px, cartes de section, plus `.badge-danger`, `.btn-danger.xmini`, `input-lg` et hauteur en ligne de `.form-control`.

## Boundaries & Constraints

**Always:** navigation par URL ou lien de lecture ; variante `kr-theme-variant` notée avant et restaurée après chaque script (`empire-brun-dark`) ; un seul script à la fois sur 9223 ; captures et scripts hors dépôt (`/tmp/kr-spike-93/`, `/tmp/kr-spike-93-scripts/`).

**Never:** aucune action de jeu (envoi, vote, déplacement, validation d'ordre, soumission, barre BBCode) ; jamais `/report` ni la cloche ; aucun message privé ni secret relevé ; aucune capture HTML brute dans le dépôt ; aucun autre fichier du dépôt modifié, aucune action git ; aucune connexion au compte.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Page publique | URL lisible déconnecté | écarts mesurés, sélecteur et taille | aucune |
| Page derrière connexion | Interface, Contacts, recherche et modération du forum | mur de connexion relevé, page non mesurée | listée en doute, à reprendre session ouverte |
| Texte dans un conteneur défilant | tableaux larges | marqué `[défilant]`, séparé des écarts de marge | aucune |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` l.4665-4681 -- règle mobile « PHASE 5 » : `a:not(.list-group-item), button, .btn, input[type=submit]…` en `min-height: 44px !important; display: inline-flex !important` ; source de plusieurs écarts relevés.
- `kraland-userscript-template.js` (~l.645, `applyMobileCriticalStyles`) -- marge latérale à zéro, déjà visée par l'entrée 1.
- Outils hors dépôt : `/tmp/kr-spike-93-scripts/measure.cjs` (texte visible par `Range.getClientRects`, cibles par boîte, lien au fil du texte exclu, ligne touchable par `elementFromPoint`), `q.cjs` (sondes ciblées), `sum.py` ; résultats JSON et captures dans `/tmp/kr-spike-93/`.

## Tasks & Acceptance

**Execution:**
- [x] Chrome dédié lancé (9223), `npm run serve` lancé (4848 éteint au départ) ; `[Kraland Dev] JS chargé` vu.
- [x] Relevé de 17 URL à 375×667, Kraland clair et Empire Brun sombre.
- [x] Sondes ciblées : titre de la ville (375 et 1280), chevron des panneaux de ville, pagination et `input.hidden` d'Événements.

**Acceptance Criteria:**
- Given le relevé, when on lit la note, then chaque page a son texte sous 16 px, ses cibles sous 44 px avec taille et sélecteur, et sa carte de section.
- Given le mandat, when on relit le journal, then aucune visite de `/report`, aucune action de jeu, aucune capture HTML dans le dépôt.

## Implementation Notes

- Session Kraland **non connectée** dans le Chrome dédié (pas de `#exit`, formulaire de connexion dans la barre). Pas de connexion tentée. Conséquence : Interface (`/profil/interface`) montre le mur de connexion ; Contacts (URL non trouvée : `/profil/contacts` et `/jouer/contacts` en 404), recherche et modération du forum (aucun lien déconnecté, `/forum/recherche` en 404) non relevés ; Membres ne montre que la recherche (7 cibles au lieu de 22 à l'inventaire).
- `forum/post/nouveau-sujet-1-10101` et `forum/post/repondre-2-329508` s'affichent déconnectés : relevés en GET seul, aucun champ touché.
- Les deux variantes donnent des mesures identiques à 1 px près (pied de page 6 px en clair, 8-9 px en sombre) : les écarts sont de mise en page, pas de couleur.
- Fixtures synthétiques demandées par l'entrée non créées : le mandat du spike interdit de toucher un autre fichier. Les formes à reconstruire sont décrites dans Findings, pour les entrées 4 et 8.

## Result

17 URL relevées à 375×667, Kraland clair et Empire Brun sombre : Règles (`regles/base`, `regles/avancees`), Monde (`monde/empires`, `monde/organisations`, `monde/guide`), Événements, Citoyens, Membres (liste et fiche `krabot`), Statistiques (`communaute/stats`), Carte (`map`, `map/province/kraland-8`, `map/ville/abandon-22`), Cybermonde (`map/cybermonde`), Interface (mur de connexion), forum nouveau sujet et réponse. Aucune visite de `/report`, aucune action de jeu, variante restaurée (`empire-brun-dark`).

Résumé : le défaut dominant est la marge à 0 px du contenu `#col-right` hors cartes (Règles, Guide, Statistiques, titres `h1.page-header`) ; les cartes de section sont partout à 8 px des bords avec contenu à 16 px (conforme H4.1) ; les cibles manquent surtout en **largeur** (hauteur forcée à 44 px par la règle « PHASE 5 », largeur native gardée) ; aucun `.badge-danger`, aucun `.btn-danger.xmini`, aucun `input-lg`, aucune hauteur en ligne sur `.form-control`.

### Findings

Mesures en px depuis le bord gauche (L) et droit (R) de l'écran ; cible = largeur × hauteur. Identiques dans les deux variantes sauf mention.

**F1 Règles (`regles/base`, `regles/avancees`).** Texte à 0 px des deux bords : `#col-right > .row > .col-md-8.justify > p|h4` et `.col-md-12.justify > p|h4` (L 0, R 0, 56 paragraphes sur `avancees`), `dl.row > dt.col-sm-2` et `dd.col-sm-10 > p` (L 0, R 0), `ul > li` (L 40, R 0), `ol > li` (R 0). Carte `.col-md-4 > .panel.panel-default` : L 8, R 8, contenu 16. Cible : lien `p > a` « Artiste » 40×44 (au fil du texte, exception H9.1 probable). Fixture existante : `regles-recherche.html` seulement.

**F2 Monde.** `monde/guide` : `h1.page-header` L 0, `.col-md-8.justify > p` L 0 R 0, `li` R 0 ; cartes L 8 R 8. `monde/empires` : `#col-right > p.mini` L 0, R 23 ; `div.genmsg` R 0 ; tableau `#topics` défilant. `monde/organisations` : 21 cibles sur 43 sous 44 px de large : `td > a.btn.btn-default` 32×44 (10), `td > a.btn.btn-{success,info,warning,primary,danger}.mini` 34×44 (10, boutons d'épopée 4 mais à mesurer), `td > a.nomargin` « - » 21×44 ; carte L 8 R 8.

**F3 Événements (`monde/evenements`).** Le `#col-left` (filtres) s'affiche en pleine largeur au-dessus du tableau : `span.list-group-item.active` L 15, `form .form-group > label.col-sm-2.control-label.mini` L 12. Tableau `#col-right table.table-striped` dans `.col-md-9` sans conteneur défilant (`overflow-x: visible`) : `th` L 8, cellules jusqu'à R −348 (texte coupé hors écran sans débordement de page, `scrollWidth` 375). Cibles : `input.form-check-input` 20×20 ; lien `td > font > a` « ici » 13×44 ; **`input#mySubmit1…6.hidden` visibles en 24×44** : la règle « PHASE 5 » (`kraland-theme.css` l.4671-4681, `display: inline-flex !important`) bat `.hidden { display: none !important }` de Bootstrap. Pagination déjà à 44×44 (l'inventaire disait 24 px).

**F4 Citoyens.** Aucun texte sous 16 px hors tableau `#topics` défilant ; carte L 8 R 8 ; aucune cible sous 44 px.

**F5 Membres (`communaute/membres`, fiche).** Seul écart : `#col-left .list-group > span.list-group-item.active` « Rechercher » L 15 (aussi sur Statistiques). Fiche : quatre cartes `.panel.panel-default` (dont `.well.panel`) L 8 R 8, contenu 16. Liste des membres non visible déconnecté : les 34 px de l'inventaire restent à mesurer.

**F6 Statistiques (`communaute/stats`).** `h1.page-header` L 0, `.col-md-6 > h2` L 0, `#col-right > p` L 0 R 10, étiquettes des camemberts `span#pieLabel1|4 > div` L 8 à 10. Aucune carte, aucune cible sous 44 px.

**F7 Carte et Cybermonde (`map`, `map/cybermonde`, province, ville).** Sélecteurs `ul.pagination > li > a > select` 120-140×28 (4 pages) ; ville : `ul.pagination > li > a` « Province » 76×34 et `a.btn.btn-default` « Travail » 76×34, icônes `tbody > tr > td > a` 32×44 (10) ; `div.genmsg` R 0. **Titre de la ville** `#mapname-container > h4.page-header` : il est dans `.kr-cybermonde-carte` (défilant, `scrollLeft` 321, carte de 1017 px) ; à 375 son texte est à L −321, hors écran à l'arrivée, et à 0 px du bord une fois la carte ramenée à gauche (`padding-left` 0). À 1280 : texte à 124 px, aligné sur la carte, pas collé au bord (le défaut « aussi sur ordinateur » n'est pas reproduit à 1280). Cartes de section `.col-md-6.col-xs-12 > .panel.panel-default` L 8 R 8, titre à 24 ; chevron `.glyphicon-chevron-up` 15 px de large à 24 px du bord droit (16 px du bord de la carte).

**F8 Forum, nouveau sujet et réponse.** `h1.page-header` « Poster un nouveau sujet » L 0 ; `form.kr-editor .form-group > label.col-sm-2.control-label` (Sujet, Expéditeur, Message) L 12. Réponse : citations `ul.media-list.forum > li.media.well` L 0 R 0 (padding 15) ; lien `.forum-msg > a` 21×44 ; `.alert.alert-dismissible > button.close` 13×44 et `scrollWidth` 380 (débordement de 5 px, même défaut que Staff D5, aussi sur le mur de connexion d'Interface). `.form-control` : 44 px, `textarea` 383 px.

**F9 Commun.** Pied de page `footer .footer-quote` L 6 R 6 (clair) / 8-9 (sombre), ligne « Généré en » R 0 sur toutes les pages. Barre de navigation hors écart.

**F10 Rétro 5 A9 et report 4.10 (pour Arnaud).** `.badge-danger` : 0 emploi ; `.btn-danger.xmini` : 0 emploi sur les 17 pages (seul `a.btn.btn-danger.mini` sur Organisations) ; `input-lg` / `.input-group-lg` : 0 ; hauteur en ligne sur `.form-control` : 0. Pages connectées non vues : à confirmer avant de retirer `height: 44px !important` (l.4698 et 4707).

**Conséquences pour les entrées.**
- Entrée 4 : la marge à corriger est celle de `#col-right` hors carte (paragraphes, `h1.page-header`, `dl.row`, `p.mini`, `genmsg`) et du `#col-left` à 12-15 px ; les cibles sont surtout des largeurs (32-34 px, 13-21 px) ; ajouter `input.hidden` révélés par « PHASE 5 » et les sélecteurs de carte à 28 px ; pagination d'Événements déjà à 44 ; titre de ville : le problème mobile est le défilement initial de la carte, pas seulement le padding. Fixtures à reconstruire : Règles (`.col-md-8.justify` + `dl.row`), Guide, Statistiques, Organisations (tableau de boutons), Événements (filtres `#col-left` + tableau + `input.hidden`), Carte ville (carte défilante + `#mapname-container`).
- Entrée 8 : nouveau sujet et réponse relevés (titre à 0, libellés à 12, citations `li.media.well` à 0, croix `.alert-dismissible` hors écran) ; recherche et modération non relevées.

Clôture (orchestrateur, 2026-10-29) : spike sans revue, commité directement sur `feature/next` (`f9383ba`), sans branche de fusion ni `test:all` (documentation seule). Relevé complété par celui du 2026-10-29 ; ses écarts ont nourri 9.4, 9.8, 9.9, 9.10 et 9.13.

## Verification

**Manual checks (if no CLI):**
- `/tmp/kr-spike-93/{kraland,empire-brun-dark}-375-{pages,carte}.json` et captures `*.png` -- un JSON par variante, mêmes écarts.
- `localStorage['kr-theme-variant']` vaut `empire-brun-dark` après chaque script (journal « variant restaurée »).
- `git status` -- seul ce plan est nouveau.
