# Travail différé

## Lot A (tickets backlog 25, 26, 29), revue quick du 2026-10-31

- Ticket 25 : `accueil-mobile#defileur` ne rejoue pas les tours à 1280 px. La règle est mobile seulement et `accueil-mobile#bureau` compare l'ordinateur à la base.
- Ticket 29 : aucune autre page mobile n'est comparée à la base par `accueil-mobile#jouer`. Les règles sont gardées par `:where(html.kr-page-accueil)`.

## Lot B (tickets backlog 27, 28, 30), revue quick du 2026-10-31

- Ticket 30 : la liste du kramail (`kr-page-kramail-liste`) partage la règle `flex-wrap: nowrap` de la pagination mobile. Elle déborderait de la même façon avec une pagination longue non compactée (Premier / Dernier). Non élargi (hors ticket).
- Ticket 28 : la bascule de `kramail-theme#contacts-onglets` ne tourne qu'en Kraland clair.
