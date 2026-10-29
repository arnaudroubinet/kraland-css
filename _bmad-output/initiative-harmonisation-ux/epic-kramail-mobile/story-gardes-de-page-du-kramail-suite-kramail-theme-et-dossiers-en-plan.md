---
title: 'Gardes de page du kramail, suite kramail-theme et dossiers en onglets libellés sur mobile'
type: 'feature'
ticket: 1
created: '2026-10-28'
status: 'built'
baseline_revision: '55ae556540e86100216fb3f0a4f089d09bcb72d0'
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

**Problem:** Le kramail n'a pas de garde de page sur `<html>` : la feuille ne peut pas le cibler dès le début du document, et la rédaction n'est reconnue que par `textarea#dest`. Sur mobile, Réception, Envoi et Corbeille sont des carrés de 44 px sans libellé, indiscernables de Nouveau et Contacts.

**Approach:** Le template pose `kr-page-kramail` et une seule sous-garde (`liste`, `lecture`, `compose`) sur `<html>`. La rédaction est reconnue par le chemin `…/post/nouveau` ou par `form[name="post_msg"]`. Sous 768 px, les trois dossiers deviennent des Onglets de section libellés ; Nouveau, Contacts et « ••• » restent des boutons à icône de 44 px. La nouvelle suite `kramail-theme` prouve le tout.

## Boundaries & Constraints

**Always:**
- Aucun nouvel `!important` : le total reste 3281.
- Gardes en `:where(html.x)`.
- Mobile en `@media (max-width: 767px)`, ordinateur inchangé.
- Cibles tactiles ≥ 44 px.
- Pas de bascule d'un repère de 3 à 4 suites citantes (MAX_CITING).

**Never:**
- Toucher aux notifications (épopée 8).
- Changer le rendu à 768 px et plus.
- Éditer le bundle généré à la main.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Liste | Réception, Envoi ou Corbeille | `kr-page-kramail kr-page-kramail-liste`, dossiers marqués `data-kr-dossier` | Aucune |
| Lecture | `…/post/<sujet>-0-<id>`, sans `post_msg` | `kr-page-kramail-lecture` | Aucune |
| Rédaction | Nouveau, Répondre, Répondre à tous, Transférer | `kr-page-kramail-compose` et `body.page-kramail-compose` | Aucune |
| Rédaction sans `#dest` | Répondre dont le textarea n'a plus d'id | Toujours `compose` (l'ancienne détection échouait) | Aucune |
| Injection en tête | Bundle évalué avant `<body>` | Gardes posées au DOMContentLoaded, comme au chargement tardif | Aucune |
| Envoi sans « + » natif | Pas de `#topics thead .btn-group` | Nouveau et Contacts seulement, pas de « ••• » | Aucune |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` -- `addPageTypeClass` (section TASK-1.1) : gardes sur `<html>` et marquage des dossiers.
- `kraland-theme.css` -- Bloc mobile kramail (`=== 2.` et `=== 2 bis.`). Les règles globales mobiles `.btn` (padding et police) et `.btn + .btn` (marge) excluent les dossiers.
- `tests/e2e/kramail-theme.mjs` -- Nouvelle suite, fragments `gardes`, `onglets`, `bureau` et `bascule`.
- `tests/e2e/lib/router.mjs` -- Entrée SUITES `kramail-theme`, zone `kramail`.
- `tests/e2e/kramail-redaction.mjs` et `tests/e2e/typographie-formes.mjs` -- Écart accepté et consigné : les comparaisons mobiles à une base antérieure retirent les dossiers.

## Tasks & Acceptance

**Execution:**
- [x] `kraland-userscript-template.js` -- poser les gardes et `data-kr-dossier` dans `addPageTypeClass` -- détection par le DOM, au DOMContentLoaded.
- [x] `kraland-theme.css` -- dossiers en onglets dans le média mobile, exclusions par `:where()` -- spécificité inchangée, sans `!important`.
- [x] `tests/e2e/kramail-theme.mjs` et `tests/e2e/lib/router.mjs` -- créer la suite et l'enregistrer -- base figée `55ae556`, injection en tête.
- [x] `tests/e2e/kramail-redaction.mjs` et `tests/e2e/typographie-formes.mjs` -- consigner l'écart et sa condition de retrait -- les bases figées précèdent l'entrée.

**Acceptance Criteria:**
- Les 8 fixtures du kramail, la variante « Répondre sans `#dest` » et la page synthétique « Signaler » (`…-8-<id>`, sans `-compose`) portent `kr-page-kramail` et la seule sous-garde attendue, à 375 et 1280 px, injection en tête ou au DOMContentLoaded.
- À 375×667 et 767 px, en Kraland clair et en Empire Brun sombre :
  - trois onglets libellés, contigus, sur un rang pleine largeur ;
  - libellé de 12 px (DESIGN Q14), retrait de 4 px, hauteur ≥ 44 px, libellé tronqué par une ellipse au besoin ;
  - filet de 2 px en `--kr-border-default` dans la ligne des inactifs ;
  - seul le dossier courant est actif : demi-gras 600 et filet de 3 px en `--kr-primary` logé dans la ligne, sans bordure basse ;
  - Nouveau, Contacts et « ••• » mesurent au moins 44×44 et sont atteints par `elementFromPoint`.
- À 768, 769 et 1280 px, le titre, `.pull-right` et chaque bouton ont les mêmes styles calculés et les mêmes rectangles qu'avec la base figée.
- Aller-retour 767 → 768 → 767 px dans le même onglet : onglets à 767, titre égal à la base à 768, onglets au retour.
- Le bundle de base (`KR_SCRIPT`) fait échouer les fragments `gardes`, `onglets` et `bascule`.

## Implementation Notes

- Assumption: une seule sous-garde `liste` pour les trois dossiers. Le dossier courant reste porté par l'onglet actif (`btn-primary` natif). Si chaque dossier doit avoir sa propre garde (lecture possible de « liste par dossier »), il faudra ajouter `kr-page-kramail-reception`, `-envoi` et `-corbeille`.
- Assumption (non vérifiée, faute de session sur le site) : la page Signaler (`…/post/<sujet>-8-<id>`) porte un formulaire `post_msg` sans être une rédaction. Son chemin est exclu de `-compose` et reçoit `-lecture`. À relever sur le site dès qu'une session le permet.
- Assumption: les gardes sont posées dans `addPageTypeClass`, au DOMContentLoaded. La rédaction se reconnaît par le DOM, donc aucune garde n'est posée au tout début du document.
- Assumption: les dossiers sont marqués par l'attribut `data-kr-dossier`, pas par une classe. Les signatures `tagName.className` des gardes de régression (`echelle-forum`, `nettoyage`) restent ainsi égales à l'ordinateur.
- Assumption: onglets contigus malgré le `gap: 8px !important` de `.pull-right` grâce à une marge de -8 px entre dossiers. Nouveau, Contacts et « ••• » passent au rang suivant.
- Les règles globales mobiles ont dû exclure les dossiers, toujours via `:where()` :
  - `.btn { padding; font-size !important }` (l.4687) ;
  - `.btn + .btn { margin-top: 8px; margin-left: 0 !important }` (l.4728).
- Écart accepté et consigné : `kramail-redaction` (`regression`, tant que la base `feature/next` précède l'entrée) et `typographie-formes` (`boutons`, `echelle-forum`, `nettoyage`, `rayons`, bases figées) retirent les dossiers de leurs comparaisons mobiles, sur les seules listes (chemin hors `/kramail/post/`). Le bouton Réception des pages lecture, nouveau et répondre reste comparé. Les dossiers sont reconnus par leur lien natif dans les deux bundles. Retrait : quand la base comparée contient l'entrée.

## Design Notes

Le code reprend la grammaire des Onglets de section du jeu (feuille, l.5444-5545) :
- barre en `--kr-bg-surface`, filet de 2 px en `--kr-border-default` sur toute la barre (`box-shadow: inset 0 -2px 0` sur chaque onglet inactif) ;
- libellé en `--kr-font-label`, retrait de 4 px, ellipse en cas de débordement, icône de 18 px ;
- onglet actif en 600, filet de 3 px en `--kr-primary` logé dans la ligne (`box-shadow: inset 0 -3px 0`), sans filet gris dessous. C'est la maquette `key-kramail-mobile.html`.

Les règles icône 44 px et `btn-primary` (fond de nation) excluent les dossiers par `:not(:where([data-kr-dossier]))`. Leur spécificité ne change pas.

## Verification

**Commands:**
- `npm run build` -- expected: VALIDATION PASSED.
- `npm run test:zone -- kramail`, puis `forum`, `typographie-formes`, `initialisation`, `confinement` et `cartes-pastilles` -- expected: 0 FAIL.
- `KR_SCRIPT=/tmp/kt71-base.user.js node tests/e2e/kramail-theme.mjs` -- expected: rouge (gardes, onglets, bascule).
- `KR_SCRIPT=/tmp/kt71-btn.user.js KR_FRAG=onglets node tests/e2e/kramail-theme.mjs` (exclusion `.btn` retirée) -- expected: rouge.
- `npm run test:router`, `npm run lint:css`, `npm run lint:js`, `npm run test:unit`, `diff -r .hermes/skills .claude/skills` -- expected: code de sortie 0, diff vide.

## Result

Résultat après correctifs de revue. Base `55ae556`, arbre de travail `wt/7.1` non commité, zones lancées une à une.

**Rouge avant :**
- `KR_SCRIPT=/tmp/kt71-base.user.js node tests/e2e/kramail-theme.mjs` (bundle de `55ae556`) : 20 ok, 68 échecs, code 1.
  - 40 échecs de gardes (dont Signaler) : `kr-page-kramail absente`.
  - 24 échecs d'onglets et 4 de bascule.
  - Le fragment `bureau` reste vert, car la base est égale à elle-même.
- Contre-épreuves sur des copies du bundle dans `/tmp` :
  - exclusion `.btn` retirée (`kt71-btn`) : `onglets` 12 ok, 12 échecs (`Réception : libellé 14 px au lieu de 12 px`) ;
  - filet inactif hors ligne, `0 2px 0` (`kt71-filet`) : `onglets` 12 ok, 12 échecs ;
  - exclusion Signaler retirée de `-compose` (`kt71-sig`) : `gardes` 36 ok, 4 échecs (Signaler).
- Premier passage de la zone `typographie-formes` après le changement initial : 23 FAIL dans `boutons`, `echelle-forum`, `nettoyage` et `rayons`. Ces échecs sont corrigés par l'attribut `data-kr-dossier` et par l'écart consigné.

**Vert après :**

| Commande | Résultat |
|---|---|
| `npm run build` | VALIDATION PASSED |
| `node tests/e2e/kramail-theme.mjs` | 88 ok, 0 échec |
| `npm run test:zone -- kramail` | 534 ok, 0 FAIL |
| `npm run test:zone -- forum` | 639 ok, 0 FAIL |
| `npm run test:zone -- typographie-formes` | 4432 ok, 0 FAIL |
| `npm run test:zone -- initialisation` | 205 ok, 0 FAIL |
| `npm run test:zone -- cartes-pastilles` | 2302 ok, 0 FAIL |
| `npm run test:router` | Routeur conforme, code 0 |
| `npm run lint:css` | code 0 |
| `npm run lint:js` | code 0 (1 avertissement préexistant dans `report-non-lu.mjs`, fichier non modifié) |

**Correctif après fusion (test:all du coordinateur sur le bundle de `9acd8d6`) :**
- Rouge avant : `forum-activite#plus` 4 FAIL (réception 375 et 767 px, deux variantes : « ••• » décalé par les onglets) et `palette-nation#composants-pages-mobile` 1 FAIL (bordures haute et basse d'Envoi et Corbeille, 16 variantes). Le contrôle « dossier actif en paire au repos » de `balayage-mobile` échouait aussi.
- `forum-activite` (`plus`) et `palette-nation` (`composants-pages-*`) : sur une liste sous 768 px, les dossiers sont retirés des deux côtés des comparaisons au bundle de base, reconnus par leur lien natif. « ••• » et les autres boutons restent comparés.
- `palette-nation`, dossier actif à 375 px : l'attendu est adapté et non exclu. Sous 768 px, l'onglet actif n'est plus un bouton d'action : la paire « au repos » (fond d'action, encre d'action) ne s'applique plus. Le contrôle exige désormais, sur 16 variantes, un filet `inset 0 -3px 0` en primaire de la nation et un texte ≥ 4,5:1. Il couvre ainsi les 14 variantes que la suite des onglets ne mesure pas. À 1280 px, la paire au repos reste exigée.
- Contre-épreuve : filet actif passé à `--kr-border-default` (`/tmp/kt71-actif.user.js`), `balayage-mobile` rouge (`filet rgba(0, 0, 0, 0.08) … au lieu de #8b0f0e …`).
- MAX_CITING : les commentaires évitent le nom de fichier de la suite des onglets ; aucun repère ne passe de 3 à 4 suites citantes. `data-kr-dossier` n'est cité par aucune suite de comparaison.
- Vert après : zones `forum` 639 ok, `palette-nation` 1372 ok, `kramail` 534 ok, `typographie-formes` 4432 ok, `cartes-pastilles` 2302 ok, toutes à 0 FAIL ; `test:router` conforme ; `lint:css` et `lint:js` à 0. Bundle inchangé (tests seuls).

- `!important` : 3281 avant et après.
- MAX_CITING : aucun repère ne passe de 3 à 4 suites citantes (contrôle par script).
- `test:all` n'est pas lancé (hors mandat).

## Review Triage Log

| # | Constat | Décision | Suite donnée |
|---|---|---|---|
| 1 | Onglets : libellé contrôlé à ≥ 12 px, retrait non contrôlé | patch | `fontSize === 12` et `paddingLeft === 4px` ; contre-épreuve `.btn` rouge |
| 2 | Retrait des dossiers appliqué à toutes les pages du kramail | patch | Retrait limité aux listes (chemin hors `/kramail/post/`) dans `typographie-formes` et `kramail-redaction` |
| 3 | Signaler (`-8-<id>`) pouvait recevoir `-compose` | patch | Chemin exclu de `-compose` ; cas synthétique `signaler` ; hypothèse non vérifiée (Implementation Notes) |
| 4 | Gardes posées au DOMContentLoaded seulement | defer | Accepté et consigné par le coordinateur |
| 5 | Filet différent de la maquette `key-kramail-mobile.html` | patch | Filet de 2 px sur toute la barre, 3 px de l'actif logé dans la ligne (`inset`) ; contrôle mis à jour |
| 6 | Libellé long sans troncature | patch | `overflow: hidden; text-overflow: ellipsis` |
| 7 | Seuil sans 769 px ni aller-retour | patch | 769 px dans `bureau` ; fragment `bascule` 767, 768, 767 dans le même onglet |
| 8 | Confinement mobile : règles dans `@media (max-width: 767px)`, `:where()` à spécificité constante, bureau inchangé | OK | Rien |
| 9 | Sous-gardes exclusives, marquage des seuls dossiers, cibles ≥ 44 px | OK | Rien |
| 10 | Doute tranché : une seule garde `liste`, attribut `data-kr-dossier` plutôt qu'une classe | OK | Rien |
| 11 | Rédaction sans `#dest` : `page-kramail-compose` posée, module des destinataires sorti proprement | OK | Rien |
| 12 | Bouton Réception de la lecture en primaire | defer | Accepté et consigné par le coordinateur |

Clôture (orchestrateur, 2026-10-29) : revue indépendante faite, correctifs appliqués, commité (9acd8d6, 3248bfd) et fusionné sur `feature/next` (95119b8) ; `test:all` vert contenant l'épopée : 18074 ok, 0 FAIL, sur `d8c8777` (SHA déduit de l'heure du journal).
