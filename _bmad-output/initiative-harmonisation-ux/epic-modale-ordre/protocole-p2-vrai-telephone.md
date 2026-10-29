# Protocole P2 : vérifications sur un vrai téléphone

Ticket 2.1. L'émulation (375×667) ne reproduit ni le clavier ni le démarrage d'un vrai navigateur mobile, où la largeur vaut 980 px tant que la balise viewport n'est pas lue (commentaire G-01 du template). Ce protocole dit ce qu'il faut regarder ; les résultats décident de la partie mobile du ticket 2.6, et servent aussi aux épopées 7 (kramail mobile) et 8 (notifications).

Consigne : **annuler, ne rien envoyer, ne valider aucun ordre.**

## 1. Préparer

1. Sur le Mac, à la racine du dépôt : `npm run build`, puis `npm run serve` (port 4848, ouvert sur le réseau local).
2. Le téléphone sur le même réseau Wi-Fi que le Mac.
3. Navigateur et gestionnaire de scripts (noter lequel) :
   - Android : Firefox avec l'extension Tampermonkey (Chrome Android n'accepte pas d'extension) ;
   - iOS : Safari avec l'application « Userscripts » (ou Tampermonkey pour Safari).
4. Sur le téléphone, ouvrir `http://192.168.5.54:4848/kraland-userscript-main.user.js` et installer le script (le bundle contient le CSS). Désactiver toute autre version du script.
5. Ouvrir `http://www.kraland.org/jouer/plateau` et se connecter si besoin.

## 2. Vérifications

Pour chaque point, noter « conforme », « écart : … » ou « non vérifiable », et joindre une capture d'écran si possible (hors dépôt).

| # | Où | Geste | Regarder |
|---|---|---|---|
| A | Plateau | charger la page, sans rien toucher | la barre d'onglets de section (Agir, Matériel, Personnage, Bâtiments, Employés) et le mini-profil (nom du personnage) apparaissent-ils ? la page déborde-t-elle en largeur ? |
| B | Plateau | toucher « Dormir », puis **Annuler** | libellés des boutons (« Cancel / OK » ou « Annuler / Valider ») ; l'avertissement « Attention ! » est-il visible sans défiler ? un bouton « ? Aide » existe-t-il ? coût et durée en pastilles ou en ligne de texte ? |
| C | Plateau | ouvrir l'ordre « Parler », toucher le champ de texte (clavier ouvert), puis **Annuler** | le bouton de validation reste-t-il visible au-dessus du clavier ? le champ reste-t-il visible ? |
| D | Forum, un sujet | « Répondre », toucher le champ (clavier ouvert), puis revenir en arrière sans envoyer | le bouton « Envoyer » reste-t-il visible ? couvre-t-il le texte saisi ? |
| E | Kramail | « Nouveau message », toucher le champ (clavier ouvert), puis revenir en arrière sans envoyer | même question que D |
| F | Barre du haut | toucher la cloche des notifications, puis fermer | la page `/report` s'ouvre-t-elle dans un onglet, une fenêtre, ou la page courante ? comment revient-on ? |
| G | Index du forum RP | toucher le bouton → d'un forum (dernier message) | arrive-t-on sur le message (ancre `#msg…`) ou en haut du sujet ? |

## 3. Résultats

À remplir par Arnaud.

- Date : 2026-10-23 (point E seul, capture d'Arnaud)
- Appareil, système et version :
- Navigateur et gestionnaire de scripts : Vivaldi Android, clavier SwiftKey

| # | Résultat | Remarque |
|---|---|---|
| A | | |
| B | | |
| C | | |
| D | | Émulation agent (2026-10-29) : conforme en émulation (voir « Émulation agent » ci-dessous). Passe vrai téléphone d'Arnaud en attente (passe finale). |
| E | écart | Rédaction kramail, thème sombre, clavier ouvert : la barre « Envoyer » fixe (pleine largeur, ~70 px) se pose juste au-dessus du clavier et masque le champ « Votre message », dont seule la première ligne reste visible ; le texte saisi est couvert. Confirme la décision CAP-8 : « Envoyer » dans le flux sous le champ, plus de barre fixe. Émulation agent (2026-10-29), après 7.7 : barre fixe disparue, « Envoyer » atteignable ; reste « Remonter en haut » sur le bord droit du champ (voir ci-dessous). Passe vrai téléphone d'Arnaud en attente (passe finale). |
| F | | |
| G | | |

Décision d'Arnaud (2026-10-23) : on n'attend pas les autres points ; C et D supposés identiques à E (barre fixe qui couvre le champ), corrigés par « Valider »/« Envoyer » dans le flux.

## 4. Émulation agent (2026-10-29), points D et E

Ticket 7.9. Décision d'Arnaud : l'émulation suffit pour l'instant ; sa passe sur vrai téléphone vient à la fin de tous les tickets. Les lignes D et E du tableau restent donc à remplir par lui.

**Moyen.** Chromium Playwright sur fixtures, réseau confiné, bundle de `feature/next` (d8c8777, inchangé à 5d42ab5). Émulation 375×667, `isMobile`, `hasTouch`, densité 2 et 3, Kraland clair et Empire Brun sombre. Script jetable `/Users/arnaud/kraland-css-captures/7.9/travail/de.mjs` (hors dépôt). Pages : rédaction kramail Nouveau (`kramail-nouveau.html`) et Répondre (`kramail-repondre.html`, citation préremplie), réponse au forum (`typographie-forum-redaction.html`).

**Geste.** Toucher le champ « Votre message », curseur en fin de texte, taper trois lignes, puis quitter le champ et rendre la hauteur, sans rien envoyer. Trois états de clavier :

- `reduit` : viewport ramené à 375×350 après le toucher (clavier qui redimensionne la page, comme sur la capture d'Arnaud du 2026-10-23) ;
- `visuel` : mise en page à 667 px, seule une bande visible de 350 px glisse dans la page (clavier qui ne réduit que le viewport visuel, défaut de Chromium Android récent) ;
- `repos` : 667 px, sans clavier, pour comparaison.

**Contrôles.** Le curseur est amené en bas de la zone visible, comme à la frappe. Puis : chaque ligne du texte saisi touchée par `elementFromPoint` (3 points par ligne) ; aucun élément `fixed` ou `sticky` sur le texte saisi ; « Envoyer » amené au milieu de la zone visible, centre touché ; aucun `submit`, `form.submit`, `requestSubmit`, requête non GET ni navigation ; aucun débordement horizontal ; aucune erreur de page.

**Résultat : 32 cas sur 36 conformes.**

- D (réponse au forum) : 12 cas sur 12 conformes. « Envoyer » de 48 px dans le flux sous le champ, atteint en son centre ; texte saisi non couvert.
- E (rédaction kramail) : Nouveau, 12 cas sur 12 conformes. Répondre, 8 sur 12 : en `reduit`, « Remonter en haut » couvre le bord droit du texte saisi (4 cas, les deux variantes, densités 2 et 3). Mesures : bouton fixe de 36×44 px en x 331–367 et y 271–315 (zone visible de 350 px), bord droit du contenu du champ à x 346, soit 15 px de chevauchement sur 44 px de haut. Le bouton n'apparaît qu'après 400 px de défilement : il touche donc les longs messages et les réponses avec citation. En `visuel`, il reste en bas de la mise en page, sous le clavier. Écart consigné dans `revue-manuelle.md`, section « Ticket 7.9 ». Aucun code n'a été corrigé.
- Envois : aucun dans les 36 cas. La seule requête sortante est la lecture du changelog par `GM.xmlHttpRequest`, interceptée et sans effet.
- Contre-épreuve : le bundle d'avant 7.7 (f48a01f) rend les 24 cas du kramail rouges. La barre « Envoyer » fixe de 56 px pleine largeur (y 294–350 en `reduit`) couvre le texte saisi : c'est le constat d'Arnaud au point E. La réponse au forum, déjà dans le flux avant 7.7, reste verte.
- Observation sans écart : la barre de navigation fixe de 60 px reste en haut, clavier ouvert. Elle prend 60 px des 350 visibles. Le texte saisi n'est pas sous elle, mais la partie du champ qui a défilé passe dessous.

**Limites de l'émulation.**

- Aucun vrai clavier : la hauteur de 350 px est une hypothèse. Le comportement réel de Vivaldi Android avec SwiftKey (`resizes-content` ou `resizes-visual`) n'est pas connu. Les deux modes sont simulés ; le mode `visuel` déplace une bande de calcul et ne provoque pas d'événement `visualViewport`.
- Le navigateur ne fait aucun défilement automatique vers le curseur : le script le fait lui-même (curseur en bas de la zone, une ligne de marge). Un vrai navigateur peut placer le curseur ailleurs.
- La page s'ouvre directement à 375 px : le démarrage à 980 px d'un vrai mobile (G-01) n'est pas reproduit.
- Fixtures, pas le site : ni le JS de Kraland (autosize du champ, par exemple), ni les images, ni Tampermonkey. Polices système du Mac.
- Le retour arrière n'est pas joué (pas d'historique) : le geste s'arrête à la sortie du champ.

**En attente :** la passe sur vrai téléphone d'Arnaud (passe finale), lignes D et E du tableau.

