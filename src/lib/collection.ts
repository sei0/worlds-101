import type { Player } from "@/types/player";

const COLLECTION_KEY = "lol-gacha-collection";

export interface CollectionState {
  collected: Set<string>;
  pullCount: number;
}

export function getCollection(): CollectionState {
  if (typeof window === "undefined") {
    return { collected: new Set(), pullCount: 0 };
  }

  try {
    const data = localStorage.getItem(COLLECTION_KEY);
    if (!data) {
      return { collected: new Set(), pullCount: 0 };
    }
    const parsed = JSON.parse(data);
    return {
      collected: new Set(parsed.collected || []),
      pullCount: parsed.pullCount || 0,
    };
  } catch {
    return { collected: new Set(), pullCount: 0 };
  }
}

export function saveCollection(state: CollectionState): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    COLLECTION_KEY,
    JSON.stringify({
      collected: Array.from(state.collected),
      pullCount: state.pullCount,
    })
  );
}

export function addToCollection(players: Player[]): CollectionState {
  const state = getCollection();
  
  for (const player of players) {
    state.collected.add(player.id);
  }
  state.pullCount += 1;

  saveCollection(state);
  return state;
}

export function resetCollection(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(COLLECTION_KEY);
}

export function getCollectionStats(allPlayers: Player[], collected: Set<string>) {
  const stats = {
    total: allPlayers.length,
    collected: collected.size,
    byGrade: {
      DEMON_KING: { total: 0, collected: 0 },
      LEGENDARY: { total: 0, collected: 0 },
      EPIC: { total: 0, collected: 0 },
      RARE: { total: 0, collected: 0 },
      UNCOMMON: { total: 0, collected: 0 },
      COMMON: { total: 0, collected: 0 },
    },
    byPosition: {
      TOP: { total: 0, collected: 0 },
      JGL: { total: 0, collected: 0 },
      MID: { total: 0, collected: 0 },
      ADC: { total: 0, collected: 0 },
      SUP: { total: 0, collected: 0 },
    },
  };

  for (const player of allPlayers) {
    stats.byGrade[player.grade].total++;
    stats.byPosition[player.position].total++;

    if (collected.has(player.id)) {
      stats.byGrade[player.grade].collected++;
      stats.byPosition[player.position].collected++;
    }
  }

  return stats;
}
