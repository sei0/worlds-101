"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [isExiting, setIsExiting] = useState(false);
  const [screenEffect, setScreenEffect] = useState<"none" | "flash" | "shake">("none");
  const [isAutoRevealing, setIsAutoRevealing] = useState(false);

  const handleCardClick = useCallback((index: number) => {
    if (revealedCards.has(index) || isAutoRevealing) return;
    setRevealedCards((prev) => new Set([...prev, index]));
    
    const player = team[index];
    if (player.grade === "DEMON_KING" || player.grade === "LEGENDARY") {
      setScreenEffect("flash");
      setTimeout(() => setScreenEffect("shake"), 100);
      setTimeout(() => setScreenEffect("none"), 500);
    }
  }, [revealedCards, isAutoRevealing, team]);

  const handleRevealAll = useCallback(() => {
    if (isAutoRevealing) return;
    setIsAutoRevealing(true);
    
    const unrevealed = team.map((_, i) => i).filter(i => !revealedCards.has(i));
    
    unrevealed.forEach((cardIndex, i) => {
      setTimeout(() => {
        setRevealedCards(prev => new Set([...prev, cardIndex]));
        
        const player = team[cardIndex];
        if (player.grade === "DEMON_KING" || player.grade === "LEGENDARY") {
          setScreenEffect("flash");
          setTimeout(() => setScreenEffect("shake"), 100);
          setTimeout(() => setScreenEffect("none"), 500);
        }
        
        if (i === unrevealed.length - 1) {
          setIsAutoRevealing(false);
        }
      }, i * 300);
    });
  }, [isAutoRevealing, team, revealedCards]);

  const handleReset = useCallback(() => {
    onReset();
  }, [onReset]);

  useEffect(() => {
    setRevealedCards(new Set());
    setIsExiting(false);
    setScreenEffect("none");
    setIsAutoRevealing(false);
  }, [team]);

  const allRevealed = revealedCards.size >= team.length;
  const teamPower = calculateTeamPower(team);

  const legendaryCount = team.filter((p) => p.grade === "LEGENDARY").length;
  const epicCount = team.filter((p) => p.grade === "EPIC").length;
  const demonKingCount = team.filter((p) => p.grade === "DEMON_KING").length;

  return (
    <div className={`text-center relative ${screenEffect === "shake" ? "animate-screen-shake" : ""}`}>
      {screenEffect === "flash" && (
        <div className="fixed inset-0 bg-yellow-400/30 animate-screen-flash pointer-events-none z-50" />
      )}
      
      <div className="flex gap-4 justify-center flex-wrap mb-6">
        {team.map((player, index) => (
          <PlayerCard
            key={player.id + index}
            player={player}
            revealed={revealedCards.has(index)}
            onClick={() => handleCardClick(index)}
            exiting={isExiting}
          />
        ))}
      </div>

      <div className="h-8 mb-4">
        {!allRevealed ? (
          <p className="text-gray-400 text-sm">
            Tap cards to reveal players! ({revealedCards.size}/{team.length})
          </p>
        ) : (
          <p className="text-2xl font-bold text-white font-[family-name:var(--font-player)]">
            Team Power: {teamPower.toLocaleString()}
            <span className="text-sm text-gray-400 font-normal ml-3">
              {demonKingCount > 0 && `👹 ×${demonKingCount} `}
              {legendaryCount > 0 && `🌟 ×${legendaryCount} `}
              {epicCount > 0 && `💜 ×${epicCount}`}
            </span>
          </p>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        {!allRevealed && revealedCards.size < team.length && (
          <Button
            onClick={handleRevealAll}
            disabled={isAutoRevealing}
            className="px-6 py-3 text-base font-bold text-white rounded-lg
                       bg-slate-700 hover:bg-slate-600
                       hover:scale-105 transition-all duration-200 cursor-pointer 
                       font-[family-name:var(--font-player)]
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reveal All
          </Button>
        )}
        <Button
          onClick={handleReset}
          className="px-8 py-3 text-base font-bold text-slate-900 rounded-lg
                     bg-white hover:bg-gray-100
                     hover:scale-105 hover:shadow-lg hover:shadow-white/20
                     transition-all duration-200 cursor-pointer font-[family-name:var(--font-player)]"
        >
          Pull Again
        </Button>
      </div>
    </div>
  );
}
