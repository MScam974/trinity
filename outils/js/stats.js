/**
 * stats.js
 * Onglet Stats de la fiche :
 * - grille des 9 compétences passives (résistances), en lecture seule,
 *   reflet automatique du niveau des compétences actives correspondantes
 *   (même Vocation x Attribut) — aucune répartition séparée.
 * - 3 jauges de vie (Endurance/Intégrité/Ténacité), dont la taille est
 *   le dé de la Vocation liée. Cases cliquables par le joueur ; rien
 *   n'est calculé ou simulé automatiquement (dégâts/soins gérés en jeu).
 * Aucune règle codée en dur : tout vient de data/competences-passives.json
 * et de data/config.json.
 */

import { sauvegarderPersonnage } from './stockage.js';

function zoneDe(casesPerdues, zones) {
    let cumule = 0;
    for (const z of zones) {
        cumule += z.cases;
        if (casesPerdues <= cumule) return z.zone;
    }
    return zones[zones.length - 1].zone;
}

/**
 * Grille en lecture seule des 9 compétences passives.
 */
export function rendreCompetencesPassives({ conteneur, personnage, donnees }) {
    const { attributs, vocations, config } = donnees;
    const passives = donnees.competencesPassives;
    const jaugeParVocation = config.competencesPassives.jaugeParVocation;
    const table = config.competencesPassives.seuilsResistance.table;

    function seuilResistance(niveau) {
        return (table.find(s => s.niveau === niveau) || table[0]).seuil;
    }

    conteneur.innerHTML = `
        <table class="tableau-competences">
            <thead>
                <tr>
                    <th class="coin"></th>
                    ${attributs.map(a => `<th class="entete-axe">${a.nom}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${vocations.map(v => `
                    <tr>
                        <th class="entete-axe">${jaugeParVocation[v.id]?.nom || v.nom}<br><span class="entete-sous-titre">${v.symbole || ''} ${v.nom}</span></th>
                        ${attributs.map(a => {
                            const passive = passives.find(p => p.vocation === v.id && p.attribut === a.id);
                            if (!passive) return '<td></td>';
                            const niveau = (personnage.competences[passive.competenceActive] || { niveau: 0 }).niveau;
                            return `
                                <td class="cellule-competence" data-label="${jaugeParVocation[v.id]?.nom || v.nom} · ${a.nom}">
                                    <div class="competence-nom">${passive.nom}</div>
                                    <div class="competence-verbes">${passive.verbes}</div>
                                    <div class="competence-niveau">Niveau ${niveau} · Seuil adverse ${seuilResistance(niveau)}</div>
                                </td>
                            `;
                        }).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/**
 * 3 jauges de vie cliquables (Endurance/Intégrité/Ténacité).
 */
export function initJaugesVie({ conteneur, personnage, donnees, surChangement }) {
    const { config } = donnees;
    const jaugeParVocation = config.competencesPassives.jaugeParVocation;
    const { zonesParDe, libellesZones } = config.competencesPassives.jaugesVie;

    if (!personnage.viePerdue) {
        personnage.viePerdue = { endurance: 0, integrite: 0, tenacite: 0 };
    }

    function rendre() {
        conteneur.innerHTML = Object.entries(jaugeParVocation)
            .filter(([cle]) => cle !== '_commentaire')
            .map(([vocationId, jauge]) => {
            const taille = personnage.vocations[vocationId];
            const total = taille ? (config.des.valeurs[taille] || 0) : 0;
            const zones = taille ? (zonesParDe[taille] || []) : [];
            const perdues = Math.min(personnage.viePerdue[jauge.id] || 0, total);
            const zoneActuelle = total ? zoneDe(perdues, zones) : null;

            const pips = Array.from({ length: total }, (_, i) => {
                const numero = i + 1;
                return `<button type="button" class="pip-vie ${numero <= perdues ? 'pip-perdue' : ''}" data-jauge="${jauge.id}" data-numero="${numero}"></button>`;
            }).join('');

            return `
                <div class="jauge-vie">
                    <div class="jauge-vie-titre">
                        ${jauge.nom}
                        ${taille ? `<span class="jauge-vie-de">${taille}</span>` : ''}
                        ${zoneActuelle ? `<span class="jauge-vie-etat jauge-vie-etat-${zoneActuelle}">${libellesZones[zoneActuelle]}</span>` : ''}
                    </div>
                    <div class="jauge-vie-pips">${pips || '<span class="texte-info">Dé non choisi.</span>'}</div>
                </div>
            `;
        }).join('');

        conteneur.querySelectorAll('.pip-vie').forEach(bouton => {
            bouton.addEventListener('click', () => {
                const jaugeId = bouton.dataset.jauge;
                const numero = parseInt(bouton.dataset.numero, 10);
                const actuel = personnage.viePerdue[jaugeId] || 0;
                personnage.viePerdue[jaugeId] = (numero <= actuel) ? numero - 1 : numero;
                sauvegarderPersonnage(personnage);
                rendre();
                if (typeof surChangement === 'function') surChangement();
            });
        });
    }

    rendre();
    return { rafraichir: rendre };
}