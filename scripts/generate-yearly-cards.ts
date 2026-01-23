import * as fs from "fs";
import * as path from "path";

type Position = "TOP" | "JGL" | "MID" | "ADC" | "SUP";
type Grade = "LEGENDARY" | "EPIC" | "RARE" | "UNCOMMON" | "COMMON";
type Result = "Champion" | "Runner-up" | "Semifinals" | "Quarterfinals" | "Group Stage";

interface Player {
  id: string;
  playerId: string;
  name: string;
  year: number;
  team: string;
  position: Position;
  grade: Grade;
  score: number;
  result: Result;
}

interface PlayerCareer {
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

interface OldPlayer {
  id: string;
  name: string;
  position: Position;
  grade: Grade;
  score: number;
  stats: {
    appearances: number;
    championships: number;
    finals: number;
    semifinals: number;
    bestResult: string;
  };
  teams: string[];
  years: number[];
}

interface CsvRow {
  year: number;
  team: string;
  player: string;
  result: Result;
}

const LCK_TEAMS = new Set([
  "SK Telecom T1", "T1", "Gen.G Esports", "KT Rolster", "Hanwha Life Esports",
  "DAMWON Gaming", "Dplus", "DRX", "Samsung Galaxy", "Longzhu Gaming",
  "ROX Tigers", "KOO Tigers", "Griffin", "Afreeca Freecs", "Samsung Blue",
  "Samsung White", "Samsung Ozone", "NaJin Black Sword", "NaJin White Shield",
  "SANDBOX Gaming", "Fredit BRION", "Liiv SANDBOX", "Kwangdong Freecs",
  "DWG KIA", "Nongshim RedForce", "BNK FearX", "OK BRION",
]);

const RESULT_SCORE: Record<Result, number> = {
  "Champion": 100,
  "Runner-up": 60,
  "Semifinals": 35,
  "Quarterfinals": 20,
  "Group Stage": 10,
};

const RESULT_ORDER: Result[] = ["Champion", "Runner-up", "Semifinals", "Quarterfinals", "Group Stage"];

function normalizePlayerName(name: string): string {
  return name.toLowerCase().replace(/[\s\-_]/g, "");
}

function createPlayerId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
}

function parseCsv(csvPath: string): CsvRow[] {
  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.trim().split("\n");
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    if (parts.length >= 4) {
      rows.push({
        year: parseInt(parts[0], 10),
        team: parts[1],
        player: parts[2],
        result: parts[3] as Result,
      });
    }
  }

  return rows;
}

function calculateYearlyScore(result: Result, year: number, team: string): number {
  let score = RESULT_SCORE[result];

  if (LCK_TEAMS.has(team)) {
    score *= 1.25;
  }

  if (year >= 2022) {
    score *= 1.3;
  } else if (year >= 2019) {
    score *= 1.1;
  } else if (year <= 2015) {
    score *= 0.9;
  }

  return Math.round(score);
}

function assignGrade(score: number): Grade {
  if (score >= 100) return "LEGENDARY";
  if (score >= 70) return "EPIC";
  if (score >= 45) return "RARE";
  if (score >= 25) return "UNCOMMON";
  return "COMMON";
}

function main() {
  const csvPath = path.join(__dirname, "../lol_worlds_data.csv");
  const oldDataPath = path.join(__dirname, "../src/data/players.json");
  const outputPath = path.join(__dirname, "../src/data/players.json");

  const oldData = JSON.parse(fs.readFileSync(oldDataPath, "utf-8"));
  const oldPlayers: OldPlayer[] = oldData.players;

  const positionMap = new Map<string, Position>();
  for (const player of oldPlayers) {
    positionMap.set(normalizePlayerName(player.name), player.position);
  }

  const csvRows = parseCsv(csvPath);

  const careerMap = new Map<string, {
    name: string;
    appearances: Set<number>;
    championships: number;
    finals: number;
    semifinals: number;
    bestResult: Result;
    teams: Set<string>;
    years: Set<number>;
  }>();

  const players: Player[] = [];
  const seenCards = new Set<string>();

  for (const row of csvRows) {
    const normalizedName = normalizePlayerName(row.player);
    const playerId = createPlayerId(row.player);
    const cardId = `${playerId}-${row.year}`;

    if (seenCards.has(cardId)) continue;
    seenCards.add(cardId);

    const position = positionMap.get(normalizedName);
    if (!position) {
      console.warn(`Position not found for: ${row.player} (${normalizedName})`);
      continue;
    }

    const score = calculateYearlyScore(row.result, row.year, row.team);
    const grade = assignGrade(score);

    players.push({
      id: cardId,
      playerId,
      name: row.player,
      year: row.year,
      team: row.team,
      position,
      grade,
      score,
      result: row.result,
    });

    if (!careerMap.has(playerId)) {
      careerMap.set(playerId, {
        name: row.player,
        appearances: new Set(),
        championships: 0,
        finals: 0,
        semifinals: 0,
        bestResult: "Group Stage",
        teams: new Set(),
        years: new Set(),
      });
    }

    const career = careerMap.get(playerId)!;
    career.appearances.add(row.year);
    career.teams.add(row.team);
    career.years.add(row.year);

    if (row.result === "Champion") career.championships++;
    if (row.result === "Runner-up") career.finals++;
    if (row.result === "Semifinals") career.semifinals++;

    const currentBestIndex = RESULT_ORDER.indexOf(career.bestResult);
    const newResultIndex = RESULT_ORDER.indexOf(row.result);
    if (newResultIndex < currentBestIndex) {
      career.bestResult = row.result;
    }
  }

  const careers: PlayerCareer[] = Array.from(careerMap.entries()).map(([playerId, data]) => ({
    playerId,
    name: data.name,
    appearances: data.appearances.size,
    championships: data.championships,
    finals: data.finals,
    semifinals: data.semifinals,
    bestResult: data.bestResult,
    teams: Array.from(data.teams),
    years: Array.from(data.years).sort((a, b) => a - b),
  }));

  players.sort((a, b) => b.score - a.score || b.year - a.year);
  careers.sort((a, b) => {
    if (b.championships !== a.championships) return b.championships - a.championships;
    if (b.appearances !== a.appearances) return b.appearances - a.appearances;
    return a.name.localeCompare(b.name);
  });

  const gradeDistribution: Record<Grade, number> = {
    LEGENDARY: 0,
    EPIC: 0,
    RARE: 0,
    UNCOMMON: 0,
    COMMON: 0,
  };

  const positionDistribution: Record<Position, number> = {
    TOP: 0,
    JGL: 0,
    MID: 0,
    ADC: 0,
    SUP: 0,
  };

  for (const player of players) {
    gradeDistribution[player.grade]++;
    positionDistribution[player.position]++;
  }

  const years = players.map((p) => p.year);

  const output = {
    metadata: {
      totalCards: players.length,
      totalPlayers: careers.length,
      generatedAt: new Date().toISOString(),
      gradeDistribution,
      positionDistribution,
      yearRange: { min: Math.min(...years), max: Math.max(...years) },
    },
    players,
    careers,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log("\n=== Generation Complete ===");
  console.log(`Total cards: ${players.length}`);
  console.log(`Total players: ${careers.length}`);
  console.log("Grade distribution:", gradeDistribution);
  console.log("Position distribution:", positionDistribution);
  console.log(`Year range: ${output.metadata.yearRange.min}-${output.metadata.yearRange.max}`);

  const fakerCards = players.filter((p) => p.playerId === "faker");
  console.log(`\nFaker cards: ${fakerCards.length}`);
  for (const c of fakerCards) {
    console.log(`  ${c.id}: ${c.team} (${c.result}) - ${c.grade}`);
  }

  const hansSamaCards = players.filter((p) => 
    p.playerId === "hans-sama" || p.playerId === "hanssama"
  );
  console.log(`\nHans Sama cards: ${hansSamaCards.length}`);
  for (const c of hansSamaCards) {
    console.log(`  ${c.id}: ${c.team} (${c.result}) - ${c.grade}`);
  }
}

main();
