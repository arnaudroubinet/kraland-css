# Note d'options : stratégie de cascade (P1)

Ticket 1.7. Décide comment les règles transverses des épopées 3 (couleurs), 4 (tailles et formes), 5 (cartes de section) et 9 (confort mobile) s'imposent face aux règles existantes.

Mesures du 2026-10-21 sur `kraland-theme.css` (14 905 lignes) et le template, en lecture seule. Méthode : un script retire les commentaires, prend chaque bloc `{…}` sans bloc imbriqué, découpe sur `;` et compte les segments qui contiennent `:` (déclarations) et `!important`. Un sélecteur est « gardé » s'il contient `page-` ou `kr-page`.

## Ce qui bloque

- 7 007 déclarations, dont 3 378 en `!important` (48 %) ; dans `@media (max-width: 767px)` : 2 538 sur 4 090 (62 %).
- Sections mobiles sans garde de page :

  | Section | Lignes | Déclarations | dont `!important` |
  |---|---|---|---|
  | PHASE 1-2 (conteneur, barre de navigation) | 3729–3855 | 63 | 100 % |
  | PHASE 3 ACCUEIL | 3856–4085 | 112 | 100 % |
  | PHASE 4 PLATEAU | 4086–4273 | 72 | 100 % |
  | PHASE 5 TOUCH | 4274–4460 | 64 | 100 % |
  | Forum v1, panneaux et titres (`body.mobile-mode .panel-default`) | 7513–7543 | 13 | 100 % |
  | NOUVEAU SUJET, partie sans garde (`.form-group`, `.panel-body`…) | 9445–9738 | 134 | 22 % |

  PHASE 5 impose `min-height: 44px` et `display: inline-flex`, en `!important`, à `a:not(.list-group-item)`, `button`, `.btn` et `input[type=button|submit|reset]` sur toutes les pages mobiles.
- Une règle transverse n'a pas de garde de page. Sans `!important`, elle perd contre ces sections quelle que soit sa spécificité. Avec `!important`, elle doit égaler leur spécificité : la règle l.7526 (`body.mobile-mode .panel-default > .panel-heading`) vaut (0,3,1). Le fichier compte déjà 68 lignes qui dopent la spécificité par `html body …` (ex. l.14856, lot « Messages v3 »).
- Classes de page : le JS pose sur `body` celles de l'accueil, du forum (et de sa racine), du kramail (et de sa rédaction), des événements et de Cybermonde, et sur `html` `kr-page-members` (Membres) et `kr-page-report` (Notifications). Les cinq pages de jeu, Contacts, Règles, Interface, Aide et Statistiques n'en ont pas : on ne peut pas y garder une règle. AGENTS.md écrit la garde `:where(html.x)` (spécificité nulle) ; une classe posée sur `body` et gardée en `body.mobile-mode:where(.page-x)`, comme au lot 1, ajoute (0,1,1).
- 78 styles posés en ligne en `!important` par le JS (65 `setProperty(…, 'important')`, 13 dans `style.cssText`), dont `applyMobileCriticalStyles` (marges latérales à 0) : aucune feuille ne les bat, quelle que soit l'option.

## Options

1. **Battre** : chaque règle nouvelle surenchérit (spécificité dopée, `!important`) sur les sections existantes, sans les toucher.
   - Pour : aucun défaut natif révélé.
   - Contre : surenchère sans fin, contraire à la garde `:where()` d'AGENTS.md ; l'ancien style reste actif partout ailleurs.
2. **Garder par page** : poser une garde à spécificité nulle sur chaque section nue, en ajoutant les classes de page manquantes sur `html` (`kr-page-jeu`, `kr-page-regles`…) pour écrire `:where(html.kr-page-x)`. C'est ce que le lot 1 a fait pour le forum (H1.1).
   - Pour : chaque section ne vaut plus que sur sa page ; risque borné page par page.
   - Contre : sur ces pages, les règles transverses restent en concurrence avec les anciennes ; une garde retire l'effet ailleurs et peut révéler un défaut natif, à vérifier chaque fois.
3. **Retirer d'un coup** : supprimer toutes les sections nues et reconstruire avec les jetons et composants de DESIGN.md.
   - Pour : cascade propre, plus de concurrence.
   - Contre : la plus large régression possible en une fois ; PHASE 1-5 seules portent 311 déclarations mobiles, sans compter les autres sections nues.
4. **Retirer par domaine** (hybride) : l'épopée qui reprend un domaine retire ou réécrit les règles anciennes de ce domaine, et garde par page (option 2) ce qu'elle conserve. Les classes de page manquantes sont ajoutées sur `html` au premier besoin.
   - Pour : chaque retrait est couvert par les tests et la validation visuelle de l'épopée qui le fait ; plus de surenchère.
   - Contre : l'ancien et le nouveau coexistent entre deux épopées.
5. **Couche CSS** (`@layer`) pour les règles transverses, en `!important` : un `!important` en couche bat un `!important` hors couche, quelle que soit la spécificité.
   - Pour : les règles transverses gagnent sans doper la spécificité.
   - Contre : une déclaration normale en couche perd contre le CSS du site (Bootstrap, hors couche), donc toute règle en couche doit être en `!important` : un nouvel étage de surenchère, et une règle de page en couche ne pourra plus corriger une règle transverse sans entrer elle aussi en couche.

**Recommandation : option 4.** Elle prolonge la garde par page du lot 1 (option 2), seule méthode déjà vérifiée ici, en y ajoutant le retrait des anciennes règles par l'épopée qui reprend leur domaine. Le risque est réparti dans des épopées testées, et la garde `:where(html.x)` d'AGENTS.md est respectée.

## Règle commune aux deux supports

AGENTS.md interdit le style global. Aujourd'hui : 77 sélecteurs dupliqués dans une paire `max-width: 767px` / `min-width: 768px`, une seule liste combinée `@media (max-width: 767px), (min-width: 768px)` (l.13543) et 605 règles globales héritées.

Recommandé avec l'option retenue : la **liste combinée**, une seule règle conforme à la lettre d'AGENTS.md, plutôt que la paire dupliquée, deux copies à tenir égales.

Constat annexe : des requêtes contredisent les conventions d'AGENTS.md. Quatre blocs `(max-width: 768px)` (l.1426, 1730, 9980, 11632) et un `(min-width: 769px)` (l.9795) s'écartent du seuil 767/768. Trois requêtes d'ordinateur utilisent `max-width` (l.8106, 12384, 12578). Les épopées qui les touchent les alignent.

## Décision

- Decision (Arnaud, 2026-10-21) : **option 4, retirer par domaine.** L'épopée qui reprend un domaine retire ou réécrit les règles anciennes de ce domaine et garde par page, en `:where(html.kr-page-x)`, ce qu'elle conserve ; les classes de page manquantes sont ajoutées sur `html` au premier besoin.
- Assumption : règle commune aux deux supports en liste combinée `@media (max-width: 767px), (min-width: 768px)`, recommandée avec l'option 4 et non tranchée explicitement.
