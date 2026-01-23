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
    name: "Faker의 팬",
    description: "Faker 카드를 1장 수집하세요",
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
    name: "Faker 컴플리트",
    description: "모든 Faker 카드를 수집하세요 (10장)",
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
    description: "T1/SKT 우승 카드 5장을 수집하세요",
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
    name: "레전드 헌터",
    description: "LEGENDARY 등급 카드 5장을 수집하세요",
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
    name: "풀 로스터",
    description: "각 포지션에서 최소 10장씩 수집하세요",
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
    name: "월드 챔피언",
    description: "우승 카드 10장을 수집하세요",
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
    name: "베테랑 수집가",
    description: "5회 이상 출전한 선수의 카드를 15명분 수집하세요",
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
    name: "하프 컬렉션",
    description: "전체 카드의 50%를 수집하세요",
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
    name: "컴플리트!",
    description: "모든 카드를 수집하세요",
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
    name: "타임 트래블러",
    description: "2013년부터 2025년까지 모든 연도의 카드를 수집하세요",
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
