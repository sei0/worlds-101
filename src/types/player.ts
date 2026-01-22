export type Position = "TOP" | "JGL" | "MID" | "ADC" | "SUP";
export type Grade = "LEGENDARY" | "EPIC" | "RARE" | "UNCOMMON" | "COMMON";

export interface PlayerStats {
  appearances: number;
  championships: number;
  finals: number;
  semifinals: number;
  bestResult: string;
}

export interface Player {
  id: string;
  name: string;
  position: Position;
  grade: Grade;
  score: number;
  stats: PlayerStats;
  teams: string[];
  years: number[];
}

export interface PlayerData {
  metadata: {
    totalPlayers: number;
    generatedAt: string;
    gradeDistribution: Record<Grade, number>;
    positionDistribution: Record<Position, number>;
  };
  players: Player[];
}

export const POSITION_LABELS: Record<Position, string> = {
  TOP: "탑",
  JGL: "정글",
  MID: "미드",
  ADC: "원딜",
  SUP: "서폿",
};

export const GRADE_COLORS: Record<Grade, string> = {
  LEGENDARY: "#FFD700",
  EPIC: "#A855F7",
  RARE: "#3B82F6",
  UNCOMMON: "#22C55E",
  COMMON: "#9CA3AF",
};

export const GRADE_PROBABILITIES: Record<Grade, number> = {
  LEGENDARY: 0.03,
  EPIC: 0.10,
  RARE: 0.20,
  UNCOMMON: 0.30,
  COMMON: 0.37,
};
