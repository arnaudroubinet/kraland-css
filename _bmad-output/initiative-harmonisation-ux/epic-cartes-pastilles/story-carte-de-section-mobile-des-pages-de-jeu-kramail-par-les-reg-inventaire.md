# Entrée 5.1 : inventaire des règles de l'en-tête de panneau mobile

Annexe du plan `story-carte-de-section-mobile-des-pages-de-jeu-kramail-par-les-reg-plan.md`. Relevé sur `317b5b7` (`kraland-theme.css`, `kraland-userscript-template.js`, Bootstrap 3.3.7 embarqué), en lecture seule.

Méthode : chaque fixture est servie sous son URL, avec la variante Kraland clair (Empire Brun sombre en contrôle), à 375, 767, 768 et 1280 px. Pour chaque `.panel.panel-default`, on relève par CDP la géométrie du panneau, de l'en-tête, du corps et du titre, avec la règle gagnante de chaque propriété. Une simulation a ensuite mesuré la cible : un bundle reconstruit hors dépôt (`/tmp`) avec les réécritures de la section 4. Les lignes citées sont celles de `317b5b7`.

## 1. Mesures de la base (375 et 767 px, Kraland clair)

| Fixture (URL) | Panneaux | Panneau | En-tête | Corps | Titre |
|---|---|---|---|---|---|
| jeu-materiel (`/jouer/materiel`) | 7, dont 1 sans en-tête (`.panel-default.well`, mb 15) | x 0, pleine largeur, fond transparent, mb 16 | 50,7 px (16 + 18,7), mb 12, rayon 8 aux 4 coins, fond surface | 16 px, transparent | 17 px 700 text-primary |
| jeu-perso (`/jouer/perso`) | 2 (Citoyenneté, Maladies) : ni corps, ni icône, ni chevron | idem | idem | aucun | idem |
| jeu-batiments (`/jouer/bat`) | 2 ; le module ne marque que le 1er (« Bâtiments Privés (1/3) ») | idem | idem | 16 px | idem |
| jeu-employes (`/jouer/pnj`) | 3, chevron natif | idem | idem | 16 px | idem |
| jeu-plateau-objets (`/jouer/plateau`) | 2 (Commerce, Matériel) : pas d'icône, module | idem | idem | 16 px | idem |
| kramail-reception (`/kramail/personnage-fictif-2000-0`) | 1, chevron natif | x 0, mb 0 (l.8952) | idem (la règle kramail l.8956 est battue) | 0 (l.8974) | 17 px 700 **text-accent** (l.8965) |
| kramail-envoi (`/kramail/personnage-fictif-2000-1`) | 1 | idem réception | idem | 0 | text-accent |
| regles-recherche (`/regles/base`) | 2 | x 0, mb 16 | 50,7, mb 12 | 16 | text-primary |
| cybermonde-ville (`/map`) | 3, dont « Bâtiments » marqué par le module | x 0, mb 16 | 50,7, mb 12 | 16 | text-primary |
| sous-forum-debuter (`/forum/hrp/debuter-20102`) | 2 | x 0, transparent | 45 px, bande, filet 1 px, rayon 0 (l.8296) | 0 | text-primary (sous-forum) |
| forum-index-rp (`/forum/rp`) | 1 | idem sous-forum | idem | 0 | text-primary (index) |
| forum-racine (`/forum`, `page-forum-racine`, pas `page-forum`) | 1 | x 0 | 44 px, mb 12, rayon 8, fond surface : **règle commune** (l.7839) + index (l.14620, `padding-top: 0`) | aucun | text-primary (index) |

Repli du module (375 et 767) : panneau replié de 95 px = en-tête 51 + mb 12 + 32 px de retrait vide du corps (`max-height: 0`, retrait 16 gardé). Invisible aujourd'hui, car le corps est transparent.

Fond de page : `body` blanc en clair (Bootstrap ; `--kr-bg-page` n'est posé qu'en sombre, l.2844) ; `--kr-bg-page` en sombre (Empire Brun sombre : page `rgb(18,16,13)`, surface `rgb(30,26,21)`). En sombre, `.panel-body` porte aussi le fond surface (l.2873, global).

À 768 et 1280 px : `body.mobile-mode` absent, aucune de ces règles ne s'applique.

## 2. Règles en jeu

| Ligne | Média | Sélecteur | Déclarations | Statut mesuré | Cible |
|---|---|---|---|---|---|
| 4334-4336 | mob | `.panel` | `margin-bottom: S4 !important` | gagne | inchangée |
| 4337-4343 | mob | `.panel-heading` | `padding: 10px 15px !important` ; flex, `align-items`, `flex-wrap`, `gap: S2` (tous `!important`) | `padding` battu sur toutes les fixtures du tableau 1 (A12 de 4.9) ; flex et `gap` gagnent | `padding` : réécrit ou retiré selon le relevé de la tâche 3 du plan |
| 4345-4350 | mob | `.panel-heading .pull-right` | `margin-left: auto`, flex | gagne (chevron natif à droite) | inchangée |
| 4352-4354 | mob | `.panel-body` | `padding: S4 !important` | gagne | garde `:where(:not(.building-section-content.collapsed))` |
| 6069-6071 | mob | `body.mobile-mode .building-section-header > span.pull-right.clickable` | `display: none !important` | gagne | inchangée |
| 6370-6420 | **global** (hors média) | `body.mobile-mode .building-section-header`, `:hover`, `:active`, `.accordion-icon`, `.expanded .accordion-icon`, `.building-section-content`, `.collapsed`, `img.img-responsive` | curseur, fonds survol/appui, icône `position: absolute; right: 12px; top: 50%`, repli `max-height` | gagne | déplacé dans `@media (max-width: 767px)` ; icône dans le flux (`margin-left: auto`) ; repli à retrait vertical 0 |
| 7831-7836 | mob | `body.mobile-mode .panel-default` | fond transparent, sans bordure ni ombre (`!important`) | gagne hors kramail et forum | carte : fond surface, retrait latéral S2 |
| 7838-7846 | mob | `body.mobile-mode .panel-default > .panel-heading` | fond surface, sans bordure, rayon md, `padding: 16`, `margin-bottom: 12`, `align-items` (`!important`) | gagne sur toutes les fixtures sauf `/forum/…` | `padding: 0 S4`, `margin-bottom: 0`, `min-height: 48px` |
| 7848-7853 | mob | `… > .panel-heading h3` | 17 px, 700, marge 0, text-primary | gagne hors kramail (couleur) et forum | inchangée (garde de page) |
| 8289-8316 | mob | `body.page-forum .panel-default`, `> .panel-heading`, `> .panel-body`, `h3` | bande du forum | gagne sur `/forum/…` (même spécificité, plus tard) | inchangée (entrée 2) |
| 8949-8954 | mob | `body.page-kramail .panel.panel-default` | `margin: 0`, `background: transparent` (+ bordure, ombre) | gagne (0,3,1) | `margin` et `background` retirés |
| 8956-8960 | mob | `body.page-kramail .panel-heading` | `12px 16px`, transparent, filet bas | **battue partout** (0,2,1 < 0,3,1) | retirée (contraire et morte) |
| 8962-8966 | mob | `body.page-kramail .panel-heading h3.panel-title` | 17 px, 700, `color: text-accent` | couleur gagne | `color` retirée |
| 8974-8976 | mob | `body.page-kramail .panel-body` | `padding: 0 !important` | gagne | inchangée (A5 du plan) |
| 9813-9815 | mob | `.panel-body` | `padding: var(--mobile-spacing-lg)` | battue par l.4352 | inchangée ; battue par le repli (0,3,1) quand l.4352 est gardée |
| 2873-2876 | global | `html[class*="-dark"] .panel-body` | fond surface | gagne en sombre | inchangée ; coins bas pris par la règle du corps de la carte |
| 746-749, 650-665 | combiné | `.panel > .panel-heading` (rayon md − 1), `.panel-heading` (12 16) | | battues sur mobile | inchangées |
| 14620-14630 | mob | `:where(html.kr-page-forum-index) #col-right .panel-default > .panel-heading` | `padding-top: 0`… | gagne sur l'index et la racine | inchangée (entrée 2) |

Template : module `Panel Sections Collapse`, l.2522-2575 (mobile au chargement seulement ; noms `Bâtiment`, `Commerce`, `Matériel` ; 1er `h3.panel-title` qui contient le nom ; classes `building-section-header` / `building-section-content`, `expanded` / `collapsed` ; chevron natif masqué en ligne). Aucun changement de template.

## 3. Pages touchées hors liste du ticket

La règle commune n'a pas de garde de page (commentaire « jusqu'au lot 5, H4.1 »). La carte la reprend avec la même portée, forum exclu : règles (`/regles/…`), Cybermonde (`/map`, panneau « Bâtiments » marqué par le module), Interface du profil, toutes les pages du kramail (réception, envoyés, corbeille, répondre, transférer), panneaux `.panel-default` des modales d'ordre (`modale-ordre/dormir.html`, `pouvoir.html`). Elles reçoivent la carte et sont vérifiées (plan, A3).

## 4. Simulation de la cible (bundle reconstruit hors dépôt)

Réécritures simulées : section 2, colonnes « Cible », avec la règle commune scindée (forum figé, autres pages en carte) et le corps final arrondi non simulé (A7).

| Fixture | 375 et 767 px |
|---|---|
| jeu-materiel, jeu-perso, jeu-batiments, jeu-employes, jeu-plateau-objets, regles, cybermonde | panneau x 8, largeur viewport − 16, fond surface, rayon 8 ; en-tête 48 px, mb 0, retrait 0/16 ; corps 16 ; titre 17 px 700 text-primary |
| kramail-reception, kramail-envoi | idem, corps 0, panneau mb 16 (l.4334 reprend la main), titre text-primary |
| sous-forum, index RP, racine | égaux à la base, ligne à ligne |
| module (bâtiments, plateau, cybermonde) | icône à 16 px du bord droit de l'en-tête, centrée (24/24) ; replié : panneau 48 px, corps 0 de haut, retrait 0 ; déplié : hauteur d'origine |
| toutes | `scrollWidth` = viewport (pas de débordement horizontal) |
| Empire Brun sombre | carte surface `rgb(30,26,21)` sur page `rgb(18,16,13)`, titre `rgb(245,241,237)` ; corps surface à coins carrés (A7) |

À 768 et 1280 px : les 6 fixtures de jeu et kramail sont égales à la base, ligne à ligne.

Sans la garde de l.4352, le panneau replié restait à 80 px (48 + 32) : l.4352 (`!important`) gagne sur le repli.
