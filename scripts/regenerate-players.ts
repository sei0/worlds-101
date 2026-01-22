import * as fs from "fs";
import * as path from "path";

const LCK_TEAMS = new Set([
  "SK Telecom T1", "T1", "Gen.G Esports", "KT Rolster", "Hanwha Life Esports",
  "DAMWON Gaming", "Dplus", "DRX", "Samsung Galaxy", "Longzhu Gaming",
  "ROX Tigers", "KOO Tigers", "Griffin", "Afreeca Freecs", "Samsung Blue",
  "Samsung White", "Samsung Ozone", "NaJin Black Sword", "NaJin White Shield",
  "SANDBOX Gaming", "Fredit BRION", "Liiv SANDBOX", "Kwangdong Freecs",
  "DWG KIA", "Nongshim RedForce", "BNK FearX", "OK BRION",
]);

type Grade = "LEGENDARY" | "EPIC" | "RARE" | "UNCOMMON" | "COMMON";

interface PlayerStats {
  appearances: number;
  championships: number;
  finals: number;
  semifinals: number;
  bestResult: string;
}

interface Player {
  id: string;
  name: string;
  position: string;
  grade: Grade;
  score: number;
  stats: PlayerStats;
  teams: string[];
  years: number[];
}

interface PlayerData {
  metadata: {
    totalPlayers: number;
    generatedAt: string;
    gradeDistribution: Record<Grade, number>;
    positionDistribution: Record<string, number>;
    gradeThresholds: Record<string, string>;
  };
  players: Player[];
}

function isLCKPlayer(player: Player): boolean {
  return player.teams.some((team) => LCK_TEAMS.has(team));
}

function calculateNewScore(player: Player): number {
  let score = player.score;

  if (isLCKPlayer(player)) {
    score = Math.round(score * 1.25);
  }

  return score;
}

function assignGrade(score: number): Grade {
  if (score >= 250) return "LEGENDARY";
  if (score >= 150) return "EPIC";
  if (score >= 80) return "RARE";
  if (score >= 40) return "UNCOMMON";
  return "COMMON";
}

function main() {
  const dataPath = path.join(__dirname, "../src/data/players.json");
  const data: PlayerData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const gradeDistribution: Record<Grade, number> = {
    LEGENDARY: 0,
    EPIC: 0,
    RARE: 0,
    UNCOMMON: 0,
    COMMON: 0,
  };

  let lckUpgrades = 0;

  data.players = data.players.map((player) => {
    const oldGrade = player.grade;
    const newScore = calculateNewScore(player);
    const newGrade = assignGrade(newScore);

    if (isLCKPlayer(player) && newGrade !== oldGrade) {
      lckUpgrades++;
      console.log(`[LCK] ${player.name}: ${oldGrade} -> ${newGrade} (${player.score} -> ${newScore})`);
    }

    gradeDistribution[newGrade]++;

    return {
      ...player,
      score: newScore,
      grade: newGrade,
    };
  });

  data.players.sort((a, b) => b.score - a.score);

  data.metadata.gradeDistribution = gradeDistribution;
  data.metadata.generatedAt = new Date().toISOString();

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  console.log("\n=== Summary ===");
  console.log(`Total players: ${data.players.length}`);
  console.log(`LCK upgrades: ${lckUpgrades}`);
  console.log("Grade distribution:", gradeDistribution);
}

main();
