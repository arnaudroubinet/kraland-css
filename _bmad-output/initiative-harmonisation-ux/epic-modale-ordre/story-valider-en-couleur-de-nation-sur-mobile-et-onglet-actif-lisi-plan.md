---
title: '« Valider » en couleur de nation sur mobile et onglet actif lisible'
type: 'feature'
ticket: '6'
created: '2026-10-23'
status: 'built'
baseline_revision: '2b46ef4fde4e10c3a80add8607f75f834cfed996'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Dans la modale d'ordre sur mobile, « Valider » garde un dégradé vert et un halo (`.kr-btn-primary-enhanced`) qui battent la paire de nation, et son pied mélange `flex-direction: column` et `flex: 2` (largeur incohérente). L'onglet actif de la modale est bleu Bootstrap (#428bca, #3071a9, halo rgba(66,139,202,.4)) sous 768 px, et son libellé `span.text-danger` (Pouvoir) reste en couleur d'état.

**Approach:** Réécrire les anciennes règles (option 4, P1) : « Valider » mobile prend la paire arm, pleine largeur sous « Annuler », dans le flux ; l'onglet actif suit un seul modèle aux deux supports (fond et texte du thème, ≥ 4,5:1, aucun bleu), libellé coloré compris.

## Boundaries & Constraints

**Always:** paire arm `--kr-arm-bg/-ink/-bg-hover/-ink-hover` avec replis primary/white/primary-dark/white ; mobile = `@media (max-width: 767px)`, bureau = `(min-width: 768px)`, règles communes `@media (max-width: 767px), (min-width: 768px)` ; gardes `:where(...)` ; « Valider » reste dans le flux (P2 : barre fixe qui couvre la saisie, décision d'Arnaud 2026-10-23) ; ordre DOM natif et `order` actuels (Annuler puis Valider) ; contrastes texte ≥ 4,5:1 dans les 16 variantes ; déclarer `--kr-arm-ink-hover` seulement pour les variantes où le survol de « Valider » tombe sous 4,5:1 ; tests rouges avant le code puis contre-épreuves sur bundle muté hors dépôt (`KR_SCRIPT`) ; ne pas faire passer `btn-success` à 4 suites citantes.

**Never:** toucher aux pastilles (9f), à la croix (9g), à « ? Aide » et « Annuler » (`.kr-btn-secondary-subtle`, H5.3), à `.kr-order-viewport` ; aucun effet de focus clavier (ticket 3.7 abandonné : ne pas ajouter ni retirer de règle `:focus`) ; l'optgroup `#428bca` (2.7) ; git modifiant arbre/index/stash ; site réel ; Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Valider mobile | 375, 767 px, Dormir et Pouvoir, 16 variantes | fond --kr-arm-bg, texte --kr-arm-ink ≥ 4,5:1, aucun dégradé ni halo vert, largeur = largeur d'« Annuler » (pleine), sous « Annuler » | n/a |
| Valider survol mobile | 375 px, survol | fond --kr-arm-bg-hover, texte ≥ 4,5:1 | n/a |
| Valider bureau | 768, 769, 1280 px | rendu inchangé par rapport à la base | n/a |
| Onglet actif | 375, 767, 768, 1280 px, Dormir et Pouvoir (span.text-danger), 16 variantes | aucun #428bca/#3071a9 ni halo bleu ; texte (span compris) couleur du thème ≥ 4,5:1 sur son fond | n/a |
| Transition | même onglet 769 → 767 → 769 px | chaque largeur prend le rendu de son support | n/a |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` 1962-1977 (`@media (max-width: 768px)`) -- `.kr-btn-primary-enhanced` vert + halo, `!important` : à retirer.
- `kraland-theme.css` 2027-2039 (bloc mobile 1160-2065) -- `.bootbox-confirm .modal-footer` flex column ; 7667-7707 (`body.mobile-mode .bootbox.modal .modal-footer`) Annuler `flex:1; order:1`, Valider `flex: 2 !important; order:2` ; doublons 7028-7054 et 1706-1723 : un seul modèle de pied mobile (colonne, `flex: none`, largeur 100 %, `order` gardé).
- `kraland-theme.css` 2275-2306 -- paire arm déjà posée sur `.btn-primary` (bureau conforme) : réutiliser.
- `kraland-theme.css` 1739, 1745-1749, 1940-1952 -- onglet actif bleu / dégradé / halo / survol #f0f8ff sous 768 px : à retirer. 7224-7233 (mobile-mode, actif bg-elevated + text-accent + filet primary) et 3055-3061 (bureau bg-surface/text-primary) : converger vers un modèle unique ; 6955 et 1205 (actif en paire arm, battus) : supprimer si morts. 860 `.text-danger.text-danger` : l'actif doit faire hériter son span.
- `kraland-userscript-template.js` 9578-9595 `enhanceOkButton` (classe posée en mobile-mode), 9477-9479 `.kraland-modal-footer` -- JS peut rester si la classe n'est plus stylée.
- `kraland-theme.css` 162-268 -- `--kr-arm-ink-hover` absent de :root, empire-brun, theocratie-seelienne, paradigme-vert, khanat-elmerien, confederation-libre, royaume-ruthvenie, empire-brun-dark.
- `tests/e2e/modale-ordre.mjs` -- `OUVRIR` l.181, `attendre` l.587, `ETAT` l.193, `TEINTES` l.462, `CROIX` l.508, `verifierTeintes` l.1095-1146, `parVariante` à 375/1280 l.1250 : ajouter mesures `VALIDER` et `ONGLET` et leurs contrôles (matrice). Fixtures `tests/e2e/fixtures/modale-ordre/{plateau,dormir,pouvoir}.html`. Citer `kr-btn-primary-enhanced` dans la suite pour router le hunk.
- `tests/e2e/lib/variantes.mjs` -- `parVariante`, `CONTRASTE` (`window.__krContraste`).

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/modale-ordre.mjs` -- contrôles de la matrice, rouges sur la base -- preuve.
- [x] `kraland-theme.css` -- retirer vert, halo, bleu et flex contradictoire ; section dédiée « 9h » pour Valider mobile et onglet actif -- intent.
- [x] `kraland-theme.css` -- `--kr-arm-ink-hover` pour les variantes mesurées sous 4,5:1 au survol -- contraste.
- [x] `npm run build` puis contre-épreuves (vert remis, bleu remis) -- rouge attendu.

**Acceptance Criteria:**
- Given les pages Plateau, Forum et Kramail hors modale, when on compare au bundle de base, then aucun bouton ni onglet hors `.kr-order-modal` ne change.

## Implementation Notes

- Retirés : 9c `flex: 1 !important` du pied, survol #f0f8ff et onglet actif #428bca ; 9d dégradé bleu de l'onglet actif, `li a:active`, `.kr-btn-primary-enhanced` vert + halo et son `:active`. Nouvelle section 9h (pied mobile en colonne, boutons `flex: none` pleine largeur ; onglet actif commun bg-surface / text-primary sans ombre, descendants en `color: inherit`).
- « Valider » mobile n'a pas de règle propre : la paire arm de `.btn-primary` s'applique une fois le vert retiré. JS inchangé (`enhanceOkButton` pose une classe qui n'est plus stylée).
- `--kr-arm-ink-hover` non déclaré : survol de « Valider » mesuré ≥ 4,5:1 dans les 16 variantes, mobile et bureau.
- Règles 1205, 6955 et MODAL PERSONNAGE MOBILE (~7224) conservées : elles servent hors modale d'ordre (fixture de palette-nation : onglet actif en text-accent).
- Bootbox donne le focus à « Valider » à l'ouverture : le test attend la paire de survol quand le bouton a le focus.
- Rouge avant : 41 FAIL sur le bundle 2b46ef4 (`KR_SCRIPT`). Contre-épreuves dans /tmp/kr6 : vert remis 19 FAIL, bleu remis 1 FAIL (768 px), 9h retirée 41 FAIL.
- Comparaison calculée avec la base : bureau 768/769/1280 identique sauf le span.text-danger de Pouvoir (voulu) ; confirmations hors ordre ≥ 768 px identiques.
- Effet hors modale d'ordre, accepté : sous 768 px, le « OK » des confirmations Bootbox hors ordre perd aussi son vert et prend la paire arm (H5.1, épopée 3 ticket 2 : tout bouton primaire en action-bg) ; les onglets actifs de ces confirmations perdent le bleu et retombent sur la règle mobile commune. Noté dans revue-manuelle.md.

## Plan Change Log

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | Confirmations hors ordre changent sur mobile (« OK » vert → paire arm, onglet bleu retiré), contre le critère « hors .kr-order-modal inchangé » | low | patch (test) | Réel : les règles retirées visaient toute `.bootbox-confirm`. Effet conforme à H5.1 (bouton primaire en action-bg) et à la fin du bleu Bootstrap ; accepté et consigné en revue-manuelle. Manque un contrôle : ajouté sur le scénario HORS_ORDRE. |
| 2 | Aucun contrôle hors ordre / Plateau-Forum-Kramail | low | patch | Même racine que 1 pour le hors ordre ; Plateau/Forum/Kramail : chaque sélecteur modifié exige `.bootbox-confirm`, `.kr-order-modal` ou `.kraland-modal-footer`, absents de ces pages hors modale. |
| 3 | Règles contradictoires (`flex: 2 !important` ~7697, `flex: 1 !important` ~7034, column ~1995, actif bg-elevated ~7224) gardées et battues par spécificité | low | defer | Préexistantes et partagées avec les autres modales Bootbox mobiles ; leur retrait sort du périmètre de la modale d'ordre : nettoyage de l'épopée (2.7). |
| 4 | Gardes `html.kr-theme-enabled` au lieu de `:where()` ; règle `* { color: inherit }` sans garde | low | patch (2e partie) | `html.kr-theme-enabled` est la couche du thème (76 sélecteurs), pas une garde de page : false pour la 1re partie. La règle sans garde s'applique thème désactivé : garde ajoutée. |
| 5 | Pas de trace de la mesure `--kr-arm-ink-hover` ni des contre-épreuves | false | reject | Rapport de l'implémenteur : survol ≥ 4,5:1 mesuré dans les 16 variantes, rouge avant 41 FAIL, contre-épreuves 19/1/41 FAIL ; consigné en Implementation Notes. |
| 6 | Bureau comparé partiellement ; 768 px après élargissement sans réouverture | low | reject | Comparaison calculée avec la base faite (bureau identique sauf span voulu). À 768 px la base rendait le vert par erreur de seuil (`max-width: 768px`) : le nouveau rendu est le rendu bureau voulu. |

## Verification

**Commands:**
- `npm run build` ; `node tests/e2e/modale-ordre.mjs` ; `node tests/e2e/parler-viewport.mjs` ; `node tests/e2e/palette-nation.mjs` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL, router conforme, lint 0 erreur. (`test:all` : orchestrateur, machine calme.)

**Result (2026-10-23, after review patches):** `npm run build` ok ; modale-ordre 340 ok 0 FAIL ; parler-viewport 78 ok 0 FAIL ; palette-nation 0 FAIL ; `test:router` conforme ; lint:css et lint:js 0 erreur ; `npm run test:all` 6048 ok, 0 FAIL (machine calme). Contre-épreuve après patchs : vert remis 21 FAIL (dont les 2 contrôles hors ordre).
