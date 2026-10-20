# BanqueKing

Petite app web (mobile d'abord, style Revolut) pour suivre son argent :

- **Comptes** : solde de chaque compte (négatif possible), découvert autorisé, solde cumulé.
- **Charges fixes** et **revenus** : intitulé, montant, jour de prélèvement / versement, catégorie.
- **Reste à la fin du mois** : solde des comptes comptés + revenus à venir − charges à venir, avec projection jour par jour et alerte de découvert (ou de dépassement du découvert autorisé).
- **Budget variable** (courses, sorties…) : montant mensuel et déjà dépensé, inclus dans la projection.
- **Épargne & placements** : objectifs avec durée estimée, placements avec plus-value.

Les données restent dans le navigateur (localStorage). Sauvegarde / restauration en texte depuis le menu « … ».

## Lancer

Ouvrir `index.html`, ou servir le dossier (`npx serve .`). Sur iPhone, une fois hébergé en HTTPS (GitHub Pages par ex.) : Safari → Partager → « Sur l'écran d'accueil » pour l'avoir comme une app.

## Cours de bourse automatiques

La GitHub Action `.github/workflows/publier.yml` publie l'app sur la branche `gh-pages` et, toutes les 30 min en semaine, récupère les cours (Yahoo Finance) des symboles listés dans `tickers.txt` ainsi que les taux de change, dans `prices.json`. L'app lit ce fichier pour calculer les plus ou moins-values (PEA et compte-titres) et l'impôt estimé.

Pour suivre une nouvelle action : ajoute son symbole dans `tickers.txt` (ex. `MSFT`, `MC.PA`). Seuls les symboles sont publics ; quantités et prix d'achat restent sur le téléphone.

Le site est publié depuis la branche `gh-pages` (Settings → Pages → Deploy from a branch → gh-pages / root).
