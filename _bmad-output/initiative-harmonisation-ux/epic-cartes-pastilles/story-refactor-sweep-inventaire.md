# Inventaire du ticket 5.6 : refactor sweep

Base : `ca73215ae5591aa018457916cfce887df274d01e` (feature/next), `kraland-theme.css` 15454 lignes, 3292 lignes avec `!important`. Relevés en lecture seule, sans site réel ni `/report`.

## 1. Reports de deferred-work.md visant l'épopée

| # | Entrée (origine) | Lieu (base `ca73215`) | Statut | Raison |
|---|------------------|------------------------|--------|--------|
| D1 | Chevron « Fonctionnaires » du Cybermonde dans le `h3`, ~222 px du bord (revue 5.1) | deferred-work.md l.74 | rejetée | Changement de rendu (place du chevron), identique à la base. Hors sweep. |
| D2 | Repli du module « Panel Sections Collapse » sans transition (revue 5.1) | deferred-work.md l.75 | rejetée | Changement de rendu (animation). Hors sweep. |
| D3 | 2e version A13 gardée pour Staff (5.2) | deferred-work.md l.79-80 | rejetée | La retirer change le rendu de Staff (`/forum/staff`), qui relève d'un autre ticket. |
| D4 | Chevron de Staff 10×14, croix d'alerte qui sort de 5 px (5.2) | deferred-work.md l.82-83 | rejetée | Changement de rendu ; à traiter avec l'alignement de Staff ou l'épopée 9. |
| D5 | Coins de la racine en sombre (5.2) | deferred-work.md l.85-86 | rejetée | Changement visible ; option non tranchée. |
| D6 | Accordéon ou modale `.panel-default` sur `/forum/*` (revue 5.2) | deferred-work.md l.91 | rejetée | Pas de fixture : demande le site réel, interdit ici. |
| D7 | Bascule 767 ↔ 768 du forum non couverte (revue 5.2) | deferred-work.md l.92 | rejetée | Ajout de couverture, pas un nettoyage. Le forum recharge au seuil (`sous-forum.mjs` ~l.915-925). |
| D8 | Pages `/forum/*` hors fixtures (revue 5.2) | deferred-work.md l.93 | rejetée | Demande une capture ou le site réel. |
| D9 | Boutons de groupe à 28 px (5.3) | deferred-work.md l.97-98 | rejetée | Cibles tactiles : épopée 9, hors périmètre. |
| D10 | Padding de l'accordéon sans transition (5.3) | deferred-work.md l.100-101 | rejetée | Changement de rendu (animation), comme D2. |
| D11 | A5 : `--kr-badge-danger-border` non lu ; sort de `--kr-badge-danger` (5.4) | `kraland-theme.css` l.76 ; l.75 lu l.10577 | traitée (T2) | `--kr-badge-danger-border` retiré (aucun `var(`). `--kr-badge-danger` gardé : encore lu par `.kd-field.is-invalid` (l.10577) ; le renommer serait cosmétique, changer sa valeur changerait le rendu. |
| D12 | Bureau compact 768-991 : cloche et enveloppe cachées menu fermé (5.4) | deferred-work.md l.109-110 | rejetée : décision d'Arnaud en attente | Question de produit (montrer un non-lu menu fermé). |
| D13 | `--kr-badge-pnj` non lu (5.5) | `kraland-theme.css` l.77 | traitée (T2) | Retiré (aucun `var(`). |
| D14 | `span.tagforum` hors famille des étiquettes (5.5, A4) | deferred-work.md l.118-119 | rejetée : décision d'Arnaud en attente | Choix de famille. |
| D15 | Marque PNJ mobile en 14 px / 46 px (5.5) | deferred-work.md l.121-122 | rejetée : décision d'Arnaud en attente | Changement de taille, question de produit. |

Déjà traités par l'épopée, rien à faire : `.panel-heading` `10px 15px` l.4312 (A12, gardée par 5.1, gagne sur les panneaux d'état) ; A13 cartes de ligne (5.2, 17 déclarations retirées).

Hors épopée (non listés ci-dessus, non traités) : kramail 1.x, list-group 3.1, alerte info, Contacts 3.5, croix, Bootbox 2.x, 4.8, 4.9 H, `.form-control` 4.10, défauts d'initialisation du fragment `nettoyage`.

## 2. Jetons de `:root`

Scan des 135 propriétés personnalisées déclarées dans `:root` de `kraland-theme.css` : une propriété est morte si aucun `var(--nom` n'apparaît dans `kraland-theme.css` ni dans `kraland-userscript-template.js` (script §5). 16 mortes.

| Jeton | Ligne | Statut | Raison |
|-------|-------|--------|--------|
| `--kr-badge-danger-border` | 76 | retiré (T2) | Report 5.4 A5. Aucun lecteur, ni en CSS, ni en JS, ni dans les tests, ni dans DESIGN.md. |
| `--kr-badge-pnj` | 77 | retiré (T2) | Report 5.5. Même relevé. |
| `--kr-badge-danger` | 75 | gardé | Lu l.10577 : `body.page-kramail-compose form[name="post_msg"] .kd-field.is-invalid { border-color: var(--kr-badge-danger, #dc3545); }`. `is-invalid` posé par le template (l.6571, l.7024). |
| `--kr-font-page-title` | 29 | rejeté : décision d'Arnaud en attente | Rétro 4 A5. Bug 10 de revue-manuelle.md : DESIGN.md les déclare, `typographie-formes.mjs` les vérifie ; « Les retirer : ta décision ». |
| `--kr-space-5` | 38 | idem | idem |
| `--kr-space-6` | 39 | idem | idem ; cité aussi par `router.test.mjs`. |
| `--kr-margin-mobile` | 40 | idem | idem |
| `--kr-touch-target-dpad` | 43 | idem | idem |
| `--kr-gold` | 11 | rejeté | Hors épopée (palette nation). |
| `--kr-bootstrap-blue` | 78 | rejeté | Hors épopée. |
| `--mobile-tab-bar-height` | 128 | rejeté | Hors épopée (navigation mobile). |
| `--mobile-spacing-xl` | 136 | rejeté | Hors épopée (grille d'espacement, épopée 4). |
| `--z-tab-bar`, `--z-bottom-sheet`, `--z-drawer` | 140-142 | rejeté | Hors épopée (couches). |
| `--transition-slow` | 147 | rejeté | Hors épopée. |
| `--kr-overlay-light-20` | 159 | rejeté | Hors épopée. |

Relevé avant (base `ca73215`) :
- `grep -n -- '--kr-badge-danger-border\|--kr-badge-pnj' kraland-theme.css kraland-userscript-template.js` : `kraland-theme.css:76` et `:77` seulement (déclarations, aucun `var(`).
- `grep -c 'kr-badge-pnj\|kr-badge-danger-border' kraland-userscript-main.user.js` : 1 (ligne du CSS minifié `--kr-badge-danger:#dc3545;--kr-badge-danger-border:#bd2130;--kr-badge-pnj:#d9534f;`).
- `grep -rn 'kr-badge-pnj\|kr-badge-danger-border' tests _bmad-output/initiative-harmonisation-ux/ux-harmonisation` : aucun résultat dans les tests ni dans DESIGN.md (seulement les plans et deferred-work.md).
- `grep -n -- '--kr-badge-danger\b' kraland-theme.css` : l.75 (déclaration), l.76 (faux positif de `\b` sur `-border`), l.10577 (lecture).
- `grep -c '!important' kraland-theme.css` : 3292.

Littéraux `#d9534f` du template (non concernés par le retrait) : l.4351 (barre de PV des cartes) et l.8010 (changelog).

## 3. Masques miroirs et détecteurs de l'épopée

Valeur des détecteurs sur les bundles (script §5) :
- `ca73215` (= HEAD = origin/feature/next) et arbre de travail : tous « après ».
- `59567f0` : seul `AVANT_TICKET55` « avant ».
- `601ab19` : 54, 55 « avant ».
- `a7f0463` : 53, 54, 55 « avant ».
- `21fed8d` : 52 à 55 « avant ».
- `458dc03`, `00b0786`, `62fd47d`, `d68ab55`, `81512a3`, `6685df5` (et les bases plus anciennes de l'épopée 4) : tous « avant ».

| Masque / détecteur | Consommateur | Base du consommateur | Statut | Raison |
|--------------------|--------------|----------------------|--------|--------|
| `CARTES_TICKET51` / `AVANT_TICKET51` | `cybermonde-carte.mjs` l.41, 99, 101, 352-355, 358-359 | `origin/feature/next` (contient 5.1) | retiré (T3) | Condition de retrait remplie : `AVANT_TICKET51(avant)` vaut `false`, rien n'est posé. Inverse exact des hunks de `21fed8d`. |
| idem | `kramail-redaction.mjs` l.29, 238-240, 1298, 1312 | `origin/feature/next` | retiré (T4) | Même condition remplie. Inverse exact des hunks de `21fed8d`. |
| idem | `forum-index.mjs` l.94, l.738 | `81512a3` | gardé | Base avant 5.1 : écart réel. |
| idem | `palette-nation.mjs` l.194-196 | `6685df5` (BASELINE4) | gardé | idem |
| idem | `typographie-formes.mjs` `nettoyage` l.1871-1879 | `00b0786` | gardé | idem |
| `CARTES_TICKET52` / `AVANT_TICKET52` | `forum-index`, `palette-nation`, `typographie-formes` `nettoyage` | idem | gardé | Bases avant 5.2. |
| `CARTES_TICKET53` / `AVANT_TICKET53` | `typographie-formes` `espacement` l.1588-1590 (`62fd47d`), `nettoyage` | idem | gardé | Bases avant 5.3. |
| `CARTES_TICKET54` / `AVANT_TICKET54` | `typographie-formes` couleurs l.316-321 (`d68ab55`) ; `cartes-pastilles` l.1501 | idem | gardé | Base avant 5.4 ; l.1501 est un garde-fou (`AVANT_TICKET54(userscript) === false`). |
| `CARTES_TICKET55` / `AVANT_TICKET55` | `typographie-formes` l.318-321, l.1879 ; `cartes-pastilles` l.1502-1503 | idem | gardé | idem. |
| `sansPnj55` | `cartes-pastilles.mjs` l.1062-1065 | `COMMIT_AVANT_53` = `a7f0463` | gardé | Base avant 5.5 ; condition écrite l.1064. |
| `sansPosition55` | `cartes-pastilles.mjs` l.1453-1454 | `COMMIT_AVANT_55` = `59567f0` | gardé, condition ajoutée (T5) | Base avant 5.5, mais aucune condition de retrait écrite. |
| Masques des épopées 3 et 4 de `kramail-redaction.mjs` (`JETONS_AVANT` … `ESPACEMENT_AVANT`) | l.220-237 | `origin/feature/next` | rejeté | Inertes aussi, mais hors épopée ; rétro 4 A6 les éteint « après fusion », et `origin/main` (`d5b38e5`) ne contient pas les épopées (160 commits d'avance). |
| Base auto-référente de `kramail-redaction` (rétro 4 F6/A6) | `bundleAvant()` | `origin/feature/next` | rejeté | Même condition (fusion) non remplie ; hors épopée. |

Repères (pas des masques, gardés) : `ETIQUETTES_TICKET55`, `PASTILLES_TICKET54`, `GROUPES_TICKET53`, `REGLES_*_TICKET5x`, `PANNEAU_TICKET51`. `variantes.mjs` n'est pas modifié : `CARTES_TICKET51` et `AVANT_TICKET51` gardent trois consommateurs.

Les hunks de `21fed8d` sur ces deux suites ne touchent que les lignes listées : `git diff 458dc03 21fed8d -- tests/e2e/cybermonde-carte.mjs tests/e2e/kramail-redaction.mjs` en donne la liste ; après T3 et T4, `git diff 458dc03 -- <suite>` doit être vide pour chacune.

## 4. Autres reports relevés (hors deferred-work.md)

| # | Report | Lieu | Statut | Raison |
|---|--------|------|--------|--------|
| O1 | Fond de page teinté en clair (5.1/5.2) | revue-manuelle.md | rejeté : décision d'Arnaud en attente | Question de produit. |
| O2 | « À regarder sur capture » : `#topics_wrapper` 6 px et pagination 320 px (5.2), statuts longs (5.3), lisibilité des pastilles et étiquettes (5.4/5.5) | revue-manuelle.md | rejeté : décision d'Arnaud en attente | Vérification visuelle par Arnaud. |
| O3 | Barres de PV des cartes de personnages, couleurs en dur (`#5cb85c`, `#f0ad4e`, `#d9534f`) | template l.4345-4352 ; renvoi de `palette-nation.mjs` l.73-74 à « l'épopée 5 » | rejeté | Absent de deferred-work.md et des tickets 5.x ; passer aux jetons d'état change le rendu. À signaler à Arnaud. |
| O4 | `after` des épopées 6 et 7 dans `tickets.toml` de l'initiative (« carte de section mobile » au lieu de 5.2 ; « carte de section (5.1) ») | tickets.toml de l'initiative | rejeté | Hors code ; se corrige par `bmad-ticket`, pas par le sweep. |

## 5. Scripts de relevé (hors dépôt, `/tmp/sweep56/`)

- `morts.mjs` : lit `kraland-theme.css`, extrait les `--nom:` du premier bloc `:root`, cherche `var(--nom` dans `kraland-theme.css` et `kraland-userscript-template.js`, affiche les noms sans lecteur avec leur ligne.
- `det.mjs` : importe `tests/e2e/lib/variantes.mjs`, lit `git show <ref>:kraland-userscript-main.user.js` pour chaque ref, affiche la valeur de `AVANT_TICKET51` à `AVANT_TICKET55`.

Ils ne sont pas à reprendre tels quels : les commandes `grep` du plan suffisent à la preuve.
