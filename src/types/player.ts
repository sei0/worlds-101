export type Position = "TOP" | "JGL" | "MID" | "ADC" | "SUP";
export type Grade = "DEMON_KING" | "LEGENDARY" | "EPIC" | "RARE" | "UNCOMMON" | "COMMON";
export type Result = "Champion" | "Runner-up" | "Semifinals" | "Quarterfinals" | "Group Stage";

// Yearly card (FIFA-style)
export interface Player {
  id: string;           // e.g., "faker-2024"
  playerId: string;     // e.g., "faker" (unique player ID for grouping)
  name: string;         // e.g., "Faker"
  year: number;         // e.g., 2024
  team: string;         // e.g., "T1"
  position: Position;
  grade: Grade;
  score: number;
  result: Result;
}

// Player career stats (for challenges)
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
  TOP: "TOP",
  JGL: "JGL",
  MID: "MID",
  ADC: "ADC",
  SUP: "SUP",
};

export const GRADE_COLORS: Record<Grade, string> = {
  DEMON_KING: "#EF4444",
  LEGENDARY: "#FFD700",
  EPIC: "#A855F7",
  RARE: "#3B82F6",
  UNCOMMON: "#22C55E",
  COMMON: "#9CA3AF",
};

export const GRADE_PROBABILITIES: Record<Grade, number> = {
  DEMON_KING: 1 / 6,
  LEGENDARY: 1 / 6,
  EPIC: 1 / 6,
  RARE: 1 / 6,
  UNCOMMON: 1 / 6,
  COMMON: 1 / 6,
};
