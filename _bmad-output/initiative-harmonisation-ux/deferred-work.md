## Deferred from: code review of epic-identite-et-defauts, tickets 1.1 à 1.5 (2026-10-20)

- Rédaction kramail sans `textarea#dest[name="c[3]"]` : jamais classée page-kramail-compose, donc privée de la barre fixe « Envoyer » qu'elle avait avant le lot 1 (template l.851). Non vérifié : lister les formulaires /kramail/post/… réels.
- Sous-chemins /jouer/bat/<id> et /jouer/materiel/<x> acceptés comme source du nom (template l.296-305) : un libellé actif autre que le nom serait mémorisé. Non vérifié : relever le titre actif de ces sous-pages réelles ; medium si vrai.
- Clé unique kr-character-name pour tous les personnages et comptes : nom périmé jusqu'à la prochaine page plateau, matériel ou bâtiments. Limite acceptée par R1 ; question ouverte Q23.

## Résultat de l'exploration backlog 5 (2026-10-22)

- Sous-chemins `/jouer/bat/<id>` et `/jouer/materiel/<x>` : infirmé, aucune page réelle n'y mène (point clos).
- Rédaction kramail sans `textarea#dest[name="c[3]"]` : toujours ouvert, non vérifiable sans marquer un message comme lu (boîte d'envoi vide, un seul message reçu non lu).

## Deferred from: revue du ticket 3.1, jetons de rôle (2026-10-23)

- source_plan: `epic-palette-nation/story-jetons-de-role-des-16-variantes-et-liens-en-couleur-d-accent-plan.md`
  summary: Les entrées-liens des listes latérales (`a.list-group-item`) prennent au survol le `#555` de Bootstrap, sans soulignement ; décider si ces entrées de navigation suivent R7 (accent et soulignement au survol).
  evidence: `a.list-group-item:hover` de Bootstrap 3.3.7 (spécificité 0,2,1) l'emporte sur `a:hover` (0,1,1) et `.list-group-item:hover` (0,2,0), avant comme après le ticket 3.1 ; en sombre, la couleur d'accent tient (`html[class*="-dark"] a:hover`), le soulignement non. Question de produit, listée dans `revue-manuelle.md`.
- source_plan: `epic-palette-nation/story-jetons-de-role-des-16-variantes-et-liens-en-couleur-d-accent-plan.md`
  summary: Alerte info en sombre : faire consommer `--kr-alert-info-bg` et `--kr-alert-info-border` par `html[class*="-dark"] .alert-info` (fond et bordure encore en dur, `rgb(122, 82, 64)`), en même temps que la couleur des liens d'alerte (ticket 3.3) et Q4 (ticket 3.5).
  evidence: Avec les liens d'alerte en primaire, la teinte de la nation les met sous 4,5:1 en Théocratie Seelienne (4,35), Paradigme Vert (4,33) et Royaume de Ruthvénie (4,31) sombres ; en `text-accent`, Paladium sombre tombe à 3,80:1 (Q4). Calcul de la revue du ticket 3.1.
- source_plan: `epic-palette-nation/story-jetons-de-role-des-16-variantes-et-liens-en-couleur-d-accent-plan.md`
  summary: En sombre, l'aide de la modale d'ordre (`.bootbox-confirm .alert-order`) et la ligne d'action cochée du mobile (`.panel-actions .row.form-group:has(input:checked)`) consomment déjà `--kr-alert-info-bg`, qui passe du rouge Kraland à 6 % à la teinte opaque de la nation ; un lien dans l'aide, en primaire (`html[class*="-dark"] .alert a`), tomberait sous 4,5:1 en Théocratie Seelienne (4,35), Paradigme Vert (4,33) et Royaume de Ruthvénie (4,31) sombres.
  evidence: Non vérifié (maybe-false, medium si vrai) : les aides relevées sur le site (Dormir, Pouvoir) n'ont aucun lien. À trancher en relevant, en lecture seule, l'aide d'autres ordres ; à traiter avec la couleur des liens d'alerte (ticket 3.3). Le texte de la ligne cochée reste ≥ 6,27:1.

## Deferred from: ticket 3.5, palette d'états (2026-10-23)

- source_plan: `epic-palette-nation/story-palette-d-etats-reservee-aux-etats-et-une-seule-couleur-non-plan.md`
  summary: Boutons de la page Contacts et « Pas un contact » (orange) : relever, en lecture seule, leurs classes et leur page, puis les passer au style standard ou primaire (DESIGN.md › Palette d'états : actions ordinaires).
  evidence: Ni fixture ni classe de page pour les viser. Depuis le ticket 3.5, s'ils portent `.btn-warning`, `.btn-success`, `.btn-danger` ou `.btn-info`, ils prennent les règles communes des boutons d'état (ou la paire d'action pour `.btn-info`), sans vérification.

- source_plan: `epic-palette-nation/story-refactor-sweep-plan.md`
  summary: Le contrôle « croix de fermeture, opacité 1 » de `modale-ordre.mjs` (fragment variantes) peut mesurer la croix pendant le fondu d'ouverture de la modale et échouer (opacité effective 0.937, confederation-libre, 1280 px).
  evidence: 1 FAIL au premier `test:all` du 2026-10-23 (ticket 3.8, aucun CSS changé), suite seule verte 3 fois sur 3 puis `test:all` vert (6005 ok) ; attendre la fin de la transition `.fade` avant la mesure réglerait le test.
  status: traité par `epic-modale-ordre/story-refactor-sweep-plan.md` (2026-10-24) : `CROIX` attend la fin des transitions de la croix et de ses ancêtres ; suite verte 3 fois sur 3.
- source_plan: `epic-modale-ordre/story-valider-en-couleur-de-nation-sur-mobile-et-onglet-actif-lisi-plan.md`
  summary: Règles mobiles contradictoires des modales Bootbox (`flex: 2 !important` sur `.btn-primary` ~l.7697, `flex: 1 !important` ~l.7034, pied en colonne ~l.1995, onglet actif bg-elevated ~l.7224) restent en place, battues par la section 9h pour la modale d'ordre.
  evidence: Revue quick du ticket 2.6 ; à retirer ou réconcilier au nettoyage de l'épopée 2 (2.7).
  status: non repris par 2.7 (retrait sans effet hors ordre non démontré) ; reporté à l'épopée 4, qui reprend « Valider » (taille normale) et les boutons des modales (rétro épopée 2, A2, 2026-10-24) ; traité par `epic-typographie-formes/story-modales-bootbox-mobiles-valider-de-taille-normale-et-regles-plan.md` (2026-10-24) : `flex: 1`, `flex: 2`, tailles 16 px / 50-56 px retirés, pied en colonne porté par la seule section 9h élargie à toute Bootbox ; onglet actif bg-elevated gardé, avec sa raison (modales à onglets hors ordre).

## Deferred from: ticket 4.8, trois rayons (2026-10-24)

- source_plan: `epic-typographie-formes/story-trois-rayons-4-px-8-px-et-plein-plan.md`
  summary: Éditeur du kramail sous des médias hors convention, `@media (min-width: 769px)` (~l.10098-10271) et `@media (max-width: 768px)` (~l.10287-10589) ; à 768 px, les règles mobiles du formulaire s'appliquent sur ordinateur. Mêmes médias à ~l.1704, ~l.1982 et ~l.11931.
  evidence: Signalés seulement (Never du ticket 4.8) ; rayons réécrits au jeton sans toucher aux médias. Pour l'entrée 10 : passer en `max-width: 767px` / `min-width: 768px`, puis tester 767, 768 et 769 px.
- source_plan: `epic-typographie-formes/story-trois-rayons-4-px-8-px-et-plein-plan.md`
  summary: Doublons réécrits au jeton sans retrait (A13) : Bootbox ordinateur (~l.1191-2036 du plan) contre Bootbox mobile (~l.6856-7659 du plan) ; cartes de ligne du forum, 1re version (~l.7848) et 2e version (~l.8542) ; `.modal` l.1287 battu par l.7319 ; bouton l.5500 battu par l.4085 (lignes du plan).
  evidence: Retirer un doublon peut révéler un défaut natif ; hors objet du ticket 4.8 (Ask First). Pour l'entrée 10 : retrait un par un, rendu vérifié après chaque retrait.
- source_plan: `epic-typographie-formes/story-trois-rayons-4-px-8-px-et-plein-plan.md`
  summary: `.kramail-character-dropdown` porte son rayon deux fois : `style.cssText` du template (~l.5793, `border-radius: var(--kr-radius-md)`) et `kraland-theme.css` ~l.9474 (`border-radius: var(--kr-radius-md) !important`), qui bat le style en ligne.
  evidence: Les deux déclarations réécrites au même jeton (8 px mesuré, fragment `rayons`, cas `accordeon` › `menu-personnage`). Pour l'entrée 10 : garder une seule source, de préférence la feuille.

## Deferred from: ticket 4.9, grille d'espacement au pas de 4 px (2026-10-24)

- source_plan: `epic-typographie-formes/story-grille-d-espacement-au-pas-de-4-px-plan.md`
  summary: 21 déclarations d'espacement hors du pas de 4 px, laissées telles quelles (A9 ; annexe d'inventaire, section 5, lignes du plan) : l.599-600 `(min-width: 3840px)` `#player-actions-section .btn` (14 px) ; l.769 `html.kr-page-report … td:first-child` (`padding-left: 10px`) ; l.1625-1626 menu BBCode des modales (`4px 6px`, `margin: 2px`) ; l.4312 `.panel-heading` mobile (`10px 15px`, toujours battue, A12) ; l.4508 `.panel-body:has([id^="c"])` (10 px) ; l.4646 `.btn-xs` mobile (`6px 12px`) ; l.4654 `.form-control` mobile (`10px 12px`, battue par l.9885) ; l.6852 `.panel-group .panel-body` (`10px 0`) ; l.7034 `.modal-body table th` (`10px 8px`) ; l.8011 et l.8695 cellules du forum mobile (`padding-top: 3px`) ; l.9441 `#topics_wrapper .btn-group .btn` du kramail (10 px) ; l.10476-10477 menu BBCode du kramail sous `(max-width: 768px)` (`4px 6px`, `margin: 2px`) ; l.13107 et l.13241 `.kr-icon-cell.btn` (`4px 2px`) ; l.15615 `.kr-tools-plus` sous `(max-width: 359px)` (`0 6px`) ; l.14109 et l.14114 flèches de tri `::after` (`margin-left: 6px`).
  evidence: Aucune n'avait de cas mesuré gagnant sur les fixtures à l'inventaire (battue, page, largeur, tactile ou menu fermé absents des fixtures) ; les réécrire sans cas mesuré violait la règle « chaque élément a un cas mesuré ». Exception constatée à l'implémentation : l.4508 gagne sur la fixture `typographie-echelle.html` (mobile, corps de panneau qui contient `#champ-essai`, 10 px dans la base comme après) ; laissée telle quelle (hors des 13 déclarations du plan) et gardée égale à la base par le fragment `espacement` (cas `corps-champ`). Pour l'entrée 10 : fixture ou émulation pour chaque ligne (page `/report` exclue : jamais chargée), puis réécriture au jeton avec rouge/vert.

## Deferred from: ticket 4.10, nettoyage de fin d'épopée (2026-10-24)

- source_plan: `epic-typographie-formes/story-refactor-sweep-plan.md`
  summary: `.form-control { height: 44px !important; }` (`kraland-theme.css` l.4674, `@media (max-width: 767px)`) est une candidate morte. Elle est gardée (R4 ne retire que `padding` et `font-size`) et sortie du sweep.
  evidence: Contre-épreuve sans FAIL (bundle sans la déclaration, fragment `nettoyage`). Sonde CDP `CSS.getMatchedStylesForNode` sur toutes les pages du fragment à 375 et 767 px : chaque `input`/`select.form-control` garde 44 px. Raison : hauteur native de Bootstrap `34px`, battue par `.form-control { min-height: var(--mobile-touch-target) !important }` (l.9653, même média ; `--mobile-touch-target: 44px` défini sur `:root` seulement, l.129). Seul cas où la déclaration déciderait : un `.form-control` à hauteur propre au-dessus de 44 px, ramené à 44 (`input-lg` de Bootstrap à 46 px, `height` en ligne). Aucun dans les fixtures (37 `class="form-control"` nus), ni dans le template et la feuille. Pour la suite : vérifier sur le site réel (lecture seule) l'absence d'`input-lg` et de hauteur en ligne, puis retirer avec rouge/vert ; sinon, ajouter le cas réel à une fixture.

## Défauts d'initialisation relevés par la fiabilisation du fragment `nettoyage` (2026-10-24)

Relevés en test (A10 de la rétro de l'épopée 4), non corrigés : le template était hors périmètre.
- `initCharacterModalMobile` est appelé deux fois : `.kr-tabs-indicator` en double, deux passes d'`enhanceCharacterModal`.
- La place du bouton palette (`insertToggleCSSButton`) dépend de l'avancée de l'analyse HTML : `navRight` ou `.navbar-header-buttons-left`.
- `insertChangelogButton` et le `setTimeout` de 150 ms de la modale d'ordre mobile tournent hors `InitQueue` : `data-kr-ready` ne les attend pas.
- `.kr-mobile-overlay` est ajouté en fin de `body` pendant l'analyse HTML, à un rang variable parmi les enfants de `body`.
- Le fragment `nettoyage` injecte maintenant le bundle à un point fixe (fin de `body`) ; les autres fragments qui comparent des chemins DOM restent exposés à ce timing.
