const TEAM_LOGOS: Record<string, string> = {
  "T1": "/teams/T1.svg",
  "SK Telecom T1": "/teams/T1.svg",
  "Gen.G Esports": "/teams/GEN.svg",
  "DRX": "/teams/DRX.svg",
  "KT Rolster": "/teams/KT.svg",
  "Hanwha Life Esports": "/teams/HLE.svg",
  "DAMWON Gaming": "/teams/DK.svg",
  "Dplus": "/teams/DK.svg",
  "DWG KIA": "/teams/DK.svg",
  "Nongshim RedForce": "/teams/NS.svg",
  "BNK FearX": "/teams/BFX.svg",
  "OK BRION": "/teams/BRO.svg",
  "Fredit BRION": "/teams/BRO.svg",
  "DN Esports": "/teams/DNS.svg",
};

export function getTeamLogo(teamName: string): string | null {
  return TEAM_LOGOS[teamName] || null;
}

export function getLatestTeamLogo(teams: string[]): string | null {
  for (let i = teams.length - 1; i >= 0; i--) {
    const logo = getTeamLogo(teams[i]);
    if (logo) return logo;
  }
  return null;
}
