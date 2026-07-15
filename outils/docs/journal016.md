# Journal 016 — Commit 16 : données d'équipement (armes, armures, objets)

Fichiers ajoutés : `outils/data/armes.json` (9), `outils/data/armures.json`
(3), `outils/data/equipements.json` (8), `outils/data/avantages.json` (9).
Fichiers modifiés : `outils/data/config.json` (règles d'équipement),
`outils/js/loader.js` (charge les 4 nouveaux fichiers).

Pure donnée ce commit — pas d'interface Équipement pour l'instant (elle
viendra dans un commit dédié, l'onglet reste "À venir" sur la fiche).

## Ce qui est dedans

- **9 avantages** génériques (Perforant, Rapide, Silencieux, Précis,
  Lourd, Fiable, Polyvalent, Modulable, Dévastateur).
- **9 armes** : couteau, épée, arc, fusil, grenade à fragmentation (avec
  `zoneEffet` descriptif, pas simulé), + un exemple d'arme exotique
  (fusil d'assaut modifié : pénalité seuil +1, mais 2 avantages majeurs)
  démontrant le compromis pénalité/puissance que tu voulais illustrer,
  + les 3 armes de mêlée propres à chaque affinité (Griffes/Crocs,
  Poings du Chi, Technogreffe de combat).
- **3 armures** : veste de cuir légère, gilet pare-balles, armure lourde
  de fortune. `protection` réduit les dégâts (confirmé).
- **8 objets divers** : radio portable, bâton lumineux, corde, kit de
  premiers secours, couteau suisse, masque filtrant (utile contre la
  Peste Écarlate), rations de survie, sac à dos (`bonusEncombrement: 3`
  — un seul exemple de contenant pour l'instant, à compléter).
- **config.json** : échelle de rareté (1 Commun → 5 Introuvable),
  formule d'encombrement max (`bonus Exploration + bonus Habileté +
  bonus des contenants`, réutilise `rangParTaille` existant), table des
  effets de qualité (1-5, normal=3 — seuls les effets sous la normale
  sont définis pour l'instant : +1 encombrement et malus de dé Vocation
  à qualité 2, +2 encombrement et malus de dé Vocation+Attribut à
  qualité 1), et les deux types de pénalité prévus (`seuil` utilisé,
  `de` prévu mais pas encore utilisé par aucune arme).

## Laissé en attente (à ta demande ou faute de règle tranchée)

- Effets de qualité 4 et 5 (au-dessus de la normale) : pas définis.
- Pénalité d'affinité croisée (utiliser un objet d'une autre affinité) :
  le champ `affinite` existe sur chaque objet, mais la pénalité
  elle-même n'est pas définie précisément — notée dans
  `config.equipement.penaliteAffiniteCroisee` comme rappel.
- Contenants à bonusEncombrement +1/+2/+4/+5 : un seul exemple livré
  (sac à dos +3), le reste à ajouter quand tu veux.
- Calculateur de dégâts de zone : volontairement absent, donnée
  descriptive seulement (confirmé par toi).

## Tests

Chargement réel via `loader.js` (serveur HTTP, pas de simulation) :
9 armes / 3 armures / 8 équipements / 9 avantages tous chargés, contenu
vérifié (pénalité et avantages du fusil modifié, bonusEncombrement du
sac à dos, présence des nouvelles clés de `config.json`).

Prochain commit : à toi de choisir — l'interface Équipement, le
tableau unifié pour Stats + "Données détaillées", ou autre chose.
