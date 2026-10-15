# Références existantes — reprise sans réécriture de l’histoire

Ce document est un index rédigé lors du setup, pas une revue rétroactive ni une approbation produit. Aucun contenu joueur, capture privée ou pièce jointe n’est recopié.

## Base du setup

- Dépôt : https://github.com/arnaudroubinet/kraland-css
- Base `origin/feature/next` vérifiée : `ac0e63810c1cc1367aaacfdb413a8c55c9da4100`.
- Mandat d’installation : carte Hermes `t_a920e604`, décision Arnaud « b » pour installer la méthode complète ; PR séparée en brouillon, aucune fusion.
- Revue indépendante prévue : `t_0e8fb249`, dépendante du setup. Ce document ne préjuge pas son verdict.

## Sources dans cette base

| Source | Ce qu’elle apporte | Limite |
| --- | --- | --- |
| `CLAUDE.md` | Contraintes de langue, userscript, architecture InitQueue, CSS mobile/bureau, sources/générés et commandes | Documentation existante ; le setup ne la modifie ni ne la ratifie de nouveau |
| `package.json` | Commandes de build, validation, lint, routeur et suites de tests | Présence d’une commande ≠ exécution verte |
| `docs/MESSAGES-V3.md` | Mandat de la maquette mobile sombre, périmètre, composition, choix natifs et preuves rapportées | Rapport historique, pas nouvelle approbation ; avertissements et dettes de lint à conserver |
| `docs/AUDIT-MAP-IMAGES.md` | Audit existant des images | À consulter si le mandat porte sur les images ; aucune nouvelle conclusion ici |

Liens immuables :

- Contraintes : https://github.com/arnaudroubinet/kraland-css/blob/ac0e63810c1cc1367aaacfdb413a8c55c9da4100/CLAUDE.md
- Messages : https://github.com/arnaudroubinet/kraland-css/blob/ac0e63810c1cc1367aaacfdb413a8c55c9da4100/docs/MESSAGES-V3.md
- PR messages consultée via GitHub : https://github.com/arnaudroubinet/kraland-css/pull/15 ; état MERGED, commit de fusion `ac0e63810c1cc1367aaacfdb413a8c55c9da4100`.

## Décisions et preuves à retrouver, non à extrapoler

`docs/MESSAGES-V3.md`, sections « Mandat et périmètre » et « Composition livrée », attribue à Arnaud la maquette mobile sombre « Moins d’interface. Plus de message. » pour la carte `t_9503a580`. Cela ne valide pas un nouveau bureau ni l’ensemble du thème clair.

Ses sections « Vérification exécutée » et « Confinement réseau » rapportent notamment un total final M-1 de 3322 contrôles verts, 58 fragments, et une dette de lint préexistante. Ce sont des résultats historiques attribués à ce rapport, non des tests réexécutés par le setup. Les archives citées restent dans les attachments de `t_9503a580` : aucune copie dans cette PR et aucun nouveau contrôle de leur contenu ici.

La PR #15 fusionnée est vérifiée sur GitHub. Une fusion ne constitue pas, à elle seule, une preuve de toutes les validations UX ou de tests. Le rapport conserve lui-même les limites du confinement des autres suites et la nécessité d’une QA indépendante.

## Travail concurrent non importé

Le mandat signale `t_71e4af53` comme travail Kramail en cours. Aucun fichier de son checkout, aucune spécification de sa branche et aucun statut produit ne sont importés ici. Les changements locaux PLT du checkout principal ne sont pas non plus une source publiée de cette installation.

## Suite

Pour le prochain mandat, choisir l’initiative et produire seulement les artefacts nécessaires à son périmètre. Le setup n’invente ni brief/PRD approuvé pour l’application existante, ni backlog historique de stories terminées. Les décisions réellement nouvelles restent à Arnaud et aux spécialistes concernés.

## Décisions hors base

Documents de décision ou de preuve qui **ne sont pas dans la base `ac0e638`** de cette PR. Table construite le 15/10/2026 à partir de `git ls-tree`, `git log` et `gh pr list` sur les têtes distantes indiquées : chemin, tête observée, dates de premier et dernier commit qui touchent le fichier, état de la PR. Le contenu n’est pas recopié ; aucune validation n’est déduite du fait qu’une PR existe ou qu’un document est présent. Les têtes évoluent : relire la branche avant de s’y fier.

| PR | Branche (état observé) | Document | Tête observée | Commits touchant le document | État de la PR |
| --- | --- | --- | --- | --- | --- |
| #17 | `feature/kramail-redaction` | `docs/KRAMAIL-REDACTION.md` | `030608247ad2744058b484b217a27daddac61f2c` | `05b2a5c` 2026-10-14 17:21 +02:00 → `2856f66` 2026-10-14 21:18 +02:00 | ouverte, brouillon, base `feature/next` |
| #16 | `fix/parler-viewport-r103` | `docs/PARLER-VIEWPORT.md` | `cce97de83120468dd7a2c0eceacbb3c6db5e49fc` | `cce97de` 2026-10-13 22:03 +02:00 | ouverte, brouillon, base `feature/next` |
| #10 | `fix/plateau-plt07-jauges` | `docs/PLT-07-jauges.md` | `ef9105cc333b31cbe68bbe585fa744aee0872c5e` | `ef9105c` 2026-10-10 13:39 +02:00 | ouverte, non brouillon, base `fix/plateau-tranche-1` |
| #19 | `fix/menus-forums-actualisation` | `docs/MENUS-FORUMS.md` | `bd5a47e4010dc5841b1e4043a091c6f5873aba3a` | `3cbb9e5` 2026-10-15 09:32 +02:00 → `bd5a47e` 2026-10-15 17:07 +02:00 | ouverte, brouillon, base `feature/next` ; document postérieur au setup |
| #13 | `feature/tests-rapides` | aucun document de décision dédié sous `docs/` dans la base | fusionnée dans `feature/next` (`880a3f0`) | — | fusionnée le 2026-10-11 |
| #14 | `feature/sous-forum` | aucun document de décision dédié sous `docs/` dans la base | fusionnée dans `feature/next` (`7d1c533`) | — | fusionnée le 2026-10-12 |

Sont aussi ouvertes, sans document indexé ici : #9 (`fix/plateau-tranche-1`), #11 (`bmad/plt-qu-qualite-usage`), #12 (`bmad/forum-mobile-g01-f01-f06`).

**Attribution de la décision « b » :** réponse d’Arnaud dans le fil Discord du 14/10/2026 vers 20:58 CEST (18:58 UTC) à l’option « (b) méthode BMad complète dans le dépôt » proposée par le coach sous « Où ranger les décisions ? » ; la carte Hermes `t_a920e604` en est la transcription.

## Preuves de provenance durables

- Liste des 300 fichiers tiers (chemin, mode, blob Git) : [`preuves/blobs-tiers-300.tsv`](preuves/blobs-tiers-300.tsv), générée depuis l’index Git de ce dépôt et comparée à la liste de provenance d’origine (300 chemins, 300 blobs identiques).
- Contre-vérification indépendante : `git ls-tree -r 8f0d50e1817fdd8fcf05a20c524218222d13cd8d -- skills/<dossier>` sur le dépôt `bmad-code-org/BMAD-METHOD`, ou `skills-lock.json` (`ref` et `computedHash` par skill).
- L’archive `bmad-setup-preuves.zip` de la carte `t_a920e604` est un témoin historique : elle n’est pas modifiée. Le défaut m1 (clé `archive_exhaustive_locale` pointant un chemin machine de scratch, et liste exhaustive uniquement dans ce scratch éphémère) est corrigé par le présent fichier et par un supplément neutralisé joint à la carte `t_7fb4daf0`, dérivé du supplément d’origine (sha256 `e5a30a28c9b8cb1e73110de4f5b0f8ba537aa59c474369084869e1824ba734e1`, conservé inchangé par le coach).
