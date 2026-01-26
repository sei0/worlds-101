# 🎰 LoL Worlds Gacha

**Build your dream team from 1063 cards of 509 players who competed in Worlds 2013-2025**

A gacha-style card collecting game featuring every player from the League of Legends World Championship history. Each player has yearly cards based on their tournament appearances.

## 🎮 Play Now

**👉 [https://worlds-101.vercel.app](https://worlds-101.vercel.app)**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## ✨ Features

### 🃏 Gacha System
- Pull a 5-player team by position (Top / Jungle / Mid / ADC / Support)
- 6-tier rarity system: **👑 DEMON_KING** → LEGENDARY → EPIC → RARE → UNCOMMON → COMMON
- **DEMON_KING**: The ultimate grade, exclusive to Faker — the undisputed GOAT
- Satisfying 3D card flip animations with grade-specific effects
- Screen flash & shake effects for high-rarity reveals

### 📖 Collection
- Collect all 1063 cards
- Filter by grade and position
- Auto-saved to LocalStorage

### ⚔️ Battle
- Simulate matches: Your team vs AI team
- Outcome based on player stats

### 🏆 Challenges
- "Collect Faker"
- "Complete the T1 Dynasty"
- And more achievements to unlock

## 🎲 Pull Rates

### Grade Probabilities
Each grade has equal probability:

| Grade | Rate |
|-------|------|
| 👑 DEMON_KING | 16.7% |
| LEGENDARY | 16.7% |
| EPIC | 16.7% |
| RARE | 16.7% |
| UNCOMMON | 16.7% |
| COMMON | 16.7% |

### Region Weights
LCK players appear more frequently.

| Region | Weight |
|--------|--------|
| LCK | ×2.5 |
| LPL | ×1.5 |
| LEC | ×1.2 |
| Others | ×0.4 |

### Recency Bonus
| Active Period | Weight |
|---------------|--------|
| 2022+ | ×2.0 |
| 2019-2021 | ×1.2 |
| Before 2018 | ×0.3 |


## 📁 Project Structure

```
worlds-101/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Main gacha screen
│   │   ├── collection/   # Collection page
│   │   ├── battle/       # Battle page
│   │   └── challenges/   # Challenges page
│   ├── components/       # React components
│   │   ├── PlayerCard.tsx
│   │   └── GachaResult.tsx
│   ├── lib/              # Business logic
│   │   ├── gacha.ts      # Pull algorithm
│   │   ├── collection.ts # Collection management
│   │   ├── battle.ts     # Battle simulation
│   │   └── audio.ts      # Sound effects
│   ├── data/
│   │   └── players.json  # 1063 card records
│   └── types/
│       └── player.ts     # Type definitions
├── public/
│   └── teams/            # Team logo SVGs
├── scripts/
│   └── regenerate-players.ts
└── lol_worlds_data.*     # Raw data (CSV, JSON, SQLite)
```

## 📊 Dataset

LoL World Championship player data from 2013-2025

- **Total Cards**: 1063
- **Total Players**: 509
- **Years Covered**: 13 (2013-2025)
- **Teams**: 100+
- **Source**: Leaguepedia

### Grade Distribution
| Grade | Count | Criteria |
|-------|-------|----------|
| 👑 DEMON_KING | 10 | Faker only — 6x World Champion, the GOAT |
| LEGENDARY | 67 | Multiple championships, all-time greats |
| EPIC | 36 | Championship or multiple finals |
| RARE | 86 | Multiple semifinals+ |
| UNCOMMON | 198 | Quarterfinals+ experience |
| COMMON | 676 | Others |

### Most Championships
1. **Faker** - 6 titles (2013, 2015, 2016, 2023, 2024, 2025)
2. **Keria, Gumayusi, Oner** - 3 titles

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **UI**: React 19 + @base-ui/react
- **Styling**: Tailwind CSS 4
- **Runtime**: Bun

## 📄 License

MIT License

Data collected from publicly available sources (Leaguepedia).

---

**Made with ❤️ from LoL Esports fan**
