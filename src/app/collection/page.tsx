"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { Player, Grade, Position } from "@/types/player";
import { POSITION_LABELS, GRADE_COLORS } from "@/types/player";
import { getAllCards } from "@/lib/gacha";
import { getCollection, getCollectionStats } from "@/lib/collection";
import { PlayerCard } from "@/components/PlayerCard";

type FilterGrade = Grade | "ALL";
type FilterPosition = Position | "ALL";
type ViewMode = "cards" | "players";

export default function CollectionPage() {
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [pullCount, setPullCount] = useState(0);
  const [filterGrade, setFilterGrade] = useState<FilterGrade>("ALL");
  const [filterPosition, setFilterPosition] = useState<FilterPosition>("ALL");
  const [filterYear, setFilterYear] = useState<number | "ALL">("ALL");
  const [showOnlyCollected, setShowOnlyCollected] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  const allCards = useMemo(() => getAllCards(), []);
  const years = useMemo(() => {
    const yearSet = new Set(allCards.map((c) => c.year));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [allCards]);

  useEffect(() => {
    const state = getCollection();
    setCollected(state.collected);
    setPullCount(state.pullCount);
  }, []);

  const stats = useMemo(
    () => getCollectionStats(allCards, collected),
    [allCards, collected]
  );

  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      if (filterGrade !== "ALL" && card.grade !== filterGrade) return false;
      if (filterPosition !== "ALL" && card.position !== filterPosition) return false;
      if (filterYear !== "ALL" && card.year !== filterYear) return false;
      if (showOnlyCollected && !collected.has(card.id)) return false;
      return true;
    });
  }, [allCards, filterGrade, filterPosition, filterYear, showOnlyCollected, collected]);

  const groupedByPlayer = useMemo(() => {
    const groups = new Map<string, Player[]>();
    for (const card of filteredCards) {
      const existing = groups.get(card.playerId) || [];
      existing.push(card);
      groups.set(card.playerId, existing);
    }
    for (const [, cards] of groups) {
      cards.sort((a, b) => b.year - a.year);
    }
    return Array.from(groups.entries()).sort((a, b) => {
      const aCollected = a[1].filter((c) => collected.has(c.id)).length;
      const bCollected = b[1].filter((c) => collected.has(c.id)).length;
      if (bCollected !== aCollected) return bCollected - aCollected;
      return b[1].length - a[1].length;
    });
  }, [filteredCards, collected]);

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
            카드 도감
          </h1>
          <p className="text-gray-400 text-sm">
            총 {pullCount}회 뽑기 • {stats.collected}/{stats.total}장 수집 ({progressPercent}%)
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
          <div className="flex gap-2 mr-4">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                viewMode === "cards"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-gray-400 hover:text-white"
              }`}
            >
              카드별
            </button>
            <button
              type="button"
              onClick={() => setViewMode("players")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                viewMode === "players"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-gray-400 hover:text-white"
              }`}
            >
              선수별
            </button>
          </div>

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

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700"
          >
            <option value="ALL">전체 연도</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
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
            수집한 카드만
          </label>
        </div>

        <div className="text-gray-400 text-sm mb-4">
          {viewMode === "cards"
            ? `${filteredCards.length}장 표시 중`
            : `${groupedByPlayer.length}명의 선수`}
        </div>

        {viewMode === "cards" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className={`transition-all duration-200 ${
                  collected.has(card.id) ? "" : "opacity-40 grayscale"
                }`}
              >
                <PlayerCard player={card} revealed={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {groupedByPlayer.map(([playerId, cards]) => {
              const collectedCount = cards.filter((c) => collected.has(c.id)).length;
              const isExpanded = expandedPlayer === playerId;
              const firstCard = cards[0];

              return (
                <div key={playerId} className="bg-slate-800 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedPlayer(isExpanded ? null : playerId)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-white">
                        {firstCard.name}
                      </span>
                      <span className="text-xs text-gray-400 bg-slate-700 px-2 py-1 rounded">
                        {POSITION_LABELS[firstCard.position]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${
                        collectedCount === cards.length 
                          ? "text-green-400" 
                          : collectedCount > 0 
                            ? "text-yellow-400" 
                            : "text-gray-500"
                      }`}>
                        {collectedCount}/{cards.length}장
                      </span>
                      <span className="text-gray-400">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-700">
                      <div className="flex flex-wrap gap-4">
                        {cards.map((card) => (
                          <div
                            key={card.id}
                            className={`transition-all duration-200 ${
                              collected.has(card.id) ? "" : "opacity-40 grayscale"
                            }`}
                          >
                            <PlayerCard player={card} revealed={true} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {filteredCards.length === 0 && (
          <div className="text-center text-gray-500 py-16">
            조건에 맞는 카드가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
