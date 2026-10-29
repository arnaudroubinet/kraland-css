---
title: 'La rédaction du kramail reprend le formulaire de réponse du forum'
type: 'feature'
ticket: '5'
created: '2026-10-29'
status: 'built'
baseline_revision: '2e65328d124d642e65d12c7cfb808cee6ed84d66'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les cinq formulaires `post_msg` du kramail (Nouveau, Répondre, Répondre à tous, Transférer, Signaler) ont leur propre peau : carte au bureau, libellés en majuscules, barre de 18 outils à 24 px (bureau) ou 40 px (mobile), menu BBCode hors pas (4px 6px / 2px), boîte « Options ». Le formulaire de réponse du forum a une autre forme (Messages:V3 sur mobile : `form.kr-editor`, `kr-sender-row`, `kr-message-row`, 5 outils + « Plus »). Signaler est classé lecture et déborde à 375 px (scrollWidth 390, `#accordion`).

**Approach:** Messages:V3 cesse d'exclure le kramail : il habille aussi les rédactions du kramail (Sujet et Expéditeur en `kr-sender-row`). Les règles V3 de l'éditeur visent aussi `page-kramail-compose`. Les anciennes règles kramail du formulaire et de la barre sont retirées (P1 option 4). Signaler devient une rédaction (`kr-page-kramail-compose`).

## Boundaries & Constraints

**Always:** P1 option 4 ; aucun nouvel `!important` (total ≤ 3154, base 2e65328) ; gardes `:where(html.x)` ; mobile `max-width: 767px`, bureau `min-width: 768px` ; cibles ≥ 44 px ; Destinataires inchangé (ajout, doublon, suppression d'une pastille) ; rendu du forum inchangé ; fixtures synthétiques, dérivées en mémoire.

**Never:** palette `--kd-*` (entrée 6) ; « Envoyer » dans le flux, barre fixe et réserve basse du formulaire (entrée 7) ; règle de taille ou de retrait de champ au bureau (bug 14, retour au natif) ; bundle édité ; site réel ; écriture git.

**Décisions (autonome, doutes dans revue-manuelle.md, « Ticket 7.5 ») :**
- A1 Signaler (`-8-`) avec un formulaire `post_msg` = rédaction (relevé du 2026-10-28 : formulaire complet).
- A2 Sur le kramail, toute ligne `.form-group > .col-sm-10 > .input-group` (Sujet, Expéditeur) est une `kr-sender-row` ; le repérage du forum est inchangé.
- A3 Référence : fixture `typographie-forum-redaction` servie au forum, avec la barre de 18 outils du kramail. Sujet et Expéditeur comparés à l'Expéditeur du forum.
- A4 Exclus de la comparaison : « Envoyer », réserve basse du formulaire (entrée 7), ligne Destinataires (entrée 6), titre h1.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mobile | 4 rédactions + Signaler, 375 et 767 | classes V3 ; valeurs calculées du formulaire du forum (lignes, libellés, champs, barre, 5 outils, « Plus », extras masqués, zone de texte, options) | — |
| Bureau | 768, 769, 1280, 1440 | aucune classe V3 visible en effet ; valeurs du forum ; aucune règle mobile à 768 | — |
| Bascule | 767 → 768 → 767 dans le même onglet | valeurs du forum à chaque largeur | — |
| Signaler | `-8-`, 375 | garde compose, pas de débordement horizontal | — |
| Destinataires | ajout, doublon, suppression | pastilles et `#dest` comme avant | — |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` l.821-845 `addPageTypeClass` -- retirer l'exclusion de Signaler.
- `kraland-userscript-template.js` l.7163-7262 Messages:V3 -- `isMessagesView` étendu à `html.kr-page-kramail-compose` ; repérage des lignes Sujet/Expéditeur au kramail ; commentaire d'en-tête.
- `kraland-userscript-template.js` `Kramail:Lecture` l.6234 -- son test Signaler devient inutile (garde lecture) : laisser.
- `kraland-theme.css` l.9821-10522 « KRAMAIL - FORMULAIRE NOUVEAU MESSAGE » -- retirer les règles du formulaire (carte, libellés, addons, barre, menus, cases, options, réserve) ; garder titre h1, sélecteur de personnage, `hr`/`#results`, « + » des contacts (repli de Destinataires).
- `kraland-theme.css` l.10523-11533 -- retirer les règles de barre (universel, bureau, mobile) ; garder `--kd-*`, `.kd-natif-cache`, `.kd-*`, `.panel-group` ; libellé 13 px limité à `.kd-label`.
- `kraland-theme.css` l.13700-13740 (cases, réserve, `scroll-margin` du forum) et l.15800-16000 (V3 éditeur) -- sélecteurs étendus à `page-kramail-compose` par `:is()` de même spécificité, sauf « Envoyer » dans le flux et sa réserve.
- `kraland-theme.css` l.7092 -- marge de page du formulaire du forum étendue à la rédaction du kramail.
- `tests/e2e/kramail-theme.mjs` -- Signaler en compose ; nouveaux fragments `redaction` (valeurs du forum) et `redaction-dest` ; en-tête ; `tests/e2e/lib/router.mjs`.
- `tests/e2e/kramail-redaction.mjs` `barre` et suites sœurs -- contrôles réécrits ou masques `AVANT_TICKET75` conditionnés à la base.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/kramail-theme.mjs` -- fragments `redaction`, `redaction-dest`, gardes Signaler -- rouges sur 2e65328.
- [x] `kraland-userscript-template.js` -- classification et Messages:V3.
- [x] `kraland-theme.css` -- retraits et sélecteurs étendus.
- [x] `tests/e2e/lib/router.mjs` -- fragments enregistrés.
- [x] Suites sœurs -- contrôles réécrits ou masques.

**Acceptance Criteria:**
- Given une rédaction du kramail, when la page s'affiche aux 6 largeurs, then la matrice est vérifiée par `kramail-theme#redaction`.
- Given le bundle de base, when `KR_SCRIPT=/tmp/kr75/base.user.js`, then `redaction` est rouge ; une mutation de chaque nouveau contrôle le rend rouge.
- Given la feuille, when on compte `!important`, then le total est ≤ 3154.

## Implementation Notes

- Messages:V3 : `isMessagesView` et `enhanceEditors` couvrent `kr-page-kramail-compose` ; au kramail, toute `.form-group > .col-sm-10 > .input-group` devient `kr-sender-row` (A2). Signaler n'est plus exclu de la rédaction (A1).
- Feuille : règles kramail du formulaire et de la barre retirées (P1 option 4) ; sélecteurs V3 en `:is(.page-forum, .page-kramail-compose)` ; marge de page sur le formulaire ; `.kd-label` sans font-size (libellé Destinataires à 14 px natif). Aucune règle de taille ou de retrait de champ au bureau (bug 14). `!important` : 2957.
- Masques conditionnés à la base (`AVANT_TICKET75`, `RETIRER_REDACTION_TICKET75`), retrait au recalage de COMMIT_* : typographie-formes (boutons, echelle-forum, rayons, espacement, nettoyage) et cartes-pastilles (focusBase).

## Plan Change Log

- 2026-10-29, revue indépendante : le « Never » sur la réserve basse prime sur la Code Map (l.13700-13740). La réserve reste au forum ; seul `scroll-margin-bottom` est étendu. Le libellé Destinataires (entrée 6) garde sa ligne hors comparaison, mais sa typographie est comparée. Le forum change volontairement pour l'anneau de focus des outils.

## Review Triage Log

| # | Lens | Finding | Verdict | Evidence | Route |
|---|------|---------|---------|----------|-------|
| 1 | quick | `form[name="post_msg"] { padding-bottom: 64px }` étendu au kramail, contre le « Never » (réserve basse, entrée 7) | medium | La base ne donnait aucune réserve effective au kramail (`.form-group:last-of-type` ne vise rien) ; le test l'excluait (`HORS_REDACTION.form`). | patch : règle rendue au seul forum ; `scroll-margin-bottom` gardé (barre fixe présente au kramail), noté en doute |
| 2 | quick | Commentaire du libellé « DESTINATAIRES » périmé (13 px, majuscules) | low | Le diff retire le font-size et les majuscules ; le commentaire décrivait l'ancien état. | patch : commentaire mis à jour |
| 3 | revue indépendante | Libellé Destinataires mobile en 14 px, majuscules, `--kr-text`, contre 13 px, casse normale, `--kr-text-secondary` pour les libellés V3 | medium | Règle mobile générale `.form-group label` ; mesuré par la paire `dest.label=exp.label`. | patch : typographie V3 sur `.kd-label` mobile ; paire ajoutée à kramail-theme#redaction |
| 4 | revue indépendante | `RETIRER_REDACTION_TICKET75` retire tout le formulaire, donc Destinataires et « Envoyer » ne sont plus comparés à la base | medium | Vrai : `form[name="post_msg"]` retiré en entier. | patch : seules les lignes Sujet, Expéditeur, Message et options sont retirées ; cadre, marge de la ligne, libellé et réserve de défilement neutralisés des deux côtés |
| 5 | revue indépendante | Anneau de focus clavier des outils masqué sur mobile (forum et kramail) | medium | `.btn-toolbar .btn:focus-visible { outline: none }` mobile ; mesuré : `outline-style: none` sur la base. | patch : règle commune `form.kr-editor .btn-toolbar .btn:focus-visible` ; fragment redaction-focus |
| 6 | revue indépendante | Garde morte « formulaire post_msg » dans Kramail:Lecture | low | Une page avec ce formulaire est classée compose ; la garde lecture la précède. | patch : garde supprimée |
| 7 | revue indépendante | `scroll-margin-bottom` du kramail sans contrôle | medium | Aucun test ne le mesurait. | patch : fragment redaction-defilement, rouge sur la base |
| 8 | revue indépendante | Bascule 767/768/767 sur Répondre seulement | low | Matrice : « Bascule » sans restriction de page. | patch : bascule sur les 5 rédactions |
| 9 | revue indépendante | Marqueur `AVANT_TICKET75` fragile (chaîne CSS minifiée) | low | Dépend de la minification du CSS. | patch : marqueur `:scope > .col-sm-10 > .input-group` (JS Messages:V3, propre à l'entrée) |

## Verification

**Commands:**
- `npm run build` -- validation verte.
- `npm run test:zone -- kramail`, puis forum, typographie-formes, cartes-pastilles, confort-mobile, forum-activite, messages -- verts ou FAIL attribués.
- `KR_SCRIPT=/tmp/kr75/base.user.js KR_FRAG=redaction,redaction-dest,gardes node tests/e2e/kramail-theme.mjs` -- rouge.
- `npm run lint:css`, `npm run lint:js`, `npm run test:unit`, `npm run test:router` -- verts ; `diff -r .hermes/skills .claude/skills` vide.

## Result

- Les cinq rédactions du kramail, Signaler compris, prennent le formulaire de réponse du forum : Messages:V3 sur mobile, natif au bureau. Les anciennes règles kramail du formulaire et de la barre sont retirées. `!important` : 2957 (base 3154).
- Correctifs de la revue indépendante :
  - le libellé Destinataires mobile prend la typographie V3 ;
  - l'anneau de focus clavier des outils est commun au forum et au kramail ;
  - la garde morte de Kramail:Lecture est supprimée ;
  - un contrôle du défilement hors de la barre « Envoyer » est ajouté ;
  - la bascule est vérifiée sur les 5 rédactions ;
  - le marqueur de base est stable ;
  - le masque du nettoyage est réduit aux lignes V3.
- Rouge sur la base (`KR_SCRIPT=/tmp/kr75/base.user.js`, fragments gardes, redaction, redaction-focus, redaction-defilement et redaction-dest de kramail-theme) : 46 ok, 75 échecs. Sur la base, Signaler est une lecture sans barre fixe : ses 2 contrôles de défilement y passent. kramail-redaction (barre, reponses-repondre, libelle) : 69 ok, 20 échecs.
- Contre-épreuves, toutes rouges :
  - css-dest-label : redaction, 20 échecs ;
  - css-focus : redaction-focus, 16 échecs ;
  - css-scroll : redaction-defilement, 10 échecs ;
  - css-kd : nettoyage, 26 échecs, ce qui montre que `.kd` reste comparé à la base ;
  - avant la revue : 14 mutations, déjà rouges.
- Vert : kramail 935, forum 639, typographie-formes 4342, cartes-pastilles 2302, confort-mobile 912, forum-activite 1385, messages 235, 0 FAIL partout. lint:css, lint:js, test:unit et test:router sont à 0. Le diff des skills est vide.
- Après fusion de feature/next (2356a54, bug 14), 2 régressions corrigées :
  - l'astérisque des champs obligatoires du kramail reprend `--kr-text-accent` sur les deux supports (règle universelle sous `:where(html.kr-page-kramail-compose)`). Rouge sur 2356a54 : textes-bureau et textes-largeurs de palette-nation, 24 FAIL ; vert ensuite, textes-mobile compris ;
  - typographie-formes#champs : masque conditionné à `AVANT_TICKET75(avantChamps)`, limité au kramail sur mobile (Sujet, Expéditeur, Message), retrait au recalage de COMMIT_CHAMPS. 4 FAIL avant, vert après.
- Vert après correctifs : palette-nation 1372, typographie-formes 4453, kramail 935, 0 FAIL. lint:css, lint:js et test:router à 0.
- Doutes : `revue-manuelle.md`, section « Ticket 7.5 ».

Clôture (orchestrateur, 2026-10-29) : revue indépendante faite, correctifs appliqués, commité (5f679de, fb8ee5c ; 2356a54 fusionne `feature/next` dans la branche) et fusionné sur `feature/next` (0b27dc2) ; `test:all` vert contenant l'épopée : 18074 ok, 0 FAIL, sur `d8c8777` (SHA déduit de l'heure du journal).
