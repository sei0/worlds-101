"use client";

import { useState } from "react";
import type { Player } from "@/types/player";
import { PlayerCard } from "./PlayerCard";
import { Button } from "@base-ui/react/button";
import { calculateTeamPower } from "@/lib/gacha";

interface GachaResultProps {
  team: Player[];
  onReset: () => void;
}

export function GachaResult({ team, onReset }: GachaResultProps) {
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());

  const handleCardClick = (index: number) => {
    if (revealedCards.has(index)) return;
    setRevealedCards((prev) => new Set([...prev, index]));
  };

  const allRevealed = revealedCards.size >= team.length;
  const teamPower = calculateTeamPower(team);

  const legendaryCount = team.filter((p) => p.grade === "LEGENDARY").length;
  const epicCount = team.filter((p) => p.grade === "EPIC").length;

  return (
    <div className="text-center">
      {!allRevealed && (
        <p className="text-gray-400 text-sm mb-6 animate-pulse">
          카드를 클릭하여 선수를 확인하세요! ({revealedCards.size}/{team.length})
        </p>
      )}

      <div className="flex gap-4 justify-center flex-wrap mb-8">
        {team.map((player, index) => (
          <PlayerCard
            key={player.id + index}
            player={player}
            revealed={revealedCards.has(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {allRevealed && (
        <div className="animate-fade-in">
          <div className="text-2xl font-bold text-white mb-2">
            팀 전투력: {teamPower.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400 mb-6">
            {legendaryCount > 0 && `🌟 LEGENDARY ×${legendaryCount} `}
            {epicCount > 0 && `💜 EPIC ×${epicCount}`}
          </div>
          <Button
            onClick={onReset}
            className="px-8 py-3 text-base font-bold text-slate-900 rounded-lg
                       bg-white hover:bg-gray-100
                       hover:scale-105 hover:shadow-lg hover:shadow-white/20
                       transition-all duration-200 cursor-pointer"
          >
            다시 뽑기
          </Button>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
