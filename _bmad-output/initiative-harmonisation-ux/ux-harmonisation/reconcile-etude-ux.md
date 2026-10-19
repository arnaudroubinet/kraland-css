---
type: reconcile
input: ../../../etude-ux.md
compared:
  - DESIGN.md
  - EXPERIENCE.md
memlog: .memlog.md, lu jusqu'à la ligne 78 (maquettes de référence demandées)
updated: 2026-10-19
---

# Rapprochement de la mission `etude-ux.md`

Étape « Inputs reconciled » de Finalize. La mission d'origine est comparée à DESIGN.md et EXPERIENCE.md ; le memlog fait foi sur les décisions d'Arnaud.

Renvois : M = `etude-ux.md`, D = DESIGN.md, E = EXPERIENCE.md, L = `.memlog.md`, suivis du numéro de ligne. IA = « Information Architecture ».

**Bilan.** Sur les 11 exigences : 9 couvertes, 2 partielles, aucune absente. Au détail (21 points) : 18 couverts, 3 partiels (déplacement ; ratios et proportions ; cohérence d'une page à l'autre), aucun absent. Aucune idée de fond n'est abandonnée. Un seul composant ne repose sur aucune décision du memlog : la Croix directionnelle et pièces, qui existe déjà.

**À reporter.** Q1 et Q2, bloquantes dans les documents, sont validées dans le memlog (L 76, L 77). DESIGN.md et EXPERIENCE.md les présentent encore comme `[ASSUMPTION]` (D 320-326, E 294-295).

## 1. Exigences de la mission

| # | Exigence | Où elle est traitée | Statut | Remarque |
|---|---|---|---|---|
| 1 | Point de vue du joueur (M 11, M 28) | D « Brand & Style » (233) ; E « Foundation » (20) ; E IA, colonne « Ce que le joueur y fait » (33-41) ; E « Key Flows » (235-288) ; L 10 | couverte | — |
| 2.1 | Boucle de jeu : plateau | E IA (36) ; Mini-profil, Panneau latéral du jeu, Onglets de section, Boutons d'accès rapide, Carte de personnage, Jauges ; H1.3 à H1.6, H3.1, H5.4, H6.1, H7.1, H11.1 ; parcours 1 et 4 | couverte | — |
| 2.2 | Boucle de jeu : ordres | E IA (37) ; Modale d'ordre (D 445, E 105), Pastilles coût, durée, potentiel, Alerte ; H2.1 à H2.7, H6.1 ; parcours 1 | couverte | — |
| 2.3 | Boucle de jeu : déplacement | E IA (38) ; Croix directionnelle et pièces (D 452, E 112, E 144) ; parcours 4 (E 278-288) | partielle | Aucune décision propre dans le memlog : seulement le principe (L 10) et le parcours (L 74). Règles reprises de « CX2 » et d'AGENTS.md. Ordinateur : « rendu actuel », sans relevé cité. |
| 2.4 | Boucle de jeu : personnage | E IA (39) ; Ligne de citoyenneté, Ligne d'objet, Panneau latéral du jeu, Carte de section ; H1.1, H1.4, H1.5, H3.1, H3.2, H4.1, H11.1 ; parcours 3 (Matériel) | couverte | Fiche Personnage, Bâtiments et Employés sans parcours (choix d'Arnaud, L 74). |
| 2.5 | Boucle de jeu : forum | E IA (40) ; Ligne de forum, Ligne de sujet, Fil d'Ariane, En-tête de sujet ; refonte de l'index (L 58-64), H1.2, H4.1, H12.2 à H12.4 ; parcours 2 | couverte | Q13 ouverte (« Envoyer » de la réponse, mobile). |
| 2.6 | Boucle de jeu : kramail | E IA (41) ; Onglets de section, Bouton « ••• », Éditeur de rédaction, Barre « Envoyer » ; H1.2, H9.1, H12.2, H13.1 ; parcours 3 | couverte | Ordinateur au rendu actuel (dossiers déjà libellés, E 193). |
| 2.7 | Boucle de jeu : notifications | E IA (35) ; Cloche des notifications, Ligne de notification ; E « State Patterns » (128-131) ; H8.1, H8.2, H14.1 à H14.3 ; parcours 1 | couverte | Q6 ouverte (popup de 600 px, sous le seuil mobile). |
| 3.1 | Couleurs (M 14) | D « Colors » (245-371) ; H2.2, H2.4, H2.7, H5.1 à H5.7, H8.1 | couverte | Q1 et Q2 validées dans le memlog (L 76-77), pas encore reportées. Valeurs d'états et de jauges en `[ASSUMPTION]` (Q3). |
| 3.2 | Placement (M 15) | D « Layout & Spacing », « Places fixes » (406-412) ; E « Responsive & Platform » (186-194) ; H1.3 à H1.5, H2.3, H2.5, H3.2, H14.2, H14.3, refonte de l'index | couverte | — |
| 3.3 | Ratios et proportions (M 16) | Nommés une seule fois (E 21). Traités par des valeurs : échelle 17/15/13/12 px et « aucun titre plus petit que le texte courant » (D 391 ; H3.1, H11.1) ; hauteurs (D 405) ; avatar de 70 px et nom (H7.1) ; colonne de date mobile (H14.2) | partielle | DESIGN.md n'énonce aucune règle de proportion. Interlignage non tranché (Q18). Largeurs de colonnes et grilles de cartes sur ordinateur non traitées, sauf la carte de personnage (H7.1). |
| 3.4 | Cohérence d'une page à l'autre (M 17) | D « Brand & Style » (237) ; E 21, E 197, E 209 ; la plupart des décisions H | partielle | Q18 (E 316) garde des écarts relevés sans décision : page courante de la pagination (5 rendus), grand titre présent ou absent selon la page, taille du titre de page mobile, interlignage (19 valeurs). |
| 4 | Ordinateur et mobile (M 11) | E « Foundation » (18) ; E « Responsive & Platform » (180-204) ; D « Layout & Spacing » (413) ; L 13 | couverte | Relevés mobiles par émulation : écart possible avec un vrai téléphone (Q17, L 19). |
| 5 | Au moins deux variantes contrastées (M 80) | Inventaire en `empire-brun-dark` et `kraland` (E 25, L 18) ; règle de vérification (E 204, E 213) ; maquette h05 sur trois variantes (D 314) ; contrastes sur les 16 variantes (D 353-371) ; L 13 | couverte | — |
| 6 | Accessibilité limitée aux joueurs voyants (M 32-34) | E « Accessibility Floor » (168-178), avec périmètre et hors-périmètre explicites (172) ; L 14 | couverte | La section ajoute « focus visible » (172, 178 ; H5.7), absent de la liste de la mission (M 34). H5.7 est validée ; sa place dans cette section reste à confirmer. |
| 7 | Aucun nouveau composant sans validation (M 29) | E « Foundation » (20) ; interdit en E 165 ; chaque composant de D « Components » cite sa décision ; L 10 | couverte | Voir § 3. |
| 8 | Corriger avant d'ajouter (M 30) | E 19 (« ce qu'il ne cite pas garde son rendu actuel ») ; E 20 ; E 227 ; décisions de correction (H1.1, H1.2, H2.x, H5.x, H10.1…) ; L 10 | couverte | Seuls ajouts : la refonte de l'index et l'extension H12.4, toutes deux validées. |
| 9 | Forum et plateau en références, révisables (M 9) | D 241 ; E 22 ; E 220-226 ; retouches : H4.1 (bande du forum), H6.1 (boutons du plateau), H6.3, H7.1, refonte de l'index ; L 12 | couverte | — |
| 10.1 | DESIGN.md : couleurs, typographie, espacements, formes, composants, à faire / à éviter (M 57) | « Colors » (245), « Typography » (373), « Layout & Spacing » (400), « Shapes » (420), « Components » (426), « Do's and Don'ts » (462) ; en plus « Elevation & Depth » (415) | couverte | `status: draft`. Dossier `initiative-harmonisation-ux/` au lieu de `harmonisation-ux/` (M 56), par décision d'Arnaud (L 8). |
| 10.2 | EXPERIENCE.md : IA centrée sur la boucle de jeu, patterns, états, interactions, réactivité, parcours (M 58) | IA (27 ; la boucle d'abord, 29-49), « Component Patterns » (86), « State Patterns » (124), « Interaction Primitives » (150), « Responsive & Platform » (180), « Key Flows » (235 ; les 4 parcours de L 74) | couverte | `status: draft`. |
| 11 | Pas de PRD, d'epics, de tickets ni de code (M 71) | E « Foundation », « Statut » (24) ; L 15 | couverte | Le dossier ne contient que les deux documents, le memlog, l'index, `.working/` (5 maquettes et la synthèse) et `imports/` (vide). Aucun bloc de code. `kraland-theme.css` et le template sont inchangés depuis le 2026-10-18. Seuls le bundle généré et `version.json` sont modifiés (2026-10-19 12:14, avant la création de l'initiative) : sans doute le `npm run build` de l'étape 0 (M 48). |

## 2. Idées qualitatives abandonnées

Aucune idée de fond n'est abandonnée. Les intentions de la mission se retrouvent dans D « Brand & Style » (231-243), E « Foundation » (15-25), E « Voice and Tone » (82) et E « Références et options écartées » (227) : le joueur vient pour jouer ; l'interface est lisible et claire ; un élément a un aspect et une place ; la leçon de l'essai précédent ; un ton léger. « Limpide » et « ergonomique » (M 11) n'y figurent pas en toutes lettres. Leur substance passe par « se lire d'un coup d'œil […] puis se faire oublier » (D 233), les cibles tactiles et les places fixes.

Absentes des deux documents :

- **Le « bénéfice joueur » de chaque hypothèse** (M 67). Il reste dans le memlog (L 21-72). Les documents ne gardent que la règle et l'identifiant H : sans le memlog, on ne lit plus ce que le joueur y gagne.
- **La comparaison avec le rendu natif** par le bouton de bascule (M 41, M 93). C'est un outil de méthode, sans effet sur l'apparence ni sur le comportement.

Reprises en partie :

- **Ratios et proportions** : voir le point 3.3.
- **La famille « tableaux »** de la synthèse (M 81) se réduit aux en-têtes de tableau (H5.3). Les marges internes relevées (8/8 ou 10/18 px, synthèse § 4) ne sont pas citées ; seule la grille H11.2 les couvre.

## 3. Composants sans décision du memlog

Les deux documents décrivent les mêmes 29 composants (D 426-460, E 86-120). Tous reposent sur au moins une décision du memlog, sauf un :

- **Croix directionnelle et pièces** : D 452 (avec le jeton `touch-target-dpad`, D 136, et les hauteurs, D 405) ; E 38, E 112, E 144, E 154, E 175 ; parcours 4 (E 278-288). Sources citées : « CX2 », AGENTS.md et H9.1. Or H9.1 (L 54) ne la nomme pas : seule sa règle générale de 44 px s'y applique. Le memlog ne cite la croix que dans le parcours 4 (L 74). C'est un composant existant, décrit au rendu actuel, donc pas un nouveau composant. Risque faible, mais ses valeurs (touches ≥ 48 px, encre ≥ 4,5:1, « ici », pointillé) ne sont pas validées dans cette étude.

Le seul composant vraiment nouveau, la **Ligne de forum**, vient de la refonte validée de l'index (L 58-64, maquette h12).

Choix sans décision dans des composants validés (pas de nouveau composant) :

- **Pastilles coût, durée, potentiel** au style de l'Étiquette de catégorie (D 446 ; Q5, E 303). H8.1 ne prévoit que deux familles, et H2.5 renvoie leurs couleurs à la palette. Q1 validée (L 76) les cite parmi les textes posés sur la couleur de nation, ce qui suppose un fond de nation ; le reste du style n'est pas tranché.
- **Bouton standard** pour « ••• », pour la flèche de l'index et pour « Nouveau sujet » (D 436, D 453, D 456 ; E 320).
- **Fond de l'Alerte** en couleur d'état à faible opacité (D 447). H2.3 fixe sa place, H5.5 sa palette ; aucune décision ne fixe son aspect.
- **En-tête de sujet** étendu à Communauté, Débats et Staff (H12.4, L 67). L'extension est validée, mais elle ajoute un fil d'Ariane sur des pages qui n'en ont pas. Or E 115 affirme : « Aucun fil d'Ariane ajouté sur les pages qui n'en ont pas (H12.3) ». Cette phrase doit réserver l'exception H12.4.

## 4. Autres écarts

- **9 variantes** (M 7) : les documents en comptent 16 (8 nations, en clair et en sombre), plus `high-contrast`, connue du JS seul (D 268, E 208). L'écart est ouvert en Q16 (E 314).
- **Page Citoyens** : inventoriée (synthèse, l. 3), mais absente du tableau des pages secondaires (E 55-65). Seule la règle « Toutes reçoivent les règles communes » (E 53) la couvre.
