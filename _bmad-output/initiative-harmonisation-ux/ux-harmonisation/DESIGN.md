---
name: Kraland — surcharge harmonisée
description: Apparence commune de la surcharge de Kraland (userscript + kraland-theme.css, sur le Bootstrap 3 du site) pour 8 nations en clair et en sombre, sur ordinateur et sur mobile.
status: final
updated: 2026-10-19
colors:
  # Jetons de rôle. Chacun désigne la variable CSS de son rôle, résolue par variante et par mode ; la valeur
  # notée ici est celle de Kraland clair (:root, variante par défaut). Valeurs des 16 variantes (8 nations,
  # clair et sombre) : corps du fichier, « Colors › Valeurs par variante ». Aucun jeton ne porte la valeur
  # d'une autre variante. Suffixe -dark : valeur du mode sombre quand elle est commune aux 8 nations
  # (bordures, états, jauges).
  primary: '#8b0f0e'              # --kr-primary
  primary-strong: '#6f0c0b'       # --kr-primary-dark : formule [ASSUMPTION] (H5.2) ; « dark » n'y désigne pas le mode
  highlight: '#c41e3a'            # --kr-highlight
  highlight-reverse: '#f6dde1'    # --kr-highlight-reverse : formule [ASSUMPTION] (H5.2)
  text-accent: '#c41e3a'          # nouveau
  text-nation: '#8b0f0e'          # nouveau
  action-bg: '#8b0f0e'            # --kr-arm-bg, repli --kr-primary
  action-ink: '#ffffff'           # --kr-arm-ink, repli blanc
  action-bg-hover: '#6f0c0b'      # --kr-arm-bg-hover, repli --kr-primary-dark
  action-ink-hover: '#ffffff'     # --kr-arm-ink-hover, repli blanc
  header-tint: '#f6ecec'          # nouveau
  border-tint: '#ead4d4'          # nouveau
  info-bg: '#f8f1f1'              # --kr-alert-info-bg : formule [ASSUMPTION] (H5.2)
  info-border: '#efdddd'          # --kr-alert-info-border : formule [ASSUMPTION] (H5.2)
  btn-shadow: '#8b0f0e1f'         # --kr-btn-shadow : formule [ASSUMPTION] (H5.2)
  status-unread: '#c41e3a'        # --kr-status-unread
  bg-page: '#f5f5f5'              # --kr-bg-page
  bg-surface: '#ffffff'           # --kr-bg-surface
  bg-elevated: '#ffffff'          # --kr-bg-elevated
  text-primary: '#0f1724'         # --kr-text-primary
  text-secondary: '#636a77'       # --kr-text-secondary (Q26 : #6b7280 foncé, ticket 3.4)
  text-muted: '#9ca3af'           # --kr-text-muted : [ASSUMPTION] éléments indisponibles seulement (Q26)
  border-default: '#00000014'     # --kr-border-default, rgb(0,0,0,0.08)
  border-strong: '#00000026'      # --kr-border-strong, rgb(0,0,0,0.15)
  border-default-dark: '#ffffff14'
  border-strong-dark: '#ffffff26'
  # États (H5.5) et jauges (H5.4) : [ASSUMPTION] valeurs proposées, un ton par mode, à valider (Q3).
  success: '#2e7d32'
  success-dark: '#81c784'
  warning: '#8a5a00'
  warning-dark: '#ffb74d'
  danger: '#c62828'
  danger-dark: '#ff8a80'
  gauge-pv: '#388e3c'
  gauge-pv-dark: '#66bb6a'
  gauge-pm: '#1565c0'
  gauge-pm-dark: '#64b5f6'
  gauge-pp: '#e65100'
  gauge-pp-dark: '#ffa726'
typography:
  family:
    note: 'Police héritée du site (Bootstrap 3) ; la surcharge ne déclare aucune famille.'
  page-title:
    fontSize: 36px
  section-title:
    fontSize: 17px
    fontWeight: '700'             # [ASSUMPTION] sur ordinateur
  name:
    fontSize: 15px
    fontWeight: '600'             # [ASSUMPTION]
  forum-name:
    fontSize: 15px
    fontWeight: '400'
  body:
    fontSize: 14px
  body-mobile:
    fontSize: 15px                # [ASSUMPTION] (Q8)
  detail:
    fontSize: 13px
  label:
    fontSize: 12px
    fontWeight: '700'
  button:
    fontSize: 14px
  button-compact:
    fontSize: 12px
rounded:
  sm: 4px
  md: 8px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  margin-mobile: 16px
  touch-target: 44px
  touch-target-dpad: 48px
components:
  button-primary:
    background: '{colors.action-bg}'
    foreground: '{colors.action-ink}'
    background-hover: '{colors.action-bg-hover}'
    foreground-hover: '{colors.action-ink-hover}'
    shadow: '{colors.btn-shadow}'
    radius: '{rounded.sm}'
    fontSize: '{typography.button.fontSize}'
    height: 34px
    height-mobile: '{spacing.touch-target}'
  button-standard:
    background: '{colors.bg-surface}'
    border: '{colors.border-tint}'
    foreground: '{colors.text-nation}'
    radius: '{rounded.sm}'
    fontSize: '{typography.button.fontSize}'
    height: 34px
    height-mobile: '{spacing.touch-target}'
  button-compact:
    fontSize: '{typography.button-compact.fontSize}'
    radius: '{rounded.sm}'
  send-button:
    background: '{colors.action-bg}'
    foreground: '{colors.action-ink}'
    background-hover: '{colors.action-bg-hover}'
    foreground-hover: '{colors.action-ink-hover}'
    radius: '{rounded.sm}'
    fontSize: '{typography.button.fontSize}'
    height-mobile: 48px
  tab-active:
    fontWeight: '600'
    underline: 3px
    underline-color: '{colors.primary}'
  section-card:
    background: '{colors.bg-surface}'
    radius: '{rounded.md}'
    header-height: 48px
    title: '{typography.section-title}'
    title-color: '{colors.text-primary}'
  panel-header:
    background: '{colors.header-tint}'
    border: '{colors.border-tint}'
    title: '{typography.section-title}'
    radius: '{rounded.md}'
  modal-close:
    size: '{spacing.touch-target}'
    color: '{colors.text-primary}'
  alert:
    foreground: '{colors.text-primary}'
    background-info: '{colors.info-bg}'
    border-info: '{colors.info-border}'
    radius: '{rounded.md}'
    # [ASSUMPTION] fond et bordure des alertes de blocage et d'avertissement : non chiffrés (Q3)
  badge-state:
    background: '{colors.status-unread}'
    foreground: '{colors.bg-surface}'
    font: '{typography.label}'
    radius: '{rounded.full}'
  label-category:
    background: '{colors.action-bg}'
    foreground: '{colors.action-ink}'
    font: '{typography.label}'
    radius: '{rounded.full}'
  gauge:
    pv: '{colors.gauge-pv}'
    pm: '{colors.gauge-pm}'
    pp: '{colors.gauge-pp}'
  character-card:
    avatar: 70px
    name: '{typography.name}'     # [ASSUMPTION] sur ordinateur (Q7)
    action-mobile: '{spacing.touch-target}'
    radius: '{rounded.md}'
  forum-row:
    name: '{typography.forum-name}'
    meta: '{typography.detail}'
    author-color: '{colors.text-accent}'
    counts-color: '{colors.text-secondary}'
    arrow: 34px
    arrow-mobile: '{spacing.touch-target}'
    min-height-mobile: 72px
  notification-row:
    text: '{typography.body}'
    text-mobile: 15px
    date: '{typography.detail}'
    unread-stripe: '{colors.status-unread}'
  focus-ring:
    width: 2px
    offset: 2px
    color: '{colors.text-accent}'
  link:
    color: '{colors.text-accent}'
    color-hover: '{colors.text-accent}'
    decoration-hover: underline
    focus: '{components.focus-ring}'
---

# Kraland — surcharge harmonisée : apparence

Ce fichier dit à quoi ressemble la surcharge. Le comportement est dans [EXPERIENCE.md](EXPERIENCE.md) ; les faits de code et les préalables d'implémentation, dans [notes-implementation.md](notes-implementation.md).

Les identifiants renvoient à `.memlog.md`, qui fait foi : H1.1, H5.3… sont des décisions, et R1 à R7 des décisions prises après les relectures ; Q1 et Q2 sont des questions tranchées, les autres Q des questions ouvertes. `[ASSUMPTION]` marque une valeur ou une lecture non tranchée par Arnaud ; les questions correspondantes sont dans EXPERIENCE.md, « Questions ouvertes ». Les jetons de couleur désignent des rôles : leurs valeurs pour les 16 variantes sont dans « Colors › Valeurs par variante ». Renvois de code : « Lnnn » pour `kraland-userscript-template.js`, « l.nnn » pour `kraland-theme.css`, dans leur état du 19 octobre 2026.

Constats de départ : [.working/synthese-incoherences.md](.working/synthese-incoherences.md). Les maquettes, dans `mockups/` (sauf h07, restée dans `.working/`), sont liées aux sections qu'elles illustrent, dont les quatre écrans clés : [modale d'ordre](mockups/key-modale-ordre.html), [plateau mobile](mockups/key-plateau-mobile.html), [notifications mobile](mockups/key-notifications-mobile.html), [kramail mobile](mockups/key-kramail-mobile.html). Les documents priment sur les maquettes en cas de conflit.

## Brand & Style

Kraland est un jeu parodique dont le site repose sur Bootstrap 3. La surcharge habille le site sans modifier son HTML ni son CSS : elle ne peut que passer par-dessus. Le joueur vient pour jouer. La surcharge doit se lire d'un coup d'œil, sur ordinateur comme sur téléphone, puis se faire oublier.

Trois partis pris tiennent l'ensemble :

- **Un élément, un aspect, une place.** Un même élément a le même aspect et la même place sur toutes les pages et sur les deux supports. Les icônes des sections, les rayons, la grille d'espacement, la taille des étiquettes et les couleurs des jauges sont identiques sur ordinateur et sur mobile.
- **La nation se reconnaît.** Chaque variante tire toutes ses nuances de la couleur de sa nation, en clair comme en sombre. Le bleu Bootstrap disparaît partout ; le rouge Kraland résiduel disparaît des autres nations.
- **Une couleur vive signale un état.** Les couleurs d'état ne servent qu'aux états. Le « non lu / nouveau » a une seule couleur, et le rouge danger ne sert qu'aux blocages (R3). Les actions ordinaires prennent le style standard ou primaire.

Le forum et le plateau (section « jouer » du site) servent de référence, sans être intouchables : plusieurs décisions les retouchent (taille des boutons, rayons, en-têtes de section). Le ton reste celui d'un loisir, sans rien de dramatique.

## Colors

### Rôles

| Jeton | Variable CSS | Sert à | Ne sert pas à |
|---|---|---|---|
| `{colors.primary}` | `--kr-primary` | fonds et filets de nation : filet de l'onglet actif ; base de `action-bg` (boutons primaires, étiquettes de catégorie) et, en clair, de `text-nation` | texte en sombre (H5.6) ; en clair, le texte passe par `text-nation` (Q2) |
| `{colors.primary-strong}` | `--kr-primary-dark` | primaire foncée : bordure du bouton primaire, repli du survol | texte, survol des liens compris (R7) |
| `{colors.highlight}` | `--kr-highlight` | accent de la nation : fonds et filets d'accent décoratifs (pastille de niveau, pièce courante « ici ») ; base de `text-accent` ; un filet d'état ou de focus prend `text-accent`, le filet décoratif garde `highlight` | texte qui n'atteint pas 4,5:1 (or d'Empire Brun clair, Q2) |
| `{colors.highlight-reverse}` | `--kr-highlight-reverse` | texte posé sur l'accent (pastille de niveau, en sombre) | texte des boutons primaires (Q1 : `action-ink`) |
| `{colors.text-accent}` | nouveau (Q2) | texte coloré : liens (R7), auteur du dernier message, compteurs de l'accueil, astérisques du kramail ; anneau de focus (H5.7) | fonds |
| `{colors.text-nation}` | nouveau (H5.3, Q2) | texte du bouton standard | fonds |
| `{colors.action-bg}`, `{colors.action-ink}` | `--kr-arm-bg` (repli `--kr-primary`), `--kr-arm-ink` (repli blanc) | fond et texte de toute action primaire ; tout texte posé sur la couleur de nation (Q1) | — |
| `{colors.action-bg-hover}`, `{colors.action-ink-hover}` | `--kr-arm-bg-hover` (repli `--kr-primary-dark`), `--kr-arm-ink-hover` (repli blanc) | survol des actions primaires (Q1) | — |
| `{colors.header-tint}`, `{colors.border-tint}` | nouveaux (H5.3) | fonds d'en-tête et bordures teintés : primaire à 8 % et 18 % en clair ; `bg-elevated` et `border-default` en sombre | — |
| `{colors.info-bg}`, `{colors.info-border}` | `--kr-alert-info-bg`, `--kr-alert-info-border` | alerte info (H5.2) | alertes de blocage et d'avertissement |
| `{colors.btn-shadow}` | `--kr-btn-shadow` | ombre du bouton primaire (H5.2) | — |
| `{colors.accent-tint}`, `{colors.accent-tint-strong}`, `{colors.accent-line}`, `{colors.accent-active}` | `--kr-accent-tint`, `--kr-accent-tint-strong`, `--kr-accent-line`, `--kr-accent-active` (épopée 7, entrée 6) | mélanges d'accent : `highlight` à 16 %, 32 % et 60 % sur le fond de saisie (`--kr-form-bg`, repli `bg-elevated`) pour les fonds teintés et le filet décoratif ; à 24 % sur `bg-elevated` pour le fond actif | texte ; filet d'état ou de focus (`text-accent` ou `text-primary`) |
| `{colors.status-unread}` | `--kr-status-unread` | tout « non lu / nouveau » : pastilles « NON LU » et « NOUVEAU MESSAGE », filets des lignes non lues (forum, notifications), pastilles de la cloche et de l'enveloppe du kramail (R3) | blocages (danger) |
| `{colors.bg-page}`, `{colors.bg-surface}`, `{colors.bg-elevated}` | `--kr-bg-*` | fond de page, cartes, éléments surélevés | — |
| `{colors.text-primary}` | `--kr-text-primary` | texte, titres de section | — |
| `{colors.text-secondary}` | `--kr-text-secondary` | texte atténué : détails, compteurs, charge | — |
| `{colors.text-muted}` | `--kr-text-muted` | `[ASSUMPTION]` éléments indisponibles (Q26) | texte à lire (2,54:1 sur blanc) |
| `{colors.border-default}`, `{colors.border-strong}` | `--kr-border-*` | séparations | — |
| `{colors.success}`, `{colors.warning}`, `{colors.danger}` | nouveaux | états (H5.5) ; danger : blocages seulement (R3) | actions ordinaires ; « non lu » |
| `{colors.gauge-pv}`, `{colors.gauge-pm}`, `{colors.gauge-pp}` | `--kr-gauge-*`, valeurs remplacées | jauges (H5.4) | états |

### Dériver une variante de sa nation (H5.2)

Aujourd'hui, les variantes claires ne changent que la primaire et l'accent ; les autres nuances gardent le rouge Kraland (`#700b09`, `#f9d9de`, anneau de focus, alerte info, ombre des boutons). Règle décidée : chaque variante claire dérive toutes ces nuances de la couleur de sa nation, comme les variantes sombres. Les formules ne sont pas tranchées. Proposition, appliquée aux 8 variantes claires, Kraland compris, pour qu'une seule formule donne chaque nuance :

| Nuance | Jeton | Dérivation proposée | Contrôle |
|---|---|---|---|
| Primaire foncée | `{colors.primary-strong}` | `[ASSUMPTION]` primaire mêlée de 20 % de noir | Kraland : `#6f0c0b` (actuel `#700b09`) ; sous `action-ink-hover`, ≥ 5,35:1 |
| Accent inverse | `{colors.highlight-reverse}` | `[ASSUMPTION]` accent à 15 % sur blanc | Kraland : `#f6dde1` (actuel `#f9d9de`) |
| Anneau de focus | `{components.focus-ring}` | `{colors.text-accent}` (H5.7, Q2) | ≥ 4,84:1 sur les fonds de page, de surface, surélevés et d'en-tête |
| Alerte info | `{colors.info-bg}`, `{colors.info-border}` | `[ASSUMPTION]` primaire à 6 % (fond) et 14 % (bordure) sur blanc, mêmes taux qu'aujourd'hui | Kraland : `#f8f1f1` (actuel `#faf1f0`, sur la base `rgb(164,18,13)`) ; texte ≥ 16,06:1 |
| Ombre des boutons | `{colors.btn-shadow}` | `[ASSUMPTION]` primaire à 12 % d'opacité, même taux qu'aujourd'hui | Kraland : `#8b0f0e1f` (actuel `rgb(165,18,13,0.12)`) |

Les variantes sombres gardent leur primaire foncée et leur accent inverse. Deux nuances n'y sont pas dérivées aujourd'hui : l'alerte info, brune `rgb(122,82,64)` dans les 8 nations (l.2762-2764), et l'ombre des boutons, rouge, héritée de `:root` (l.40). `[ASSUMPTION]` Elles suivent la même règle (H5.5 : palette « accordée au thème », Q4) : alerte info en primaire de la nation mêlée à `bg-surface`, à 15 % pour le fond et 30 % pour la bordure (les taux actuels) ; ombre en primaire à 12 % d'opacité. Empire Brun sombre garde ainsi son alerte actuelle : le brun `rgb(122,82,64)` est sa primaire `#7a5240`. Valeurs : tableau « Teintes, alerte info et ombre ».

### Teintes du mode clair (H5.3)

En clair, les en-têtes de panneau, les en-têtes de tableau, le bouton standard et les onglets reçoivent le même traitement qu'en sombre, au lieu du rendu Bootstrap (`#f5f5f5`/`#333`, `#ddd`). Fonds d'en-tête : primaire de la nation à 8 % sur blanc. Bordures : 18 %. Bouton standard : bordure à 18 % et texte de la nation (`{colors.text-nation}`). Valeurs calculées par mélange sRGB (comme le `color-mix(in srgb, …)` des jetons `--kr-accent-*` du champ Destinataires du kramail) : tableau « Teintes, alerte info et ombre ».

Maquette : [mockups/h05-clair-composants.html](mockups/h05-clair-composants.html) (Kraland et Paradigme Vert en clair, Empire Brun en sombre). Elle date d'avant H6.3 et H11.2 (panneaux à 4 px, marges de 10 et 15 px) et calcule autrement les nuances de Paradigme Vert (`#ecf3ed`, `#d3e4d7`, `#084d1a`) : les tableaux priment.

### Mode sombre : la primaire ne sert jamais de texte (H5.6)

En sombre, la primaire ne sert qu'aux fonds : boutons, onglets, filets. Les textes colorés prennent l'accent de la nation, à 4,5:1 au moins (« Contrastes de référence »). La primaire en texte tombe entre 2,25 et 2,56:1 en Empire Brun. Cas relevés : titres de section mobiles (réglés par H4.1, qui les passe en couleur du texte), astérisques « * » du kramail, compteurs de l'accueil, liens (R7).

Périmètre relevé par la relecture de faisabilité : [notes-implementation.md](notes-implementation.md).

### Texte en couleur de nation, mode clair (Q2)

Q2 étend la règle au clair : tout texte coloré atteint 4,5:1 au moins sur sa surface et prend la nuance de la nation qui y parvient. L'or reste réservé aux fonds et aux filets : Empire Brun prend `#8a5a00` (5,93:1, la valeur de `--kr-status-unread`) au lieu de son accent `#c69100` (2,82:1), et Paladium prend son accent `#044c17` (10,24:1) au lieu de sa primaire `#d4af37` (2,10:1). Cela touche l'auteur du dernier message à l'index, les liens, l'anneau de focus et le texte du bouton standard.

D'où deux jetons de texte, résolus par variante et par mode :

- `{colors.text-accent}` : texte coloré en accent (liens, auteur du dernier message, compteurs de l'accueil, astérisques du kramail) et anneau de focus. C'est l'accent, sauf en Empire Brun clair (`#8a5a00`).
- `{colors.text-nation}` : texte du bouton standard. C'est la primaire en clair (H5.3), sauf en Paladium (`#044c17`) et en Confédération Libre (`#475369`, son accent : la primaire ne fait que 4,38:1 sur `header-tint`, fond du bouton standard survolé ou pressé ; ticket 3.4, `[ASSUMPTION]` à confirmer), et l'accent en sombre (H5.6).

Contrastes des deux jetons : « Contrastes de référence ».

`{colors.highlight}` garde ses emplois décoratifs (pastille de niveau, filet et « ici » de la pièce courante) : en Empire Brun clair, ils restent dorés.

### Liens (R7)

Les liens prennent `{colors.text-accent}`, au repos comme au survol ; aspect : composant **Lien**. Aujourd'hui, le survol passe en primaire foncée en clair (l.1986-1988) et en primaire en sombre (l.3147-3149) ; en sombre, son contraste tombe à 3,99:1 en Kraland, 2,56:1 en Empire Brun et 4,46:1 en Khanat Elmérien, sur `bg-surface`.

### Texte posé sur la couleur de nation (Q1)

H8.1 demandait des étiquettes de catégorie « fond primaire et texte blanc ». Or le blanc sur la primaire tombe sous 4,5:1 dans 7 variantes sombres sur 8 (de 1,65:1 en Paladium sombre à 4,49:1 en Kraland sombre) et en Paladium clair (2,10:1). Décision Q1 : tout texte posé sur la couleur de nation (boutons primaires, « Envoyer », étiquettes de catégorie, pastilles coût, durée, potentiel) prend la paire existante `--kr-arm-bg` / `--kr-arm-ink` (`{colors.action-bg}` / `{colors.action-ink}`). Cette paire est déjà réglée pour la croix directionnelle (CX2, ticket « PLT-QU CX2 ») et pour « Répondre » et « Envoyer » du forum. Contrastes, au repos et au survol : tableau « Encre d'action » et « Contrastes de référence ». Effet : en Kraland clair, le texte des boutons primaires passe du rose `#f9d9de` au blanc.

Périmètre relevé par la relecture de faisabilité (texte posé aujourd'hui sur la primaire) : [notes-implementation.md](notes-implementation.md).

### Palette d'états (H5.5)

Succès, avertissement (l'« alerte » de H5.5), danger et info : un ton pour le clair, un pour le sombre, réservés aux états. H5.5 réserve chaque état à un usage : le succès aux votes, l'avertissement aux messages d'avertissement, le danger aux blocages, l'info aux informations. Le « non lu / nouveau » n'appartient pas à cette palette : il a sa couleur, `{colors.status-unread}` (R3). Les boutons d'action ordinaires (« Voir l'historique » cyan, « Pas un contact » orange, boutons de Contacts) prennent le style standard ou primaire. Plus de couleurs Bootstrap brutes ni de pastilles pastel.

| État | Sert à | Clair | Sombre | Contraste (clair sur blanc ; sombre, minimum sur `bg-surface` / sur `bg-elevated`) |
|---|---|---|---|---|
| Succès | votes | `[ASSUMPTION]` `{colors.success}` `#2e7d32` | `[ASSUMPTION]` `{colors.success-dark}` `#81c784` | 5,13:1 ; 8,60 / 7,55:1 |
| Avertissement | avertissements (`.alert-warning`) | `[ASSUMPTION]` `{colors.warning}` `#8a5a00` | `[ASSUMPTION]` `{colors.warning-dark}` `#ffb74d` | 5,93:1 ; 10,00 / 8,77:1 |
| Danger | blocages (`.alert-danger`), et rien d'autre (R3) | `[ASSUMPTION]` `{colors.danger}` `#c62828` | `[ASSUMPTION]` `{colors.danger-dark}` `#ff8a80` | 5,62:1 ; 7,58 / 6,65:1 |
| Info | informations | teinte de la nation (`{colors.info-bg}`, `{colors.info-border}`) | idem, formule sombre `[ASSUMPTION]` | texte `{colors.text-primary}` ≥ 11,44:1 |

Contrainte : texte ≥ 4,5:1, en couleur d'état sur la surface comme en couleur `bg-surface` sur un fond de couleur d'état. Valeurs à valider (Q3) ; couleurs d'état voisines de certaines couleurs de nation : Q21. `[ASSUMPTION]` L'info suit la nation (H5.2 cite « alerte info » parmi les nuances dérivées) ; succès, avertissement et danger ont un ton par mode, commun aux 8 nations (Q4).

### Jauges (H5.4)

Une couleur par jauge, identique sur ordinateur et mobile : PV vert, PM bleu, PP orange, avec un ton pour le clair et un pour le sombre. Aujourd'hui, l'ordinateur peint PV et PM en `#5cb85c` et PP en `#f0ad4e` (Bootstrap 3) ; le mobile utilise `--kr-gauge-pv #28a745`, `--kr-gauge-pm #007bff`, `--kr-gauge-pp #ffc107` (Bootstrap 4, et PP jaune).

| Jauge | Clair | Sombre |
|---|---|---|
| PV | `[ASSUMPTION]` `{colors.gauge-pv}` `#388e3c` (3,77:1 sur `#f5f5f5`) | `[ASSUMPTION]` `{colors.gauge-pv-dark}` `#66bb6a` (≥ 6,42:1 sur `bg-elevated`) |
| PM | `[ASSUMPTION]` `{colors.gauge-pm}` `#1565c0` (5,27:1) | `[ASSUMPTION]` `{colors.gauge-pm-dark}` `#64b5f6` (≥ 6,86:1) |
| PP | `[ASSUMPTION]` `{colors.gauge-pp}` `#e65100` (3,48:1) | `[ASSUMPTION]` `{colors.gauge-pp-dark}` `#ffa726` (≥ 7,82:1) |

Contrainte proposée : remplissage ≥ 3:1 sur le fond de la piste (`#f5f5f5` de Bootstrap en clair, `bg-elevated` en sombre), dans toutes les variantes de chaque mode. Valeurs à valider (Q3). PV et succès restent deux jetons distincts, même si leurs teintes sont voisines.

### Valeurs par variante

Le JS pose `html.kr-theme-variant-<nation>` en clair et `html.kr-theme-variant-<nation>-dark` en sombre. Kraland clair porte ses valeurs sur `:root` : la classe `kr-theme-variant-kraland`, posée par le JS (L2865, L3436), n'a pas de règle CSS. Il y a 8 nations, chacune en clair et en sombre (16 variantes). La variante `high-contrast` n'existe que dans le JS (Q16).

Les valeurs sont celles de `kraland-theme.css` (l.5-395), sauf trois groupes :

1. les nuances calculées par les formules `[ASSUMPTION]` de « Dériver une variante de sa nation », soit celles que H5.2 fait dériver en clair, plus l'alerte info et l'ombre en sombre ;
2. `text-accent` d'Empire Brun clair et `text-nation` de Paladium clair (Q2) ;
3. l'encre de survol de Paladium clair (Q1).

Valeurs et contrastes calculés par script (mélange sRGB, formule WCAG). Les valeurs hexadécimales sont écrites en minuscules, sur 6 chiffres (8 avec l'opacité).

#### Couleur de nation et texte coloré

Entre parenthèses : contraste sur `bg-surface`. En clair, `primary-strong` et `highlight-reverse` viennent des formules de H5.2 ; en sombre, ce sont les valeurs actuelles.

| Variante | `primary` | `primary-strong` | `highlight` | `highlight-reverse` | `text-accent` | `text-nation` |
|---|---|---|---|---|---|---|
| Kraland clair | `#8b0f0e` | `#6f0c0b` | `#c41e3a` | `#f6dde1` | `#c41e3a` (5,84) | `#8b0f0e` (9,67) |
| Empire Brun clair | `#5e3b2d` | `#4b2f24` | `#c69100` | `#f6efd9` | `#8a5a00` (5,93, Q2) | `#5e3b2d` (9,82) |
| Paladium clair | `#d4af37` | `#aa8c2c` | `#044c17` | `#d9e4dc` | `#044c17` (10,24) | `#044c17` (10,24, Q2) |
| Théocratie Seelienne clair | `#0033a0` | `#002980` | `#2d5fcb` | `#e0e7f7` | `#2d5fcb` (5,82) | `#0033a0` (10,60) |
| Paradigme Vert clair | `#0b6623` | `#09521c` | `#063803` | `#dae1d9` | `#063803` (13,34) | `#0b6623` (7,15) |
| Khanat Elmérien clair | `#6a0dad` | `#550a8a` | `#7b4c9c` | `#ebe4f0` | `#7b4c9c` (6,26) | `#6a0dad` (9,24) |
| Confédération Libre clair | `#6b7280` | `#565b66` | `#475369` | `#e3e5e9` | `#475369` (7,75) | `#475369` (7,75, ticket 3.4) |
| Royaume de Ruthvénie clair | `#0a6b2d` | `#085624` | `#c41e3a` | `#f6dde1` | `#c41e3a` (5,84) | `#0a6b2d` (6,66) |
| Kraland sombre | `#c45252` | `#8b0f0e` | `#e07070` | `#1a0505` | `#e07070` (5,73) | `#e07070` (5,73) |
| Empire Brun sombre | `#7a5240` | `#5e3b2d` | `#d4a574` | `#1a0f0a` | `#d4a574` (7,77) | `#d4a574` (7,77) |
| Paladium sombre | `#e6c76e` | `#d4af37` | `#4a9d5f` | `#021a0a` | `#4a9d5f` (5,31) | `#4a9d5f` (5,31) |
| Théocratie Seelienne sombre | `#5a8fd9` | `#2d5fcb` | `#80b3ff` | `#000d1f` | `#80b3ff` (8,24) | `#80b3ff` (8,24) |
| Paradigme Vert sombre | `#4d9c61` | `#2a7a3d` | `#70c784` | `#021508` | `#70c784` (8,66) | `#70c784` (8,66) |
| Khanat Elmérien sombre | `#9966cc` | `#7b4c9c` | `#b794d9` | `#1a0425` | `#b794d9` (7,17) | `#b794d9` (7,17) |
| Confédération Libre sombre | `#9ca3af` | `#6b7280` | `#c2c9d6` | `#0f1115` | `#c2c9d6` (10,68) | `#c2c9d6` (10,68) |
| Royaume de Ruthvénie sombre | `#4a9d61` | `#2a7a3d` | `#ff6b85` | `#1a0408` | `#ff6b85` (6,47) | `#ff6b85` (6,47) |

`status-unread` vaut `text-accent` dans les 16 variantes : l'accent, sauf `#8a5a00` en Empire Brun clair (R3). En clair, `highlight-reverse` n'a plus d'emploi relevé une fois Q1 appliquée : il colorait le texte des boutons primaires (l.1997), et la pastille de niveau garde en clair son texte actuel (blanc, ou `--kr-text` en Empire Brun).

#### Encre d'action

Valeurs de `--kr-arm-*` quand la variante les définit (CX2), sinon celles de leurs replis ; les jetons de survol de la croix (`--kr-arm-ink-hover`, `--kr-arm-bg-hover`) gardent leurs valeurs actuelles. En clair, le fond de survol est la primaire foncée de la formule H5.2. Seule valeur nouvelle à déclarer : l'encre de survol de Paladium clair, que Q1 impose (le repli blanc y ferait 3,23:1).

| Variante | `action-bg` | `action-ink` | Contraste | `action-bg-hover` | `action-ink-hover` | Contraste |
|---|---|---|---|---|---|---|
| Kraland clair | `#8b0f0e` | `#ffffff` | 9,67 | `#6f0c0b` | `#ffffff` | 12,12 |
| Empire Brun clair | `#5e3b2d` | `#ffffff` | 9,82 | `#4b2f24` | `#ffffff` | 12,13 |
| Paladium clair | `#d4af37` | `#1e1a15` | 8,23 | `#aa8c2c` | `#1e1a15` (à déclarer, Q1) | 5,35 |
| Théocratie Seelienne clair | `#0033a0` | `#ffffff` | 10,60 | `#002980` | `#ffffff` | 12,89 |
| Paradigme Vert clair | `#0b6623` | `#ffffff` | 7,15 | `#09521c` | `#ffffff` | 9,39 |
| Khanat Elmérien clair | `#6a0dad` | `#ffffff` | 9,24 | `#550a8a` | `#ffffff` | 11,69 |
| Confédération Libre clair | `#6b7280` | `#ffffff` | 4,83 | `#565b66` | `#ffffff` | 6,81 |
| Royaume de Ruthvénie clair | `#0a6b2d` | `#ffffff` | 6,66 | `#085624` | `#ffffff` | 8,87 |
| Kraland sombre | `#b64c4c` | `#f5f1ed` | 4,53 | `#8b0f0e` | `#f5f1ed` | 8,60 |
| Empire Brun sombre | `#7a5240` | `#ffffff` | 6,76 | `#5e3b2d` | `#ffffff` | 9,82 |
| Paladium sombre | `#e6c76e` | `#1e1a15` | 10,51 | `#d4af37` | `#1e1a15` | 8,23 |
| Théocratie Seelienne sombre | `#5a8fd9` | `#1e1a15` | 5,24 | `#2d5fcb` | `#f5f1ed` | 5,18 |
| Paradigme Vert sombre | `#4d9c61` | `#1e1a15` | 5,14 | `#2a7a3d` | `#f5f1ed` | 4,73 |
| Khanat Elmérien sombre | `#8659b3` | `#f5f1ed` | 4,57 | `#7b4c9c` | `#f5f1ed` | 5,57 |
| Confédération Libre sombre | `#9ca3af` | `#1e1a15` | 6,81 | `#5f6673` | `#f5f1ed` | 5,14 |
| Royaume de Ruthvénie sombre | `#4a9d61` | `#1e1a15` | 5,18 | `#2a7a3d` | `#f5f1ed` | 4,73 |

#### Teintes, alerte info et ombre

En sombre, `header-tint` et `border-tint` prennent les valeurs de `bg-elevated` et de `border-default`. `btn-shadow` s'écrit avec son opacité (`1f` : 12 %). Dernière colonne : contraste du texte sur l'alerte info.

| Variante | `header-tint` | `border-tint` | `info-bg` | `info-border` | `btn-shadow` | `text-primary` sur `info-bg` |
|---|---|---|---|---|---|---|
| Kraland clair | `#f6ecec` | `#ead4d4` | `#f8f1f1` | `#efdddd` | `#8b0f0e1f` | 16,13 |
| Empire Brun clair | `#f2efee` | `#e2dcd9` | `#f5f3f2` | `#e8e4e2` | `#5e3b2d1f` | 16,25 |
| Paladium clair | `#fcf9ef` | `#f7f1db` | `#fcfaf3` | `#f9f4e3` | `#d4af371f` | 17,21 |
| Théocratie Seelienne clair | `#ebeff7` | `#d1daee` | `#f0f3f9` | `#dbe2f2` | `#0033a01f` | 16,17 |
| Paradigme Vert clair | `#ebf3ed` | `#d3e3d7` | `#f0f6f2` | `#ddeae0` | `#0b66231f` | 16,41 |
| Khanat Elmérien clair | `#f3ecf8` | `#e4d3f0` | `#f6f0fa` | `#eaddf4` | `#6a0dad1f` | 16,06 |
| Confédération Libre clair | `#f3f4f5` | `#e4e6e8` | `#f6f7f7` | `#eaebed` | `#6b72801f` | 16,75 |
| Royaume de Ruthvénie clair | `#ebf3ee` | `#d3e4d9` | `#f0f6f2` | `#ddeae2` | `#0a6b2d1f` | 16,41 |
| Kraland sombre | `#2a1f1f` | `#ffffff14` | `#371e1e` | `#502727` | `#c452521f` | 13,33 |
| Empire Brun sombre | `#2a251f` | `#ffffff14` | `#2c221b` | `#3a2b22` | `#7a52401f` | 13,82 |
| Paladium sombre | `#252015` | `#ffffff14` | `#39321e` | `#574d2c` | `#e6c76e1f` | 11,44 |
| Théocratie Seelienne sombre | `#1a2438` | `#ffffff14` | `#1d2a44` | `#283c5f` | `#5a8fd91f` | 12,50 |
| Paradigme Vert sombre | `#1a2820` | `#ffffff14` | `#182e1f` | `#22412a` | `#4d9c611f` | 12,91 |
| Khanat Elmérien sombre | `#251a2d` | `#ffffff14` | `#2d1f39` | `#402b53` | `#9966cc1f` | 12,95 |
| Confédération Libre sombre | `#1f2228` | `#ffffff14` | `#2a2d32` | `#3e4248` | `#9ca3af1f` | 11,46 |
| Royaume de Ruthvénie sombre | `#1d2621` | `#ffffff14` | `#1c2e21` | `#24412d` | `#4a9d611f` | 12,92 |

#### Fonds et textes

Les 8 variantes claires partagent fonds et textes ; les 8 sombres ont les leurs, teintés de la nation (valeurs actuelles). Bordures : `{colors.border-default}` et `{colors.border-strong}` en clair, `{colors.border-default-dark}` et `{colors.border-strong-dark}` dans les 8 variantes sombres.

| Variante | `bg-page` | `bg-surface` | `bg-elevated` | `text-primary` | `text-secondary` | `text-muted` |
|---|---|---|---|---|---|---|
| 8 variantes claires | `#f5f5f5` | `#ffffff` | `#ffffff` | `#0f1724` | `#636a77` (Q26) | `#9ca3af` |
| Kraland sombre | `#120d0d` | `#1e1515` | `#2a1f1f` | `#f5eded` | `#b8a0a0` | `#8a6868` |
| Empire Brun sombre | `#12100d` | `#1e1a15` | `#2a251f` | `#f5f1ed` | `#b8a997` | `#8a7968` |
| Paladium sombre | `#0f0e0a` | `#1a1810` | `#252015` | `#f5f3e8` | `#c4b896` | `#938567` |
| Théocratie Seelienne sombre | `#0a0e15` | `#12182a` | `#1a2438` | `#e8f0ff` | `#9db5d6` | `#6b7f9e` |
| Paradigme Vert sombre | `#0a120d` | `#0f1a13` | `#1a2820` | `#e8f5ed` | `#a0c4ab` | `#6d8a75` |
| Khanat Elmérien sombre | `#0f0a15` | `#1a121f` | `#251a2d` | `#f0e8ff` | `#bba0d6` | `#857299` |
| Confédération Libre sombre | `#0e1013` | `#16181c` | `#1f2228` | `#e8eaed` | `#b8bcc4` | `#7e8591` |
| Royaume de Ruthvénie sombre | `#0d1210` | `#141a16` | `#1d2621` | `#ecf5f0` | `#a5c4b0` | `#708a79` |

### Contrastes de référence

Calculés par script (formule WCAG) sur les valeurs des tableaux ci-dessus, pour les combinaisons qui portent une décision. Sauf mention, sur les 16 variantes.

| Combinaison | Valeurs | Cible | Verdict |
|---|---|---|---|
| `action-ink` sur `action-bg` | 4,53 à 10,60:1 | ≥ 4,5:1 (Q1) | conforme |
| `action-ink-hover` sur `action-bg-hover` | 4,73 à 12,89:1, avec l'encre `#1e1a15` en Paladium clair (le repli blanc y fait 3,23:1) | ≥ 4,5:1 (Q1) | conforme une fois l'encre déclarée |
| `text-accent` (liens, texte coloré) sur `bg-surface` | 5,31 à 13,34:1 (sombre : 5,31 à 10,68:1) ; ≥ 4,84:1 sur `bg-page`, `bg-elevated` et `header-tint` (sombre, sur `bg-elevated` : 4,84 à 9,58:1) | ≥ 4,5:1 (H5.6, Q2, R7) | conforme |
| `text-accent` sur `info-bg` (lien dans une alerte info) | ≥ 4,92:1, sauf Paladium sombre 3,81:1 | ≥ 4,5:1 | Paladium sombre : Q4 |
| `text-nation` (bouton standard) sur `bg-surface` | 5,31 à 10,68:1 ; ≥ 4,5:1 aussi sur `header-tint` (survol et appui) une fois Confédération Libre clair passée à son accent (ticket 3.4) | ≥ 4,5:1 (H5.3, Q2) | conforme |
| `bg-surface` sur `status-unread` (pastilles d'état) | 5,31 à 13,34:1 | ≥ 4,5:1 | conforme |
| `highlight-reverse` sur `highlight` (pastille de niveau, sombre) | 5,44 à 11,36:1 (8 variantes sombres) | ≥ 4,5:1 | conforme |
| `text-primary` sur `info-bg` | 16,06 à 17,21:1 (clair) ; 11,44 à 13,82:1 (sombre) | ≥ 4,5:1 | conforme |
| `text-primary` sur `header-tint`, clair | 15,52 à 17,06:1 | ≥ 4,5:1 | conforme |
| `text-secondary`, clair : sur blanc / `bg-page` / `header-tint` / `info-bg` | 5,44 / 4,99 / 4,70 à 5,17 / 4,86 à 5,21:1 (`#636a77` ; `#6b7280` faisait 4,83 / 4,43 / 4,17 à 4,59 / 4,32 à 4,63:1) | ≥ 4,5:1 | conforme (Q26, décidé en autonomie, ticket 3.4) |
| `text-secondary` sur `bg-surface`, sombre | 7,31 à 9,35:1 | ≥ 4,5:1 | conforme |
| `text-muted` | 2,54:1 (clair) ; 3,63 à 4,90:1 (sombre) | — | `[ASSUMPTION]` indisponible seulement (Q26) |
| Filet primaire de l'onglet actif | 2,10:1 (Paladium clair), 2,56:1 (Empire Brun sombre) ; ailleurs ≥ 3,99:1 | non fixée | Q20 |
| Bordure du bouton standard, clair (`border-tint` sur blanc) | 1,13 à 1,41:1 | non fixée | Q20 |
| Anneau de focus (`text-accent`) | ≥ 4,84:1 sur `bg-page`, `bg-surface`, `bg-elevated` et `header-tint` ; 3,81:1 au plus bas sur `info-bg` (Paladium sombre) | `[ASSUMPTION]` ≥ 3:1 | conforme |

## Typography

Aucun jeton de typographie n'existe aujourd'hui (32 tailles différentes dans le CSS, 0 % en jetons). La hiérarchie est désormais la même sur les deux supports.

| Rôle | Jeton | Taille | Graisse | Exemples | Décision |
|---|---|---|---|---|---|
| Grand titre de page (ordinateur) | `{typography.page-title}` | 36 px | actuelle | forum, kramail, interface | H11.1 (inchangé) |
| Titre de section | `{typography.section-title}` | 17 px | 700 (`[ASSUMPTION]` sur ordinateur, repris du mobile) | « Outils », « Jeu (RP) », en-têtes de panneau | H3.1, H4.1, H11.1 |
| Nom et valeur | `{typography.name}` | 15 px | 600 `[ASSUMPTION]` | « Lanterne », « 22467 MØ », noms de personnages | H3.1, H7.1, H11.1 |
| Nom de forum (index) | `{typography.forum-name}` | 15 px | 400 (comme un sujet lu, ticket 6.1) | « Taverne » | refonte de l'index |
| Texte courant | `{typography.body}` / `{typography.body-mobile}` | 14 px / 15 px `[ASSUMPTION]` (Q8) | normale | notifications : 14 px (pop-up), 15 px (mobile, H14.1) | H11.1, H14.1 |
| Détail | `{typography.detail}` | 13 px | normale | charge, dates, dernier message, compteurs | H3.1, H11.1, H14.1 |
| Étiquette, pastille | `{typography.label}` | 12 px | 700 | « mod », « guilde », « PNJ », « NON LU », « ! », « ici » | H8.2 |
| Bouton | `{typography.button}` | 14 px | actuelle | « Dormir », « Prier », sections de jeu, « Valider », « Envoyer » | H6.1, H6.2 |
| Bouton compact (ordinateur) | `{typography.button-compact}` | 12 px | actuelle | votes, pagination | H6.2 |

Règles :

- Aucun titre plus petit que le texte courant. Sur les pages de jeu mobiles (plateau, Matériel, Personnage, Bâtiments, Employés), rien sous 12 px (H3.1). Cause du défaut actuel : l'échelle mobile des titres en `rem` ; les tailles décidées s'écrivent en pixels.
- Ordinateur (H11.1) : les noms et valeurs en h4 de 18 px (« Lanterne », « 22467 MØ ») passent à 15 px ; les titres de section passent de 16 à 17 px.
- `[ASSUMPTION]` Texte courant mobile à 15 px, d'après H3.1 (noms et valeurs) et H14.1 (« comme le reste du jeu ») ; le texte des messages du forum garde ses 16 px. L'échelle n'a pas de rôle « champ » (Q8).
- Les plus petites tailles décidées hors des pages de jeu mobiles valent aussi 12 px (étiquettes, boutons compacts).
- Famille : celle du site, non surchargée. Interlignage : non tranché, rendu actuel (Q18).
- Titres de section en `{colors.text-primary}`, jamais en primaire (H4.1, H5.6).

Maquettes : [mockups/h03-texte-mobile-materiel.html](mockups/h03-texte-mobile-materiel.html) (Matériel en 375 px, avant/après : titre et nom en 20/10 px deviennent titre, nom et détail en 17/15/13 px) ; [mockups/key-plateau-mobile.html](mockups/key-plateau-mobile.html) (plateau en 375 px : 17/15/13/12 px).

## Layout & Spacing

- **Grille** (H11.2) : une seule, au pas de 4 px : `{spacing.1}` à `{spacing.6}` (4, 8, 12, 16, 24, 32 px), sur ordinateur et mobile. Les 10 et 15 px de Bootstrap deviennent 8, 12 ou 16 px. `[ASSUMPTION]` 15 devient 16 ; 10 devient 8 ou 12 selon les espacements voisins, au cas par cas ; périmètre à borner (Q11). Aujourd'hui : deux grilles, 15 px écrit 46 fois, 3 % des espacements en jetons.
- **Marge latérale mobile** (H10.1) : `{spacing.margin-mobile}` (16 px) sur toutes les pages ; aucun texte ne commence plus près du bord. Pages à corriger : Règles, Interface, Statistiques, Aide, Carte (titre de la ville), index du forum RP et HRP (titre), Événements. Le défaut de la Carte existe aussi sur ordinateur ; `[ASSUMPTION]` il y est corrigé de même. Contrainte d'implémentation (marges des conteneurs mises à zéro par le JS) : [notes-implementation.md](notes-implementation.md).
- **Cartes de section mobiles** (H4.1) : légèrement en retrait des bords, liste des sujets du sous-forum comprise, qui quitte sa pleine largeur (R6). `[ASSUMPTION]` 8 px ; le contenu garde 16 px de marge intérieure (Q10).
- **Hauteurs** : bouton 34 px (ordinateur) et 44 px (mobile) (H6.2) ; « Envoyer » 48 px sur mobile, dans le flux (R4) ; en-tête de carte de section 48 px (H4.1) ; ligne de forum ≥ 72 px sur mobile (refonte de l'index) ; cible tactile `{spacing.touch-target}`, croix `{spacing.touch-target-dpad}` (H9.1, AGENTS.md).
- **Places fixes** : chaque élément récurrent garde sa place.
  - Nom du personnage : en tête du mini-profil (mobile) et en titre du panneau latéral (ordinateur), sur les cinq pages de jeu (H1.3, H1.4, R1).
  - Section en cours : filet sous l'onglet ou le bouton d'accès rapide (H1.5).
  - Modale d'ordre : alertes de blocage et d'avertissement juste sous le titre de l'ordre, fixées en haut du corps de la modale pendant le défilement (H2.3, R2) ; pastilles coût, durée, potentiel juste au-dessus des boutons (H2.5).
  - Ligne d'objet : image, nom, puis charge alignée à droite (H3.2).
  - Ligne de forum, ordinateur : icône et nom à gauche ; compteurs, dernier message et flèche alignés à droite (refonte de l'index).
  - Notifications : sélecteur de personnage à 16 px du haut ; sur mobile, date au-dessus du texte et filet « non lu » à gauche (H14.2, H14.3).
  - « Envoyer » : sous le champ de rédaction, dans le flux (R4).
- **Points de rupture** : mobile ≤ 767 px, ordinateur ≥ 768 px, selon les conventions d'AGENTS.md. Les cartes de personnages changent selon leur propre largeur, pas selon celle de la fenêtre (H7.1). Comportement détaillé : EXPERIENCE.md, « Responsive & Platform ».

## Elevation & Depth

- **Étagement par le ton.** En sombre, trois niveaux teintés de la nation : `bg-page` < `bg-surface` < `bg-elevated` (du plus sombre au plus clair). En clair, le fond de page est `#f5f5f5` et les surfaces sont blanches ; les teintes de H5.3 (`{colors.header-tint}`, `{colors.border-tint}`) donnent aux en-têtes le même détachement qu'en sombre.
- **Ombres.** Jetons actuels inchangés : `--kr-shadow-sm/md/lg` (opacité : clair 0,05 / 0,07 / 0,10 ; sombre 0,4 / 0,5 / 0,6). Seule l'ombre du bouton primaire change : `{colors.btn-shadow}`, dérivée de la nation (H5.2). Les maquettes h04 et h12 ne montrent aucune ombre sur les cartes de section ni sur les lignes de forum ; aucune décision n'en ajoute.

## Shapes

Trois rayons, identiques sur ordinateur et mobile (H6.3) : `{rounded.sm}` (4 px) pour les contrôles (boutons, dont « Envoyer », et champs) ; `{rounded.md}` (8 px) pour les conteneurs (cartes, panneaux, modales, cartes de section) ; `{rounded.full}` pour les pastilles et étiquettes. Ils remplacent 36 rayons distincts (cartes de 4 à 22 px ; boutons 3/4/5 px sur ordinateur, 0/3/4/6/8/10 px sur mobile ; boutons à icône du kramail à 10 px ; « Envoyer » du forum à 8 px).

`[ASSUMPTION]` Formes non citées par H6.3, conservées : rayons asymétriques des touches de la croix directionnelle, avatars et images (Q12).

## Components

Liste commune avec EXPERIENCE.md (« Component Patterns »), mêmes noms, même ordre. Éléments existants sans composant de rattachement (pastille de niveau, bouton à icône, tuiles d'action du plateau mobile…) : Q24 et Q30.

| Composant | Anatomie et aspect | Décisions |
|---|---|---|
| **Bouton primaire** | `{components.button-primary}` : fond `{colors.action-bg}`, texte `{colors.action-ink}`, `{rounded.sm}`, `{typography.button}`, 34 px sur ordinateur, `{spacing.touch-target}` sur mobile, ombre `{colors.btn-shadow}`. Quelle que soit la balise (button, a, label, span, input). Survol : fond `{colors.action-bg-hover}`, texte `{colors.action-ink-hover}`. Sur le plateau (ordinateur), les boutons d'action de classe native `btn-primary` en font partie (Dormir, Prier dans la fixture `plateau-qualite-usage.html`). | H5.1, H2.2, H6.1, H6.2, Q1 |
| **Bouton standard** | `{components.button-standard}` : fond `{colors.bg-surface}`, bordure `{colors.border-tint}`, texte `{colors.text-nation}` (primaire en clair, sauf Paladium et Confédération Libre ; accent en sombre). Mêmes tailles que le bouton primaire. Sert à « Annuler », « ? Aide » et aux boutons de classe native `btn-default` (Pouvoir sur le plateau). Les actions ordinaires (« Voir l'historique », « Pas un contact », Contacts) prennent ce style ou celui du bouton primaire (H5.5). Maquette : [mockups/h05-clair-composants.html](mockups/h05-clair-composants.html) (voir sa mise en garde, « Teintes du mode clair »). | H5.3, H5.5, H2.4, H6.2, Q2 |
| **Bouton compact** | `{components.button-compact}`. Ordinateur seulement : `{typography.button-compact}`, `{rounded.sm}`. Réservé aux votes et à la pagination. Hauteur et couleur non tranchées (votes : 22 px aujourd'hui, Q9). | H6.2 |
| **Bouton « Envoyer »** | `{components.send-button}`. Mobile : dans le flux, sous le champ de rédaction, comme l'« Envoyer » actuel du forum (aligné à droite, largeur du libellé, l.14799-14812) : 48 px de haut, fond `{colors.action-bg}`, texte `{colors.action-ink}`, `{typography.button}`, `{rounded.sm}` (texte de 16 px et rayon de 8 px aujourd'hui au forum). Forum (nouveau sujet, réponse) et kramail ; plus aucune barre fixe, celle de 56 px du kramail disparaît (l.10256). Ordinateur : **Bouton primaire** de taille normale. Sur les Règles, « ok » reste un bouton à côté du champ de recherche (H1.2). | R4, H1.2, H6.2, H6.3, Q1 |
| **Bouton « ••• »** | Glyphe texte « ••• » du forum (L7229-7236) pour tous les boutons « autres actions », kramail compris (au lieu de l'icône « ⋮ » `fa-ellipsis-v`). Bouton à icône de `{spacing.touch-target}` sur mobile. `[ASSUMPTION]` style standard. | H12.2, H13.1 |
| **Onglets de section** | Mobile : icône et libellé. Actif (`{components.tab-active}`) : texte en demi-gras (600), filet `{colors.primary}` de 3 px sous l'onglet, fond inchangé. Icônes : Agir `fa-bolt`, Matériel `fa-suitcase`, Personnage `fa-user`, Bâtiments `fa-home`, Employés `fa-users`. Libellés ≥ 12 px (11 px aujourd'hui, Q14). Même composant pour les dossiers du kramail (Réception, Envoi, Corbeille ; disposition : Q31). Maquettes : [mockups/key-plateau-mobile.html](mockups/key-plateau-mobile.html), [mockups/key-kramail-mobile.html](mockups/key-kramail-mobile.html). | H1.6, H13.1, H3.1 |
| **Boutons d'accès rapide** | Ordinateur : 5 boutons (Agir, Matériel, Personnage, Bâtiments, Employés), mêmes icônes, `{typography.button}`, 34 px. Section en cours : même signal que l'onglet actif (demi-gras, filet primaire de 3 px), fond inchangé. À ne pas confondre avec les tuiles d'action du plateau mobile, que le code appelle « actions rapides » (Q24). | H1.5, H1.6, H6.1 |
| **Panneau latéral du jeu** | Ordinateur. Titre : nom du personnage sur le plateau et sur les pages Matériel, Personnage, Bâtiments et Employés (au lieu de « Personnage », « Employés »). Source du nom : EXPERIENCE.md (R1). Style d'**En-tête de panneau et de tableau**. Nom long : Q29. | H1.4, R1 |
| **Mini-profil** | Mobile : nom du personnage en `{typography.name}`, à la place du mot fixe « Personnage », sur toutes les pages de jeu ; source du nom : EXPERIENCE.md (R1). Jauges en `{components.gauge}`. Maquette : [mockups/key-plateau-mobile.html](mockups/key-plateau-mobile.html) (plié). | H1.3, H3.1, H5.4, R1 |
| **Carte de section** | Mobile : `{components.section-card}`. En-tête de 48 px et contenu dans la même carte `{rounded.md}`, en retrait des bords ; titre `{typography.section-title}` en `{colors.text-primary}` ; icône à gauche, chevron à droite. Sert au jeu, au forum (liste des sujets du sous-forum comprise, au lieu de sa pleine largeur actuelle, R6) et au kramail. Remplace la carte détachée du jeu (54 px, titre 17 px), la bande du forum (45 px, titre 16 px) et la carte du kramail (50 px, titre en `{colors.text-accent}`). Maquette : [mockups/h04-entetes-section-mobile.html](mockups/h04-entetes-section-mobile.html) (option A retenue, option B écartée ; la maquette nomme ce composant « en-tête de section »). | H4.1, H6.3, R6 |
| **En-tête de panneau et de tableau** | `{components.panel-header}` : fond `{colors.header-tint}`, bordure `{colors.border-tint}` (teintes de la nation en clair ; `bg-elevated` et `border-default` en sombre). Titre `{typography.section-title}` (17 px). Panneau `{rounded.md}`. Les onglets suivent la même règle en clair. Maquette : [mockups/h05-clair-composants.html](mockups/h05-clair-composants.html). | H5.3, H11.1, H6.3 |
| **Ligne d'objet** | Matériel : image, nom (`{typography.name}`), puis charge alignée à droite (`{typography.detail}`, `{colors.text-secondary}`), dans le même ordre que sur ordinateur. Maquette : [mockups/h03-texte-mobile-materiel.html](mockups/h03-texte-mobile-materiel.html) (carte sans retrait, voir Q10). | H3.1, H3.2 |
| **Ligne de citoyenneté** | Personnage, mobile : icône et valeur, comme sur ordinateur ; plus de « → … sujets · » hérité du forum. | H1.1 |
| **Modale d'ordre** | Conteneur `{rounded.md}`. Anatomie, supports et maquette : détail sous le tableau. | H2.1 à H2.7, R2 |
| **Pastilles coût, durée, potentiel** | Ordinateur et mobile, juste au-dessus des boutons. Fond `{colors.action-bg}`, texte `{colors.action-ink}` (Q1). Fin des pastels jaune, bleu ciel et rose. `[ASSUMPTION]` Reste du style : celui de l'**Étiquette de catégorie** (Q5). | H2.5, H5.5, H8.1, Q1 |
| **Alerte** | `{components.alert}`. Bloc d'état : blocage (`.alert-danger`) en `{colors.danger}`, avertissement (`.alert-warning`) en `{colors.warning}`, information en teinte de la nation (`{colors.info-bg}`, `{colors.info-border}`). Texte `{colors.text-primary}`, `{rounded.md}`. `[ASSUMPTION]` Fond en couleur d'état à faible opacité, taux non chiffrés (Q3 ; maquette key-modale-ordre : fond à 12 %, bordure à 35 %). | H5.5, H2.3, R2 |
| **Pastille d'état** | `{components.badge-state}` : `{typography.label}`, `{rounded.full}`, texte `{colors.bg-surface}` sur `{colors.status-unread}` (comme le « NON LU » actuel). Une seule couleur pour « NON LU », « NOUVEAU MESSAGE », la pastille « ! » de la cloche (rouge `#dc3545` aujourd'hui) et celle de l'enveloppe du kramail (rouge aujourd'hui, comme la pastille d'état) (R3). | H8.1, H8.2, R3 |
| **Étiquette de catégorie** | `{components.label-category}` : un seul style pour « article », « guilde », « mod », « PNJ », « Dernier sujet »… : fond `{colors.action-bg}`, texte `{colors.action-ink}` (Q1, au lieu du blanc de H8.1), `{typography.label}`, `{rounded.full}`. Jamais une couleur d'état : « PNJ » des cartes du plateau quitte le rouge `#c9302c`. | H8.1, H8.2, Q1 |
| **Jauges PV, PM, PP** | `{components.gauge}` : PV `{colors.gauge-pv}`, PM `{colors.gauge-pm}`, PP `{colors.gauge-pp}`, ton clair ou sombre selon le mode. Mêmes couleurs sur ordinateur et mobile. | H5.4 |
| **Carte de personnage** | `{components.character-card}`. Ordinateur, mobile et maquettes : détail sous le tableau. | H7.1, principe « avatar important », H8.1 |
| **Croix directionnelle et pièces** | Mobile, rendu actuel (CX2), sauf la pastille « ici » de la pièce courante, qui passe en `{typography.label}` (10,5 px aujourd'hui, H8.2) : touches ≥ `{spacing.touch-target-dpad}`, texte des touches ≥ 4,5:1 (`--kr-arm-ink`) ; pièces ≥ `{spacing.touch-target}` ; pièce courante marquée « ici » ; direction indisponible en pointillé. Maquette : [mockups/key-plateau-mobile.html](mockups/key-plateau-mobile.html). | AGENTS.md, H9.1, H8.2 |
| **Ligne de forum** | `{components.forum-row}` : icône et nom (`{typography.forum-name}`) ; dernier message : auteur en `{colors.text-accent}`, heure, en `{typography.detail}` ; « N sujets · N messages » en `{typography.detail}` et `{colors.text-secondary}` ; flèche de 34 px (ordinateur) ou `{spacing.touch-target}` (mobile) vers le dernier message, `[ASSUMPTION]` en bouton standard. Ordinateur : compteurs, dernier message et flèche alignés à droite. Mobile : lignes ≥ 72 px dans une **Carte de section**. Ni description ni modérateurs. Étiquette « guilde » en **Étiquette de catégorie**. Points ouverts (heure, forum sans dernier message) : Q27. Maquette : [mockups/h12-index-forum.html](mockups/h12-index-forum.html). | refonte de l'index (H12.1) |
| **Ligne de sujet** | Sous-forum, rendu actuel, dans la **Carte de section** sur mobile (R6) ; pastilles « NON LU », « NOUVEAU MESSAGE » en **Pastille d'état** ; étiquettes en **Étiquette de catégorie** ; filet « non lu » en `{colors.status-unread}`, la couleur des pastilles (R3). | H8.1, H8.2, R3, R6 |
| **Fil d'Ariane** | Forum, mobile : format des sujets, « Catégorie › Forum › Sujet », élément courant atténué (`{colors.text-secondary}`) et coupé par des points de suspension s'il est trop long. Le sous-forum perd « ⏪ » et son icône de retour. Couleur des liens et hauteur des cibles : Q28. | H12.3 |
| **En-tête de sujet** | Forum, mobile : **Fil d'Ariane**, puis barre « Répondre » (**Bouton primaire**) et « Nouveau sujet » (`[ASSUMPTION]` **Bouton standard**). Boutons de 44 px, `{rounded.sm}` (48 px et 8 px aujourd'hui). Étendu aux sujets de Communauté, Débats et Staff. | H12.4, H6.2, H6.3 |
| **Ligne de notification** | `{components.notification-row}` : texte `{typography.body}` dans le pop-up ordinateur (900×800, rendu ordinateur, R5), 15 px sur mobile (H14.1) ; date `{typography.detail}`. Mobile : date au-dessus du texte, texte sur toute la largeur. Non lue : filet `{colors.status-unread}` à gauche (R3). Aucune bande vide de ≈ 70 px en haut : le sélecteur de personnage commence à 16 px. Maquette : [mockups/key-notifications-mobile.html](mockups/key-notifications-mobile.html). | H14.1, H14.2, H14.3, R3, R5 |
| **Cloche des notifications** | Icône de la barre du haut ; pastille « ! » en **Pastille d'état** (12 px gras au lieu de 10 px ; `{colors.status-unread}` au lieu du rouge `#dc3545`). L'enveloppe du kramail porte la même pastille (R3). | H8.1, H8.2, R3 |
| **Éditeur de rédaction** | Rendu actuel (forum, kramail, ordres), avec le **Bouton « Envoyer »** sous le champ sur mobile (R4). Mobile : boutons de la barre d'outils et cibles du champ Destinataires ≥ `{spacing.touch-target}` (40×40 aujourd'hui au kramail). | H9.1, R4 |
| **Anneau de focus** | `{components.focus-ring}` : anneau de 2 px en `{colors.text-accent}` (l'accent ; `#8a5a00` en Empire Brun clair, Q2), décalé de 2 px. Seule forme de focus ; remplace les 8 formes du CSS et l'anneau bleu du navigateur `rgb(153,200,255)`. | H5.7, Q2 |
| **Lien** | `{components.link}` : `{colors.text-accent}` au repos et au survol ; le survol souligne au lieu de passer en primaire ; focus clavier en **Anneau de focus**. | R7, H5.6, H5.7, Q2 |

### Modale d'ordre, détail

- De haut en bas, dans le corps de l'ordre : titre, **Alerte** de blocage ou d'avertissement (s'il y en a), bouton « ? Aide » en **Bouton standard**, contenu de l'ordre, **Pastilles coût, durée, potentiel**, puis « Annuler » (**Bouton standard**) et « Valider » (**Bouton primaire**). Maintien des alertes pendant le défilement et repli de l'aide : EXPERIENCE.md (R2).
- Mobile : boutons pleine largeur, « Valider » sous « Annuler » ; onglet actif en `{colors.text-primary}` ≥ 4,5:1, sans halo bleu `#428bca`.
- Ordinateur : croix de fermeture `{components.modal-close}` (44×44, couleur du texte, ≥ 3:1 au lieu de noir à 0,2 d'opacité).
- Maquette : [mockups/key-modale-ordre.html](mockups/key-modale-ordre.html) (ordinateur et mobile en Empire Brun sombre, pied en Paladium clair) ; image fixe, elle ne montre pas le maintien de l'alerte au défilement.

### Carte de personnage, détail

- Ordinateur : avatar de 70 px conservé (plus gros que sur mobile parce qu'il y a la place) ; quand la carte est trop étroite pour le nom à côté de l'avatar, le nom passe dessous, sur toute la largeur de la carte, deux lignes au plus ; sinon, rien ne change. Constat : cartes trop étroites dans les fenêtres d'environ 1100 à 1500 px. `[ASSUMPTION]` Nom en `{typography.name}` aussi sur ordinateur (H11.1, Q7).
- Mobile : nom en `{typography.name}`, icônes d'action de 44×44 (26 à 28 px aujourd'hui).
- « PNJ » en **Étiquette de catégorie**.
- Maquettes : [mockups/key-plateau-mobile.html](mockups/key-plateau-mobile.html) (mobile) ; [.working/h07-cartes-personnages.html](.working/h07-cartes-personnages.html) montre la proposition d'avant reformulation (avatar de 56 px au-dessus du nom, écartée) : seule la décision H7.1 décrite ici vaut.

## Do's and Don'ts

| À faire | À éviter | Source |
|---|---|---|
| Couleur de la nation pour tout bouton primaire, quelle que soit la balise | Bleu Bootstrap `#337ab7` / `#286090` | H5.1 |
| Toutes les nuances d'une variante claire tirées de sa nation | Rouge Kraland résiduel (`#700b09`, `#f9d9de`) chez les autres nations | H5.2 |
| En clair, les composants aux couleurs de la nation, comme en sombre (teintes à 8 % et 18 %) | Rendu Bootstrap brut (`#f5f5f5`/`#333`, `#ddd`) | H5.3 |
| En sombre, la primaire en fond et l'accent pour le texte coloré | Primaire en texte (2,25 à 2,56:1 en Empire Brun) | H5.6 |
| Texte coloré à 4,5:1 au moins, dans la nuance de la nation qui y parvient | Or d'Empire Brun ou de Paladium en texte (2,82 et 2,10:1) | Q2 |
| Texte posé sur la couleur de nation en encre d'action | Blanc imposé (1,65:1 en Paladium sombre) | Q1 |
| Couleur vive réservée aux états | Boutons d'action cyan, orange ou rouge ; pastilles pastel | H5.5 |
| Une seule couleur pour « non lu / nouveau » | Cloche en rouge danger ; filet et pastille de deux couleurs | R3 |
| Une couleur par jauge, la même sur les deux supports | Vert Bootstrap 3 sur ordinateur, Bootstrap 4 sur mobile | H5.4 |
| Un seul style d'étiquette de catégorie | « PNJ » en rouge danger | H8.1 |
| Étiquettes et pastilles en 12 px gras | 8,25 à 10,5 px | H8.2 |
| Titres 17 px, noms 15 px, détails 13 px ; rien sous 12 px (jeu, mobile) | Titre de 20 px au-dessus d'un nom de 10 px | H3.1, H11.1 |
| Titre de section en couleur du texte | Titre de section en primaire | H4.1 |
| Trois rayons : 4 px, 8 px, plein | 36 rayons différents | H6.3 |
| Grille au pas de 4 px | 10 et 15 px de Bootstrap | H11.2 |
| Une seule forme de focus | Anneau bleu du navigateur, 8 formes | H5.7 |
| Liens en accent, soulignés au survol | Survol des liens en primaire | R7 |
| « Envoyer » dans le flux, sous le champ | Barre fixe en bas d'écran | R4 |
| Mêmes icônes de section sur les deux supports | Deux séries d'icônes | H1.6 |
| Avatar de 70 px sur ordinateur | Réduire l'avatar | principe « avatar important », H7.1 |
