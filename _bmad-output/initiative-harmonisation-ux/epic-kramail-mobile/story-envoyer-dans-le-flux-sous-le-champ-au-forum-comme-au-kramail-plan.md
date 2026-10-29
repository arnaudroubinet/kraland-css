---
title: '« Envoyer » dans le flux sous le champ, au forum comme au kramail'
type: 'feature'
ticket: '7'
created: '2026-10-29'
status: 'built'
baseline_revision: 'f48a01f9abf3811066978945d04730289745e489'
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

**Problem:** Sur mobile, la rédaction du kramail (et toute rédaction du forum sans barre d'outils) garde la barre « Envoyer » fixe de 56 px pleine largeur, avec sa réserve basse, son pied de page remis dans le flux et « Remonter en haut » relevé à 64 px. Clavier ouvert, elle couvre le champ « Votre message » (P2, point E, 2026-10-23). Sur ordinateur, « Envoyer » du kramail a une forme propre (180 px de large, ombre, filet au-dessus).

**Approach:** La barre fixe et tout ce qui la compense sont retirés (P1 option 4). Sur mobile, une seule règle « Envoyer » dans le flux, sous le champ, alignée à droite, 48 px, paire `--kr-arm-bg` / `--kr-arm-ink`, rayon sm, `{typography.button}`, pour tout formulaire `post_msg` du forum et de la rédaction du kramail. Sur ordinateur, « Envoyer » du kramail redevient le bouton primaire natif du forum.

## Boundaries & Constraints

**Always:** aucun nouvel `!important` (total ≤ 2958) ; gardes `:where(html.x)` pour toute garde ajoutée ; mobile `max-width: 767px`, bureau `min-width: 768px` ; « Envoyer » 48 px sur mobile, cibles ≥ 44 px ; ≥ 4,5:1 dans les 16 variantes ; envoi bloqué par un destinataire non validé inchangé ; z-index 991 du backlog 12 inchangé (seul son commentaire change) ; fixtures seulement.

**Never:** menus en feuille et pied collant de la modale d'ordre (`.bootbox`, épopée modale-ordre) ; contacts (entrée 8) ; Destinataires (comportement) ; bundle édité ; site réel ; écriture git.

**Décisions (autonome, doutes dans revue-manuelle.md, « Ticket 7.7 ») :**
- C1 La règle dans le flux vise tout `form[name="post_msg"]` de `page-forum` et `page-kramail-compose`, barre d'outils ou non (`.kr-editor` n'est plus requis).
- C2 Taille du texte : `{typography.button}` (14 px, DESIGN.md › send-button), au lieu des 16 px actuels du forum.
- C3 Bureau : les règles « BOUTON ENVOYER — plus proéminent » du kramail (bouton et filet du conteneur) sont retirées.
- C4 Les menus en feuille de la modale d'ordre (`inset: auto 8px 60px`) relèvent de son pied collant, pas de la barre « Envoyer » : non touchés. Les décalages kramail à 60/64 px ont déjà disparu avec l'entrée 5.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mobile kramail | 5 rédactions, 375×667 et 767 | aucun `fixed`/`sticky` dans le formulaire ; « Envoyer » sous la zone de texte, à droite, 48 px, arm, 4 px, 14 px ; centre atteint après `scrollTo` | rouge sur f48a01f |
| Mobile forum | réponse dérivée, sujet + formulaire avec et sans barre d'outils, message ouvert | idem ; la barre du message ouvert ne couvre pas « Envoyer » ; voile 990 : actions au-dessus | rouge sur f48a01f (sans barre) |
| Bureau | kramail et réponse du forum, 1280 | « Envoyer » du kramail aux valeurs calculées de celui du forum | rouge sur f48a01f |
| Contraste | Nouveau et réponse du forum, 16 variantes, 375 | texte ≥ 4,5:1 | — |
| Blocage | texte tapé non validé, « Envoyer » | rien ne part, « Validez ou effacez » visible et atteignable | — |

</frozen-after-approval>

## Code Map

Lignes = f48a01f.

- `kraland-theme.css` l.9757-9786 (mobile, bloc l.9550) -- retirer la barre fixe, son `:active` et `.form-group:last-of-type { padding-bottom: 60px }`.
- `kraland-theme.css` l.10010-10041 (bureau) -- retirer les deux règles « 7. BOUTON ENVOYER » du kramail (C3).
- `kraland-theme.css` l.13089-13116 (mobile, bloc l.13021) -- retirer `scroll-margin-bottom: 72px`, `form[name="post_msg"] { padding-bottom: 64px }`, pied de page remis dans le flux et « Remonter en haut » à 64 px ; en-tête du bloc mis à jour.
- `kraland-theme.css` l.15143-15146 -- commentaire du 991 (plus de barre fixe).
- `kraland-theme.css` l.15316-15350 -- règle dans le flux étendue (C1, C2) : `:is(.page-forum, .page-kramail-compose)`, sans `.kr-editor` ; réserve de 16 px et « Remonter en haut » à 20 px étendus. L.14919 : commentaire d'en-tête.
- Template -- aucun changement (Kramail:Destinataires bloque par l'événement `invalid`, indépendant de la position du bouton).
- `tests/e2e/kramail-theme.mjs` -- nouveau fragment `envoyer` (matrice) ; en-tête ; `redaction-defilement` gardé.
- `tests/e2e/forum-activite.mjs` `envoyer` -- cas « sans barre d'outils » attendu dans le flux, 48 px, aucun fixe dans le formulaire.
- `tests/e2e/lib/router.mjs` -- fragment `envoyer` de kramail-theme.
- Suites sœurs qui attendent la barre fixe (jeu-identite `regles-ok`, kramail-redaction blocage en bas de page, forum-mobile, palette-nation, typographie-formes, messages-v3, confort-mobile, cartes-pastilles) -- contrôles réécrits si absolus, masques conditionnés à la base sinon.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/kramail-theme.mjs`, `tests/e2e/forum-activite.mjs` -- fragments `envoyer` -- rouges sur f48a01f.
- [x] `kraland-theme.css` -- retraits et règle étendue -- verts.
- [x] `tests/e2e/lib/router.mjs` -- fragment déclaré -- `test:router` vert.
- [x] Suites sœurs -- réécrites ou masquées.
- [x] Contre-épreuves par mutation du bundle.

**Acceptance Criteria:**
- Given `KR_SCRIPT=/tmp/kr77/base.user.js`, when `envoyer` (kramail-theme, forum-activite) tourne, then rouge ; une mutation de la nouvelle règle le rend rouge.
- Given la feuille, when `grep -o '!important' kraland-theme.css | wc -l`, then ≤ 2958.
- Given les zones palette-nation, kramail, forum, forum-activite, typographie-formes et les suites qui mesurent « Envoyer », then 0 FAIL.

## Implementation Notes

- CSS : barre fixe mobile (bloc 5), règles bureau « 7. BOUTON ENVOYER » du kramail, `scroll-margin-bottom: 72px`, réserve de 64 px du forum, pied de page remis dans le flux et « Remonter en haut » à 64 px retirés. Règle dans le flux étendue à `:is(.page-forum, .page-kramail-compose) form[name="post_msg"]` (sans `.kr-editor`), avec réserve de 16 px et « Remonter en haut » à 20 px.
- La taille de texte vient de la règle mobile commune des `.btn` (`--kr-font-button !important`) : l'ancienne exclusion à 16 px est partie avec la barre. Une déclaration `font-size` dans la règle serait morte (constaté par mutation).
- Le forum tenait son poids 600 et l'absence de bordure de la barre fixe (règle aussi appliquée au forum) : gardés dans la règle commune (`font-weight: 600; border: none`, sans `!important`).
- `!important` : 2958 → 2946.
- Tests : `kramail-theme#envoyer` (nouveau), `forum-activite#envoyer` (forme sans barre attendue dans le flux), `jeu-identite#regles-ok` (kramail : static, pied non relative, réserve 0, « Remonter en haut » 20 px). Masques à la base `AVANT_TICKET77` / `RETIRER_ENVOYER_TICKET77` (lib/variantes.mjs) dans typographie-formes (boutons, echelle-forum, nettoyage et bascule) et forum-activite#fil, avec « retrait au recalage de COMMIT_* ».
- Envoi bloqué : `kramail-redaction` (zone kramail, 335 ok) vert ; le blocage passe par l'événement `invalid`, indépendant de la position. 991 : `forum-activite#envoyer` (voile 990 : barre du message ouvert au-dessus) vert.

## Plan Change Log

## Review Triage Log

| # | Constat | Verdict | Route | Preuve |
|---|---|---|---|---|
| 1 | Pas de 768/769 ni de bascule 767↔768 pour « Envoyer » | low | patch (768) / rejet (bascule) | 768 ajouté à `kramail-theme#envoyer` (ordinateur, 88 ok). Bascule rejetée : la règle ne vit que sous `body.mobile-mode`, plus aucune barre fixe à défaire ; test de bascule = complexité ajoutée pour un défaut improbable. |
| 2 | Forme sans barre du forum peu contrôlée (sous le champ, à droite, arm, rayon, 14 px) | medium | patch | `forum-activite#envoyer` : contrôle de forme ajouté pour 'sans' et 'flux' ; base 12 échecs, m2 (police 16) 8 échecs, neuf vert. |
| 3 | redaction-defilement : libellés « hors de la barre « Envoyer » » périmés | low | patch | Libellés réécrits (« non couvert par « Envoyer » ») ; l'en-tête décrivait déjà le contrôle réel. |
| 4 | Neutre back-to-top de `RETIRER_ENVOYER_TICKET77` appliqué à toute page | low | patch | Conditionné à la présence de `form[name="post_msg"]`. |
| 5 | envoyer-mobile en exclus au lieu de vises (typographie-formes) | false | rejet | Le bouton garde une hauteur (48) et un padding (0 20px) propres : il reste une exclusion légitime de l'échelle commune. |
| 6 | Commentaires « bouton collant » dans kramail-redaction.mjs | low | patch | Commentaires l.1105-1107 réécrits (dans le flux depuis 7.7) ; les autres « collante » visent la barre de navigation. |
| 7 | Blocage prouvé seulement par kramail-redaction inchangé | false | rejet | Le contrôle « blocage depuis le bas de page » tape le vrai « Envoyer » à sa nouvelle place, puis vérifie qu'il ne part rien ; vert dans la zone kramail. |

Revue indépendante (« approuvable après correctifs », 7 constats mineurs) :

| # | Constat | Verdict | Route | Preuve |
|---|---|---|---|---|
| R1 | `nettoyage` : `RETIRER_ENVOYER_TICKET77` retire « Envoyer » et « Remonter en haut » à toutes les largeurs, forum sur ordinateur compris | low | patch | Le masque ne s'applique plus que si `innerWidth < 768` ou si le chemin est `/kramail/` (là où la base fixait ou restylait « Envoyer »). |
| R2 | `forum-activite#fil` : même condition de largeur | low | patch | Couvert par la même condition dans le masque partagé. |
| R3 | `forum-mobile#pied` : libellés « z-index 90 », « barre fixe de 56 px » faux | low | patch | Libellés réécrits : « Envoyer » dans le flux, « Remonter en haut » ne le chevauche pas. |
| R4 | `redaction-defilement` ne détecte que « Envoyer » comme recouvrement | medium | patch | Exige `vu === el || el.contains(vu)` ; contre-épreuve (voile fixe de 300 px en bas) rouge. |
| R5 | Pas de bascule 767 -> 768 -> 767 dans le même onglet | low | patch | Bascule Nouveau ajoutée au fragment `envoyer` ; base rouge (2 échecs), mutation 48 px au bureau rouge. |
| R6 | 60 px de `.bootbox` | false | rejet | Déjà consigné (C4, revue-manuelle). |
| R7 | En-tête de section CSS vide « 5. BOUTON ENVOYER… » | low | patch | Supprimé. |

## Verification

**Commands:**
- `npm run build` -- VALIDATION PASSED ; `!important` 2958 -> 2946.
- `KR_SCRIPT=/tmp/kr77/base.user.js KR_FRAG=envoyer node tests/e2e/kramail-theme.mjs` -- rouge (40 ok / 37 échecs) ; bundle neuf 88 ok / 0 (375, 767, 768, 1280).
- `KR_SCRIPT=/tmp/kr77/base.user.js KR_FRAG=envoyer node tests/e2e/forum-activite.mjs` -- rouge (12 échecs) ; bundle neuf vert.
- `jeu-identite#regles-ok` sur la base -- rouge (6 échecs) ; neuf vert.
- Contre-épreuves : m1 (règle limitée au forum kr-editor) kramail-theme 20 échecs, forum-activite 4 ; m2 (police 16 px !important) kramail-theme 12, forum-activite 8 ; m3 (position fixed) kramail-theme 12, forum-activite 8.
- `npm run test:zone --` typographie-formes 4453, forum-activite 1393, kramail 1152 (kramail-redaction 335, blocage compris), forum 639, palette-nation 1372, messages 235, cartes-pastilles 2302, confort-mobile 912, plateau 1959, sous-forum 1374 -- 0 FAIL.
- `npm run lint:css` exit 0, `npm run lint:js` exit 0 (1 warning préexistant), `npm run test:router` exit 0 (routeur conforme).
- Après les correctifs de la revue indépendante : build VALIDATION PASSED (`!important` 2946) ; `KR_FRAG=envoyer` kramail-theme 90 ok / 0 (bascule comprise ; base 46 ok / 44 échecs, mutation 48 px au bureau 11 échecs dont la bascule) ; `KR_FRAG=redaction-defilement` 10 ok (mutation voile fixe en bas : rouge) ; `KR_FRAG=envoyer` forum-activite vert ; `KR_FRAG=pied` forum-mobile vert ; test:zone typographie-formes 4453, kramail 1154, forum 639, forum-activite 1393 -- 0 FAIL ; lint:css, lint:js (1 warning préexistant), test:router exit 0.

## Result

« Envoyer » est dans le flux sous le champ au forum (avec ou sans barre d'outils) comme au kramail : plus de barre fixe ni de réserve de 60/64 px. Sur mobile : 48 px, fond et encre d'action, rayon sm, `{typography.button}`. Sur ordinateur : bouton primaire du forum. Le blocage par destinataire non validé et le 991 au-dessus du voile 990 restent verts. Revue quick : 7 constats, dont 5 corrigés (patch), 2 rejetés, aucun reporté. Doutes C1 à C4 dans revue-manuelle.md.

Clôture (orchestrateur, 2026-10-29) : revue indépendante faite, correctifs appliqués, commité (40c1574) et fusionné sur `feature/next` (d64c578) ; `test:all` vert contenant l'épopée : 18074 ok, 0 FAIL, sur `d8c8777` (SHA déduit de l'heure du journal).
