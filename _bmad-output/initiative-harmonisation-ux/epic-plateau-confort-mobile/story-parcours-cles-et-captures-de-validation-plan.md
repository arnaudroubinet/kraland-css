---
title: 'Parcours clés et captures de validation'
type: 'chore'
ticket: '11'
created: '2026-10-29'
status: 'in-review'
baseline_revision: '7bec45299cd1427408b3a9c7889e0eaa3ef1326a'
route: 'one-shot'
route_source: 'auto'
risk: 'low'
review: 'hitl'
review_source: 'pinned'
lenses_ran: []
review_loop_iteration: 0
context: ['../ux-harmonisation/EXPERIENCE.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** les entrées 1 à 10 et 13 de l'épopée ont chacune leurs tests, mais personne n'a rejoué bout à bout les quatre parcours clés d'EXPERIENCE.md (Key Flows), et Arnaud n'a pas de jeu de captures à jour pour juger le rendu (CAP-10).

**Approach:** captures sur fixtures (bundle courant, Playwright, réseau confiné) en Kraland clair et Empire Brun sombre, puis les quatre parcours joués en émulation mobile (375×667, isMobile, hasTouch) et à 1280×720, avec mesures à chaque étape : cibles par boîte et `elementFromPoint`, marge de 16 px, débordement horizontal, recouvrement. Décision d'Arnaud : « Tu testes via émulateur, ça me suffit. Quand tout sera fini (tous les tickets), je ferai une passe manuelle, pas avant. »

## Boundaries & Constraints

**Always:** fixtures du dépôt et documents générés par le script seulement ; Chromium Playwright local, `confineNetwork` dès la création du contexte ; deux variantes ; captures et scripts hors dépôt (`/Users/arnaud/kraland-css-captures/9.11/`) ; chaque écart relevé avec ses mesures.

**Never:** aucune modification de `kraland-theme.css`, du template, du bundle ni de `tests/` ; aucune action de jeu ni soumission (« Valider » et « Envoyer » mesurés, jamais touchés ; `submit`, `form.submit` et `requestSubmit` neutralisés et journalisés) ; aucune requête vers `/report` hors fixture ; ni site réel ni Chrome 9222/9223 ; aucune écriture git, aucun `npm install`, pas de `test:all`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Étape d'un parcours | page de fixture, 375 mobile ou 1280 | cibles ≥ 44 px (48 pour la croix) aux cinq points, texte à ≥ 16 px des bords, aucun débordement | écart consigné avec mesures |
| Lien suivi | flèche, Répondre, onglet, enveloppe, Nouveau message, direction | GET de document servi par la fixture visée, rien d'autre | lien absent ou couvert : écart |
| Envoi | « Valider », « Envoyer » | jamais touchés ; journal `__envois` vide | envoi détecté : écart bloquant |
| Fixture incomplète | élément absent de la fixture | limite notée, contournée par une autre fixture | aucune |

</frozen-after-approval>

## Code Map

- Aucun fichier de code modifié.
- `/Users/arnaud/kraland-css-captures/9.11/travail/harnais.mjs` -- contexte confiné, fixtures servies par chemin (`docs.servir` pour suivre un lien), sondes `window.open` et envois, bundle évalué dès que `body` existe.
- `/Users/arnaud/kraland-css-captures/9.11/travail/captures.mjs` -- 168 captures et 10 planches ; journal `captures.json`.
- `/Users/arnaud/kraland-css-captures/9.11/travail/parcours.mjs` -- quatre parcours × deux supports × deux variantes ; mesures par `tests/e2e/lib/marges.mjs` (`CIBLE_PAGE`, `ecartsCible`, `TEXTES_HORS_MARGE_PAGE`) ; journal `parcours.json`, sortie `parcours.txt`.

## Tasks & Acceptance

**Execution:**
- [x] Captures des pages clés à 1280×720, 1440×900, 1920×1080 et 375×667, deux variantes.
- [x] Mini-profil du plateau plié et déplié, à 375 et 700 px.
- [x] Cartes de personnages à 1100, 1280 et 1500 px.
- [x] Forum des épopées 5 et 6 (rétro 5 A10, rétro 6 A8) : racine, index RP, HRP, Débats, Communauté, sous-forum, sujet, sujet Communauté.
- [x] Kramail contre forum : non refait, voir `/Users/arnaud/kraland-css-captures/7.9/`.
- [x] Quatre parcours en émulation, 375 mobile et 1280, deux variantes : 52 étapes, dont 50 mesurées et 2 non applicables.
- [ ] Validation d'Arnaud des captures et des parcours (hitl), à sa passe finale.

**Acceptance Criteria:**
- Given les captures, when Arnaud les parcourt à sa passe finale, then chaque page clé, le mini-profil et les cartes sont visibles dans les deux variantes aux largeurs demandées.
- Given les quatre parcours, when on relit `parcours.txt`, then chaque étape a ses cibles et ses écarts mesurés, et aucun envoi n'a eu lieu.
- Given un écart, when on lit ce plan, then il est reporté en D9.n, avec ses mesures et la mention « accord d'Arnaud attendu à la passe finale ».

## Implementation Notes

- Fixtures par étape : P1 `cloche-notifications` (/accueil), `report-non-lu`, `plateau-qualite-usage`, `modale-ordre/plateau` + `dormir` (ouverte par `bootbox.confirm`, comme le site) ; P2 `forum-index-rp`, `forum-sujet`, `typographie-forum-redaction` ; P3 `plateau-qualite-usage`, `jeu-materiel`, `kramail-reception`, `kramail-nouveau` ; P4 croix générée (copie de `fixtureHtml` de `croix-directionnelle.mjs`), `plateau-cartes-noms`.
- Le personnage s'appelle « Joueur » (plateau) ou « Perso d'Essai » (matériel) dans les fixtures, pas « Nerys » : différence de fixture, pas un écart.
- `jeu-materiel` n'a pas d'enveloppe : P3 prend l'enveloppe de la barre de `cloche-notifications` (/accueil).
- La croix n'existe qu'en mobile ; à 1280, P4 suit une pièce native.
- « ? Aide » de la modale est dans le corps défilant : mesuré après `scrollTop` du corps de la modale à son maximum, puis `elementFromPoint` aux cinq points (le `scrollTo` de la fenêtre ne l'atteint pas ; avant défilement, le pied de la modale le couvre, ce qui est attendu).
- Google Fonts refusé sur `modale-ordre/plateau` (`main.css` natif de la fixture) : bruit connu, sans effet.
- Variantes : `kraland` (« kraland-clair » dans les noms de fichiers) et `empire-brun-dark` (« empire-brun-sombre »).

## Result

**Parcours** : les quatre parcours vont au bout dans les deux supports et les deux variantes, liens suivis par GET de fixture seulement, `__envois` vide partout, aucune requête `/report` (la cloche ouvre la fonction native : `window.open('report', 'private_report', 'width=600,height=600,…')` en mobile, 900×800 sur ordinateur). 52 étapes : 36 sans écart, 14 avec écart, 2 non applicables (P4 « échec » à 1280 : croix mobile seule). Les 14 se ramènent à trois écarts réels (D9.2 à D9.4), à un écart connu hors périmètre (D9.5) et à des faux positifs ou exclusions connues (ci-dessous). Aucun débordement horizontal, ni dans les parcours ni dans les 168 captures. Aucune erreur de page.

Conformes, mesurés (375 mobile, sauf mention) :
- P1 : pastille de la cloche 16×16, 12 px, 700 ; cloche et enveloppe 44×44. Notifications : sélecteur 353×44 à 17 px du haut (bordure de 1 px comprise), date 13 px, texte 15 px, filet de 4 px du non-lu. Onglet mobile Agir actif 55×63, 600, filet de 3 px primaire ; les cinq onglets mobiles mesurés (Agir 55, Matériel 75, Personnage 96, Bâtiments 86, Employés 85, hauteur 63), Personnage au bord droit couvert (D9.2) ; tuile Dormir 95×64 ; en-tête du mini-profil 343×65. Modale : avertissement sous le titre, en `sticky`, visible au défilement du corps (143 px) ; « ? Aide » 88×46 ; pastilles au-dessus des boutons ; « Annuler » puis « Valider » 321×44 sur un dialogue de 355, fond de la nation. À 1280 : flèche, boutons de 34 px, popup 900×800.
- P2 (1280) : flèche 34×34, auteur 13 px en couleur d'accent, le sujet s'ouvre sur `#msg6900001`, « répondre » 100×34, « Envoyer » 77×34, 14 px. En mobile : flèche 44×44, « Répondre » 175×44, « Envoyer » 120×48.
- P3 : en mobile, l'onglet Matériel de la barre d'onglets (`.mobile-tab-bar a[href="/jouer/materiel"]`) est touché, et non plus l'accès rapide ; il devient actif (79×63, 600, filet de 3 px), mais son bord droit est couvert par Personnage (D9.2) ; en-tête de carte 359×48, titre 17 px ; Lanterne : nom 15 px, charge 13 px calée à droite (x 293-343) ; Réception, Envoi, Corbeille 114×52 ; Nouveau message, Contacts, « ••• » 44×44 ; zone de saisie jamais couverte après saisie ; « Envoyer » 120×48, dans le flux (`position: static`).
- P4 : touches de la croix 50×50, pièces 60×60, pièce courante « ici » ; le plateau se recharge ; cartes : noms 15 px entiers, « PNJ » 12 px 700, actions 44×44, aucun chevauchement. Échec : Sud seul, les trois autres touches sans lien, en pointillé (`dashed`). À 1280, l'étape « échec » est non applicable (croix mobile seule).

Écart connu hors périmètre, reporté en D9.5 : `button.kd-contacts` 105×40 (rédaction du kramail, 375). EXPERIENCE P3 étape 5 et H9.1 demandent ≥ 44 px ; 9.9 l'a laissé hors périmètre (`<button>`, épopée 4).

Faux positifs et exclusions, non reportés :
- « Se déplacer » à 12 px : titre de la croix masqué (`clip-path: inset(50%)`, 1×1), non visible ; l'outil ne repère que `.sr-only`. Le bloc de la croix garde 12 px de padding latéral (touche Ouest à x 12, dernière pièce à 12 px du bord droit) : cibles, pas texte, hors règle des 16 px.
- « ••• » absent à 1280 : mobile seulement, attendu.
- Actions des cartes 24×24 à 1280 : la règle des 44 px est mobile.

### Reports proposés

Numérotation à partir de D9.2 (seul D9.1 existe, plan 9.5) ; à renuméroter si un ticket parallèle a pris ces numéros.

- **D9.2 — Barre d'onglets mobile : libellés longs plus larges que leur case de 75 px.** Chaque `li` de `.mobile-tab-bar` est en `flex: 1 1 0` (75 px) ; chaque `a` est en `inline-flex`, `nowrap`, avec 16 + 16 px de padding. Personnage (96 px), Bâtiments (86) et Employés (85) débordent donc de leur case sur toutes les pages, actifs ou non ; le demi-gras de l'actif n'ajoute qu'environ 4 px (Matériel actif 79 px pour 75). Plateau, 375 : Personnage `a` 150-246 dans `li` 150-225, Bâtiments 225-311 dans 225-300, Employés 300-384,7 dans 300-375. Les cibles se chevauchent : au bord droit de Personnage et de Bâtiments (et de Matériel actif), `elementFromPoint` tombe sur l'onglet suivant. La barre fait 385 px pour 375 ; sur la page personnage elle défile de 10 px et coupe Agir à x −10. Le filet de l'actif passe sous l'onglet suivant et les libellés se touchent presque. Accord d'Arnaud attendu à la passe finale.
- **D9.3 — Accès rapides du plateau mobile : première case des accès rapides plus haute de 8 px.** `.kr-quick-access-buttons` (fixture `plateau-qualite-usage`, 375) : Agir 152×52 à y 344, les autres cases 152×44 (Matériel à y 352). Cause : la règle mobile `.btn + .btn:where(:not([data-kr-dossier])) { margin-top: 8px !important }` (`kraland-theme.css` l.4895) bat le `margin: 0` de la grille (l.12569) ; seule la première case y échappe. Ce n'est pas l'état actif : avec l'actif déplacé sur Matériel, Agir reste à 52 px (contre-épreuve de la revue). Sur mobile, l'absence de gras et de filet de l'actif est voulue (règle l.12538 limitée à `min-width: 768px`, cohérente avec EXPERIENCE). Ces boutons doublent la barre d'onglets et sont masqués sur la page matériel : vérifier sur le vrai plateau s'ils s'affichent. Accord d'Arnaud attendu à la passe finale.
- **D9.4 — /accueil sans marge mobile.** /accueil porte `body.page-accueil` mais est absent de `KR_PAGE_CLASSES` (pas de `kr-marge-mobile`) : texte du contenu à 0 px du bord à 375 (paragraphe synthétique de `cloche-notifications`). Hors périmètre des entrées 1 et 4 et du spike 9.3 ; à relever sur le vrai site avant toute décision. Accord d'Arnaud attendu à la passe finale.
- **D9.5 — Bouton Contacts de la rédaction du kramail sous 44 px.** `button.kd-contacts` 105×40 à 375, en absolu dans le champ Destinataires (343×44). EXPERIENCE P3 étape 5 et H9.1 demandent ≥ 44 px ; 9.9 l'a laissé hors périmètre (`<button>`, épopée 4). Écart connu hors périmètre. Accord d'Arnaud attendu à la passe finale.

Clôture (orchestrateur, 2026-10-29) : partie agent commitée (`9759352`) directement sur `feature/next`, sans branche de fusion ni `test:all` (documentation et captures hors dépôt) ; reports D9.2 à D9.5 dans `deferred-work.md`. Partie hitl (les 4 parcours joués par Arnaud en Kraland clair et Empire Brun sombre, validation des planches de `/Users/arnaud/kraland-css-captures/9.11/`) ouverte jusqu'à la passe finale d'Arnaud ; ticket laissé `in-review`.

## Verification

**Commands:**
- `node /Users/arnaud/kraland-css-captures/9.11/travail/captures.mjs` -- « 168 captures, 0 échecs » ; seule requête refusée hors bruit : Google Fonts sur `plateau-ordre`.
- `node /Users/arnaud/kraland-css-captures/9.11/travail/parcours.mjs > parcours.txt` -- « 2 étapes non applicables / 36 étapes sans écart / 14 avec écart ».

**Manual checks (if no CLI):**
- Planches `/Users/arnaud/kraland-css-captures/9.11/planches/` : parcours 1 à 4, mini-profil, cartes, forum des épopées 5 et 6.
- `git status` -- seuls ce plan, `deferred-work.md` et `revue-manuelle.md` changent.
