"use client";

import { useState } from "react";
import Link from "next/link";
import type { Player } from "@/types/player";
import { POSITION_LABELS } from "@/types/player";
import { pullGacha } from "@/lib/gacha";
import { simulateBattle, type BattleResult } from "@/lib/battle";
import { PlayerCard } from "@/components/PlayerCard";
import { Button } from "@base-ui/react/button";

export default function BattlePage() {
  const [playerTeam, setPlayerTeam] = useState<Player[] | null>(null);
  const [opponentTeam, setOpponentTeam] = useState<Player[] | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });

  const handleDraw = () => {
    const newTeam = pullGacha();
    setPlayerTeam(newTeam);
    setBattleResult(null);
    setOpponentTeam(null);
  };

  const handleBattle = () => {
    if (!playerTeam) return;

    setIsBattling(true);
    const opponent = pullGacha();
    setOpponentTeam(opponent);

    setTimeout(() => {
      const result = simulateBattle(playerTeam, opponent);
      setBattleResult(result);
      setIsBattling(false);

      setStats((prev) => ({
        wins: prev.wins + (result.winner === "player" ? 1 : 0),
        losses: prev.losses + (result.winner === "opponent" ? 1 : 0),
        draws: prev.draws + (result.winner === "draw" ? 1 : 0),
      }));
    }, 1000);
  };

  const handleReset = () => {
    setPlayerTeam(null);
    setOpponentTeam(null);
    setBattleResult(null);
  };

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
            팀 배틀
          </h1>
          <p className="text-gray-400 text-sm">
            {stats.wins}승 {stats.losses}패 {stats.draws}무
          </p>
        </header>

        {!playerTeam && (
          <div className="text-center py-16">
            <p className="text-gray-300 mb-8">
              먼저 당신의 팀을 뽑으세요!
            </p>
            <Button
              onClick={handleDraw}
              className="px-8 py-4 text-lg font-bold text-slate-900 rounded-xl
                         bg-white hover:bg-gray-100
                         hover:scale-105 transition-all cursor-pointer"
            >
              🎰 팀 뽑기
            </Button>
          </div>
        )}

        {playerTeam && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">
                내 팀
              </h2>
              <div className="flex gap-3 justify-center flex-wrap">
                {playerTeam.map((player, i) => (
                  <div key={player.id + i} className="text-center">
                    <PlayerCard player={player} revealed={true} />
                    {battleResult && (
                      <div
                        className={`mt-2 text-sm font-bold ${
                          battleResult.rounds[i].winner === "player"
                            ? "text-green-400"
                            : battleResult.rounds[i].winner === "opponent"
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        {battleResult.rounds[i].playerPower}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {!battleResult && !isBattling && (
              <div className="text-center">
                <Button
                  onClick={handleBattle}
                  className="px-8 py-4 text-lg font-bold text-slate-900 rounded-xl
                             bg-white hover:bg-gray-100
                             hover:scale-105 transition-all cursor-pointer"
                >
                  ⚔️ 배틀 시작!
                </Button>
              </div>
            )}

            {isBattling && (
              <div className="text-center py-8">
                <div className="text-4xl animate-bounce">⚔️</div>
                <p className="text-gray-400 mt-4">대전 중...</p>
              </div>
            )}

            {opponentTeam && (
              <div>
                <h2 className="text-xl font-bold text-red-400 mb-4 text-center">
                  상대 팀
                </h2>
                <div className="flex gap-3 justify-center flex-wrap">
                  {opponentTeam.map((player, i) => (
                    <div key={player.id + i} className="text-center">
                      <PlayerCard player={player} revealed={true} />
                      {battleResult && (
                        <div
                          className={`mt-2 text-sm font-bold ${
                            battleResult.rounds[i].winner === "opponent"
                              ? "text-green-400"
                              : battleResult.rounds[i].winner === "player"
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {battleResult.rounds[i].opponentPower}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {battleResult && (
              <div className="text-center py-6">
                <div
                  className={`text-4xl font-bold mb-4 ${
                    battleResult.winner === "player"
                      ? "text-green-400"
                      : battleResult.winner === "opponent"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {battleResult.winner === "player"
                    ? "🎉 승리!"
                    : battleResult.winner === "opponent"
                    ? "😢 패배..."
                    : "🤝 무승부"}
                </div>
                <div className="text-gray-400 mb-6">
                  {battleResult.playerScore} vs {battleResult.opponentScore}
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleBattle}
                    className="px-6 py-3 font-bold text-slate-900 rounded-lg
                               bg-white hover:bg-gray-100
                               hover:scale-105 transition-all cursor-pointer"
                  >
                    다시 배틀
                  </Button>
                  <Button
                    onClick={handleReset}
                    className="px-6 py-3 font-bold text-white rounded-lg
                               bg-slate-700 hover:bg-slate-600
                               transition-all cursor-pointer"
                  >
                    새 팀 뽑기
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
