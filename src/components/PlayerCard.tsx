"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Player } from "@/types/player";
import { POSITION_LABELS } from "@/types/player";
import { getLatestTeamLogo } from "@/data/team-logos";

interface PlayerCardProps {
  player: Player;
  revealed?: boolean;
  onClick?: () => void;
}

const gradeStyles: Record<string, string> = {
  LEGENDARY: "border-yellow-400 shadow-yellow-400/50",
  EPIC: "border-purple-500 shadow-purple-500/50",
  RARE: "border-blue-500 shadow-blue-500/50",
  UNCOMMON: "border-green-500 shadow-green-500/50",
  COMMON: "border-gray-400 shadow-gray-400/30",
};

const gradeTextColors: Record<string, string> = {
  LEGENDARY: "text-yellow-400",
  EPIC: "text-purple-500",
  RARE: "text-blue-500",
  UNCOMMON: "text-green-500",
  COMMON: "text-gray-400",
};

const gradeGlowColors: Record<string, string> = {
  LEGENDARY: "shadow-yellow-400/60",
  EPIC: "shadow-purple-500/60",
  RARE: "shadow-blue-500/60",
  UNCOMMON: "shadow-green-500/60",
  COMMON: "shadow-gray-400/40",
};

export function PlayerCard({ player, revealed = true, onClick }: PlayerCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [showFront, setShowFront] = useState(revealed);

  useEffect(() => {
    if (revealed && !showFront) {
      setIsFlipping(true);
      setTimeout(() => setShowFront(true), 150);
      setTimeout(() => setIsFlipping(false), 400);
    }
  }, [revealed, showFront]);

  const handleClick = () => {
    if (revealed || isFlipping || !onClick) return;
    
    setIsFlipping(true);
    onClick();
    
    setTimeout(() => setShowFront(true), 150);
    setTimeout(() => setIsFlipping(false), 400);
  };

  const borderStyle = gradeStyles[player.grade] || gradeStyles.COMMON;
  const textColor = gradeTextColors[player.grade] || gradeTextColors.COMMON;
  const glowColor = gradeGlowColors[player.grade] || gradeGlowColors.COMMON;
  const teamLogo = getLatestTeamLogo(player.teams);

  return (
    <div
      className="perspective-1000"
      style={{ perspective: "1000px" }}
    >
      <div
        onClick={handleClick}
        className={`
          w-40 h-56 relative cursor-pointer
          transition-transform duration-400 ease-out
          ${isFlipping ? "animate-flip" : ""}
          ${!revealed && !isFlipping ? "hover:scale-105 hover:-translate-y-1" : ""}
        `}
        style={{
          transformStyle: "preserve-3d",
          transform: showFront ? "rotateY(0deg)" : "rotateY(180deg)",
          transition: "transform 0.4s ease-out",
        }}
      >
        <div
          className={`
            absolute inset-0 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 
            border-2 ${borderStyle} shadow-lg p-4 flex flex-col
            transition-shadow duration-300
            ${showFront ? `shadow-xl ${glowColor}` : ""}
          `}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`text-[10px] font-bold uppercase ${textColor}`}>
              {player.grade}
            </span>
            <span className="text-[10px] text-gray-400 bg-slate-700 px-1.5 py-0.5 rounded">
              {POSITION_LABELS[player.position]}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {teamLogo ? (
              <Image
                src={teamLogo}
                alt={player.teams[player.teams.length - 1]}
                width={48}
                height={48}
                className="object-contain"
              />
            ) : (
              <span className="text-4xl">🎮</span>
            )}
          </div>

          <div className="text-center">
            <div className="text-sm font-bold text-white mb-1 truncate">
              {player.name}
            </div>
            <div className="text-[10px] text-gray-400">
              {player.stats.championships > 0 && `🏆×${player.stats.championships} `}
              {player.stats.appearances}회 출전
            </div>
          </div>

          <div className="mt-1.5 text-[10px] text-gray-500 text-center truncate">
            {player.teams.slice(0, 2).join(", ")}
            {player.teams.length > 2 && ` +${player.teams.length - 2}`}
          </div>
        </div>

        <div
          className="
            absolute inset-0 rounded-xl 
            bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900
            border-2 border-indigo-500/50 
            flex items-center justify-center
            shadow-lg shadow-indigo-500/20
          "
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-center">
            <div className="text-5xl mb-2 animate-pulse">❓</div>
            <div className="text-xs text-indigo-300/70">탭하여 공개</div>
          </div>
          <div className="absolute inset-2 border border-indigo-400/20 rounded-lg pointer-events-none" />
          <div className="absolute inset-4 border border-indigo-400/10 rounded-md pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
