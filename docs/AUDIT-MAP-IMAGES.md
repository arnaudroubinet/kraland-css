# Audit réseau des images de carte (map/1, map/1b → map/5)

Généré par `node tests/e2e/audit-map-images.mjs --online` le 2026-10-10T14:39:56.020Z. Ne pas éditer à la main.

## Source d'inventaire

Index Apache officiels du serveur d'images, accessibles en GET sans authentification :

- `http://img7.kraland.org/2/map/` (liste des variantes) puis un index par variante (`http://img7.kraland.org/2/map/<variante>/`).
- Aucune plage numérique devinée ; aucun nom relevé sur le plateau. `robots.txt` absent (404) : rien n'interdit la lecture, la concurrence reste faible (3 requêtes, pause 120 ms) et un cache évite les relectures.

## Couverture

Variantes présentes dans l'index racine (16) : `0` (82 fichiers), `1` (558 fichiers), `2` (481 fichiers), `3` (478 fichiers), `4` (481 fichiers), `5` (478 fichiers), `1b` (548 fichiers), `1c` (470 fichiers), `1d` (462 fichiers), `2b` (481 fichiers), `3b` (478 fichiers), `4b` (481 fichiers), `5b` (478 fichiers), `_3` (478 fichiers), `_3b` (478 fichiers), `_back` (6 fichiers).

- **Matrice de présence** (d'après les index, toutes variantes) : `1` 558 noms, `1b` 548 noms. Détail dans `tests/e2e/fixtures/map-inventory.json` (clé `matrix`).
- **Vérification réseau (GET + décodage)** : chaque nom de `map/1` et de `map/1b`, dans sa variante source ET dans la variante cible `map/5` (noms exacts, suffixes compris : `55_1.gif`…). Ce sont les seules variantes concernées par les règles de remplacement (`/2/map/1/` et `/2/map/1b/` → `/2/map/5/`).
- Les autres variantes (`0`, `2`, `3`, `4`, `1c`, `1d`, `2b`, `3b`, `4b`, `5b`, `_3`, `_3b`, `_back`) ne sont comparées que par les index (non lues image par image : aucune règle ne les remplace). `--deep` les lit.


### Matrice map/1 → toutes les variantes (d'après les index)

| Variante | Noms de map/1 présents | Noms de map/1 absents | Noms de map/1b présents | Noms de map/1b absents |
|---|---|---|---|---|
| `0` | 69 | 489 | 69 | 479 |
| `1` | 558 | 0 | 548 | 0 |
| `2` | 481 | 77 | 481 | 67 |
| `3` | 478 | 80 | 478 | 70 |
| `4` | 481 | 77 | 481 | 67 |
| `5` (cible) | 478 | 80 | 478 | 70 |
| `1b` | 548 | 10 | 548 | 0 |
| `1c` | 470 | 88 | 470 | 78 |
| `1d` | 462 | 96 | 462 | 86 |
| `2b` | 481 | 77 | 481 | 67 |
| `3b` | 478 | 80 | 478 | 70 |
| `4b` | 481 | 77 | 481 | 67 |
| `5b` | 478 | 80 | 478 | 70 |
| `_3` | 478 | 80 | 478 | 70 |
| `_3b` | 478 | 80 | 478 | 70 |
| `_back` | 0 | 558 | 0 | 548 |

## Totaux calculés

| Source | Noms | Sources valides | Cibles map/5 valides | Cibles absentes (404) | Cibles invalides | Remplaçables | Exclusions | Inconnus | Écarts index/réseau |
|---|---|---|---|---|---|---|---|---|---|
| map/1 | 558 | 558 | 478 | 80 | 0 | 478 | 80 | 0 | 0 |
| map/1b | 548 | 548 | 478 | 70 | 0 | 478 | 70 | 0 | 0 |

Sources qui ne sont pas des images valides : aucune.

Erreurs temporaires non résolues (jamais exclues) : aucune.

## Mappings explicites (MEDIEVAL_MAP_OVERRIDES, hôte externe)

44 mappings : cibles {"present":44}. Sources présentes dans l'index officiel : 44/44.

Toutes les cibles se décodent.

Les mappings explicites gardent la priorité sur la règle générale ; une cible externe en échec reste couverte par le repli d'exécution.

## Exclusions déterministes (cible map/5 absente ou invalide)

### map/1 (80)

`109.gif` `123.gif` `124.gif` `125.gif` `126.gif` `127.gif` `128.gif` `129.gif` `130.gif` `134.gif` `150.gif` `160.gif` `161.gif` `162.gif` `163.gif` `164.gif` `165.gif` `166.gif` `167.gif` `168.gif` `169.gif` `170.gif` `197.gif` `198.gif` `199.gif` `231129.gif` `231229.gif` `231329.gif` `231429.gif` `3527.gif` `5015.gif` `5021.gif` `5022.gif` `5023.gif` `5024.gif` `51_1.gif` `51_2.gif` `51_3.gif` `51_4.gif` `51_5.gif` `51_6.gif` `51_7.gif` `51_8.gif` `51_9.gif` `52_0.gif` `53_0.gif` `54.gif` `54_0.gif` `55_0.gif` `55_1.gif` `55_2.gif` `55_3.gif` `55_4.gif` `55_5.gif` `55_6.gif` `55_7.gif` `55_8.gif` `55_9.gif` `56_1.gif` `56_2.gif` `56_3.gif` `56_4.gif` `56_5.gif` `56_6.gif` `56_7.gif` `56_8.gif` `56_9.gif` `blank.gif` `c1w.gif` `hex.gif` `hex2.gif` `hex3.gif` `m1w.gif` `m2w.gif` `m3w.gif` `m4w.gif` `p1w.gif` `p2w.gif` `p3w.gif` `p4w.gif`

### map/1b (70)

`109.gif` `123.gif` `124.gif` `125.gif` `126.gif` `127.gif` `128.gif` `129.gif` `130.gif` `134.gif` `150.gif` `160.gif` `161.gif` `162.gif` `163.gif` `164.gif` `165.gif` `166.gif` `167.gif` `168.gif` `169.gif` `170.gif` `197.gif` `198.gif` `199.gif` `231129.gif` `231229.gif` `231329.gif` `231429.gif` `3527.gif` `5015.gif` `5021.gif` `5022.gif` `5023.gif` `5024.gif` `51_1.gif` `51_2.gif` `51_3.gif` `51_4.gif` `51_5.gif` `51_6.gif` `51_7.gif` `51_8.gif` `51_9.gif` `52_0.gif` `53_0.gif` `54.gif` `54_0.gif` `55_0.gif` `55_1.gif` `55_2.gif` `55_3.gif` `55_4.gif` `55_5.gif` `55_6.gif` `55_7.gif` `55_8.gif` `55_9.gif` `56_1.gif` `56_2.gif` `56_3.gif` `56_4.gif` `56_5.gif` `56_6.gif` `56_7.gif` `56_8.gif` `56_9.gif` `hex.gif` `hex2.gif` `hex3.gif`

Ces listes sont reprises dans `kraland-userscript-template.js` (`CONFIG.MEDIEVAL_ABSENT_IN_TARGET`) : plus de requête voué à l'échec vers `map/5`. Le repli d'exécution (retour à l'URL d'origine si le chargement échoue) est conservé : une image qui disparaîtrait plus tard reste protégée.

## Limites

- L'inventaire est celui des index Apache à la date ci-dessus ; une image ajoutée ensuite au serveur n'est pas dans la liste d'exclusions (elle est donc simplement tentée, avec repli).
- Une exclusion signifie « absente ou invalide à la date de l'audit » : relancer `--online` pour la mettre à jour ; les erreurs réseau, 403, 429 et 5xx ne produisent jamais d'exclusion.
- Le décodage est vérifié sans dépendance (signature, dimensions, fin de fichier GIF/PNG/JPEG), pas par un moteur de rendu complet.
- Les arrière-plans CSS : la feuille du thème ne contient aucun `url()` distant (uniquement des `data:`) ; les arrière-plans posés en ligne par le site passent par la même règle `computeReplacement` + pré-test avant remplacement.
