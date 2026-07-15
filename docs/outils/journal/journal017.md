# Journal 017 — Commit 17 : refonte du modèle équipement (données) + correctif dés

Fichiers modifiés : `outils/css/base.css`, `outils/data/armes.json`,
`outils/data/armures.json`, `outils/data/equipements.json`,
`outils/data/config.json`, `outils/js/personnage.js`.

## 1. Correctif visuel des dés

Le dé sélectionné dans le tableau (création et fiche) est maintenant
visuellement évident : fond coloré + gras sur l'option cochée.

## 2. Modèle équipement — implémente la conversation de design

- **Catalogue vs instance** : `armes.json`/`armures.json`/`equipements.json`
  décrivent des **types** (le champ `qualite` fixe qu'ils avaient au
  commit 16 a été retiré — la qualité appartient à l'instance possédée
  par un personnage, pas au type).
- **Chaque objet du catalogue lié à une compétence** (`competence: "..."`),
  en réutilisant directement les noms de compétences existants — pas de
  nomenclature parallèle (Mobilité/Optique/etc.), comme décidé.
  Ex: `corde → athletisme`, `kit-premiers-secours → survie`, toutes les
  armes → `combat`, toutes les armures → `presence`.
- **`personnage.inventaire`** (remplace le placeholder `equipements: []`
  qui n'était jamais utilisé) : liste d'instances, chacune avec sa
  propre `qualite` (0-5) et `affiniteObjet` (0-3), indépendantes du
  catalogue — forme documentée en commentaire dans `personnage.js`.
- **`config.equipement.qualite`** : nouvelle table 0-5 (Inexistant →
  Légendaire) avec le nombre d'avantages supplémentaires par niveau
  (0 en dessous de 3, 1/2/3 pour Supérieur/Expert/Légendaire).
- **`config.equipement.affiniteObjet`** : échelle 0-3, pouvoirs
  d'affinité par instance — la liste des pouvoirs eux-mêmes reste à
  définir plus tard.
- **`config.equipement.emplacementsCreation`** : les 3 emplacements de
  départ (fragile=1, ordinaire=2, qualité=3), qualité 4-5 réservées aux
  trouvailles en jeu — conforme à la règle que tu avais toi-même
  écrite dans ton document de départ.
- L'ancienne table `qualite.effets` (variante autour d'une "normale" à
  3, avec malus d'encombrement/de dé) a été retirée : elle appartenait
  à un modèle qu'on a abandonné en cours de discussion.

## Non touché (comme convenu)

- Le jet de dés (Attribut + Vocation contre Seuil) : inchangé, qualité
  et affinité de l'objet n'influencent que le nombre d'avantages.
- Les jauges d'usure : abandonnées. Le malus au seuil sur échec
  critique reste une règle de table (MJ), pas simulée.
- L'interface Équipement elle-même : toujours pas construite, seule la
  donnée est prête.

## Tests

Test de non-régression complet (création + fiche, bout-en-bout) :
aucune casse sur le reste du moteur après le renommage
`equipements`→`inventaire` dans `personnage.js`. Contenu vérifié :
compétence liée correcte sur "Épée", champ `qualite` bien absent du
catalogue, table qualité→avantages et emplacements de création conformes.

Prochain commit : l'interface Équipement (à toi de dire si on s'y met
maintenant ou si tu veux d'abord voir autre chose).