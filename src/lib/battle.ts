import type { Player, Grade, Result } from "@/types/player";

const GRADE_POWER: Record<Grade, number> = {
  DEMON_KING: 100,
  LEGENDARY: 95,
  EPIC: 80,
  RARE: 65,
  UNCOMMON: 50,
  COMMON: 35,
};

const RESULT_BONUS: Record<Result, number> = {
  "Champion": 15,
  "Runner-up": 10,
  "Semifinals": 5,
  "Quarterfinals": 2,
  "Group Stage": 0,
};

export interface BattleResult {
  winner: "player" | "opponent" | "draw";
  playerScore: number;
  opponentScore: number;
  rounds: RoundResult[];
}

export interface RoundResult {
  position: string;
  playerPower: number;
  opponentPower: number;
  winner: "player" | "opponent" | "draw";
}

function calculateBattlePower(card: Player): number {
  const basePower = GRADE_POWER[card.grade];
  const resultBonus = RESULT_BONUS[card.result];
  const recencyBonus = card.year >= 2022 ? 5 : card.year >= 2019 ? 2 : 0;
  const randomFactor = Math.random() * 20 - 10;
  
  return Math.round(basePower + resultBonus + recencyBonus + randomFactor);
}

export function simulateBattle(
  playerTeam: Player[],
  opponentTeam: Player[]
): BattleResult {
  const rounds: RoundResult[] = [];
  let playerWins = 0;
  let opponentWins = 0;

  const positions = ["TOP", "JGL", "MID", "ADC", "SUP"];

  for (let i = 0; i < 5; i++) {
    const playerPower = calculateBattlePower(playerTeam[i]);
    const opponentPower = calculateBattlePower(opponentTeam[i]);

    let winner: "player" | "opponent" | "draw";
    if (playerPower > opponentPower) {
      winner = "player";
      playerWins++;
    } else if (opponentPower > playerPower) {
      winner = "opponent";
      opponentWins++;
    } else {
      winner = "draw";
    }

    rounds.push({
      position: positions[i],
      playerPower,
      opponentPower,
      winner,
    });
  }

  const playerScore = rounds.reduce((sum, r) => sum + r.playerPower, 0);
  const opponentScore = rounds.reduce((sum, r) => sum + r.opponentPower, 0);

  let winner: "player" | "opponent" | "draw";
  if (playerWins > opponentWins) {
    winner = "player";
  } else if (opponentWins > playerWins) {
    winner = "opponent";
  } else {
    winner = playerScore > opponentScore ? "player" : opponentScore > playerScore ? "opponent" : "draw";
  }

  return { winner, playerScore, opponentScore, rounds };
}
