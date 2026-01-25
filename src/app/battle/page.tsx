"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Player } from "@/types/player";
import { pullGacha } from "@/lib/gacha";
import { simulateBattle, type BattleResult } from "@/lib/battle";
import { PlayerCard } from "@/components/PlayerCard";
import { Button } from "@base-ui/react/button";

type Phase = "drawing" | "ready" | "battling" | "revealing" | "result";

export default function BattlePage() {
  const [playerTeam, setPlayerTeam] = useState<Player[] | null>(null);
  const [opponentTeam, setOpponentTeam] = useState<Player[] | null>(null);
  const [playerRevealed, setPlayerRevealed] = useState<Set<number>>(new Set());
  const [opponentRevealed, setOpponentRevealed] = useState<Set<number>>(new Set());
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [phase, setPhase] = useState<Phase>("drawing");
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });

  const allPlayerRevealed = playerTeam ? playerRevealed.size >= playerTeam.length : false;
  const allOpponentRevealed = opponentTeam ? opponentRevealed.size >= opponentTeam.length : false;

  const initDraw = useCallback(() => {
    const newTeam = pullGacha();
    setPlayerTeam(newTeam);
    setPlayerRevealed(new Set());
    setOpponentTeam(null);
    setOpponentRevealed(new Set());
    setBattleResult(null);
    setPhase("drawing");
  }, []);

  useEffect(() => {
    initDraw();
  }, [initDraw]);

  useEffect(() => {
    if (allPlayerRevealed && phase === "drawing") {
      setPhase("ready");
    }
  }, [allPlayerRevealed, phase]);

  useEffect(() => {
    if (phase === "revealing" && opponentTeam) {
      if (opponentRevealed.size < opponentTeam.length) {
        const timer = setTimeout(() => {
          setOpponentRevealed((prev) => new Set([...prev, prev.size]));
        }, 500);
        return () => clearTimeout(timer);
      } else {
        const result = simulateBattle(playerTeam!, opponentTeam);
        setBattleResult(result);
        setPhase("result");
        setStats((prev) => ({
          wins: prev.wins + (result.winner === "player" ? 1 : 0),
          losses: prev.losses + (result.winner === "opponent" ? 1 : 0),
          draws: prev.draws + (result.winner === "draw" ? 1 : 0),
        }));
      }
    }
  }, [phase, opponentRevealed, opponentTeam, playerTeam]);

  const handlePlayerCardClick = (index: number) => {
    if (phase !== "drawing" || playerRevealed.has(index)) return;
    setPlayerRevealed((prev) => new Set([...prev, index]));
  };

  const handleReDraw = () => {
    initDraw();
  };

  const handleStartBattle = () => {
    if (!playerTeam) return;
    const opponent = pullGacha();
    setOpponentTeam(opponent);
    setOpponentRevealed(new Set());
    setBattleResult(null);
    setPhase("battling");

    setTimeout(() => {
      setPhase("revealing");
    }, 800);
  };

  const handleRematch = () => {
    const opponent = pullGacha();
    setOpponentTeam(opponent);
    setOpponentRevealed(new Set());
    setBattleResult(null);
    setPhase("battling");

    setTimeout(() => {
      setPhase("revealing");
    }, 800);
  };

  if (!playerTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-6xl animate-bounce">⚔️</div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold mb-2 text-white font-[family-name:var(--font-title)]">Team Battle</h1>
          <p className="text-gray-400 text-sm">
            {stats.wins}W {stats.losses}L {stats.draws}D
          </p>
        </header>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-blue-400 mb-2 text-center font-[family-name:var(--font-player)]">
              Your Team
            </h2>
            {phase === "drawing" && !allPlayerRevealed && (
              <p className="text-gray-400 text-sm mb-4 text-center animate-pulse">
                Tap cards to reveal ({playerRevealed.size}/{playerTeam.length})
              </p>
            )}
            <div className="flex gap-3 justify-center flex-wrap">
              {playerTeam.map((player, i) => (
                <div key={player.id + i} className="text-center">
                  <PlayerCard
                    player={player}
                    revealed={playerRevealed.has(i)}
                    onClick={() => handlePlayerCardClick(i)}
                  />
                  {playerRevealed.has(i) && (
                    <div className="mt-2 text-sm font-medium text-gray-400">
                      {player.score}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {phase === "ready" && (
            <div className="text-center py-4 flex gap-4 justify-center flex-wrap">
              <Button
                onClick={handleReDraw}
                className="px-6 py-3 font-bold text-white rounded-lg
                           bg-slate-700 hover:bg-slate-600
                           hover:scale-105 transition-all cursor-pointer font-[family-name:var(--font-player)]"
              >
                🔄 Re-draw
              </Button>
              <Button
                onClick={handleStartBattle}
                className="px-8 py-4 text-lg font-bold text-slate-900 rounded-xl
                           bg-white hover:bg-gray-100
                           hover:scale-105 transition-all cursor-pointer font-[family-name:var(--font-player)]"
              >
                ⚔️ Start Battle!
              </Button>
            </div>
          )}

          {phase === "battling" && (
            <div className="text-center py-8">
              <div className="text-5xl animate-bounce">⚔️</div>
              <p className="text-gray-400 mt-4">Finding opponent...</p>
            </div>
          )}

          {opponentTeam && phase !== "battling" && (
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-2 text-center font-[family-name:var(--font-player)]">
                Opponent Team
              </h2>
              {phase === "revealing" && (
                <p className="text-gray-400 text-sm mb-4 text-center animate-pulse">
                  Revealing... ({opponentRevealed.size}/{opponentTeam.length})
                </p>
              )}
              <div className="flex gap-3 justify-center flex-wrap">
                {opponentTeam.map((player, i) => (
                  <div key={player.id + i} className="text-center">
                    <PlayerCard
                      player={player}
                      revealed={opponentRevealed.has(i)}
                    />
                    {opponentRevealed.has(i) && (
                      <div className="mt-2 text-sm font-medium text-gray-400">
                        {player.score}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === "result" && battleResult && (
            <div className="text-center py-6">
              <div
                className={`text-4xl font-bold mb-4 font-[family-name:var(--font-player)] ${
                  battleResult.winner === "player"
                    ? "text-green-400"
                    : battleResult.winner === "opponent"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {battleResult.winner === "player"
                  ? "🎉 Victory!"
                  : battleResult.winner === "opponent"
                  ? "😢 Defeat..."
                  : "🤝 Draw"}
              </div>
              <div className="text-gray-400 mb-6">
                {battleResult.playerScore} vs {battleResult.opponentScore}
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={handleRematch}
                  className="px-6 py-3 font-bold text-slate-900 rounded-lg
                             bg-white hover:bg-gray-100
                             hover:scale-105 transition-all cursor-pointer font-[family-name:var(--font-player)]"
                >
                  ⚔️ Rematch
                </Button>
                <Button
                  onClick={handleReDraw}
                  className="px-6 py-3 font-bold text-white rounded-lg
                             bg-slate-700 hover:bg-slate-600
                             transition-all cursor-pointer font-[family-name:var(--font-player)]"
                >
                  🔄 New Team
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
