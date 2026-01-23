export type Position = "TOP" | "JGL" | "MID" | "ADC" | "SUP";
export type Grade = "LEGENDARY" | "EPIC" | "RARE" | "UNCOMMON" | "COMMON";
export type Result = "Champion" | "Runner-up" | "Semifinals" | "Quarterfinals" | "Group Stage";

// 년도별 카드 (피파 스타일)
export interface Player {
  id: string;           // e.g., "faker-2024"
  playerId: string;     // e.g., "faker" (선수 고유 ID, 그룹핑용)
  name: string;         // e.g., "Faker"
  year: number;         // e.g., 2024
  team: string;         // e.g., "T1"
  position: Position;
  grade: Grade;
  score: number;
  result: Result;
}

// 선수 커리어 통계 (도전과제용)
export interface PlayerCareer {
  playerId: string;
  name: string;
  appearances: number;
  championships: number;
  finals: number;
  semifinals: number;
  bestResult: Result;
  teams: string[];
  years: number[];
}

export interface PlayerData {
  metadata: {
    totalCards: number;
    totalPlayers: number;
    generatedAt: string;
    gradeDistribution: Record<Grade, number>;
    positionDistribution: Record<Position, number>;
    yearRange: { min: number; max: number };
  };
  players: Player[];
  careers: PlayerCareer[];
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
