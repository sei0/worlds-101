import type { Player } from "@/types/player";

export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (collected: Set<string>, allPlayers: Player[]) => boolean;
  progress: (collected: Set<string>, allPlayers: Player[]) => { current: number; total: number };
}

export const CHALLENGES: Challenge[] = [
  {
    id: "faker-fan",
    name: "Faker의 팬",
    description: "Faker를 수집하세요",
    icon: "👑",
    requirement: (collected) => collected.has("faker"),
    progress: (collected) => ({
      current: collected.has("faker") ? 1 : 0,
      total: 1,
    }),
  },
  {
    id: "t1-dynasty",
    name: "T1 Dynasty",
    description: "T1/SKT 우승 멤버 5명을 수집하세요",
    icon: "🏆",
    requirement: (collected, allPlayers) => {
      const t1Champions = allPlayers.filter(
        (p) =>
          (p.teams.some((t) => t.includes("T1") || t.includes("SK Telecom")) ||
            p.teams.some((t) => t.includes("SKT"))) &&
          p.stats.championships > 0
      );
      const collectedCount = t1Champions.filter((p) => collected.has(p.id)).length;
      return collectedCount >= 5;
    },
    progress: (collected, allPlayers) => {
      const t1Champions = allPlayers.filter(
        (p) =>
          (p.teams.some((t) => t.includes("T1") || t.includes("SK Telecom")) ||
            p.teams.some((t) => t.includes("SKT"))) &&
          p.stats.championships > 0
      );
      return {
        current: t1Champions.filter((p) => collected.has(p.id)).length,
        total: 5,
      };
    },
  },
  {
    id: "legendary-collector",
    name: "레전드 헌터",
    description: "LEGENDARY 등급 선수 5명을 수집하세요",
    icon: "🌟",
    requirement: (collected, allPlayers) => {
      const legendaries = allPlayers.filter((p) => p.grade === "LEGENDARY");
      return legendaries.filter((p) => collected.has(p.id)).length >= 5;
    },
    progress: (collected, allPlayers) => {
      const legendaries = allPlayers.filter((p) => p.grade === "LEGENDARY");
      return {
        current: legendaries.filter((p) => collected.has(p.id)).length,
        total: 5,
      };
    },
  },
  {
    id: "full-roster",
    name: "풀 로스터",
    description: "각 포지션에서 최소 10명씩 수집하세요",
    icon: "📋",
    requirement: (collected, allPlayers) => {
      const positions = ["TOP", "JGL", "MID", "ADC", "SUP"] as const;
      return positions.every((pos) => {
        const posPlayers = allPlayers.filter((p) => p.position === pos);
        return posPlayers.filter((p) => collected.has(p.id)).length >= 10;
      });
    },
    progress: (collected, allPlayers) => {
      const positions = ["TOP", "JGL", "MID", "ADC", "SUP"] as const;
      const minCollected = Math.min(
        ...positions.map((pos) => {
          const posPlayers = allPlayers.filter((p) => p.position === pos);
          return posPlayers.filter((p) => collected.has(p.id)).length;
        })
      );
      return { current: Math.min(minCollected, 10), total: 10 };
    },
  },
  {
    id: "worlds-winner",
    name: "월드 챔피언",
    description: "우승 경험이 있는 선수 10명을 수집하세요",
    icon: "🥇",
    requirement: (collected, allPlayers) => {
      const champions = allPlayers.filter((p) => p.stats.championships > 0);
      return champions.filter((p) => collected.has(p.id)).length >= 10;
    },
    progress: (collected, allPlayers) => {
      const champions = allPlayers.filter((p) => p.stats.championships > 0);
      return {
        current: champions.filter((p) => collected.has(p.id)).length,
        total: 10,
      };
    },
  },
  {
    id: "veteran-collector",
    name: "베테랑 수집가",
    description: "5회 이상 출전한 선수 15명을 수집하세요",
    icon: "🎖️",
    requirement: (collected, allPlayers) => {
      const veterans = allPlayers.filter((p) => p.stats.appearances >= 5);
      return veterans.filter((p) => collected.has(p.id)).length >= 15;
    },
    progress: (collected, allPlayers) => {
      const veterans = allPlayers.filter((p) => p.stats.appearances >= 5);
      return {
        current: veterans.filter((p) => collected.has(p.id)).length,
        total: 15,
      };
    },
  },
  {
    id: "half-collection",
    name: "하프 컬렉션",
    description: "전체 선수의 50%를 수집하세요",
    icon: "📚",
    requirement: (collected, allPlayers) => {
      return collected.size >= Math.floor(allPlayers.length / 2);
    },
    progress: (collected, allPlayers) => ({
      current: collected.size,
      total: Math.floor(allPlayers.length / 2),
    }),
  },
  {
    id: "complete-collection",
    name: "컴플리트!",
    description: "모든 선수를 수집하세요",
    icon: "🎊",
    requirement: (collected, allPlayers) => {
      return collected.size >= allPlayers.length;
    },
    progress: (collected, allPlayers) => ({
      current: collected.size,
      total: allPlayers.length,
    }),
  },
];

export function getCompletedChallenges(
  collected: Set<string>,
  allPlayers: Player[]
): Challenge[] {
  return CHALLENGES.filter((c) => c.requirement(collected, allPlayers));
}
