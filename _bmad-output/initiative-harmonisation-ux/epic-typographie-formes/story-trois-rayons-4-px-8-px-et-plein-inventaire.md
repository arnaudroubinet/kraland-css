# Ticket 4.8 : inventaire des rayons

Annexe du plan `story-trois-rayons-4-px-8-px-et-plein-plan.md`. Relevé sur `5ff22d3` (`kraland-theme.css`, `kraland-userscript-template.js`), lecture seule.

Rôles : **C4** contrôle, `var(--kr-radius-sm)` ; **K8** conteneur, `var(--kr-radius-md)` ; **P** pastille ou étiquette, `var(--kr-radius-full)` ; **X** exception gardée (Q12 et A7) ; **Z** 0 voulu ou coin intérieur, inchangé ; **T** déclaration de variable. Dans la colonne cible, `S`, `M` et `F` abrègent `var(--kr-radius-sm)`, `var(--kr-radius-md)` et `var(--kr-radius-full)`. Les numéros de ligne sont ceux de `5ff22d3` ; l'implémenteur se repère au sélecteur si le fichier a bougé.

Comptes du CSS : 268 entrées, soit 6 variables et 262 déclarations de rayon (230 `border-radius`, 32 longhands de coin). C4 102 (dont 12 déjà au jeton), K8 51, P 20, X 36, Z 53. Valeur calculée changée : C4 67, K8 28, P 14, X 1 (réécriture neutre de l.12292 seulement si `--kr-radius` est retiré).

## 1. kraland-theme.css

| Ligne | Média | Sélecteur abrégé | Valeur actuelle | Rôle | Cible | Note |
|---|---|---|---|---|---|---|
| 18 | commun | `:root` | --kr-radius `.5rem` | T | retiré | consommateurs passés aux jetons (A2) |
| 32 | commun | `:root` | --kr-radius-sm `4px` | T | gardé | jetons de l'entrée 1 |
| 33 | commun | `:root` | --kr-radius-md `8px` | T | gardé | jetons de l'entrée 1 |
| 34 | commun | `:root` | --kr-radius-full `9999px` | T | gardé | jetons de l'entrée 1 |
| 140 | commun | `:root` | --mobile-radius `8px` | T | retiré | consommateurs passés aux jetons (A2) |
| 141 | commun | `:root` | --mobile-radius-lg `16px` | T | retiré | mort : aucun consommateur |
| 618 | commun | `#skills-panel` | `5px !important` | K8 | `var(--kr-radius-md) !important` | panneau des compétences |
| 650 | commun | `.form-control.form-control` | `.4rem` | C4 | `var(--kr-radius-sm)` | champ ; .4rem = 4 px |
| 987 | commun | `.img-circle` | `50%` | X | inchangé | image |
| 1101 | commun | `.carousel-caption` | `.6rem` | K8 | `var(--kr-radius-md)` |  |
| 1191 | mob | `.bootbox-confirm .modal-body > select:first-of-type, .bootbox-confirm …` | `var(--mobile-radius)` | C4 | `var(--kr-radius-sm)` | sélecteur (champ) |
| 1220 | mob | `.bootbox-confirm .panel-heading ul.nav-tabs > li > a` | `var(--mobile-radius) !important` | C4 | `var(--kr-radius-sm)` | onglet (A5) |
| 1261 | mob | `.bootbox-confirm .panel-actions` | `var(--mobile-radius)` | K8 | `var(--kr-radius-md)` |  |
| 1287 | mob | `.bootbox-confirm .panel-actions .row.form-group` | `4px` | K8 | `var(--kr-radius-md)` | doublon battu par 7319 (D) |
| 1429 | mob | `.bootbox-confirm select[name="bonus"]` | `8px` | C4 | `var(--kr-radius-sm)` | sélecteur (champ) |
| 1444 | mob | `.bootbox-confirm .btn-toolbar .btn` | `6px` | C4 | `var(--kr-radius-sm)` | bouton |
| 1500 | mob | `.bootbox-confirm .btn-toolbar` | `var(--mobile-radius) var(--mobile-radius) 0 0 !important` | C4 | `var(--kr-radius-sm) var(--kr-radius-sm) 0 0` | barre BBCode collée au champ (A4) |
| 1518 | mob | `.bootbox-confirm .btn-toolbar .btn-group` | `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 1539 | mob | `.bootbox-confirm .btn-toolbar > .btn-group > .btn, .bootbox-confirm .b…` | `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 1571 | mob | `.bootbox-confirm .btn-toolbar .btn-group .dropdown > .dropdown-toggle …` | `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 1592 | mob | `.bootbox-confirm .btn-toolbar .dropdown-menu .btn-group .btn` | `4px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 1599 | mob | `.bootbox-confirm .btn-toolbar > .btn-group:first-child > .btn:first-ch…` | `var(--mobile-radius) 0 0 0 !important` | C4 | `var(--kr-radius-sm) 0 0 0` | coin extérieur de la barre (A4) |
| 1605 | mob | `.bootbox-confirm .btn-toolbar > .btn-group[aria-label]:last-of-type > …` | `0 var(--mobile-radius) 0 0 !important` | C4 | `0 var(--kr-radius-sm) 0 0` | coin extérieur de la barre (A4) |
| 1621 | mob | `.bootbox-confirm .btn-toolbar::-webkit-scrollbar-thumb` | `2px` | X | inchangé | barre de défilement (A7) |
| 1627 | mob | `.bootbox-confirm .btn-toolbar + textarea.form-control, .bootbox-confir…` | top-left `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 1628 | mob | `.bootbox-confirm .btn-toolbar + textarea.form-control, .bootbox-confir…` | top-right `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 1641 | mob | `.bootbox-confirm .btn-toolbar .dropdown-menu` | `var(--mobile-radius) var(--mobile-radius) 0 0 !important` | K8 | `var(--kr-radius-md) var(--kr-radius-md) 0 0` | menu en feuille du bas |
| 1742 | mob | @media max-width: 768px | `.bootbox-confirm .kraland-modal-footer .btn` | `8px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 1903 | mob | @media max-width: 768px | `.bootbox-confirm .kraland-modal-header select` | `8px !important` | C4 | `var(--kr-radius-sm)` | sélecteur (champ) |
| 1910 | mob | @media max-width: 768px | `.bootbox-confirm .kraland-character-title img` | `8px !important` | X | inchangé | avatar ou image |
| 1917 | mob | @media max-width: 768px | `.bootbox-confirm .kraland-form-zone .panel` | `8px !important` | K8 | `var(--kr-radius-md)` |  |
| 1926 | mob | @media max-width: 768px | `.bootbox-confirm .kraland-form-zone input[type="text"], .bootbox-confi…` | `6px !important` | C4 | `var(--kr-radius-sm)` | champ |
| 1994 | mob | `.bootbox-confirm .alert` | `var(--mobile-radius)` | K8 | `var(--kr-radius-md)` |  |
| 2029 | mob | `.bootbox-confirm .modal-footer p` | `var(--mobile-radius)` | K8 | `var(--kr-radius-md)` |  |
| 2036 | mob | `.bootbox-confirm .modal-footer .btn` | `var(--mobile-radius)` | C4 | `var(--kr-radius-sm)` | bouton |
| 2104 | deux | `.kr-order-modal .kr-order-badge` | `9999px` | P | `var(--kr-radius-full)` | pastille ou étiquette |
| 2385 | commun | `.dashboard-section` | `8px` | K8 | `var(--kr-radius-md)` | conteneur |
| 2413 | commun | `.dashboard-group-buttons .btn` | `4px` | C4 | `var(--kr-radius-sm)` | bouton |
| 2439 | commun | `.dashboard-section-header .badge` | `10rem` | P | `var(--kr-radius-full)` | pastille ou étiquette |
| 2464 | commun | `.dashboard-card` | `6px` | K8 | `var(--kr-radius-md)` | conteneur |
| 2527 | commun | `.dashboard-card-avatar` | `50%` | X | inchangé | avatar ou image |
| 2608 | commun | `.dashboard-card-hp-fill` | `0` | X | inchangé | jauge (A7) |
| 2621 | commun | `.dashboard-card-pnj` | `3px` | P | `var(--kr-radius-full)` | pastille ou étiquette |
| 2668 | commun | `.dashboard-card-actions a` | `3px` | C4 | `var(--kr-radius-sm)` | bouton |
| 3540 | commun | `.c100` | `50% !important` | X | inchangé | cercle de progression de l'avatar |
| 3574 | commun | `.c100::after` | `50% !important` | X | inchangé | cercle de progression de l'avatar |
| 3587 | commun | `.c100::before` | `50% !important` | X | inchangé | cercle de progression de l'avatar |
| 4011 | mob | `.center > ul.pagination:has(select) select` | `4px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 4085 | mob | `.navbar-toggle` | `12px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 4113 | mob | `.navbar-toggle .icon-bar` | `2px !important` | X | inchangé | dessin de l'icône hamburger |
| 4376 | mob | `a[href*="#flap"]` | `50% !important` | P | `var(--kr-radius-full)` | bouton rond (A3) |
| 4543 | mob | `.panel-body a` | `4px !important` | C4 | `var(--kr-radius-sm)` | tuile, pièce ou ligne touchable (A10) |
| 4694 | mob | `.modal-content` | `8px !important` | K8 | `var(--kr-radius-md)` | conteneur |
| 4787 | commun | `.kr-mobile-close` | `50%` | P | `var(--kr-radius-full)` | bouton rond (A3) |
| 4810 | commun | `.kr-mobile-skills-toggle` | `50% !important` | P | `var(--kr-radius-full)` | bouton rond (A3) |
| 4909 | mob | `b.mm > .mobile-mini-profile .avatar` | `4px` | X | inchangé | avatar ou image |
| 4986 | mob | `b.mm > .mobile-mini-profile-settings` | `50% !important` | P | `var(--kr-radius-full)` | bouton rond (A3) |
| 5022 | mob | `b.mm > .mobile-gauge-compact-bar` | `3px !important` | X | inchangé | jauge (A7) |
| 5072 | mob | `b.mm > .mobile-mini-profile-gauges-full` | `4px !important` | K8 | `var(--kr-radius-md)` | conteneur |
| 5094 | mob | `b.mm > .mobile-gauge-full-bar` | `6px !important` | X | inchangé | jauge (A7) |
| 5128 | mob | `b.mm > .mobile-mini-profile-characteristics` | `4px !important` | K8 | `var(--kr-radius-md)` | conteneur |
| 5142 | mob | `b.mm > .mobile-mini-profile-skills` | `4px !important` | K8 | `var(--kr-radius-md)` | conteneur |
| 5308 | mob | `b.mm > .mobile-quick-action.btn` | `0 !important` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 5402 | mob | `b.mm > .mobile-tab-bar.nav-tabs > li > a` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 5500 | mob | `b.mm > .navbar-toggle` | `4px` | C4 | `var(--kr-radius-sm)` | doublon battu par 4085 (D) |
| 5576 | mob | `b.mm > .navbar-header-buttons-left li a, .navbar-header-buttons-right …` | `4px` | C4 | `var(--kr-radius-sm)` | bouton |
| 5597 | mob | `b.mm > .navbar-header-buttons-left .badge, .navbar-header-buttons-righ…` | `8px !important` | P | `var(--kr-radius-full)` | pastille ou étiquette |
| 5680 | mob | `b.mm > .navbar-right > li > a, .navbar-right > li > button` | `4px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 5804 | mob | `b.mm .dashboard-card` | `8px` | K8 | `var(--kr-radius-md)` | conteneur |
| 5818 | mob | `b.mm .dashboard-card-link` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 5875 | mob | `b.mm .dashboard-card-avatar` | `50%` | X | inchangé | avatar ou image |
| 5972 | mob | `b.mm .dashboard-card-actions a` | `6px` | C4 | `var(--kr-radius-sm)` | bouton |
| 6103 | mob | `b.mm .commerce-products-container > a.list-group-item` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 6164 | mob | `b.mm .commerce-products-container > a.list-group-item .mention` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 6203 | ord | `html.kr-commerce-list-mode .commerce-products-container > a.list-group…` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 6256 | ord | `html.kr-commerce-list-mode .commerce-products-container > a.list-group…` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 6436 | mob | `b.mm .kr-nav-v2 .kr-pad::before` | `50%` | X | inchangé | croix (Q12) |
| 6472 | mob | `b.mm .kr-nav-v2 .kr-n` | `10px 10px 2px 2px` | X | inchangé | croix (Q12) |
| 6478 | mob | `b.mm .kr-nav-v2 .kr-s` | `2px 2px 10px 10px` | X | inchangé | croix (Q12) |
| 6483 | mob | `b.mm .kr-nav-v2 .kr-w` | `10px 2px 2px 10px` | X | inchangé | croix (Q12) |
| 6488 | mob | `b.mm .kr-nav-v2 .kr-e` | `2px 10px 10px 2px` | X | inchangé | croix (Q12) |
| 6539 | mob | `b.mm .kr-nav-v2 .kr-hub` | `2px` | X | inchangé | croix (Q12) |
| 6604 | mob | `b.mm .kr-nav-v2.kr-nav-tiles a.kr-room-tile` | `4px` | C4 | `var(--kr-radius-sm)` | tuile, pièce ou ligne touchable (A10) |
| 6611 | mob | `b.mm .kr-nav-v2.kr-nav-tiles .kr-room-tile .kr-room-thumb` | `0` | X | inchangé | vignette de pièce (image) |
| 6618 | mob | `b.mm .kr-nav-v2.kr-nav-tiles .kr-room-tile .kr-room-thumb img` | `0` | X | inchangé | vignette de pièce (image) |
| 6633 | mob | `b.mm .kr-nav-v2.kr-nav-tiles a.kr-room-tile[aria-current="true"]::afte…` | `4px` | C4 | `var(--kr-radius-sm)` | tuile, pièce ou ligne touchable (A10) |
| 6657 | mob | `b.mm .kr-nav-v2 a.kr-room` | `4px` | C4 | `var(--kr-radius-sm)` | tuile, pièce ou ligne touchable (A10) |
| 6682 | mob | `b.mm .kr-nav-v2 .kr-room-thumb` | `3px` | X | inchangé | vignette de pièce (image) |
| 6692 | mob | `b.mm .kr-nav-v2 .kr-room-thumb img` | `3px` | X | inchangé | vignette de pièce (image) |
| 6703 | mob | `b.mm .kr-nav-v2 .kr-room-thumb img + img` | `0` | X | inchangé | vignette de pièce (image) |
| 6725 | mob | `b.mm .kr-nav-v2 .kr-room-here` | `9px` | P | `var(--kr-radius-full)` | pastille ou étiquette |
| 6773 | mob | `.panel-group` | `0 !important` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 6784 | mob | `.panel-group .panel` | `0 !important` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 6798 | mob | `.panel-group .panel-heading` | `0 !important` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 6856 | mob | `b.mm .modal-content` | `8px !important` | K8 | `var(--kr-radius-md)` | conteneur |
| 6898 | mob | `b.mm .modal-body select` | `6px !important` | C4 | `var(--kr-radius-sm)` | sélecteur (champ) |
| 6926 | mob | `b.mm .modal-body .nav-tabs > li > a` | `6px !important` | C4 | `var(--kr-radius-sm)` | onglet (A5) |
| 6967 | mob | `b.mm .modal-body input[type="text"], b.mm .modal-body input[type="numb…` | `6px !important` | C4 | `var(--kr-radius-sm)` | champ |
| 7017 | mob | `b.mm .modal-footer .btn` | `6px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 7036 | mob | `b.mm .modal-body .alert` | `6px !important` | K8 | `var(--kr-radius-md)` | conteneur |
| 7043 | mob | `b.mm .modal-header img` | `4px !important` | X | inchangé | avatar ou image |
| 7056 | mob | `b.mm .bootbox.modal select[name="top"].form-control` | `8px !important` | C4 | `var(--kr-radius-sm)` | sélecteur (champ) |
| 7082 | mob | `b.mm .bootbox.modal h3` | `8px !important` | K8 | `var(--kr-radius-md)` |  |
| 7093 | mob | `b.mm .bootbox.modal h3 img[width="80"]` | `6px !important` | X | inchangé | avatar ou image |
| 7184 | mob | `b.mm .bootbox.modal .panel.with-nav-tabs .nav-tabs > li > a` | `0 !important` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 7303 | mob | `b.mm .bootbox.modal.bootbox-confirm .panel-footer select` | `6px !important` | C4 | `var(--kr-radius-sm)` | sélecteur (champ) |
| 7319 | mob | `b.mm .bootbox.modal.bootbox-confirm .panel-actions .row.form-group` | `8px !important` | K8 | `var(--kr-radius-md)` |  |
| 7425 | mob | `b.mm .bootbox.modal .btn-toolbar` | `var(--mobile-radius) var(--mobile-radius) 0 0 !important` | C4 | `var(--kr-radius-sm) var(--kr-radius-sm) 0 0` | barre BBCode collée au champ (A4) |
| 7427 | mob | `b.mm .bootbox.modal .btn-toolbar` | bottom-left `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 7428 | mob | `b.mm .bootbox.modal .btn-toolbar` | bottom-right `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 7452 | mob | `b.mm .bootbox.modal .btn-toolbar .btn-group` | `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 7478 | mob | `b.mm .bootbox.modal .btn-toolbar > .btn-group > .btn, b.mm .bootbox.mo…` | `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 7508 | mob | `b.mm .bootbox.modal .btn-toolbar .btn-group .dropdown > .dropdown-togg…` | `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 7523 | mob | `b.mm .bootbox.modal .btn-toolbar > .btn-group:first-child > .btn:first…` | `var(--mobile-radius) 0 0 0 !important` | C4 | `var(--kr-radius-sm) 0 0 0` | coin extérieur de la barre (A4) |
| 7530 | mob | `b.mm .bootbox.modal .btn-toolbar > .btn-group:last-child > .btn:last-c…` | `0 var(--mobile-radius) 0 0 !important` | C4 | `0 var(--kr-radius-sm) 0 0` | coin extérieur de la barre (A4) |
| 7546 | mob | `b.mm .bootbox.modal .btn-toolbar::-webkit-scrollbar-thumb` | `2px` | X | inchangé | barre de défilement (A7) |
| 7552 | mob | `b.mm .bootbox.modal .btn-toolbar + textarea, b.mm .bootbox.modal .btn-…` | top-left `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 7553 | mob | `b.mm .bootbox.modal .btn-toolbar + textarea, b.mm .bootbox.modal .btn-…` | top-right `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 7569 | mob | `b.mm .bootbox.modal .btn-toolbar .dropdown .dropdown-menu, b.mm .bootb…` | `var(--mobile-radius) var(--mobile-radius) 0 0 !important` | K8 | `var(--kr-radius-md) var(--kr-radius-md) 0 0` | menu en feuille du bas |
| 7591 | mob | `b.mm .bootbox.modal .btn-toolbar .dropdown-menu .btn-group .btn` | `4px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 7618 | mob | `b.mm .bootbox.modal textarea#message, b.mm .bootbox.modal textarea.for…` | `8px !important` | C4 | `var(--kr-radius-sm)` | champ |
| 7659 | mob | `b.mm .bootbox.modal .modal-footer .btn` | `8px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 7726 | mob | `b.mm #kr-tamper-theme-form .form-group > div > div` | `8px !important` | K8 | `var(--kr-radius-md)` |  |
| 7740 | mob | `b.mm #kr-tamper-theme-form .form-group img` | `4px !important` | X | inchangé | avatar ou image |
| 7799 | mob | `b.mm .panel-default > .panel-heading` | `var(--mobile-radius) !important` | K8 | `var(--kr-radius-md)` | conteneur |
| 7835 | mob | `:where(html:not(.kr-page-forum-index)) b.mm:where(.page-forum, .page-f…` | `8px !important` | K8 | `var(--kr-radius-md) !important` | carte de ligne du forum (doublons, D) |
| 8179 | commun | `.forum-card` | `12px` | K8 | `var(--kr-radius-md)` | conteneur |
| 8336 | commun | `.mini-chat-fab` | `50%` | P | `var(--kr-radius-full)` | bouton rond (A3) |
| 8436 | mob | `.dataTables_length select` | `var(--mobile-radius) !important` | C4 | `var(--kr-radius-sm)` | sélecteur (champ) |
| 8459 | mob | `.dataTables_filter input` | `var(--mobile-radius) !important` | C4 | `var(--kr-radius-sm)` | champ |
| 8489 | mob | `body.page-forum .panel-default > .panel-heading` | `0 !important` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 8529 | mob | `:where(html:not(.kr-page-forum-index)) body.page-forum .panel-default …` | `12px !important` | K8 | `var(--kr-radius-md) !important` | carte de ligne du forum (doublons, D) |
| 8769 | mob | `body.page-forum table.dataTable tbody tr` | `12px !important` | K8 | `var(--kr-radius-md)` | conteneur |
| 8861 | mob | `body.page-forum table.dataTable tbody td:nth-child(1) .forum-tags a` | `2px !important` | P | `var(--kr-radius-full)` | pastille ou étiquette |
| 8949 | mob | `.dataTables_paginate .paginate_button` | `var(--mobile-radius) !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 9064 | mob | `body.page-kramail h1.page-header .pull-right > a.btn, body.page-kramai…` | `10px !important` | C4 | `var(--kr-radius-sm)` | bouton à icône du kramail (10 px) |
| 9107 | mob | `body.page-kramail h1.page-header .pull-right > .btn-group > .dropdown-…` | `10px !important` | K8 | `var(--kr-radius-md)` | conteneur |
| 9197 | mob | `body.page-kramail #topics_wrapper .dataTables_filter input[type="searc…` | `22px !important` | C4 | `var(--kr-radius-sm)` | champ de recherche en pilule (A6) |
| 9230 | mob | `body.page-kramail #topics_wrapper .dataTables_paginate .paginate_butto…` | `8px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 9264 | mob | `body.page-kramail #topics tbody tr` | `12px !important` | K8 | `var(--kr-radius-md)` | conteneur |
| 9408 | mob | `body.page-kramail #topics_wrapper .btn-group .btn` | `8px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 9423 | mob | `.kramail-character-selector` | `var(--mobile-radius) !important` | C4 | `var(--kr-radius-sm)` | titre-sélecteur cliquable (A9) |
| 9447 | mob | `.kramail-character-dropdown` | `var(--mobile-radius) !important` | K8 | `var(--kr-radius-md)` | conteneur |
| 9544 | mob | `b.mm ul.media-list.forum > li.media.well.kramail-post-restructured` | `12px !important` | K8 | `var(--kr-radius-md)` | conteneur |
| 9571 | mob | `.kramail-msg-header .kramail-msg-avatar` | `8px !important` | X | inchangé | avatar ou image |
| 9644 | mob | `.kramail-msg-body blockquote, .kramail-msg-body .blockquote, .kramail-…` | `0 8px 8px 0 !important` | K8 | `0 var(--kr-radius-md) var(--kr-radius-md) 0` | citation, filet à gauche |
| 9698 | mob | `b.mm .center > ul.pagination.t > li > a` | `10px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 9782 | mob | `.btn-toolbar` | `var(--mobile-radius)` | C4 | `var(--kr-radius-sm)` | barre BBCode (A4) |
| 9794 | mob | `.btn-toolbar::-webkit-scrollbar-track` | `2px` | X | inchangé | barre de défilement (A7) |
| 9799 | mob | `.btn-toolbar::-webkit-scrollbar-thumb` | `2px` | X | inchangé | barre de défilement (A7) |
| 9831 | mob | `.btn-toolbar .btn` | `6px` | C4 | `var(--kr-radius-sm)` | bouton |
| 9851 | mob | `.form-control` | `var(--mobile-radius) !important` | C4 | `var(--kr-radius-sm)` | champ |
| 9939 | mob | `:where(body.page-kramail-compose, body.page-forum) button.btn-primary.…` | `0 !important` | Z | inchangé | barre fixe d'envoi du kramail (A11) |
| 9981 | mob | `.accordion-toggle, a[data-toggle="collapse"]` | `var(--mobile-radius)` | K8 | `var(--kr-radius-md)` | en-tête repliable (A8) |
| 9999 | mob | `.panel-collapse` | `var(--mobile-radius)` | K8 | `var(--kr-radius-md)` | conteneur |
| 10052 | commun | `body.page-kramail h1.page-header .btn-default` | `var(--kr-radius)` | C4 | `var(--kr-radius-sm)` | bouton |
| 10068 | min-width: 769px | `body.page-kramail form.form-horizontal.editeur-text` | `var(--kr-radius)` | K8 | `var(--kr-radius-md)` | conteneur |
| 10111 | min-width: 769px | `body.page-kramail .editeur-text .form-group:has(input[type="checkbox"]…` | `var(--kr-radius)` | K8 | `var(--kr-radius-md)` | conteneur |
| 10146 | min-width: 769px | `body.page-kramail .editeur-text button.btn-primary.pull-right` | `var(--kr-radius)` | C4 | `var(--kr-radius-sm)` | bouton |
| 10166 | min-width: 769px | `body.page-kramail .editeur-text .btn-toolbar` | `var(--kr-radius)` | C4 | `var(--kr-radius-sm)` | barre BBCode (A4) |
| 10192 | min-width: 769px | `body.page-kramail .editeur-text .btn-toolbar .btn` | `4px` | C4 | `var(--kr-radius-sm)` | bouton |
| 10209 | min-width: 769px | `body.page-kramail .editeur-text .col-sm-10 > .btn-toolbar + textarea.f…` | top-left `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 10210 | min-width: 769px | `body.page-kramail .editeur-text .col-sm-10 > .btn-toolbar + textarea.f…` | top-right `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 10216 | min-width: 769px | `body.page-kramail .editeur-text .col-sm-10 > .btn-toolbar` | bottom-left `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 10217 | min-width: 769px | `body.page-kramail .editeur-text .col-sm-10 > .btn-toolbar` | bottom-right `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 10247 | ord | `body.page-kramail .editeur-text .input-group-addon .btn.btn-primary` | `4px` | C4 | `var(--kr-radius-sm)` | bouton |
| 10302 | max-width: 768px | `body.page-kramail .editeur-text .input-group` | `var(--mobile-radius)` | C4 | `var(--kr-radius-sm)` | champ |
| 10316 | max-width: 768px | `body.page-kramail .editeur-text .input-group-addon` | `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 10323 | max-width: 768px | `body.page-kramail .editeur-text .input-group-addon:first-child` | `var(--mobile-radius) 0 0 var(--mobile-radius) !important` | C4 | `var(--kr-radius-sm) 0 0 var(--kr-radius-sm)` | coins extérieurs du groupe |
| 10331 | max-width: 768px | `body.page-kramail .editeur-text .input-group .form-control` | `0 var(--mobile-radius) var(--mobile-radius) 0 !important` | C4 | `0 var(--kr-radius-sm) var(--kr-radius-sm) 0` | coins extérieurs du groupe |
| 10348 | max-width: 768px | `body.page-kramail .editeur-text .btn-toolbar` | `var(--mobile-radius) var(--mobile-radius) 0 0 !important` | C4 | `var(--kr-radius-sm) var(--kr-radius-sm) 0 0` | barre BBCode collée au champ (A4) |
| 10366 | max-width: 768px | `body.page-kramail .editeur-text .btn-toolbar .btn-group` | `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 10389 | max-width: 768px | `body.page-kramail .editeur-text .btn-toolbar > .btn-group > .btn, body…` | `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 10422 | max-width: 768px | `body.page-kramail .editeur-text .btn-toolbar .btn-group .dropdown > .d…` | `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 10443 | max-width: 768px | `body.page-kramail .editeur-text .btn-toolbar .dropdown-menu .btn-group…` | `4px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 10450 | max-width: 768px | `body.page-kramail .editeur-text .btn-toolbar > .btn-group:first-child …` | `var(--mobile-radius) 0 0 var(--mobile-radius) !important` | C4 | `var(--kr-radius-sm) 0 0 var(--kr-radius-sm)` | coins extérieurs du groupe |
| 10456 | max-width: 768px | `body.page-kramail .editeur-text .btn-toolbar > .btn-group[aria-label]:…` | `0 var(--mobile-radius) var(--mobile-radius) 0 !important` | C4 | `0 var(--kr-radius-sm) var(--kr-radius-sm) 0` | coins extérieurs du groupe |
| 10472 | max-width: 768px | `body.page-kramail .editeur-text .btn-toolbar::-webkit-scrollbar-thumb` | `2px` | X | inchangé | barre de défilement (A7) |
| 10478 | max-width: 768px | `body.page-kramail .editeur-text .btn-toolbar + textarea.form-control, …` | top-left `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 10479 | max-width: 768px | `body.page-kramail .editeur-text .btn-toolbar + textarea.form-control, …` | top-right `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 10497 | max-width: 768px | `body.page-kramail .editeur-text .btn-toolbar .dropdown-menu` | `var(--mobile-radius) var(--mobile-radius) 0 0 !important` | K8 | `var(--kr-radius-md) var(--kr-radius-md) 0 0` | menu en feuille du bas |
| 10535 | max-width: 768px | `body.page-kramail .editeur-text .form-group:has(input[type="checkbox"]…` | `var(--mobile-radius)` | K8 | `var(--kr-radius-md)` | conteneur |
| 10632 | commun | `body.page-kramail-compose form[name="post_msg"] .btn-toolbar` | `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 10651 | commun | `body.page-kramail-compose form[name="post_msg"] .btn-toolbar > .btn-gr…` | `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 10672 | commun | `body.page-kramail-compose form[name="post_msg"] .btn-toolbar > .btn-gr…` | `0 !important` | Z | inchangé | coins intérieurs de groupe |
| 10684 | commun | `html body.page-kramail-compose form[name="post_msg"] .btn-toolbar > .b…` | top-left `4px !important` | C4 | `var(--kr-radius-sm)` | coin extérieur (champ, bouton) |
| 10685 | commun | `html body.page-kramail-compose form[name="post_msg"] .btn-toolbar > .b…` | bottom-left `4px !important` | C4 | `var(--kr-radius-sm)` | coin extérieur (champ, bouton) |
| 10691 | commun | `html body.page-kramail-compose form[name="post_msg"] .btn-toolbar > .b…` | top-right `4px !important` | C4 | `var(--kr-radius-sm)` | coin extérieur (champ, bouton) |
| 10692 | commun | `html body.page-kramail-compose form[name="post_msg"] .btn-toolbar > .b…` | bottom-right `4px !important` | C4 | `var(--kr-radius-sm)` | coin extérieur (champ, bouton) |
| 10820 | commun | `body.page-kramail-compose form[name="post_msg"] .kd-input` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 11043 | commun | `body.page-kramail-compose form[name="post_msg"] .kd-msg-btn` | `3px` | C4 | `var(--kr-radius-sm)` | bouton |
| 11146 | ord | `body.page-kramail-compose form[name="post_msg"] .btn-toolbar + textare…` | top-left `4px !important` | C4 | `var(--kr-radius-sm)` | coin extérieur (champ, bouton) |
| 11147 | ord | `body.page-kramail-compose form[name="post_msg"] .btn-toolbar + textare…` | top-right `4px !important` | C4 | `var(--kr-radius-sm)` | coin extérieur (champ, bouton) |
| 11162 | ord | `body.page-kramail-compose form[name="post_msg"] .kd-field` | `4px` | C4 | `var(--kr-radius-sm)` | champ |
| 11180 | ord | `body.page-kramail-compose form[name="post_msg"] .kd-chip` | `13px` | P | `var(--kr-radius-full)` | pastille ou étiquette |
| 11189 | ord | `body.page-kramail-compose form[name="post_msg"] .kd-chip-x` | `0 12px 12px 0` | P | `0 var(--kr-radius-full) var(--kr-radius-full) 0` | moitié droite de la pastille |
| 11209 | ord | `body.page-kramail-compose form[name="post_msg"] .kd-contacts` | `3px` | C4 | `var(--kr-radius-sm)` | bouton |
| 11223 | ord | `body.page-kramail-compose form[name="post_msg"] .kd-panel` | `6px` | K8 | `var(--kr-radius-md)` | conteneur |
| 11279 | ord | `body.page-kramail-compose form[name="post_msg"] .kd-opt-free .kd-opt-t…` | `3px` | P | `var(--kr-radius-full)` | pastille ou étiquette |
| 11388 | mob | `body.page-kramail-compose form[name="post_msg"] .btn-toolbar + textare…` | top-left `var(--mobile-radius, 8px) !important` | C4 | `var(--kr-radius-sm)` | coin extérieur (champ, bouton) |
| 11389 | mob | `body.page-kramail-compose form[name="post_msg"] .btn-toolbar + textare…` | top-right `var(--mobile-radius, 8px) !important` | C4 | `var(--kr-radius-sm)` | coin extérieur (champ, bouton) |
| 11416 | mob | `body.page-kramail-compose form[name="post_msg"] .kd-field` | `4px` | C4 | `var(--kr-radius-sm)` | champ |
| 11434 | mob | `body.page-kramail-compose form[name="post_msg"] .kd-chip` | `17px` | P | `var(--kr-radius-full)` | pastille ou étiquette |
| 11445 | mob | `body.page-kramail-compose form[name="post_msg"] .kd-chip-x` | `0 16px 16px 0` | P | `0 var(--kr-radius-full) var(--kr-radius-full) 0` | moitié droite de la pastille |
| 11470 | mob | `body.page-kramail-compose form[name="post_msg"] .kd-contacts` | `3px` | C4 | `var(--kr-radius-sm)` | bouton |
| 11483 | mob | `body.page-kramail-compose form[name="post_msg"] .kd-panel` | `6px` | K8 | `var(--kr-radius-md)` | conteneur |
| 11538 | mob | `body.page-kramail-compose form[name="post_msg"] .kd-opt-free .kd-opt-t…` | `3px` | P | `var(--kr-radius-full)` | pastille ou étiquette |
| 11736 | commun | `.kr-changelog-content` | `var(--kr-radius) !important` | K8 | `var(--kr-radius-md)` | conteneur |
| 11812 | commun | `.kr-changelog-footer button` | `var(--kr-radius)` | C4 | `var(--kr-radius-sm)` | bouton |
| 12009 | ord | `.page-accueil .alert-info` | `var(--kr-radius)` | K8 | `var(--kr-radius-md)` | conteneur |
| 12024 | ord | `.page-accueil #player-header-section` | `var(--kr-radius)` | K8 | `var(--kr-radius-md)` | conteneur |
| 12034 | ord | `.page-accueil #player-header-section > .list-group-item.active` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 12039 | ord | `.page-accueil #player-header-section .panel` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 12078 | ord | `.page-accueil .kraland-metrics .list-group-item` | `var(--kr-radius)` | K8 | `var(--kr-radius-md)` | conteneur |
| 12117 | ord | `.page-accueil .ds_user` | `var(--kr-radius)` | K8 | `var(--kr-radius-md)` | conteneur |
| 12141 | ord | `.page-accueil .ds_user .pull-right img` | `50%` | X | inchangé | avatar ou image |
| 12155 | ord | `.accueil-play-btn` | `var(--kr-radius)` | C4 | `var(--kr-radius-sm)` | bouton |
| 12176 | ord | `.accueil-forum-section` | `var(--kr-radius)` | K8 | `var(--kr-radius-md)` | conteneur |
| 12198 | ord | `.accueil-forum-section .ds_forum` | `0 !important` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 12231 | ord | `.page-accueil #myCarousel` | `var(--kr-radius)` | K8 | `var(--kr-radius-md)` | conteneur |
| 12245 | ord | `.page-accueil #myCarousel .carousel-caption` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 12273 | ord | `.page-accueil .kr-ministerial-card` | `var(--kr-radius)` | K8 | `var(--kr-radius-md)` | conteneur |
| 12292 | ord | `.page-accueil .kr-ministerial-card img` | `calc(var(--kr-radius) / 2)` | X | `calc(.5rem / 2)` | image ; ne dépend plus de --kr-radius |
| 12373 | mob | `.page-accueil .alert-info` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 12389 | mob | `.page-accueil .kr-ministerial-card` | `var(--kr-radius)` | K8 | `var(--kr-radius-md)` | conteneur |
| 12423 | mob | `.page-accueil .accueil-play-btn` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 12446 | mob | `.page-accueil .ds_user` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 12465 | mob | `.page-accueil .ds_user .pull-right img` | `50%` | X | inchangé | avatar ou image |
| 12506 | mob | `.page-accueil .accueil-forum-section .ds_forum` | `0 !important` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 12558 | mob | `.page-accueil .kraland-metrics .list-group-item` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 12605 | mob | `.page-accueil #player-header-section > .list-group-item.active` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 12612 | mob | `.page-accueil #player-header-section .panel` | `0` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 12679 | commun | `#kr-resize-banner` | `8px` | K8 | `var(--kr-radius-md)` | conteneur |
| 12691 | commun | `#kr-resize-banner button` | `6px` | C4 | `var(--kr-radius-sm)` | bouton |
| 12970 | ord | `#col-leftest .kr-skill-badge, #col-leftest .kr-stat-badge` | `8px` | P | `var(--kr-radius-full)` | pastille ou étiquette |
| 13003 | ord | `#col-leftest .kr-icon-cell::after` | `4px` | K8 | `var(--kr-radius-md)` | conteneur |
| 13180 | mob | `.kr-skill-badge, .kr-stat-badge` | `8px` | P | `var(--kr-radius-full)` | pastille ou étiquette |
| 13544 | mob | `.forum-thread-action` | `var(--mobile-radius, 8px)` | C4 | `var(--kr-radius-sm)` | bouton |
| 13613 | mob | `.col-sm-10 > .btn-toolbar:not(.bootbox *) > .btn-group > .btn, .col-sm…` | `6px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 13664 | mob | `.col-sm-10 > .btn-toolbar:not(.bootbox *) .dropdown-menu .btn-group > …` | `6px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 13791 | deux | `body.page-forum.kr-subforum .kr-topic-badge` | `3px` | P | `var(--kr-radius-full)` | pastille ou étiquette |
| 14055 | mob | `body.page-forum.kr-subforum #topics thead th` | `22px` | C4 | `var(--kr-radius-sm)` | bouton de tri en pilule (A6) |
| 14104 | mob | `body.page-forum.kr-subforum #topics tbody tr` | `0 !important` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 14251 | mob | `body.page-forum.kr-subforum #topics tbody td:nth-child(5) > p.mini .bt…` | `8px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 14373 | mob | `html body.page-forum.kr-subforum.mobile-mode .panel-default table.tabl…` | `0 !important` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 14630 | ord | `html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default tbod…` | top-left `var(--kr-radius-sm)` | C4 | inchangé | déjà au jeton (entrée 4) |
| 14631 | ord | `html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default tbod…` | bottom-left `var(--kr-radius-sm)` | C4 | inchangé | déjà au jeton (entrée 4) |
| 14635 | ord | `html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default tbod…` | top-right `var(--kr-radius-sm)` | C4 | inchangé | déjà au jeton (entrée 4) |
| 14636 | ord | `html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default tbod…` | bottom-right `var(--kr-radius-sm)` | C4 | inchangé | déjà au jeton (entrée 4) |
| 14665 | ord | `html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default tbod…` | `6px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 14888 | mob | `:where(html.kr-page-forum-index) #col-right .panel-default .table > tb…` | `0 !important` | Z | inchangé | 0 voulu (bandeau, ligne, pleine largeur) |
| 15013 | mob | `:where(html.kr-page-forum-index) #col-right .panel-default .table > tb…` | `8px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 15125 | ord | `:where(html.kr-page-forum-index) #col-right .panel-default .table > tb…` | `6px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 15164 | mob | `b.mm ul.media-list.forum > li.media.kr-msg` | `8px` | K8 | `var(--kr-radius-md)` | conteneur |
| 15184 | mob | `b.mm ul.media-list.forum > li.media.kr-msg img.avatar` | `6px` | X | inchangé | avatar ou image |
| 15327 | mob | `b.mm ul.media-list.forum > li.media.kr-msg > .media-body > .pull-right…` | `6px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 15453 | mob | `b.mm.page-forum form.kr-editor .btn-toolbar.kr-tools-ready` | `8px 8px 0 0` | C4 | `var(--kr-radius-sm) var(--kr-radius-sm) 0 0` | barre BBCode collée au champ (A4) |
| 15461 | mob | `b.mm.page-forum form.kr-editor .btn-toolbar.kr-tools-ready + textarea.…` | `0 0 8px 8px !important` | C4 | `0 0 var(--kr-radius-sm) var(--kr-radius-sm)` | champ sous la barre (A4) |
| 15518 | mob | `b.mm.page-forum form.kr-editor .btn-toolbar.kr-tools-ready .kr-tools-p…` | `6px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 15542 | mob | `html b.mm.page-forum form.kr-editor[name="post_msg"] div > button.btn-…` | `8px !important` | C4 | `var(--kr-radius-sm)` | bouton |
| 15593 | ord | `:where(body.page-forum) ul.media-list.forum > li.media > .media-body >…` | top-left `var(--kr-radius-sm)` | C4 | inchangé | déjà au jeton (entrée 4) |
| 15594 | ord | `:where(body.page-forum) ul.media-list.forum > li.media > .media-body >…` | bottom-left `var(--kr-radius-sm)` | C4 | inchangé | déjà au jeton (entrée 4) |
| 15598 | ord | `:where(body.page-forum) ul.media-list.forum > li.media > .media-body >…` | top-right `var(--kr-radius-sm)` | C4 | inchangé | déjà au jeton (entrée 4) |
| 15599 | ord | `:where(body.page-forum) ul.media-list.forum > li.media > .media-body >…` | bottom-right `var(--kr-radius-sm)` | C4 | inchangé | déjà au jeton (entrée 4) |
| 15608 | ord | `:where(body.page-forum) .center > ul.pagination:not(:has(select)) > li…` | top-left `var(--kr-radius-sm)` | C4 | inchangé | déjà au jeton (entrée 4) |
| 15609 | ord | `:where(body.page-forum) .center > ul.pagination:not(:has(select)) > li…` | bottom-left `var(--kr-radius-sm)` | C4 | inchangé | déjà au jeton (entrée 4) |
| 15613 | ord | `:where(body.page-forum) .center > ul.pagination:not(:has(select)) > li…` | top-right `var(--kr-radius-sm)` | C4 | inchangé | déjà au jeton (entrée 4) |
| 15614 | ord | `:where(body.page-forum) .center > ul.pagination:not(:has(select)) > li…` | bottom-right `var(--kr-radius-sm)` | C4 | inchangé | déjà au jeton (entrée 4) |

## 2. kraland-userscript-template.js

| Ligne | Contexte | Élément | Valeur actuelle | Rôle | Cible | Note |
|---|---|---|---|---|---|---|
| 5544 | fil d'Ariane cloné (cssText) | lien | `0` | Z | inchangé | 0 voulu |
| 5579 | `.forum-new-topic-fab` (cssText) | bouton flottant rond | `50%` | P | `var(--kr-radius-full)` | même rendu (A3) |
| 5793 | `.kramail-character-dropdown` (cssText) | menu du sélecteur de personnage | `var(--mobile-radius)` | K8 | `var(--kr-radius-md)` | doublon de la CSS l.9447 (!important) ; à réécrire car `--mobile-radius` est retiré |
| 5885 | `.kramail-character-selector` (cssText) | sélecteur de personnage | `var(--mobile-radius)` | C4 | `var(--kr-radius-sm)` | contrôle (A9) |
| 9419 | `forceOrderModalGridLayout` | liens d'onglets de la modale d'ordre | `'8px', 'important'` | C4 | `'var(--kr-radius-sm)', 'important'` | onglets = contrôles (A5) |
| 9671 | `fixDropdownPosition` | menu en feuille du bas | `'var(--mobile-radius) var(--mobile-radius) 0 0', 'important'` | K8 | `'var(--kr-radius-md) var(--kr-radius-md) 0 0', 'important'` | même valeur (8 px) |
| 4214 | SVG | attribut `rx` d'un dessin | 37 | hors sujet | inchangé | pas un `border-radius` |

## 3. Natifs de Bootstrap 3.3.7 sans règle d'origine dans la peau

Règle de rôle ajoutée (A1), dans la liste combinée `@media (max-width: 767px), (min-width: 768px)`, sauf `.label` et `.badge` ajoutés à la règle existante l.695-702.

| Composant natif | Valeur native | Rôle | Cible |
|---|---|---|---|
| `.btn` | 4px | C4 | S (même valeur, posé par le jeton) |
| `.btn-xs`, `.btn-sm`, `.btn-group-xs > .btn`, `.btn-group-sm > .btn` | 3px | C4 | S |
| `.btn-lg`, `.btn-group-lg > .btn` | 6px | C4 | S |
| `.btn-group` coins intérieurs | 0 | Z | inchangé (longhands natifs plus spécifiques) |
| `.label` | .25em | P | F |
| `.badge` | 10px | P | F |
| `.panel` | 4px | K8 | M |
| `.panel > .panel-heading`, `.panel-footer` | 3px (haut ou bas) | K8 | `calc(var(--kr-radius-md) - 1px)` aux mêmes coins |
| `.alert` | 4px | K8 | M |
| `.well`, `.well-sm`, `.well-lg` | 4 / 3 / 6px | K8 | M |
| `.dropdown-menu` | 4px | K8 | M |
| `.modal-content` (ordinateur) | 6px | K8 | M (la règle mobile l.4694 passe dans la liste combinée) |
| `.list-group`, `.list-group-item` | 4px aux extrémités | hors liste | natif (A14) |
| `.tooltip-inner`, `.popover` | 4 / 6px | hors liste | natif (A14) |
| `.progress` | 4px | X | natif (jauge, A7) |
| `.img-rounded`, `.img-thumbnail`, `.img-circle` | 6 / 4 / 50% | X | natif (images, Q12) |
| `.pagination`, `.nav-tabs > li > a`, `.input-group-addon`, `.form-control` | 4px | C4 | déjà 4 px ; seuls ceux que la peau redéclare sont réécrits |
