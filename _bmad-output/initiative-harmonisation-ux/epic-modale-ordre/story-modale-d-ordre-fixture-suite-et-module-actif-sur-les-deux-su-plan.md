---
title: "Modale d'ordre : fixture, suite et module actif sur les deux supports"
type: 'feature'
ticket: '2'
created: '2026-10-22'
status: 'built'
baseline_revision: '94ae014dde187b6f72229c237900aaef4b6e6ea4'
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

**Problem:** Le module de la modale d'ordre ne tourne que sur mobile, une seule fois, 150 ms après l'apparition de la modale ; un contenu remplacé plus tard (autre ordre choisi, chargement Ajax) n'est pas retraité. Les boutons natifs s'appellent « Cancel » et « OK ». Aucune fixture ni suite ne couvre la modale native.

**Approach:** Balle traçante de l'épopée 2 : une fixture de la modale native et une suite e2e ; un socle commun aux deux supports qui reconnaît une modale d'ordre, la marque, renomme ses boutons « Annuler » / « Valider » (H2.1) et se réapplique, sans doublon, quand son contenu est remplacé. Les modales hors ordre gardent « Cancel » / « OK ».

## Boundaries & Constraints

**Always:** une modale d'ordre se reconnaît à `.bootbox.bootbox-confirm` contenant `#ajax-order form[name="post_msg"]` ; chaque traitement est idempotent (deux appels = un seul effet) ; vérifié à 375×667, 767, 768, 769, 1280, 1440 et 1920 px ; harnais Bootbox existant de `tests/e2e/vendor/parler/` réutilisé ; `npm run test:parler` reste vert (il attend `data-structure-transformed` sur mobile).

**Never:** valider un ordre ou toucher l'envoi natif ; étendre à l'ordinateur la grille d'onglets en styles en ligne, le carrousel, le balayage ou le compteur de caractères ; changer ici quelle alerte se replie (entrée 3) ou le style des pastilles (entrée 4).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Dormir | modale d'ordre, avertissement avant les onglets | boutons « Annuler » / « Valider », modale marquée une fois, aux deux supports | No error expected |
| Pouvoir | modale d'ordre, aide puis blocage dans l'onglet, libellé d'onglet `span.text-danger` | idem | No error expected |
| Contenu remplacé | le contenu de `#ajax-order` est remplacé (autre ordre) | marquage refait sur le nouveau contenu, sans doublon ; libellés toujours « Annuler » / « Valider » | No error expected |
| Appel double | le socle s'exécute deux fois (double enregistrement mobile) | un seul effet | No error expected |
| Confirmation hors ordre | `bootbox.confirm` sans `#ajax-order` | « Cancel » / « OK » inchangés, aucun marquage | No error expected |
| Seuil | 767 / 768 / 769 px | socle actif des deux côtés | No error expected |

</frozen-after-approval>

## Code Map

- Structure native relevée le 2026-10-22 (hors dépôt : `.tmp/captures/modale-ordre/squelettes.txt`) : `div.bootbox.modal.fade.bootbox-confirm` > `.modal-dialog` > `.modal-content` > `.modal-body` (`button.bootbox-close-button.close` « × », `div.bootbox-body > div#ajax-order > form[name=post_msg]`) + `.modal-footer` (`button.btn.btn-default[data-bb-handler=cancel]` « Cancel », `button.btn.btn-primary[data-bb-handler=confirm]` « OK »). Dormir : `h3{div.pull-right{img}}`, paragraphes de caractéristiques, `div.alert.alert-warning.alert-sm` « Attention ! … » AVANT `div.panel.with-nav-tabs.panel-default` (`.panel-heading > ul.nav.nav-tabs > li.active > a[href^="javascript:updateAjax("]`, `.panel-body.panel-order > .tab-content > .tab-pane.active` avec `h4{span.mention.pull-right.mini{a "[?]"} strong "Dormir"}` puis `div.alert.alert-dismissible.alert-order` (aide, `button.close`, `p.mini.justify`), `.panel-footer > p.mini` « Coût: 0 FK | Durée: 00:00 | … »). Pouvoir : titre `h3` « Pouvoir », onglet `li.active > a > span.text-danger`, `h4 strong` avec `span.text-danger` « (délit) », aide `alert-order` puis `div.alert.alert-danger.alert-sm` « Ordre Réservé à une Vocation » dans le `.tab-pane`.
- `kraland-userscript-template.js` : section « MODAL PERSONNAGE MOBILE » (~l.8985) : `initCharacterModalMobile` (~l.8997, observateur des `.bootbox` ajoutées, `enhanceCharacterModal` 150 ms après) enregistré deux fois si la largeur est < 768 à l'évaluation (~l.10207 et ~l.11189) ; `transformOrderModalStructure` (~l.9273, garde mobile, drapeau `dataset.structureTransformed` ~l.9276/9344) ; `makeAlertCollapsible` (~l.9397, replie la première `.alert`) ; `formatFooterAsBadges` (~l.9460) ; `enhanceCharacterModal` (~l.9622, garde mobile, observateur de contenu qui ne réapplique que la grille et la barre d'outils ~l.9665) ; `trackOrderModalViewport` (~l.9023, zone `parler` du routeur).
- `tests/e2e/vendor/parler/` (Bootbox 4.4.0, jQuery, Bootstrap) et `tests/e2e/parler-viewport.mjs` (ouvre une modale par `bootbox.confirm` avec ses propres libellés, attend `data-structure-transformed`).
- `tests/e2e/lib/router.mjs` : la section « MODAL PERSONNAGE MOBILE » n'est dans aucune entrée `SECTIONS` ; mot-clé `trackOrderModalViewport` → zone `parler`.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/fixtures/modale-ordre/` -- page de plateau minimale et contenus Dormir et Pouvoir (données inventées, structure ci-dessus) -- base des tests
- [x] `tests/e2e/modale-ordre.mjs` + `tests/e2e/lib/router.mjs` (suite, zone `modale-ordre`, section « MODAL PERSONNAGE MOBILE » et mots-clés) -- suite rouge d'abord, une vérification par ligne de la matrice, ouverture par `bootbox.confirm` comme le site (contenu de l'ordre dans le message)
- [x] `kraland-userscript-template.js` -- socle commun aux deux supports (reconnaissance, marquage idempotent, libellés, réapplication au remplacement du contenu), sans changer le comportement mobile existant
- [x] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:**
- Given une modale d'ordre ouverte à 375 ou 1280 px, when son contenu est remplacé deux fois, then le marquage existe une seule fois et les boutons portent « Annuler » / « Valider »
- Given les suites existantes, when elles tournent, then `test:parler` et les autres restent vertes

## Design Notes

- Écart assumé avec la description du ticket : le repli de l'aide et les pastilles ne passent aux deux supports qu'aux entrées 3 et 4, avec leurs règles corrigées, pour ne pas étendre à l'ordinateur le repli de la première alerte (qui masque l'avertissement de Dormir).

## Implementation Notes

- Fichiers : `kraland-userscript-template.js` (section « MODAL PERSONNAGE MOBILE » : `applyOrderModal` et `watchOrderModal`, appelés par l'observateur des modales de `initCharacterModalMobile`, sur les deux supports) ; fixtures `tests/e2e/fixtures/modale-ordre/` (`plateau.html`, `dormir.html`, `pouvoir.html`) ; suite `tests/e2e/modale-ordre.mjs` (4 fragments : mobile, bureau, largeurs, seuil ; 59 contrôles) ; `tests/e2e/lib/router.mjs` (suite et zone `modale-ordre` ; fixtures -> `modale-ordre` ; harnais `vendor/parler/` -> `parler` + `modale-ordre` ; mots-clés `kr-order-*` hors viewport, `bootbox-confirm`, `ajax-order`, `bb-handler` -> `modale-ordre` + `parler` ; section « MODAL PERSONNAGE MOBILE » -> `modale-ordre` + `parler`, seules suites qui ouvrent une modale Bootbox) et 1 test dans `router.test.mjs` ; ligne de zone dans le tableau du skill `tester-kraland-css` (deux copies) ; bundle et `version.json`.
- Socle : reconnaissance `.bootbox.bootbox-confirm` contenant `#ajax-order form[name="post_msg"]` ; marque `kr-order-modal` sur la modale et `kr-order-form` sur le formulaire traité (refaite sur chaque nouveau formulaire) ; libellés posés par `data-bb-handler` (`cancel`, `confirm`) sans remplacer les nœuds ni les gestionnaires ; un seul observateur `childList` / `subtree` par modale (WeakSet), coupé à `hidden.bs.modal` ; chaque écriture n'a lieu que si elle change le DOM (ni écriture neutre, ni boucle avec l'observateur).
- Décision : repères neufs `kr-order-*` plutôt que les classes `kraland-*` de `transformOrderModalStructure`. Leurs règles CSS sont mobiles (l.~935-1941) : les reposer sur un contenu remplacé changerait le rendu mobile actuel. La chaîne mobile (`enhanceCharacterModal`, drapeau `data-structure-transformed` attendu par Parler) est intacte. Les entrées 3 à 6 s'appuient sur `kr-order-modal` et `kr-order-form`.
- Décision (hypothèse ajoutée à `revue-manuelle.md`) : thème désactivé (peau coupée), le socle ne s'installe pas et la modale reste native, comme Kramail:Destinataires et l'index du forum.
- Appel double mesuré par un journal des mutations (attribut class, enfants des boutons) : 1 ajout de chaque repère, 0 écriture neutre, 1 écriture par libellé, sur la modale, chaque contenu et chaque bouton. Précondition sur mobile : 2 indicateurs d'onglets de la chaîne mobile, preuve que l'observateur est enregistré deux fois.
- Document-start (correctif de revue) : le bundle est en `@run-at document-start` ; évalué avant `<body>`, `initCharacterModalMobile` ne pose pas son observateur (`if (document.body)`) et le socle restait inactif (« Cancel » / « OK »). Correctif réservé au socle : sans `<body>`, `watchOrderModalsOfBody` pose l'observateur du socle au `DOMContentLoaded` ; la chaîne mobile et le viewport des ordres restent installés comme avant (non installés dans ce cas). La suite injecte le bundle dès que `<html>` existe (comme `fin-initialisation.mjs`, mode start) dans une page servie avec un script en tête de `<head>`, avant la balise viewport, sans lequel l'injection tombe après `<body>` ; précondition vérifiée : `<body>` absent, largeur ≥ 768 px sur mobile (G-01). Dormir à 375 et 1280 px : « Annuler » / « Valider », marquage unique.
- Contrôles ajoutés à la matrice : chargement Ajax (`#ajax-order` sans formulaire à l'ouverture) à 375 et 1280 px ; transitions 769 -> 767 -> 769 et 767 -> 769 -> 767 dans le même onglet, saisie en cours (bandeau, sans rechargement) ; peau coupée à 1280 px ; envoi natif intact (mêmes boutons, même gestionnaire Bootbox du pied, aucun envoi ni POST, aucune erreur) ; gardes des limites (ordinateur : ni grille d'onglets en style en ligne, ni indicateurs de balayage, ni repli, ni pastilles ; mobile : mise en forme existante, repli de la première alerte et pastilles compris).
- Limite : les modales natives Dormir et Pouvoir n'ont ni sélecteur de personnage ni champ à `maxlength` ; la garde « chaîne mobile non étendue » ne voit donc ni le carrousel ni le compteur, seulement la grille d'onglets en style en ligne et les indicateurs de balayage, que la même fonction pose.
- Vérification : bundle d'avant (template de `b536d79`) rouge, 22 ok, 35 FAIL (`test:red -- modale-ordre` : ROUGE confirmé, mêmes comptes qu'en série) ; vert après, 57 ok ; document-start : 2 FAIL avant le correctif (« Cancel » / « OK » à 375 et 1280 px), 59 ok après. Contre-épreuves sur des bundles mutés hors dépôt : sans réapplication, 16 FAIL (contenu remplacé, appel double, Ajax) ; écriture neutre, 9 FAIL (appel double, Ajax) ; sans reconnaissance, 9 FAIL (hors ordre, Ajax) ; socle mobile seulement, 24 FAIL (ordinateur, seuil 768/769, transition 769) ; sans garde du thème, 1 FAIL (peau coupée) ; chaîne mobile étendue à l'ordinateur, 5 FAIL (garde ordinateur). `test:parler` 78 ok, comme avant. Captures 375 et 1280 px comparées au bundle d'avant : seule la bande des boutons du pied change (l'écart du bouton OK de la confirmation hors ordre sur mobile est du bruit d'animation, présent entre deux captures du bundle d'avant). `test:router` conforme ; `lint:css` et `lint:js` à 0 erreur (1 avertissement préexistant dans `report-non-lu.mjs`) ; `test:all` VERT, 4419 ok, 0 FAIL (tests unitaires 56 ok).

## Verification

**Commands:**
- `npm run build && node tests/e2e/modale-ordre.mjs` -- expected: rouge avant le code, vert après
- `npm run test:parler`, `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: verts, 0 erreur
- `npm run test:all` -- expected: RÉSULTAT : VERT

## Review Triage Log

Passe quick du 2026-10-22 : 1 high, patch.
- high, patch — socle jamais installé quand le bundle est évalué avant `<body>` (production : `@run-at document-start`) : l'observateur des modales n'était posé que si `document.body` existait. Une première sonde de l'orchestrateur avait conclu à tort que le cas passait : dans la fixture, `<body>` existait déjà à l'injection. Correctif : `watchOrderModalsOfBody` posé au `DOMContentLoaded` quand `<body>` manque ; suite : option `debut` (bundle injecté avant `<body>`, viewport non lue, 981 px mesurés), contrôle Dormir à 375 et 1280 px ; rouge avant le correctif, vert après.

Vérification : `modale-ordre.mjs` 59 ok ; `test:parler` 78 ok ; `test:unit` 56/56 ; `test:router` conforme ; `lint:css`, `lint:js` 0 erreur ; skills identiques ; `test:all` 4421 ok, 0 FAIL.

Hors périmètre, reporté au backlog : au vrai document-start, `trackOrderModalViewport`, la chaîne mobile `enhanceCharacterModal` et `enableModalBackdropClick` ne s'installent pas (même garde `if (document.body)`) ; `createMobileOverlay` lève une exception si le bundle tourne avant `<body>` sous 768 px, ce qui arrête l'initialisation ; le mode `start` de `fin-initialisation.mjs` injecte après `<body>` dans ses fixtures.
