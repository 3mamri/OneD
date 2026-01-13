import axios from 'axios';

const API_BASE_URL = 'https://api.api-onepiece.com/v2';

export async function getCharacters() {
    try {
        const response = await axios.get(`${API_BASE_URL}/characters/fr`);
        const characters = response.data;

        return characters
            .filter(char => {
                const name = char.name || "";
                // On garde si le personnage a une image ET une affiliation (ça élimine 80% des inconnus)
                // OU s'il a une prime (même de 0, car les figurants n'ont souvent pas de champ bounty du tout)
                const hasVisual = char.picture && char.picture.length > 10;
                const hasTeam = char.affiliation && char.affiliation !== "Inconnu";
                const hasBounty = char.bounty !== undefined && char.bounty !== null;

                return (hasVisual && hasTeam) || hasBounty;
            })
            .map(char => {
                const fullName = char.name.trim();
                return {
                    id: char.id,
                    name: fullName,
                    // Système de recherche amélioré pour trouver "Garp" dans "Monkey D. Garp"
                    searchNames: [
                        fullName.toLowerCase(),
                        ...fullName.toLowerCase().split(/[\s,.'-]+/)
                    ],
                    image: char.picture || '/iconeonepiece.ico',
                    bounty: parseInt(char.bounty) || 0,
                    type: 'Inconnu',
                    origin: 'Inconnu',
                    first_arc: 'Inconnu',
                    affiliation: 'Inconnu'
                };
            });
    } catch (e) {
        console.error("Erreur liste personnages:", e);
        return [];
    }
}
export async function getCharacterDetails(id) {
    try {
        const res = await axios.get(`${API_BASE_URL}/characters/fr/${id}`);
        const data = res.data;
        const attr = data.french_attribute || {};

        // On récupère les vraies infos de l'arc et du genre
        return {
            type: attr.gender || data.gender || 'Masculin',
            affiliation: attr.affiliation || data.affiliation || 'Pirate',
            devil_fruit: attr.fruit_type || data.devil_fruit || 'Aucun',
            origin: attr.origin || data.origin || 'Inconnu',
            first_arc: attr.first_arc || data.first_arc || 'Romance Dawn'
        };
    } catch (e) {
        return null;
    }
}

export async function getHakiCount(id) {
    try {
        const res = await axios.get(`${API_BASE_URL}/hakis/fr/character/${id}/count`);
        return res.data.count ?? res.data ?? 0;
    } catch (e) {
        return 0;
    }
}

export async function getArcs() {
    try {
        const res = await axios.get(`${API_BASE_URL}/arcs/fr`);
        // On récupère l'ordre exact des arcs pour les flèches
        return res.data.map(arc => arc.french_attribute?.name || arc.name);
    } catch (e) {
        return [];
    }
}

export function selectDailyChallenge(chars) {
    if (!chars.length) return null;
    const seed = new Date().getFullYear() * 10000 + (new Date().getMonth() + 1) * 100 + new Date().getDate();
    const randomIndex = Math.floor((Math.abs(Math.sin(seed))) * chars.length);
    return chars[randomIndex];
}