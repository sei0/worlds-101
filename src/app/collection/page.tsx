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
            ← Back to Gacha
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-white font-[family-name:var(--font-title)]">
            Card Collection
          </h1>
          <p className="text-gray-400 text-sm">
            {pullCount} Pulls • {stats.collected}/{stats.total} Cards ({progressPercent}%)
          </p>
        </header>

        <div className="w-full bg-slate-800 rounded-full h-3 mb-8">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {(["DEMON_KING", "LEGENDARY", "EPIC", "RARE", "UNCOMMON", "COMMON"] as Grade[]).map((grade) => (
            <div
              key={grade}
              className={`bg-slate-800 rounded-lg p-3 text-center ${grade === "DEMON_KING" ? "animate-pulse" : ""}`}
              style={{ borderLeft: `3px solid ${GRADE_COLORS[grade]}` }}
            >
              <div className="text-xs text-gray-400 mb-1">{grade === "DEMON_KING" ? "👹 DEMON KING" : grade}</div>
              <div className="text-lg font-bold text-white font-[family-name:var(--font-player)]">
                {stats.byGrade[grade]?.collected ?? 0}/{stats.byGrade[grade]?.total ?? 0}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "cards"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-gray-400 hover:text-white border border-slate-600"
              }`}
            >
              By Card
            </button>
            <button
              type="button"
              onClick={() => setViewMode("players")}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "players"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-gray-400 hover:text-white border border-slate-600"
              }`}
            >
              By Player
            </button>
          </div>

          <div className="h-6 w-px bg-slate-700" />

          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value as FilterGrade)}
            className="bg-slate-800 text-white pl-4 pr-8 py-2.5 rounded-lg border border-slate-600 text-sm cursor-pointer hover:border-slate-500 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22%239ca3af%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M8%2011L3%206h10l-5%205z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
          >
            <option value="ALL">All Grades</option>
            <option value="DEMON_KING">👹 Demon King</option>
            <option value="LEGENDARY">🌟 Legendary</option>
            <option value="EPIC">💜 Epic</option>
            <option value="RARE">💙 Rare</option>
            <option value="UNCOMMON">💚 Uncommon</option>
            <option value="COMMON">⬜ Common</option>
          </select>

          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value as FilterPosition)}
            className="bg-slate-800 text-white pl-4 pr-8 py-2.5 rounded-lg border border-slate-600 text-sm cursor-pointer hover:border-slate-500 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22%239ca3af%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M8%2011L3%206h10l-5%205z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
          >
            <option value="ALL">All Positions</option>
            {(["TOP", "JGL", "MID", "ADC", "SUP"] as Position[]).map((pos) => (
              <option key={pos} value={pos}>
                {POSITION_LABELS[pos]}
              </option>
            ))}
          </select>

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
            className="bg-slate-800 text-white pl-4 pr-8 py-2.5 rounded-lg border border-slate-600 text-sm cursor-pointer hover:border-slate-500 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22%239ca3af%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M8%2011L3%206h10l-5%205z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
          >
            <option value="ALL">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <div className="h-6 w-px bg-slate-700" />

          <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOnlyCollected}
              onChange={(e) => setShowOnlyCollected(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
            />
            Collected Only
          </label>
        </div>

        <div className="text-gray-400 text-sm mb-4">
          {viewMode === "cards"
            ? `${filteredCards.length} Cards`
            : `${groupedByPlayer.length} Players`}
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
                      <span className="text-lg font-bold text-white font-[family-name:var(--font-player)]">
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
                        {collectedCount}/{cards.length}
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
            No cards match the filter
          </div>
        )}
      </div>
    </div>
  );
}
