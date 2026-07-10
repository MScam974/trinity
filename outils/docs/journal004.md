# Journal 004 — Commit 4 : Création libre (creation.js) + ui.js

Fichiers ajoutés : `outils/js/creation.js`, `outils/js/ui.js`.

- `creation.js` :
  - sélecteurs de dés (d6/d8/d10) pour les 3 Attributs et les 3 Vocations,
    rendus depuis `data/attributs.json` / `data/vocations.json` ;
  - échange automatique de dé si une taille est déjà utilisée ailleurs
    dans le même groupe (comportement identique au prototype) ;
  - calcul du niveau de chaque Compétence à partir de la somme des
    valeurs de dé, **en lisant les seuils dans `config.json`**
    (`niveauCompetence.seuils`) — aucun seuil (12/16/20) codé en dur
    dans le JS, contrairement au prototype d'origine ;
  - matrice Vocation x Attribut générée dynamiquement (ordre et libellés
    lus dans les données, pas de "Exploration/Interaction/Action" en dur).
- `ui.js` : bascule d'onglets générique (`data-onglet` / `.onglet-contenu`),
  réutilisable pour n'importe quel jeu d'onglets du projet.
- Testé avec jsdom : rendu des sélecteurs, calcul de niveau (ex. 2 dés
  d10 → niveau 3, seuil 6+ ; d8+d6 → niveau 1, seuil 8+), échange de dés
  vérifié, bascule d'onglet vérifiée.

Rappel : le calcul de niveau ci-dessus reste le système "somme de dés"
du prototype, en attente d'arbitrage sur le système fort/moyen/faible
des specs (voir journal001/002). `creation.js` isole déjà ce calcul
dans `calculerNiveauCompetence()`, ce qui rendra le remplacement localisé
le moment venu.

Prochain commit : à discuter avec toi — soit on tranche le système
fort/moyen/faible (compétences), soit on avance sur la fiche complète /
le portrait / le stockage JSON en gardant le système actuel.
