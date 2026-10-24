# Ticket 4.9 : inventaire des espacements

Annexe du plan `story-grille-d-espacement-au-pas-de-4-px-plan.md`. Relevé sur `62fd47d` (`kraland-theme.css`, `kraland-userscript-template.js`, Bootstrap 3.3.7 embarqué), lecture seule.

Méthode : sur chaque fixture du périmètre, à 375, 767, 768, 769 et 1280 px, chaque élément des composants de la liste (`.panel`, `.panel-heading`, `.panel-body`, `.btn`, `.form-control`, cellules `td`/`th`, liens `.panel-body a`) est relevé par CDP : `padding-*`, `margin-*`, `row-gap`, `column-gap`, avec la règle gagnante de chaque propriété. Les valeurs hors pas de 4 (ou hors 0 à 32 px) sont rapprochées de leur déclaration source par sélecteur et déclaration (postcss), car le bundle injecte une feuille minifiée dont les lignes CDP valent 0. Une simulation (bundle reconstruit avec le CSS modifié, minifié par lightningcss comme `build.js`) a ensuite mesuré chaque changement et chaque exception contre la base.

Fixtures (abrégées dans la colonne « Cas mesuré ») : `plateau` (plateau-qualite-usage.html), `plateau-typo` (typographie-echelle.html), `sujet` (forum-sujet.html), `redaction` (typographie-forum-redaction.html), `index-rp` (forum-index-rp.html), `sous-forum` (sous-forum-debuter.html), `reception` (kramail-reception.html), `lecture` (kramail-lecture.html), `nouveau` (kramail-nouveau.html), `repondre` (kramail-repondre.html), `modale-ordre` (modale-ordre/plateau.html, modale ouverte), `interface` (palette-nation-profil, onglet Interface), `composants` (typographie-formes.html).

Rôles : **R** réécrite au jeton ; **N** natif de Bootstrap couvert par la règle de rôle ; **E** exception mesurée égale à la base ; **D** déjà au pas, inchangée ; **H** non atteinte sur les fixtures, laissée et consignée pour l'entrée 10.

Règle d'arrondi (A3) : multiple de 4 le plus proche. À égalité (6, 10), le rôle tranche : un retrait de cadre (`padding` d'un conteneur) monte, un interstice (`gap`, `margin`) descend. 15 → 16, 5 → 4, 6 (gap) → 4, 10 (gap, margin) → 8, 10 (padding d'en-tête) → 12. Les écarts à cette règle sont mesurés (cellules, A4 ; bas du panneau du forum, A6 ; `kr-tools-plus`).

Jetons : `S1`…`S4` abrègent `var(--kr-space-1)`…`var(--kr-space-4)` (4, 8, 12, 16 px, `:root` l.34-37).

Comptes : 13 déclarations CSS réécrites (R), 4 règles de rôle pour les natifs (N), 1 déclaration en ligne du template, 14 exceptions (E), 21 déclarations non atteintes (H). Éléments dont l'espacement calculé change, toutes fixtures et largeurs confondues : cellules 288, boutons 64, liens `.panel-body a` 44, en-têtes 40, corps de panneau 33, panneaux 12.

## 1. kraland-theme.css, déclarations réécrites (R)

| Ligne | Média | Sélecteur abrégé | Propriété : valeur actuelle | Cible | Raison | Cas mesuré |
|---|---|---|---|---|---|---|
| 2099 | combiné | `.kr-order-form .kr-order-help-toggle` | `gap: 6px` | `S1` | interstice, 6 → 4 | modale-ordre@375/768/1280, composants@375/768/1280 (« ? Aide ») |
| 2100 | combiné | idem | `margin-bottom: 10px` | `S2` | interstice, 10 → 8 | idem |
| 4308 | mob | `.panel` (Panels responsive) | `margin-bottom: 15px !important` | `S4 !important` | 15 → 16 | plateau@375/767 (`#player-main-panel.panel.panel-body`), plateau-typo@375/767 (`#col-left .panel`) ; 12 panneaux |
| 4316 | mob | `.panel-heading` | `gap: 10px !important` | `S2 !important` | interstice, 10 → 8 | plateau-typo, index-rp, sous-forum, reception, repondre, composants @375 |
| 4327 | mob | `.panel-body` | `padding: 15px !important` | `S4 !important` | 15 → 16 | plateau@375/767, plateau-typo@375/767, composants@375 |
| 4575 | mob | `.panel-body a` (Items de commerce) | `gap: 10px !important` | `S2 !important` | interstice, 10 → 8 | plateau@375/767 (accès rapides), index-rp@375 (`span.btn-group > a.btn`) |
| 4577 | mob | idem | `margin-bottom: 5px !important` | `S1 !important` | 5 → 4 | plateau@375/767 (accès rapides) ; reception@375 (-6 px de hauteur de page) |
| 14586 | ≥768 | `html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default tbody > tr > td` | `padding: 6px 10px !important` | `S2 !important` | cellule 8/8, A4 | sous-forum@768/1280, 150 cellules, +4 px par ligne, sans retour à la ligne |
| 15082 | ≥768 | `:where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr > td` | `padding: 6px 10px !important` | `S2 !important` | parité avec le sous-forum (A4) | index-rp@768/1280, 32 cellules |
| 14727 | ≥768 | `html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default > .panel-body` | `padding: 8px 15px 10px !important` | `S2 S4 !important` | 8 16 8, A6 | sous-forum@768/1280 (`#fx-permanents`, `#fx-sujets`) |
| 15176 | ≥768 | `:where(html.kr-page-forum-index) #col-right .panel-default > .panel-body` | `padding: 8px 15px 10px !important` | `S2 S4 !important` | parité avec le sous-forum | index-rp@768/1280 |
| 15352 | mob | `body.mobile-mode ul.media-list.forum > li.media.kr-msg > .media-body > .pull-right .btn` | `gap: 6px` | `S1` | interstice, 6 → 4 | sujet@375/767, 15 boutons d'action des messages |
| 15551 | mob | `body.mobile-mode.page-forum form.kr-editor .btn-toolbar.kr-tools-ready .kr-tools-plus` | `padding: 0 10px !important` | `0 S2 !important` | 8, aligné sur les boutons BBCode voisins mobiles (0 8) | redaction@375 |

## 2. kraland-userscript-template.js

| Ligne | Élément | Valeur actuelle | Cible | Cas mesuré |
|---|---|---|---|---|
| 8720 | `#kr-config-import-btn` (`btn btn-default btn-sm`) | `style="margin-left:6px"` | `style="margin-left:var(--kr-space-1)"` | interface@768/1280 |

## 3. Natifs de Bootstrap 3.3.7 sans règle d'origine dans la peau (N)

Une seule liste combinée `@media (max-width: 767px), (min-width: 768px)`, placée après `.form-control.form-control` (l.644-649), sans `!important`. Sur mobile, elle est inerte : les règles mobiles de la peau en `!important` (4327, 4312, 7835, forum) la battent. Mesuré égal à la simulation sans le bloc à 375 et 767 px.

| Natif | Valeur native | Règle de rôle | Cas mesuré |
|---|---|---|---|
| `.panel-body` | `padding: 15px` | `.panel-body { padding: var(--kr-space-4); }` | plateau, plateau-typo, reception, modale-ordre, composants @768/769/1280 ; 12 éléments par largeur |
| `.panel-heading` | `padding: 10px 15px` | `.panel-heading { padding: var(--kr-space-3) var(--kr-space-4); }` (A5) | plateau-typo, index-rp, sous-forum, reception, repondre, modale-ordre, composants @768/769/1280 ; 16 en-têtes, 40 → 44 px de haut |
| `.modal-footer .btn + .btn` | `margin-left: 5px` | `.modal-footer .btn + .btn { margin-left: var(--kr-space-1); }` | modale-ordre@768/1280 |
| `table.dataTable thead th` (feuille de la fixture du sous-forum, l.29, copie de la feuille du site) | `padding: 8px 10px` | `html body.page-forum.kr-subforum:not(.mobile-mode) table.dataTable thead th { padding: var(--kr-space-2); }` (A4) | sous-forum@768/1280, 10 `#topics th` ; garde mesurée : `#dt` de composants inchangé |

## 4. Exceptions mesurées égales à la base (E)

Chacune est relevée dans la simulation et égale au bundle de `62fd47d` : même `padding`, `margin`, `gap` calculés, même hauteur. Le fragment `espacement` les mesure contre le bundle de base (`COMMIT_ESPACEMENT`).

| # | Source | Valeur | Raison | Cas mesuré |
|---|---|---|---|---|
| E1 | Bootstrap `.btn` | `padding: 6px 12px` vertical 6, ≥768 | A1 : 34 px imposés (H6.1, entrée 2) ; 6 + 20 + 6 + 2 ne se décompose pas au pas de 4 sans toucher le `line-height`, et la simulation 8/16 a fui (bâtiments 74 → 78, grille d'actions 34 → 34,8, boutons des en-têtes 14 → 18, sous-forum 34 → 35). L'horizontal 12 est au pas | 116 boutons @768/1280 : en-têtes `span.pull-right > a.btn`, actions et accès rapides du plateau, bâtiments, Envoyer de la rédaction, `#topics .dropdown-toggle`, composants `#bs-*`, pied de modale, « ? Aide » |
| E2 | l.647 `.form-control.form-control` | `padding: .6rem .8rem` (6 / 8) | A2 : aligné sur le `.btn` de 34 px ; horizontal 8 au pas | redaction, nouveau, repondre, modale-ordre @768/1280, 18 champs |
| E3 | Bootstrap `.btn-xs` | `padding: 1px 5px` | A8 : bouton compact de l'entrée 4 (votes, pagination, 12 px) | sujet, redaction, lecture @768/1280, 68 boutons |
| E4 | Bootstrap `.btn-sm` | `padding: 5px 10px` | A8 : boutons d'export et d'import de l'Interface, hauteur 34 égale | interface@768/1280 |
| E5 | l.11164 (≥768) barre BBCode du kramail | `padding: 0 5px !important` | A8 : barre BBCode exclue (entrée 2) | nouveau, repondre @768/1280, 72 boutons |
| E6 | l.11170 (≥768), l.11399 (mob) | `margin-left: -1px !important` | chevauchement des bordures d'un groupe | nouveau, repondre @375/768/1280 |
| E7 | Bootstrap `.btn-group .btn + .btn` | `margin-left: -1px` | idem | sujet, redaction @768/1280, 32 boutons |
| E8 | l.5199 (mob, imbriqué) `.mobile-mini-profile .mobile-skill-item, .mobile-characteristic-badge` | `padding: 6px 2px 4px !important` | A8 : tuile dense du mini-profil (bat aussi `.list-group-item` l.4533 `10px 12px`) | plateau@375, plié et déplié |
| E9 | l.4536 (mob) `.list-group-item` | `gap: 10px !important` | A8 : mêmes tuiles ; colonne flexible, l'écart vertical fixe la hauteur 74,4 / 88,8 | plateau@375 |
| E10 | l.13063 (≥768) `#col-leftest .panel-body.grid-transformed` | `padding: 8px 3px` | colonne étroite des caractéristiques (`col-md-1`) ; 3 → 4 rognerait la grille | plateau, plateau-typo, modale-ordre @768/1280 |
| E11 | l.15550 (mob) `.kr-tools-plus` | `margin: 0 0 0 auto !important` | marge automatique (133,6 px résolus) | redaction@375 |
| E12 | l.15403 (mob) `.kr-msg-more` | `margin-left: auto !important` | marge automatique (29,5 → 31,5 px résolus, conséquence du gap 6 → 4) | sujet@375 |
| E13 | l.15575 (mob) Envoyer du forum | `margin: 12px 52px 0 auto !important` | marge automatique (203 px résolus) ; 12 et 52 au pas | redaction@375 |
| E14 | gouttière Bootstrap `[class^=col-]` | `padding: 0 15px` | hors périmètre (Q11) | colonnes du plateau : x et largeur identiques sur toutes les fixtures et largeurs (0 écart) |

Déjà au pas, inchangées (D) : l.9885 (mob) `.form-control` `12px var(--mobile-spacing-md) !important` ; l.14676 et l.15136 `padding-right: 52px !important` ; l.8525 et l.9181 (mob) en-têtes `12px 16px !important` ; `.btn` mobile `padding` vertical 12 et `line-height` 20 (A10) ; jetons `--mobile-spacing-*`.

## 5. Non atteintes sur les fixtures (H), laissées et consignées pour l'entrée 10

Aucune n'est la règle gagnante d'un élément mesuré : soit battue par une autre règle, soit sans élément dans les fixtures. Les réécrire sans cas mesuré violerait la règle « chaque élément a un cas mesuré ». À consigner dans `deferred-work.md` (entrée 10).

| Ligne | Média | Sélecteur abrégé | Valeur | Constat |
|---|---|---|---|---|
| 599, 600 | `(min-width: 3840px)` | `#player-actions-section .btn` | `padding-right/left: 14px` | largeur hors fixtures |
| 769 | combiné | `html.kr-page-report table > tbody > tr.bg-info > td:first-child` | `padding-left: 10px` | page `/report`, jamais chargée (fixture absente) |
| 1625, 1626 | mob | `.bootbox-confirm .btn-toolbar .dropdown-menu .btn-group .btn` | `padding: 4px 6px !important`, `margin: 2px !important` | menu de barre BBCode de modale fermé dans les fixtures |
| 4312 | mob | `.panel-heading` | `padding: 10px 15px !important` | toujours battue (l.7835, règles du forum, l.8525, l.9181) ; sans effet mesuré (A12) |
| 4508 | mob | `.panel-body:has([id^="c"])` | `padding: 10px !important` | aucun élément gagnant |
| 4646 | mob | `.btn-xs` | `padding: 6px 12px !important` | aucun `.btn-xs` gagnant sur mobile |
| 4654 | mob | `.form-control` | `padding: 10px 12px !important` | battue par l.9885 |
| 6852 | mob | `.panel-group .panel-body` | `padding: 10px 0 !important` | aucun accordéon gagnant dans les fixtures du périmètre |
| 7034 | mob | `body.mobile-mode .modal-body table th` | `padding: 10px 8px !important` | aucun tableau de modale |
| 8011 | mob | cellules du forum hors index | `padding-top: 3px !important` | battue |
| 8695 | mob | `body.page-forum .panel-default .table > tbody > tr > td:last-child` | `padding-top: 3px !important` | battue |
| 9441 | mob | `body.page-kramail #topics_wrapper .btn-group .btn` | `padding: 10px !important` | aucun élément gagnant |
| 10476, 10477 | `(max-width: 768px)` | `body.page-kramail .editeur-text .btn-toolbar .dropdown-menu .btn-group .btn` | `padding: 4px 6px`, `margin: 2px` | menu fermé ; média non conforme déjà signalé (4.8) |
| 13107 | `(min-width: 768px) and (hover: none)` | `#col-leftest .kr-icon-cell.btn` | `padding: 4px 2px` | tactile seulement, non émulé |
| 13241 | mob | `.kr-icon-cell.btn` | `padding: 4px 2px` | aucun élément gagnant |
| 15615 | `(max-width: 359px)` | `.kr-tools-plus` | `padding: 0 6px !important` | largeur hors liste commune |
| 14109, 14114 | mob | `#topics thead th.sorting_*::after` | `margin-left: 6px` | pseudo-éléments, hors composants de la liste |
