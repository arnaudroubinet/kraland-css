---
title: "Modale d'ordre : fixture, suite et module actif sur les deux supports"
type: 'feature'
ticket: '2'
created: '2026-10-22'
status: 'in-progress'
baseline_revision: '94ae014dde187b6f72229c237900aaef4b6e6ea4'
route: 'full'
route_source: 'auto'
risk: 'high'
review: ''
review_source: ''
lenses_ran: []
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
- [ ] `tests/e2e/fixtures/modale-ordre/` -- page de plateau minimale et contenus Dormir et Pouvoir (données inventées, structure ci-dessus) -- base des tests
- [ ] `tests/e2e/modale-ordre.mjs` + `tests/e2e/lib/router.mjs` (suite, zone `modale-ordre`, section « MODAL PERSONNAGE MOBILE » et mots-clés) -- suite rouge d'abord, une vérification par ligne de la matrice, ouverture par `bootbox.confirm` comme le site (contenu de l'ordre dans le message)
- [ ] `kraland-userscript-template.js` -- socle commun aux deux supports (reconnaissance, marquage idempotent, libellés, réapplication au remplacement du contenu), sans changer le comportement mobile existant
- [ ] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:**
- Given une modale d'ordre ouverte à 375 ou 1280 px, when son contenu est remplacé deux fois, then le marquage existe une seule fois et les boutons portent « Annuler » / « Valider »
- Given les suites existantes, when elles tournent, then `test:parler` et les autres restent vertes

## Design Notes

- Écart assumé avec la description du ticket : le repli de l'aide et les pastilles ne passent aux deux supports qu'aux entrées 3 et 4, avec leurs règles corrigées, pour ne pas étendre à l'ordinateur le repli de la première alerte (qui masque l'avertissement de Dormir).

## Implementation Notes

## Verification

**Commands:**
- `npm run build && node tests/e2e/modale-ordre.mjs` -- expected: rouge avant le code, vert après
- `npm run test:parler`, `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: verts, 0 erreur
- `npm run test:all` -- expected: RÉSULTAT : VERT
