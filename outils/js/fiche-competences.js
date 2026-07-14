/**
 * fiche-competences.js
 * Rendu de la zone Affinité de la fiche (outils/fiche.html) : texte +
 * schéma cliquable (triangle.js). La grille des compétences a déménagé
 * dans tableau-competences.js (composant partagé avec la création).
 */

import { initSchemaPoints } from './triangle.js';

export function rendreZoneAffinite({ conteneurTexte, conteneurSchema, personnage, donnees }) {
    const affiniteNom = (donnees.affinites.find(a => a.id === personnage.affinite) || {}).nom || '—';
    conteneurTexte.textContent = `Votre affinité de départ est ${affiniteNom}.`;

    initSchemaPoints({
        conteneur: conteneurSchema,
        donneesSchema: donnees.triangleAffinite
    });
}