/**
 * app.js
 * Point d'entrée du moteur. Charge les données, crée l'objet personnage,
 * puis initialise les modules d'interface. Ne contient aucune règle de
 * jeu : c'est uniquement le câblage entre les modules.
 */

import { chargerDonnees, chargerQuestionnaire } from './loader.js';
import { creerPersonnage, appliquerResultatQuestionnaire } from './personnage.js';
import { initOnglets } from './ui.js';
import { initQuestionnaire } from './questionnaire.js';
import { initTableauCompetences } from './tableau-competences.js';
import { sauvegarderPersonnage } from './stockage.js';

async function demarrer() {
    const donnees = await chargerDonnees();
    const questionnaireData = await chargerQuestionnaire();
    const personnage = creerPersonnage();

    const idsVocations = donnees.vocations.map(v => v.id);
    const idsAttributs = donnees.attributs.map(a => a.id);

    // Onglets : bascule entre les deux méthodes de création
    initOnglets({
        conteneurOnglets: document.getElementById('onglets-methode'),
        conteneurContenus: document.getElementById('contenus-methode')
    });

    // Affinité (sélectionnable directement en Création libre, ou fixée
    // automatiquement par le résultat du questionnaire — les deux modes
    // doivent produire le même personnage).
    function rendreSelecteurAffinite() {
        const conteneur = document.getElementById('selecteur-affinite');
        conteneur.innerHTML = donnees.affinites.map(affinite => `
            <label class="affinite-option">
                <input type="radio" name="affinite" value="${affinite.id}" ${personnage.affinite === affinite.id ? 'checked' : ''}>
                <span>${affinite.nom}</span>
            </label>
        `).join('');
        conteneur.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', () => {
                personnage.affinite = input.value;
            });
        });
    }
    rendreSelecteurAffinite();

    // Tableau unifié : dés (Attributs x Vocations) + répartition des
    // compétences, en un seul composant partagé avec la fiche.
    const tableauCompetences = initTableauCompetences({
        conteneur: document.getElementById('tableau-competences'),
        personnage,
        donnees,
        editable: true
    });

    function rafraichirRepartitions() {
        tableauCompetences.rafraichir();
    }

    // Questionnaire
    initQuestionnaire({
        conteneur: document.getElementById('questionnaire-conteneur'),
        questionnaire: questionnaireData,
        personnage,
        surChangement: (etat) => {
            const progression = document.getElementById('questionnaire-progression');
            if (progression) {
                progression.textContent = `${etat.nombreReponses} / ${etat.totalQuestions}`;
            }

            if (!etat.complet) return;

            // Le questionnaire produit exactement le même objet personnage
            // que la Création libre : on applique le résultat aux dés,
            // puis on resynchronise les deux vues qui en dépendent.
            appliquerResultatQuestionnaire(personnage, idsVocations, idsAttributs);
            rafraichirRepartitions();
            rendreSelecteurAffinite();

            const resultat = document.getElementById('questionnaire-resultat');
            if (resultat) {
                const affiniteNom = (donnees.affinites.find(a => a.id === personnage.affinite) || {}).nom || personnage.affinite;
                resultat.textContent = `Affinité : ${affiniteNom}`;
            }
        }
    });

    // Utile en console tant qu'il n'y a pas encore de fiche/export.
    window.personnage = personnage;

    // Fin de la création : sauvegarde et ouvre la fiche dans un nouvel onglet.
    const boutonTerminer = document.getElementById('bouton-terminer');
    if (boutonTerminer) {
        boutonTerminer.addEventListener('click', () => {
            sauvegarderPersonnage(personnage);
            window.open('fiche.html', '_blank');
        });
    }
}

demarrer().catch(erreur => {
    console.error('Erreur au démarrage du moteur Trynyty :', erreur);
    document.body.insertAdjacentHTML('afterbegin',
        `<div class="erreur-chargement">Erreur de chargement : ${erreur.message}</div>`);
});