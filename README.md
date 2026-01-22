# LoL Worlds Database (2013-2025)

리그 오브 레전드 월드 챔피언십 2013년부터 2025년까지의 출전 선수 및 성적 데이터베이스

## 📊 데이터 개요

- **기간**: 2013년 ~ 2025년 (13년)
- **총 기록**: 1,120개
- **고유 팀 수**: 100개
- **고유 선수 수**: 579명

## 📁 파일 구조

```
worlds-101/
├── lol_worlds_data.csv      # CSV 형식 데이터
├── lol_worlds_data.json     # JSON 형식 데이터
├── lol_worlds_data.db       # SQLite 데이터베이스
└── README.md                # 이 파일
```

## 📈 성적 분류

데이터는 다음과 같이 최종 성적별로 분류됩니다:

| 성적 | 기록 수 |
|------|---------|
| Group Stage | 581명 |
| Quarterfinals | 269명 |
| Semifinals | 134명 |
| Runner-up | 68명 |
| Champion | 68명 |

## 🏆 주요 통계

### 최다 우승 선수

1. **Faker** (T1/SKT) - 5회 우승 (2013, 2015, 2016, 2023, 2024, 2025)
2. **Bengi** (SKT) - 3회 우승 (2013, 2015, 2016)
3. **Bang** (SKT) - 2회 우승 (2015, 2016)
4. **Wolf** (SKT) - 2회 우승 (2015, 2016)

### 최다 출전 선수

1. **Faker** - 10회 출전
2. **Ruler** - 9회 출전
3. **Maple** - 8회 출전
4. **Meiko** - 8회 출전

## 💾 사용 예제

### CSV 파일

```python
import pandas as pd

# CSV 파일 읽기
df = pd.read_csv('lol_worlds_data.csv')

# 특정 선수 검색
faker_records = df[df['Player'] == 'Faker']

# 특정 년도 우승팀
champions_2023 = df[(df['Year'] == 2023) & (df['Result'] == 'Champion')]
```

### SQLite 데이터베이스

```python
import sqlite3

conn = sqlite3.connect('lol_worlds_data.db')
cursor = conn.cursor()

# Faker가 출전한 모든 대회
cursor.execute('''
    SELECT year, team, result
    FROM players
    WHERE player = "Faker"
    GROUP BY year, team, result
    ORDER BY year
''')

# 2023년 T1 로스터
cursor.execute('''
    SELECT player, result
    FROM players
    WHERE year = 2023 AND team = "T1"
''')

# 우승 경험이 있는 선수 찾기
cursor.execute('''
    SELECT player, COUNT(DISTINCT year) as championship_count
    FROM players
    WHERE result = "Champion"
    GROUP BY player
    ORDER BY championship_count DESC
''')

conn.close()
```

### JSON 파일

```python
import json

with open('lol_worlds_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 메타데이터 확인
print(data['metadata'])

# 특정 년도 데이터 조회
year_2023 = [t for t in data['tournaments'] if t['year'] == 2023][0]

# 우승팀 찾기
for team in year_2023['teams']:
    if team['result'] == 'Champion':
        print(f"2023 Champion: {team['name']}")
        print(f"Players: {', '.join(team['players'])}")
```

## 🔍 고급 쿼리 예제

### SQLite 쿼리

```sql
-- 가장 많이 우승한 팀
SELECT team, COUNT(DISTINCT year) as championships
FROM players
WHERE result = 'Champion'
GROUP BY team
ORDER BY championships DESC
LIMIT 5;

-- 연도별 우승팀
SELECT year, team
FROM players
WHERE result = 'Champion'
GROUP BY year, team
ORDER BY year;

-- 특정 선수의 성적 추이
SELECT year, team, result
FROM players
WHERE player = 'Faker'
GROUP BY year, team, result
ORDER BY year;

-- 4강 이상 진출 횟수가 가장 많은 선수
SELECT player, COUNT(DISTINCT year) as semifinal_or_better
FROM players
WHERE result IN ('Champion', 'Runner-up', 'Semifinals')
GROUP BY player
ORDER BY semifinal_or_better DESC
LIMIT 10;

-- 년도별 지역별 성적 (팀명 기준 추정)
SELECT year,
       SUM(CASE WHEN result = 'Champion' THEN 1 ELSE 0 END) as champions,
       SUM(CASE WHEN result IN ('Champion', 'Runner-up') THEN 1 ELSE 0 END) as finalists,
       SUM(CASE WHEN result IN ('Champion', 'Runner-up', 'Semifinals') THEN 1 ELSE 0 END) as semifinals
FROM players
GROUP BY year
ORDER BY year;
```

## 📝 데이터 구조

### CSV 컬럼

| 컬럼명 | 설명 |
|--------|------|
| Year | 대회 년도 |
| Team | 팀 이름 |
| Player | 선수 닉네임 |
| Result | 최종 성적 (Champion, Runner-up, Semifinals, Quarterfinals, Group Stage) |

### JSON 구조

```json
{
  "metadata": {
    "description": "...",
    "total_years": 13,
    "years_covered": "2013-2025",
    "result_categories": [...]
  },
  "tournaments": [
    {
      "year": 2023,
      "teams": [
        {
          "name": "T1",
          "result": "Champion",
          "players": ["Zeus", "Oner", "Faker", "Gumayusi", "Keria"]
        }
      ]
    }
  ]
}
```

## 🎯 활용 사례

- **통계 분석**: 선수/팀별 성적 추이 분석
- **예측 모델**: 과거 데이터 기반 성적 예측
- **시각화**: 년도별, 팀별, 선수별 데이터 시각화
- **리서치**: e스포츠 연구 및 보고서 작성

## 📄 라이선스

이 데이터베이스는 공개 정보를 바탕으로 수집되었으며, 교육 및 분석 목적으로 자유롭게 사용할 수 있습니다.

## 🔄 업데이트

- **최종 업데이트**: 2026년 1월 22일
- **데이터 출처**: Liquipedia, Leaguepedia

---

**Note**: 이 데이터베이스는 2013년부터 2025년까지의 LoL Worlds 공식 데이터를 기반으로 하고 있으며, 각 팀의 최종 성적과 선수 명단을 포함합니다.
