---
title: "La lecture d'un message et d'un fil reprend le message de sujet du forum"
type: 'feature'
ticket: 2
created: '2026-10-28'
status: 'built'
baseline_revision: '95119b8c3e1d5876ed6d14babcd23c57d32b9099'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'orchestrator'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, la lecture du kramail recopie le message dans une carte à elle (`kramail-msg-*`, innerHTML recopié, premier message seul : un fil n'est pas traité), avec un blanc translucide et un rayon de 8 px en dur ; Répondre et Répondre à tous sont des icônes seules. Sur ordinateur, le nom et le cartouche n'ont pas les tailles du message de sujet.

**Approach:** Le module de lecture du kramail est réécrit : il ne recopie plus rien, il remet chaque message du fil dans la forme du message de sujet (nom hors du cartouche, corps en `.forum-msg`, signature dans le corps, destinataires marqués) et pose `kr-msg` sur mobile, comme Messages:V3. Les règles V3 et les règles du sujet sur ordinateur s'appliquent alors telles quelles ; les règles `kramail-msg-*` sont retirées. Répondre et Répondre à tous sont libellés sur les deux supports ; sur mobile, les autres actions (Transférer compris) sont dans le « ••• » commun.

## Boundaries & Constraints

**Always:**
- Aucun nouvel `!important` (3281 avant).
- Gardes en `:where(html.kr-page-kramail-lecture)` ; mobile en `@media (max-width: 767px)`, ordinateur en `(min-width: 768px)`.
- Cibles tactiles ≥ 44 px ; « ••• » ouvrable au toucher même avec un `.dropdown-backdrop` (990).
- Aucun nœud natif cloné ni recréé dans le message ; seuls des déplacements de nœuds, des classes et des attributs.
- Couleurs par jetons, vérifiées dans les 16 variantes.

**Never:**
- Changer le rendu du forum (sujet, réponse) ni la liste et la rédaction du kramail.
- Toucher à l'en-tête (titre, sélecteur de personnage, bouton Réception) : entrée 3.
- Éditer le bundle généré à la main ; accéder au site réel.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Message seul | kramail-lecture | message aux classes et valeurs du message de forum-sujet | Aucune |
| Fil | plusieurs `li.media` | chaque message traité | Aucune |
| Lu depuis l'Envoi | paragraphe « Envoyé à : » | destinataires gardés, sous l'identité | Aucune |
| Signature | nœuds après `.t` | gardée, dans le corps | Aucune |
| Signaler | `…-8-<id>`, sans message | rien à traiter, aucune erreur | sortie silencieuse |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` -- module `Kramail:PostMobileEnhancer` (l.6143-6412) réécrit en `Kramail:Lecture` (même préfixe : routeur `SECTIONS` inchangé). Garde `kr-page-kramail-lecture` posée par `addPageTypeClass` (l.849) au DOMContentLoaded, avant InitQueue. Réutiliser `createMoreButton` (l.5418). Modèle : `Messages:V3` (l.7325, `isMessagesView`, `kr-msg` posé sur mobile < 768 px seulement).
- `kraland-theme.css` -- en-tête mobile du kramail (l.8921-9047 : base 44 px qui exclut déjà `[data-kr-dossier]`) ; règles globales mobiles `.btn` et `.btn + .btn` (l.4744, l.4785) ; bloc lecture mobile l.9411-9578 (`kramail-msg-*`, `kramail-post-restructured`, blanc `rgba(255,255,255,0.03)`, rayon 8 px) à retirer, sauf `.forum-top:has(.kramail-actions-moved)` ; V3 l.15107-15350 (non gardée par page : s'applique à `kr-msg`) ; sujet sur ordinateur l.15596-15605 (`:where(body.page-forum)`).
- `tests/e2e/kramail-theme.mjs` -- nouveaux fragments `lecture`, `lecture-plus`, `lecture-couleurs`.
- `tests/e2e/fixtures/kramail-lecture.html` (forme A, sans destinataires), `kramail-lecture-recue.html` (forme A, destinataires, signature), `kramail-lecture-envoi.html` (forme B, Envoi, 6 boutons -15-/-16-/-17-) -- synthétiques, sur la structure relevée le 2026-10-29. Signaler (-8-) servi par `kramail-repondre.html`, déjà conforme au relevé.
- `tests/e2e/lib/router.mjs` -- frags de `kramail-theme` ; regex l.186 (`kramail-msg-…`).
- Lecteurs des anciennes classes : `typographie-formes.mjs` (l.1104-1106, 1314-1315), `lib/variantes.mjs` (l.145-147, 266, 715), `forum-activite.mjs` (`plus`, voisins du h1 de la lecture comparés à 6270c81), `lib/router.test.mjs` (l.100, 573 : données synthétiques).

## Tasks & Acceptance

**Execution:**
- [x] `kraland-userscript-template.js` -- réécrire le module : forme du message de sujet sur les deux supports, `kr-msg` et menu « ••• » (Transférer compris) sur mobile, `data-kr-libelle` sur Répondre et Répondre à tous.
- [x] `kraland-theme.css` -- retirer le bloc `kramail-msg-*` ; libellés des deux actions (mobile et ordinateur) ; destinataires dans la grille V3 ; règles du sujet sur ordinateur étendues à la lecture ; exclusions `:where()` des règles globales.
- [x] `tests/e2e/fixtures/` -- deux fixtures synthétiques.
- [x] `tests/e2e/kramail-theme.mjs` + `router.mjs` -- fragments et registre.
- [x] Suites lectrices -- ne masquer que l'écart du 7.2, avec sa condition de retrait.

**Acceptance Criteria:**
- Given les trois fixtures de lecture à 375, 767, 1280 et 1440 px, when on mesure chaque message, then classes du `li` égales à celles du message de forum-sujet et mêmes taille, couleur, rayon, espacement (li, avatar, nom, date, corps).
- Given la lecture sur mobile, when on touche « ••• » (avec ou sans voile 990), then le menu s'ouvre au-dessus du voile avec Transférer, Signaler, Supprimer, Nouveau message, Contacts ; Répondre et Répondre à tous visibles, libellés, ≥ 44 px, atteints par `elementFromPoint`.
- Given les 16 variantes, when on mesure les couleurs du message, then elles égalent celles du message de forum-sujet ; aucun littéral de couleur dans les règles de lecture.
- Given le bundle de base (`KR_SCRIPT`), then les nouveaux fragments sont rouges.

## Implementation Notes

- Relevé du site réel (2026-10-29) : une page = un message, jamais de fil. Forme A (réception) : `.user-info > img.avatar, strong > a, div.cartouche > p`. Forme B (Envoi, personnage) : `.cartouche > div > img[data-toggle=tooltip]`, puis `strong > a` dans la cartouche, après le div. Destinataires : `.media-body > p` avant `.btn-group-xs`, absents quand le compte membre reçoit. Signature : nœuds libres après `div.t`. Envoi : 6 boutons (-15-, -16-, -17-), sans Signaler ni Supprimer.
- Module `Kramail:Lecture` (priorité 33) : aucun clonage ; nom sorti du cartouche en forme B (cartouche vidée masquée par `hidden`, `display:none` sous garde, sans `!important`), lien natif du nom conservé (plus de `href="#"`), `.t` + `forum-msg`, nœuds après `.t` rangés dans `div.kr-msg-signature` dans le corps, paragraphe des destinataires marqué `kr-msg-recipients` s'il existe (rien de créé sinon), `kr-msg` posé sous 768 px en mode mobile (comme Messages:V3). Sortie si `form[name="post_msg"]` (Signaler : message cité natif, dans `#accordion`) ; messages ciblés par `#col-right > ul.media-list.forum > li.media`.
- Répondre et Répondre à tous : `data-kr-libelle` posé d'après le mode du chemin (-5-/-15-, -6-/-16-). Écart au relevé « title et mode » : `disableTooltips` retire `title` sur mobile avant le module, seul le mode est fiable sur les deux supports. Libellés du menu fixes par mode (Transférer, Signaler, Nouveau message), Supprimer par `alertdel`, Contacts par le chemin.
- Sur mobile, boutons d'action dans `h1 .pull-right` ; secondaires DÉPLACÉS (nœud natif, gestionnaire de Supprimer conservé) dans le « ••• » commun (`createMoreButton`). `moveActions` idempotent (marque `kramail-actions-moved`).
- Ordinateur : `clear: both` sur la liste des messages de la lecture. Dans les fixtures, `.forum-top` n'a pas de hauteur (CSS du site absent) et la barre libellée, plus large, rétrécissait `.media-body` (168 px contre 349 de base à 1280) ; sur le site réel la barre fait 35 px et le message prend toute la largeur.
- Ombre et état actif du menu « ••• » : règle d'origine scindée, `:where(html:not(.kr-page-kramail-lecture))` garde les valeurs de la liste, la lecture prend `--kr-shadow-lg` et `--kr-bg-active`.
- CSS : bloc `kramail-msg-*` / `kramail-post-restructured` retiré (dont blanc `rgba(255,255,255,0.03)` et rayon 8 px) ; base 44 px du titre scindée (carrés à icône seule hors `[data-kr-libelle]`) ; règle 2 ter des boutons libellés ; destinataires en ligne 4 de la grille V3 ; règles du sujet sur ordinateur étendues à `:where(html.kr-page-kramail-lecture)` ; menu « ••• » en jetons (`--kr-shadow-lg`, `--kr-bg-active`, partagé avec la réception). `!important` : 3281 → 3209, aucun nouveau.
- Fixtures synthétiques alignées sur le relevé (formes A et B, destinataires, signature libre, boutons de l'Envoi), contenu inventé ; fixture de fil retirée.
- Suites lectrices : écarts du 7.2 masqués avec condition de retrait (bundle de base sans `Kramail:Lecture`) : kramail-redaction `regression` (titre, barre, messages de la lecture retirés des deux côtés), forum-activite `plus` (trois boutons exclus, abscisse du « ••• » non comparée sur mobile ; sur ordinateur, Répondre, Répondre à tous et le message retirés, Transférer comparé), typographie-formes (rôles de la lecture = rôles du sujet ; miroir et rayons hors messages/titre de la lecture), `AVANT_TICKET47` rendu insensible au retrait de `kramail-msg-date`. Chaque masque porte le commentaire « nom du module = repère de retrait ».

## Result

- Rouge avant : `KR_SCRIPT=<bundle 95119b8> KR_FRAG=lecture,lecture-plus,lecture-couleurs node tests/e2e/kramail-theme.mjs` : 112 contrôles en échec (lien du nom, signature hors du corps, libellés absents, Transférer hors du menu, largeur, littéraux de couleur du menu).
- Contre-épreuves par mutation du template (bundle reconstruit, `KR_SCRIPT`), toutes rouges : lien du nom en `#` (formes A et B), destinataires vides créés, Supprimer cloné (gestionnaire 0), `clear` retiré (`.media-body` 168 < 349 à 1280), Signaler non exclu et sélecteur générique (message cité marqué), garde d'idempotence retirée (second passage : DOM modifié). Une seule des deux gardes de Signaler ou d'idempotence retirée reste verte : double protection, consignée.
- Vert après (correctifs de revue compris) : mêmes fragments 127 ok, 0 échec ; kramail-theme complet 215 ok.
- Zones (machine calme, 0 FAIL) : kramail (kramail-theme 215, kramail-redaction 340, jeu-identite 106), forum (forum-index 158, forum-mobile 375, jeu-identite 106), forum-activite 929, typographie-formes 4427, palette-nation 1372, cartes-pastilles 2302, messages 235.
- `npm run build` VALIDATION PASSED ; lint:css 0 ; lint:js 0 (1 avertissement préexistant) ; test:unit 0 ; test:router conforme ; `diff -r .hermes/skills .claude/skills` vide ; `!important` 3281 → 3209.

## Plan Change Log

- 2026-10-29, relevé du site réel : une page de lecture ne porte qu'un message. La ligne « Fil » de la matrice (intention gelée, non modifiée) n'a pas d'objet sur le site ; la fixture de fil est retirée, le module traite quand même chaque `li.media` de la liste.

## Review Triage Log

| # | Constat | Décision | Suite |
|---|---------|----------|-------|
| A1 | Un message par page, pas de fil | Fixture `kramail-lecture-fil.html` retirée, choix consigné (Plan Change Log) | Fait |
| A2 | Forme A : `.user-info > img.avatar, strong > a, div.cartouche > p` | `kramail-lecture.html` et `kramail-lecture-recue.html` en forme A ; nom gardé en place | Fait, check « lien natif » |
| A3 | Forme B : `strong` dans la cartouche, après le div de l'avatar | `kramail-lecture-envoi.html` en forme B ; `strong` sorti, cartouche vidée en `hidden` | Fait |
| A4 | Destinataires `.media-body > p` avant `.btn-group-xs`, absents à la réception membre | Fixtures recue et envoi avec `p` ; lecture sans ; check « aucun destinataire » | Fait |
| A5 | Signature en nœuds libres après `div.t` | Fixtures en nœuds libres ; rangés dans `.kr-msg-signature` | Fait |
| A6 | Envoi : 6 boutons (-15-, -16-, -17-), sans Signaler ni Supprimer | Fixture envoi réécrite ; libellés et menu par mode, items attendus Transférer, Nouveau message, Contacts | Fait |
| A7 | Répondre et Répondre à tous reconnus par title et mode | Mode seul : `disableTooltips` retire `title` sur mobile avant le module | Écart consigné |
| A8 | Lien du nom en `href="#"` | Lien natif conservé ; test rouge (mutations formes A et B : « lien du nom : # ») puis vert | Fait |
| A9 | Pas de destinataires vides | Rien créé sans `p` ; check « aucun bloc vide » ; rouge par mutation | Fait |
| B1 | Largeur de `.media-body` ≥ base à 768 et 1280, formes A et B | Check ajouté contre la base ; rouge (168 < 349) dû à la fixture sans CSS du site, corrigé par `clear: both` | Fait |
| B2 | typographie-formes:1238, masque inconditionnel | Conditionné à `!avantEchelleForum.includes('Kramail:Lecture')` | Fait |
| B3 | forum-activite:1252, sur ordinateur ne retirer que -5- et -6- | Transférer comparé ; le message reste retiré (rendu du sujet, prouvé par kramail-theme) | Fait |
| B4 | Ombre et état actif du menu changés aussi sur la liste | Règles scindées par garde de lecture ; liste inchangée | Fait |
| B5 | Signaler : message cité natif | Sortie sur `form[name="post_msg"]` + ciblage `#col-right >` ; fixture conforme (form, hr, accordion) ; check « message cité intact » | Fait ; double garde : retirer une seule des deux reste vert |
| B6 | Nœuds du « ••• » clonés | Nœuds natifs déplacés ; check « Supprimer garde son gestionnaire » | Fait |
| B7 | `moveActions` non idempotent | Marque `kramail-actions-moved` ; check « second passage sans effet » | Fait ; double garde (`buttons.length === 0`) |
| B8 | 320 px absent de lecture-plus | Ajouté (320, 375, 767, 1280) | Fait |
| B9 | Cartouche `hidden` visible | `:where(html.kr-page-kramail-lecture) .user-info > .cartouche[hidden]{display:none}`, sans `!important` | Fait |
| B10 | Repère de retrait des masques | Commentaire « nom du module = repère de retrait » dans variantes, kramail-redaction, forum-activite, typographie-formes | Fait |
| B11 | Mention « supposée » dans le plan | Retirée, remplacée par le relevé | Fait |

## Verification

**Commands:**
- `npm run build` -- expected: VALIDATION PASSED.
- `node tests/e2e/kramail-theme.mjs` puis `KR_SCRIPT=<base> KR_FRAG=lecture,lecture-plus,lecture-couleurs node tests/e2e/kramail-theme.mjs` -- expected: vert, puis rouge.
- `npm run test:zone --` kramail, forum, forum-activite, messages, typographie-formes, palette-nation, cartes-pastilles -- expected: 0 FAIL.
- `npm run test:router`, `npm run test:unit`, `npm run lint:css`, `npm run lint:js`, `diff -r .hermes/skills .claude/skills` -- expected: code 0, diff vide.
