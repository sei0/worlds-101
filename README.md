# 🎰 LoL Worlds Gacha

**2013-2024 월드 챔피언십 역대 선수 가챠 게임**

527명의 월즈 출전 선수들로 나만의 드림팀을 만들어보세요.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## ✨ 주요 기능

### 🃏 가챠 시스템
- 포지션별 (탑/정글/미드/원딜/서폿) 5인 팀 뽑기
- 5단계 등급: **LEGENDARY** → EPIC → RARE → UNCOMMON → COMMON
- 3D 카드 플립 애니메이션으로 두근두근 오픈

### 📖 도감
- 527명 선수 컬렉션
- 등급/포지션별 필터링
- LocalStorage 자동 저장

### ⚔️ 배틀
- 내 팀 vs AI 팀 시뮬레이션
- 선수 스탯 기반 승패 결정

### 🏆 챌린지
- "Faker 수집하기"
- "T1 왕조 완성"
- 그 외 다양한 도전 과제

## 🎲 확률 시스템

### 등급 출현율
| 등급 | 확률 |
|------|------|
| LEGENDARY | 3% |
| EPIC | 10% |
| RARE | 20% |
| UNCOMMON | 30% |
| COMMON | 37% |

### 리전 가중치
LCK 선수가 더 자주 등장합니다.

| 리전 | 가중치 |
|------|--------|
| LCK | ×2.5 |
| LPL | ×1.5 |
| LEC | ×1.2 |
| 기타 | ×0.4 |

### 최신 시즌 보너스
| 활동 시기 | 가중치 |
|-----------|--------|
| 2022년 이후 | ×2.0 |
| 2019-2021년 | ×1.2 |
| 2018년 이전 | ×0.3 |

## 🚀 시작하기

```bash
# 의존성 설치
bun install

# 개발 서버 실행
bun run dev

# 프로덕션 빌드
bun run build
```

http://localhost:3000 에서 확인

## 📁 프로젝트 구조

```
worlds-101/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # 메인 가챠 화면
│   │   ├── collection/   # 도감
│   │   ├── battle/       # 배틀
│   │   └── challenges/   # 챌린지
│   ├── components/       # React 컴포넌트
│   │   ├── PlayerCard.tsx
│   │   └── GachaResult.tsx
│   ├── lib/              # 비즈니스 로직
│   │   ├── gacha.ts      # 뽑기 알고리즘
│   │   ├── collection.ts # 수집 관리
│   │   └── battle.ts     # 배틀 시뮬레이션
│   ├── data/
│   │   └── players.json  # 527명 선수 데이터
│   └── types/
│       └── player.ts     # 타입 정의
├── scripts/
│   └── regenerate-players.ts  # 데이터 재생성
└── lol_worlds_data.*     # 원본 데이터 (CSV, JSON, SQLite)
```

## 📊 데이터셋

2013-2024 LoL 월드 챔피언십 출전 선수 데이터

- **총 선수**: 527명
- **기간**: 12년 (2013-2024)
- **팀 수**: 100개+
- **출처**: Leaguepedia

### 등급 분포
| 등급 | 선수 수 | 기준 |
|------|---------|------|
| LEGENDARY | 24명 | 다회 우승, 레전드급 |
| EPIC | 46명 | 우승 경험 or 다회 결승 |
| RARE | 47명 | 4강 이상 다수 |
| UNCOMMON | 116명 | 8강 이상 경험 |
| COMMON | 294명 | 그 외 |

### 최다 우승 선수
1. **Faker** - 6회 (2013, 2015, 2016, 2023, 2024, 2025)
2. **Keria, Gumayusi, Oner** - 3회

## 🛠 기술 스택

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **UI**: React 19 + @base-ui/react
- **Styling**: Tailwind CSS 4
- **Runtime**: Bun

## 📄 라이선스

MIT License

데이터는 공개 정보(Leaguepedia)를 기반으로 수집되었습니다.

---

**Made with ❤️ for LoL Esports fans**
