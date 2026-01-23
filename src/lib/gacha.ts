import type { Player, PlayerCareer, Position, Grade } from "@/types/player";
import { GRADE_PROBABILITIES } from "@/types/player";
import playerData from "@/data/players.json";

const POSITIONS: Position[] = ["TOP", "JGL", "MID", "ADC", "SUP"];

const LCK_TEAMS = new Set([
  "SK Telecom T1", "T1", "Gen.G Esports", "KT Rolster", "Hanwha Life Esports",
  "DAMWON Gaming", "Dplus", "DRX", "Samsung Galaxy", "Longzhu Gaming",
  "ROX Tigers", "KOO Tigers", "Griffin", "Afreeca Freecs", "Samsung Blue",
  "Samsung White", "Samsung Ozone", "NaJin Black Sword", "NaJin White Shield",
  "SANDBOX Gaming", "Fredit BRION", "Liiv SANDBOX", "Kwangdong Freecs",
  "DWG KIA", "Nongshim RedForce", "BNK FearX", "OK BRION",
]);

const LPL_TEAMS = new Set([
  "EDward Gaming", "Royal Never Give Up", "Invictus Gaming", "Top Esports",
  "LGD Gaming", "JD Gaming", "LNG Esports", "FunPlus Phoenix", "Weibo Gaming",
  "Bilibili Gaming", "Oh My God", "Suning", "Anyone's Legend", "Team WE",
  "I May", "Royal Club", "Star Horn Royal Club",
]);

const LEC_TEAMS = new Set([
  "Fnatic", "G2 Esports", "Rogue", "MAD Lions", "Splyce", "Origen",
  "H2K", "H2k-Gaming", "Misfits Gaming", "SK Gaming", "MAD Lions KOI",
  "Movistar KOI", "Alliance", "Lemondogs", "GamingGear.eu", "Team Vitality",
  "Gambit Gaming", "Gambit Esports",
]);

type Region = "LCK" | "LPL" | "LEC" | "OTHER";

function getCardRegion(player: Player): Region {
  if (LCK_TEAMS.has(player.team)) return "LCK";
  if (LPL_TEAMS.has(player.team)) return "LPL";
  if (LEC_TEAMS.has(player.team)) return "LEC";
  return "OTHER";
}

function calculateWeight(player: Player): number {
  let weight = 1.0;

  const region = getCardRegion(player);
  switch (region) {
    case "LCK":
      weight *= 2.5;
      break;
    case "LPL":
      weight *= 1.5;
      break;
    case "LEC":
      weight *= 1.2;
      break;
    case "OTHER":
      weight *= 0.4;
      break;
  }

  if (player.year >= 2022) {
    weight *= 2.0;
  } else if (player.year >= 2019) {
    weight *= 1.2;
  } else if (player.year <= 2017) {
    weight *= 0.3;
  }

  return weight;
}

function getCardsByPosition(position: Position): Player[] {
  return (playerData.players as Player[]).filter((p) => p.position === position);
}

function rollGrade(): Grade {
  const roll = Math.random();
  let cumulative = 0;

  for (const [grade, probability] of Object.entries(GRADE_PROBABILITIES)) {
    cumulative += probability;
    if (roll <= cumulative) {
      return grade as Grade;
    }
  }

  return "COMMON";
}

function weightedRandomPick(players: Player[]): Player {
  const weights = players.map(calculateWeight);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < players.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return players[i];
  }
  
  return players[players.length - 1];
}

function pickCardByGrade(cards: Player[], targetGrade: Grade): Player {
  const gradeOrder: Grade[] = ["LEGENDARY", "EPIC", "RARE", "UNCOMMON", "COMMON"];
  const targetIndex = gradeOrder.indexOf(targetGrade);

  for (let i = targetIndex; i < gradeOrder.length; i++) {
    const candidates = cards.filter((p) => p.grade === gradeOrder[i]);
    if (candidates.length > 0) {
      return weightedRandomPick(candidates);
    }
  }

  for (let i = targetIndex - 1; i >= 0; i--) {
    const candidates = cards.filter((p) => p.grade === gradeOrder[i]);
    if (candidates.length > 0) {
      return weightedRandomPick(candidates);
    }
  }

  return weightedRandomPick(cards);
}

export function pullGacha(): Player[] {
  const team: Player[] = [];

  for (const position of POSITIONS) {
    const positionCards = getCardsByPosition(position);
    const grade = rollGrade();
    const card = pickCardByGrade(positionCards, grade);
    team.push(card);
  }

  return team;
}

export function calculateTeamPower(team: Player[]): number {
  return team.reduce((sum, player) => sum + player.score, 0);
}

export function getAllCards(): Player[] {
  return playerData.players as Player[];
}

export function getCardById(id: string): Player | undefined {
  return (playerData.players as Player[]).find((p) => p.id === id);
}

export function getAllCareers(): PlayerCareer[] {
  return (playerData as { careers: PlayerCareer[] }).careers;
}

export function getCareerByPlayerId(playerId: string): PlayerCareer | undefined {
  return getAllCareers().find((c) => c.playerId === playerId);
}

export function getCardsByPlayerId(playerId: string): Player[] {
  return getAllCards().filter((p) => p.playerId === playerId);
}
