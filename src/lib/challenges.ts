import type { Player, PlayerCareer } from "@/types/player";
import { getAllCareers } from "./gacha";

export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (collected: Set<string>, allCards: Player[], careers: PlayerCareer[]) => boolean;
  progress: (collected: Set<string>, allCards: Player[], careers: PlayerCareer[]) => { current: number; total: number };
}

function getCollectedPlayerIds(collected: Set<string>, allCards: Player[]): Set<string> {
  const playerIds = new Set<string>();
  for (const card of allCards) {
    if (collected.has(card.id)) {
      playerIds.add(card.playerId);
    }
  }
  return playerIds;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "faker-fan",
    name: "Faker Fan",
    description: "Collect 1 Faker card",
    icon: "👑",
    requirement: (collected, allCards) => {
      return allCards.some((c) => c.playerId === "faker" && collected.has(c.id));
    },
    progress: (collected, allCards) => ({
      current: allCards.filter((c) => c.playerId === "faker" && collected.has(c.id)).length > 0 ? 1 : 0,
      total: 1,
    }),
  },
  {
    id: "faker-complete",
    name: "Faker Complete",
    description: "Collect all Faker cards (10 cards)",
    icon: "🐐",
    requirement: (collected, allCards) => {
      const fakerCards = allCards.filter((c) => c.playerId === "faker");
      return fakerCards.every((c) => collected.has(c.id));
    },
    progress: (collected, allCards) => {
      const fakerCards = allCards.filter((c) => c.playerId === "faker");
      return {
        current: fakerCards.filter((c) => collected.has(c.id)).length,
        total: fakerCards.length,
      };
    },
  },
  {
    id: "t1-dynasty",
    name: "T1 Dynasty",
    description: "Collect 5 T1/SKT championship cards",
    icon: "🏆",
    requirement: (collected, allCards) => {
      const t1ChampionCards = allCards.filter(
        (c) =>
          (c.team.includes("T1") || c.team.includes("SK Telecom")) &&
          c.result === "Champion"
      );
      return t1ChampionCards.filter((c) => collected.has(c.id)).length >= 5;
    },
    progress: (collected, allCards) => {
      const t1ChampionCards = allCards.filter(
        (c) =>
          (c.team.includes("T1") || c.team.includes("SK Telecom")) &&
          c.result === "Champion"
      );
      return {
        current: t1ChampionCards.filter((c) => collected.has(c.id)).length,
        total: 5,
      };
    },
  },
  {
    id: "legendary-collector",
    name: "Legend Hunter",
    description: "Collect 5 LEGENDARY grade cards",
    icon: "🌟",
    requirement: (collected, allCards) => {
      const legendaries = allCards.filter((c) => c.grade === "LEGENDARY");
      return legendaries.filter((c) => collected.has(c.id)).length >= 5;
    },
    progress: (collected, allCards) => {
      const legendaries = allCards.filter((c) => c.grade === "LEGENDARY");
      return {
        current: legendaries.filter((c) => collected.has(c.id)).length,
        total: 5,
      };
    },
  },
  {
    id: "full-roster",
    name: "Full Roster",
    description: "Collect at least 10 cards from each position",
    icon: "📋",
    requirement: (collected, allCards) => {
      const positions = ["TOP", "JGL", "MID", "ADC", "SUP"] as const;
      return positions.every((pos) => {
        const posCards = allCards.filter((c) => c.position === pos);
        return posCards.filter((c) => collected.has(c.id)).length >= 10;
      });
    },
    progress: (collected, allCards) => {
      const positions = ["TOP", "JGL", "MID", "ADC", "SUP"] as const;
      const minCollected = Math.min(
        ...positions.map((pos) => {
          const posCards = allCards.filter((c) => c.position === pos);
          return posCards.filter((c) => collected.has(c.id)).length;
        })
      );
      return { current: Math.min(minCollected, 10), total: 10 };
    },
  },
  {
    id: "champion-cards",
    name: "World Champion",
    description: "Collect 10 championship cards",
    icon: "🥇",
    requirement: (collected, allCards) => {
      const championCards = allCards.filter((c) => c.result === "Champion");
      return championCards.filter((c) => collected.has(c.id)).length >= 10;
    },
    progress: (collected, allCards) => {
      const championCards = allCards.filter((c) => c.result === "Champion");
      return {
        current: championCards.filter((c) => collected.has(c.id)).length,
        total: 10,
      };
    },
  },
  {
    id: "veteran-players",
    name: "Veteran Collector",
    description: "Collect cards from 15 players with 5+ appearances",
    icon: "🎖️",
    requirement: (collected, allCards, careers) => {
      const collectedPlayerIds = getCollectedPlayerIds(collected, allCards);
      const veterans = careers.filter((c) => c.appearances >= 5);
      return veterans.filter((v) => collectedPlayerIds.has(v.playerId)).length >= 15;
    },
    progress: (collected, allCards, careers) => {
      const collectedPlayerIds = getCollectedPlayerIds(collected, allCards);
      const veterans = careers.filter((c) => c.appearances >= 5);
      return {
        current: veterans.filter((v) => collectedPlayerIds.has(v.playerId)).length,
        total: 15,
      };
    },
  },
  {
    id: "half-collection",
    name: "Half Collection",
    description: "Collect 50% of all cards",
    icon: "📚",
    requirement: (collected, allCards) => {
      return collected.size >= Math.floor(allCards.length / 2);
    },
    progress: (collected, allCards) => ({
      current: collected.size,
      total: Math.floor(allCards.length / 2),
    }),
  },
  {
    id: "complete-collection",
    name: "Complete!",
    description: "Collect all cards",
    icon: "🎊",
    requirement: (collected, allCards) => {
      return collected.size >= allCards.length;
    },
    progress: (collected, allCards) => ({
      current: collected.size,
      total: allCards.length,
    }),
  },
  {
    id: "time-traveler",
    name: "Time Traveler",
    description: "Collect cards from every year (2013-2025)",
    icon: "⏰",
    requirement: (collected, allCards) => {
      const years = new Set<number>();
      for (const card of allCards) {
        if (collected.has(card.id)) {
          years.add(card.year);
        }
      }
      return years.size >= 13;
    },
    progress: (collected, allCards) => {
      const years = new Set<number>();
      for (const card of allCards) {
        if (collected.has(card.id)) {
          years.add(card.year);
        }
      }
      return { current: years.size, total: 13 };
    },
  },
];

export function getCompletedChallenges(
  collected: Set<string>,
  allCards: Player[]
): Challenge[] {
  const careers = getAllCareers();
  return CHALLENGES.filter((c) => c.requirement(collected, allCards, careers));
}
