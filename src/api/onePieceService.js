import { characters } from "../data/characters";

export function getCharacters() {
    return characters;
}

export function searchCharacters(query, excludedIds = []) {
    const normalized = query.trim().toLowerCase();

    if (normalized.length < 2) return [];

    return characters
        .filter((character) => {
            const notExcluded = !excludedIds.includes(character.id);
            const matches =
                character.name.toLowerCase().includes(normalized) ||
                (character.searchNames || []).some((name) =>
                    String(name).toLowerCase().includes(normalized)
                );

            return notExcluded && matches;
        })
        .slice(0, 8);
}

export function selectDailyChallenge(list) {
    if (!list || !list.length) return null;

    const today = new Date();
    const seed = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash += seed.charCodeAt(i);
    }

    return list[hash % list.length];
}

export async function getCharacterDetails(id) {
    const char = characters.find((c) => c.id === id);

    if (!char) {
        return {
            type: "Inconnu",
            devil_fruit: "Aucun",
            origin: "Inconnu",
            first_arc: "Inconnu",
            affiliation: "Inconnu",
            bounty: 0,
            height: 0,
            image: ""
        };
    }

    return {
        type: char.gender || char.type || "Inconnu",
        devil_fruit:
            char.devil_fruit ||
            char.devilFruit?.type ||
            char.fruitType ||
            "Aucun",
        origin: char.origin || "Inconnu",
        first_arc: char.first_arc || char.firstArc || "Inconnu",
        affiliation: char.affiliation || "Inconnu",
        bounty: char.bounty || 0,
        height: char.height || char.size || char.taille || 0,
        image: char.image || ""
    };
}

export async function getHakiCount(id) {
    const char = characters.find((c) => c.id === id);

    if (!char) return 0;

    if (Array.isArray(char.haki)) return char.haki.length;
    if (typeof char.haki === "number") return char.haki;
    if (typeof char.haki === "boolean") return char.haki ? 1 : 0;

    return 0;
}

export async function getArcs() {
    const arcs = [
        ...new Set(
            characters
                .map((c) => c.first_arc || c.firstArc)
                .filter(Boolean)
        )
    ];

    return arcs;
}