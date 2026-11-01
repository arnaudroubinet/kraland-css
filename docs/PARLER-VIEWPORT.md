# Parler : zone visible des ordres avec saisie

Carte : t_1a761355. Autorisation Arnaud : correctif ciblé, tests et PR vers `feature/next`, sans fusion automatique, sans installation. Base après fetch : `ac0e63810c1cc1367aaacfdb413a8c55c9da4100` (pas le `7d1c533` du diagnostic QA).

## Constat et correction

La sonde reproduit une modale dont le grand viewport vaut 957 px alors que la zone visible vaut 757 px. Les contraintes `90vh` / `100vh`, le padding haut de 30 px et les marges de 10 px laissent le footer hors cadre. Le défilement du body ne déplace pas son frère footer. La safe-area existe déjà et n'est pas la cause identifiée.

`kraland-userscript-template.js`, fonction `trackOrderModalViewport`, marque seulement une Bootbox contenant `.panel-order textarea#message`, sous 768 px. Ce sélecteur structurel vise les ordres avec saisie, pas un titre « Parler » inventé ; il peut aussi viser un autre ordre de même structure. Aucun DOM natif Parler exact n'étant disponible, cette délimitation reste à confirmer sur téléphone.

La hauteur et le décalage haut proviennent de `visualViewport.height/offsetTop`, actualisés au resize/scroll et après chargement Ajax. Sans cette API, repli sur `window.innerHeight`. La CSS mobile utilise cette hauteur, un budget de marges de 20 px et un défilement réel du content/dialog/modal en repli aux très faibles hauteurs. Le body reste défilable ; le footer reste non rétrécissable mais n'est plus sticky dans cette seule branche de cascade. Les valeurs et listeners sont retirés à la fermeture et le marquage désactivé au retour bureau.

Aucun remplacement global vh/dvh, aucun handler, callback, action, champ ou validation modifié. Les autres modales et la géométrie bureau restent hors du sélecteur. Kramail et menus ne font pas partie de ce correctif.

## Tests et limites

`npm run test:zone -- parler` ou `npm run test:parler` : suite `tests/e2e/parler-viewport.mjs`, enregistrée dans le total `npm run test:all`. `KR_SHOTS=/chemin/hors/depot` conserve les captures et `mesures.json`. `KR_SCRIPT` permet de rejouer le rouge contre un bundle ancien.

Fixture : `tests/e2e/fixtures/parler/model-page.html` reprend le plateau minimal ; `model-form.html` est EXPLICITEMENT SYNTHÉTIQUE, pas une archive native Parler. Bootbox 4.4.0 construit réellement son conteneur ; Bootstrap 3.3.7 et jQuery 3.3.1 sont les sources publiques déjà conservées par QA. Les assets sont dans `tests/e2e/vendor/parler/`, leur provenance/hash dans `tests/e2e/fixtures/parler/native-manifest.json`. Aucun téléchargement ni installation dans cette tâche. Le fichier main.js conservé pour provenance n'est pas exécuté.

Toutes les routes sont interceptées : seule la fixture et ses assets locaux sont servis, le reste aborté. submit/requestSubmit neutralisés, callback de confirmation compté, aucun clic de validation. Gestes tactiles CDP (`Input.synthesizeScrollGesture`) hors textarea ; jamais scrollIntoView ou scrollTop forcé. Identité du textarea/formulaire/bouton, action, method, noms/types/required et handlers délégués Bootbox sont contrôlés pendant les transitions.

Scénarios : écart grand/visible de 200 px imposé par CDP, hauteurs 600/320/240/180/160, rotation 667×200 et 844×390, retour 390×844 puis bureau 1280×720 et mobile 390×600 ; repli sans visualViewport aux hauteurs 600/200/844 ; autre Bootbox mobile et bureau ; fermeture puis resize. Ce ne sont PAS des dimensions mesurées de Galaxy S21 ni un clavier Android réel. Les captures CDP brutes et les métriques sont comparées en pixels ; une émulation incohérente fait échouer le test.

Rouge initial avant build sur le bundle de la base : 65 ok / 6 FAIL, exit 1, dont Valider totalement hors zone visible après gestes et cinq échecs de faibles hauteurs/repli. Premier vert après build : 71 ok / 0 FAIL, exit 0. La suite finale ajoute un contrôle d'autre modale mobile, le chargement Ajax et renforce le nettoyage des listeners. Contre-épreuve de la suite étendue contre le même bundle base : 71 ok / 7 FAIL, exit 1 (le contrôle de détection Ajax échoue aussi, comme attendu). Lint du template JS : exit 0 ; lint CSS : 13 erreurs préexistantes, identiques à la base (exit 2), aucune nouvelle erreur conservée. Les résultats finaux au SHA publié, journaux et captures sont remis dans le handoff kanban / PR, pas inscrits ici avant exécution.

Accélération des tests (lot C, carte t_499ec23d) : la suite tourne désormais dans le Chromium de Playwright de la suite (plus le Chrome système). Dans ce navigateur, l'écart de 200 px agrandit le grand viewport (100vh) au lieu de réduire la zone visible : la capture « barres » mesure 390×844 et non plus 500×757, mais l'écart grand/visible reste reproduit et la contre-épreuve contre le bundle `ac0e638` donne toujours 71 ok / 7 FAIL sur les mêmes vérifications. Les gestes vont à 6 000 px/s (×5), sauf le témoin lent « barres-apres-gestes » à 1 200 px/s. Les attentes fixes sont remplacées par des conditions : `html[data-kr-ready]`, modale affichée (`shown.bs.modal`) et mise en forme mobile (`data-structure-transformed`), hauteur `--kr-order-visible-height` égale au viewport visible, bandeau de rechargement présent seulement si la largeur a franchi 768 px depuis le chargement (saisie en cours), retrait de la modale à la fermeture.

Réserves obligatoires : DOM Parler exact non obtenu, sonde synthétique, aucune validation physique Android/Vivaldi. La correction du mécanisme local n'est pas une preuve de résolution du signalement physique. QA indépendante et contrôle S21/Vivaldi barres affichées, clavier, rotations et conservation de saisie restent requis avant décision de fusion par Arnaud. Aucun envoi n'est nécessaire pour ces contrôles.

## Méthode et leçons

Le dépôt n'a pas `_bmad/` : proposition de `bmad setup` séparé, aucune installation implicite. Cet artefact tient la spécification et les réserves de la correction autorisée ; aucune story déclarée validée par la seule auto-vérification dev.

Leçon de la sonde : imposer une transition effective de métriques CDP avant clear et contrôler ensemble dimensions de capture et visualViewport ; le simple clear peut laisser des métriques anciennes malgré une capture de taille différente. Un rouge dû à une sonde incohérente ne constitue jamais la reproduction produit. Bootbox délègue les handlers de clic sur la modale : comparer ces références, pas des handlers supposés sur le bouton.

Nettoyage : aucun serveur ni port CDP partagé utilisé ; browser.close en finally ; profils/logs et worktree dans scratch. Aucun conteneur créé. Ne jamais nettoyer le checkout partagé préexistant sale ni le worktree Messages.

## Suite : Vivaldi mobile, barre d'adresse après le clavier

Signalement d'Arnaud (téléphone réel, Vivaldi) : après usage du clavier, la barre d'adresse réapparaît, la popin rétrécit et « Valider » devient inaccessible. Deux causes plausibles corrigées :

- la mesure `visualViewport` peut rester périmée quand la barre réapparaît sans resize fiable : la CSS borne désormais le budget par `min(var(--kr-order-visible-height), 100dvh)` (variable `--kr-order-budget`), et le JS remesure à `focusin`/`focusout` et après chaque resize (50 à 1 000 ms), plus au scroll de la fenêtre ;
- le suivi ne visait que `.panel-order textarea#message` : il couvre maintenant toute Bootbox mobile contenant un champ qui ouvre le clavier (textarea, input texte/nombre/etc., contenteditable). Les Bootbox sans saisie gardent leur géométrie historique.

Les plafonds mobiles génériques (`.modal-dialog` en mobile-mode, `.bootbox-confirm .modal-content`) passent de `vh` à `dvh`.

Test : fragment `vivaldi` de `tests/e2e/parler-viewport.mjs` (mesure périmée forcée, remesure au focusout, Bootbox avec input texte à 390×320). Rouge sur le bundle de base (1 ok / 3 FAIL), vert après correctif. Réserve : émulation Chromium, pas de validation physique Vivaldi.

## Suite : mode compact clavier ouvert

Retour d'Arnaud : le correctif fonctionne mais la zone utile devient minuscule. Mesure à 360×380 (S21, clavier ouvert) : pied 143 px (Annuler et Valider empilés), onglets collants 58 px, marges 10 px, corps 215 px. Quand un champ de saisie de la modale est focalisé et que la zone visible fait moins de 600 px, `trackOrderModalViewport` pose `kr-keyboard-open` : modale bord à bord, onglets non collants, pied sur une ligne (Annuler | Valider), pastilles masquées. Résultat : pied 57 px, corps 321 px. Le mode est retiré au blur. Test : fragment `vivaldi`.

## Suite : densité de la popin (relevé sur le site réel)

Retour d'Arnaud du 1er novembre 2026 sur la popin Parler, thème brun : retours à la ligne injustifiés, interlignes trop grands, espace horizontal mal employé, barre Valider/Annuler trop haute. Relevé cette fois sur le site réel (popin Parler ouverte sur un personnage du plateau, sans validation), page de 360 × 680 px visibles, thème Empire Brun sombre, feuille de `feature/next` injectée à la place de celle du serveur local.

| Mesure (360 × 680) | Avant | Après |
| --- | --- | --- |
| Pied (pastilles, Annuler, Valider) | 209 px, boutons empilés, pastilles sur 2 rangées | 89 px, pastilles sur 1 rangée, Annuler \| Valider côte à côte |
| Corps visible | 449 px | 591 px |
| Liste de la cible | 141 px (2 colonnes vides de 20 px, liste de 56 px) | 44 px, à côté de la croix |
| Titre (avatar, nom, icônes) | 116 px, nom sur 2 lignes | 60 px, nom sur 1 ligne |
| Lien du nom dans la description | bloc de 44 px | en ligne, 17 px |
| Onglets (8) | 226 px, 2 colonnes | 146 px, 3 colonnes |
| « Masquer son identité » | 3 lignes dans 83 px | 1 ligne |
| Libellés Action, Options, Message | 44 px chacun | 21 px |
| Zone de saisie | 240 px de large, à 1 956 px du haut | 314 px de large, à 1 216 px |

Corrections : section « MODALE D'ORDRE MOBILE : DENSITÉ » en fin de `kraland-theme.css` (sous 768 px), et `forceOrderModalGridLayout` qui lit colonnes, écart et retrait des onglets dans des variables CSS (valeurs de repli : rendu historique, bureau inchangé). Le mode compact du clavier ouvert reste tel quel. Le retrait de 15 px du corps reste : la croix garde la place de celle des confirmations hors ordre (ticket 2.5). Les confirmations hors ordre gardent le pied en colonne.

Fenêtre rétrécie sous 768 px sans rechargement (saisie en cours, bandeau « La mise en page s'adaptera au prochain rechargement ») : la règle mobile générale `.btn + .btn` mettait 8 px au-dessus de « Valider », désormais sans marge dans le pied d'un ordre. Le bandeau (z-index 2000) recouvrait le bas de la modale, « Valider » compris, déjà avant ce changement : modale ouverte, il passe sous son fond (z-index 1035) et revient à la fermeture.

Tests : `tests/e2e/modale-ordre.mjs` attend désormais, sous 768 px, le pied d'un ordre en rangée (« Annuler » | « Valider » à parts égales) et celui d'une confirmation hors ordre en colonne.
