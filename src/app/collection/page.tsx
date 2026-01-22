"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { Player, Grade, Position } from "@/types/player";
import { POSITION_LABELS, GRADE_COLORS } from "@/types/player";
import { getAllPlayers } from "@/lib/gacha";
import { getCollection, getCollectionStats } from "@/lib/collection";
import { PlayerCard } from "@/components/PlayerCard";

type FilterGrade = Grade | "ALL";
type FilterPosition = Position | "ALL";

export default function CollectionPage() {
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [pullCount, setPullCount] = useState(0);
  const [filterGrade, setFilterGrade] = useState<FilterGrade>("ALL");
  const [filterPosition, setFilterPosition] = useState<FilterPosition>("ALL");
  const [showOnlyCollected, setShowOnlyCollected] = useState(false);

  const allPlayers = useMemo(() => getAllPlayers(), []);

  useEffect(() => {
    const state = getCollection();
    setCollected(state.collected);
    setPullCount(state.pullCount);
  }, []);

  const stats = useMemo(
    () => getCollectionStats(allPlayers, collected),
    [allPlayers, collected]
  );

  const filteredPlayers = useMemo(() => {
    return allPlayers.filter((player) => {
      if (filterGrade !== "ALL" && player.grade !== filterGrade) return false;
      if (filterPosition !== "ALL" && player.position !== filterPosition) return false;
      if (showOnlyCollected && !collected.has(player.id)) return false;
      return true;
    });
  }, [allPlayers, filterGrade, filterPosition, showOnlyCollected, collected]);

  const progressPercent = Math.round((stats.collected / stats.total) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-5 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <Link
            href="/"
            className="text-gray-400 hover:text-white text-sm mb-4 inline-block"
          >
            ← 뽑기로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-white">
            선수 도감
          </h1>
          <p className="text-gray-400 text-sm">
            총 {pullCount}회 뽑기 • {stats.collected}/{stats.total}명 수집 ({progressPercent}%)
          </p>
        </header>

        <div className="w-full bg-slate-800 rounded-full h-3 mb-8">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {(["LEGENDARY", "EPIC", "RARE", "UNCOMMON", "COMMON"] as Grade[]).map((grade) => (
            <div
              key={grade}
              className="bg-slate-800 rounded-lg p-3 text-center"
              style={{ borderLeft: `3px solid ${GRADE_COLORS[grade]}` }}
            >
              <div className="text-xs text-gray-400 mb-1">{grade}</div>
              <div className="text-lg font-bold text-white">
                {stats.byGrade[grade].collected}/{stats.byGrade[grade].total}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value as FilterGrade)}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700"
          >
            <option value="ALL">전체 등급</option>
            <option value="LEGENDARY">🌟 Legendary</option>
            <option value="EPIC">💜 Epic</option>
            <option value="RARE">💙 Rare</option>
            <option value="UNCOMMON">💚 Uncommon</option>
            <option value="COMMON">⬜ Common</option>
          </select>

          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value as FilterPosition)}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700"
          >
            <option value="ALL">전체 포지션</option>
            {(["TOP", "JGL", "MID", "ADC", "SUP"] as Position[]).map((pos) => (
              <option key={pos} value={pos}>
                {POSITION_LABELS[pos]}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyCollected}
              onChange={(e) => setShowOnlyCollected(e.target.checked)}
              className="w-4 h-4"
            />
            수집한 선수만 보기
          </label>
        </div>

        <div className="text-gray-400 text-sm mb-4">
          {filteredPlayers.length}명 표시 중
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              className={`transition-all duration-200 ${
                collected.has(player.id) ? "" : "opacity-40 grayscale"
              }`}
            >
              <PlayerCard player={player} revealed={true} />
            </div>
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center text-gray-500 py-16">
            조건에 맞는 선수가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
