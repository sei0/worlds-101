"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Player } from "@/types/player";
import { POSITION_LABELS } from "@/types/player";
import { getTeamLogo } from "@/data/team-logos";
import { playCardFlip, playCardReveal } from "@/lib/audio";

interface PlayerCardProps {
  player: Player;
  revealed?: boolean;
  onClick?: () => void;
}

const gradeStyles: Record<string, string> = {
  DEMON_KING: "border-red-500 shadow-red-500/70",
  LEGENDARY: "border-yellow-400 shadow-yellow-400/50",
  EPIC: "border-purple-500 shadow-purple-500/50",
  RARE: "border-blue-500 shadow-blue-500/50",
  UNCOMMON: "border-green-500 shadow-green-500/50",
  COMMON: "border-gray-400 shadow-gray-400/30",
};

const gradeTextColors: Record<string, string> = {
  DEMON_KING: "text-red-500",
  LEGENDARY: "text-yellow-400",
  EPIC: "text-purple-500",
  RARE: "text-blue-500",
  UNCOMMON: "text-green-500",
  COMMON: "text-gray-400",
};

const gradeGlowColors: Record<string, string> = {
  DEMON_KING: "shadow-red-500/80",
  LEGENDARY: "shadow-yellow-400/60",
  EPIC: "shadow-purple-500/60",
  RARE: "shadow-blue-500/60",
  UNCOMMON: "shadow-green-500/60",
  COMMON: "shadow-gray-400/40",
};

const RESULT_DISPLAY: Record<string, string> = {
  "Champion": "🏆",
  "Runner-up": "🥈",
  "Semifinals": "🥉",
  "Quarterfinals": "QF",
  "Group Stage": "Groups",
};

interface RevealEffect {
  show: boolean;
  grade: string;
}

const getRevealEffectClass = (grade: string): string => {
  switch (grade) {
    case "DEMON_KING": return "animate-demon-burst";
    case "LEGENDARY": return "animate-legendary-burst";
    case "EPIC": return "animate-epic-glow";
    case "RARE": return "animate-rare-shimmer";
    default: return "";
  }
};

const shouldShowEffect = (grade: string): boolean => {
  return ["DEMON_KING", "LEGENDARY", "EPIC", "RARE"].includes(grade);
};

export function PlayerCard({ player, revealed = true, onClick, exiting = false }: PlayerCardProps & { exiting?: boolean }) {
  const [cardState, setCardState] = useState<"hidden" | "flipping" | "revealed">(() => 
    revealed ? "revealed" : "hidden"
  );
  const [revealEffect, setRevealEffect] = useState<RevealEffect>({ show: false, grade: "" });

  const isDemonKing = player.grade === "DEMON_KING";
  const isLegendary = player.grade === "LEGENDARY";
  const isRevealed = cardState === "revealed";

  useEffect(() => {
    setCardState(revealed ? "revealed" : "hidden");
    setRevealEffect({ show: false, grade: "" });
  }, [player.id, revealed]);

  useEffect(() => {
    if (revealed && cardState === "hidden") {
      setCardState("flipping");
    }
  }, [revealed, cardState]);

  useEffect(() => {
    if (cardState === "flipping") {
      playCardFlip();
      
      const timer = setTimeout(() => {
        setCardState("revealed");
        playCardReveal(player.grade);
        
        if (shouldShowEffect(player.grade)) {
          setRevealEffect({ show: true, grade: player.grade });
          setTimeout(() => setRevealEffect({ show: false, grade: "" }), 800);
          
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            if (player.grade === "DEMON_KING") {
              navigator.vibrate([50, 30, 100, 30, 50]);
            } else if (player.grade === "LEGENDARY") {
              navigator.vibrate([40, 20, 80]);
            } else if (player.grade === "EPIC") {
              navigator.vibrate([30, 20, 50]);
            } else {
              navigator.vibrate(20);
            }
          }
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [cardState, player.grade]);

  const handleClick = () => {
    if (cardState !== "hidden" || !onClick) return;
    
    setCardState("flipping");
    onClick();
    
    setTimeout(() => {
      setCardState("revealed");
      if (shouldShowEffect(player.grade)) {
        setRevealEffect({ show: true, grade: player.grade });
        setTimeout(() => setRevealEffect({ show: false, grade: "" }), 800);
      }
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const borderStyle = gradeStyles[player.grade] || gradeStyles.COMMON;
  const textColor = gradeTextColors[player.grade] || gradeTextColors.COMMON;
  const glowColor = gradeGlowColors[player.grade] || gradeGlowColors.COMMON;
  const teamLogo = getTeamLogo(player.team);

  return (
    <div
      className={`perspective-1000 relative ${exiting ? "animate-card-exit" : ""}`}
      style={{ perspective: "1000px" }}
    >
      {revealEffect.show && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className={`absolute inset-0 ${getRevealEffectClass(revealEffect.grade)} rounded-xl`} />
          {(isDemonKing || isLegendary) && (
            <>
              <div className={`absolute inset-[-20px] animate-demon-ring rounded-full border-4 ${isDemonKing ? "border-red-500/60" : "border-yellow-400/60"}`} />
              <div className={`absolute inset-[-40px] animate-demon-ring-delay rounded-full border-2 ${isDemonKing ? "border-red-400/40" : "border-yellow-300/40"}`} />
            </>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          w-full h-[84px] sm:w-40 sm:h-56 relative cursor-pointer bg-transparent border-none p-0
          transition-transform duration-300 ease-out
          ${cardState === "hidden" ? "hover:scale-[1.02] sm:hover:scale-105 sm:hover:-translate-y-1" : ""}
        `}
        style={{
          transformStyle: "preserve-3d",
          transform: isRevealed ? "rotateY(0deg)" : "rotateY(180deg)",
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Front - Mobile (Horizontal) */}
        <div
          className={`
            absolute inset-0 rounded-2xl sm:hidden overflow-hidden
            ${isDemonKing 
              ? "bg-gradient-to-br from-red-950 via-slate-900 to-red-950 border-2" 
              : "bg-gradient-to-br from-slate-900 to-slate-800 border-2"
            }
            ${borderStyle} shadow-lg
            transition-shadow duration-300
            ${isRevealed ? `shadow-xl ${glowColor}` : "opacity-0"}
            ${isDemonKing && isRevealed ? "animate-udk-glow" : ""}
          `}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
          
          <div className="relative h-full px-4 py-3 flex flex-row items-center gap-3">
            <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-800/50">
              {teamLogo ? (
                <Image
                  src={teamLogo}
                  alt={player.team}
                  width={44}
                  height={44}
                  className="object-contain"
                />
              ) : (
                <span className="text-3xl">🎮</span>
              )}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="text-[20px] font-bold text-white truncate font-[family-name:var(--font-player)] leading-tight tracking-tight">
                {player.name}
              </div>
              <div className="text-[12px] text-gray-400 truncate mt-0.5">
                {player.team} · {player.year} · {RESULT_DISPLAY[player.result] || player.result}
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                isDemonKing ? "bg-red-500/20 text-red-400" :
                isLegendary ? "bg-yellow-500/20 text-yellow-400" :
                player.grade === "EPIC" ? "bg-purple-500/20 text-purple-400" :
                player.grade === "RARE" ? "bg-blue-500/20 text-blue-400" :
                player.grade === "UNCOMMON" ? "bg-green-500/20 text-green-400" :
                "bg-gray-500/20 text-gray-400"
              }`}>
                {isDemonKing ? "👹 DEMON" : player.grade}
              </span>
              <span className="text-[10px] text-gray-500">
                {POSITION_LABELS[player.position]} · {player.score}pt
              </span>
            </div>
          </div>
        </div>

        {/* Front - Desktop (Vertical) */}
        <div
          className={`
            absolute inset-0 rounded-xl hidden sm:flex
            ${isDemonKing 
              ? "bg-gradient-to-br from-red-950 via-slate-900 to-red-950 border-3" 
              : "bg-gradient-to-br from-slate-900 to-slate-800 border-2"
            }
            ${borderStyle} shadow-lg p-4 flex-col
            transition-shadow duration-300
            ${isRevealed ? `shadow-xl ${glowColor}` : "opacity-0"}
            ${isDemonKing && isRevealed ? "animate-udk-glow" : isRevealed ? "animate-card-front-idle" : ""}
          `}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
              isDemonKing ? "bg-red-500/20 text-red-400" :
              isLegendary ? "bg-yellow-500/20 text-yellow-400" :
              player.grade === "EPIC" ? "bg-purple-500/20 text-purple-400" :
              player.grade === "RARE" ? "bg-blue-500/20 text-blue-400" :
              player.grade === "UNCOMMON" ? "bg-green-500/20 text-green-400" :
              "bg-gray-500/20 text-gray-400"
            }`}>
              {isDemonKing ? "👹 DEMON" : player.grade}
            </span>
            <span className="text-[10px] text-gray-500">
              {POSITION_LABELS[player.position]}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {teamLogo ? (
              <Image
                src={teamLogo}
                alt={player.team}
                width={48}
                height={48}
                className="object-contain"
              />
            ) : (
              <span className="text-4xl">🎮</span>
            )}
          </div>

          <div className="text-center">
            <div className="text-[20px] font-bold text-white truncate font-[family-name:var(--font-player)]">
              {player.name}
            </div>
            <div className="text-[12px] text-gray-400 truncate">
              {player.team} · {player.year}
            </div>
          </div>

          <div className="mt-1.5 text-center">
            <span className="text-[10px] text-gray-500">
              {RESULT_DISPLAY[player.result] || player.result} · {player.score}pt
            </span>
          </div>
        </div>

        {/* Back - Mobile (Horizontal) */}
        <div
          className={`
            absolute inset-0 rounded-2xl sm:hidden overflow-hidden
            bg-gradient-to-br from-blue-950 via-blue-900 to-slate-950
            border-2 border-blue-500/40
            flex items-center justify-center gap-4
            shadow-lg shadow-blue-500/20
            ${cardState === "hidden" ? "animate-card-idle-horizontal" : ""}
          `}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="absolute inset-2 border border-blue-400/20 rounded-xl pointer-events-none" />
          <div className="absolute inset-4 border border-blue-400/10 rounded-lg pointer-events-none" />
          
          <div className="relative flex items-center gap-3">
            <Image
              src="/summoner.svg"
              alt="Summoner"
              width={28}
              height={28}
              className="opacity-60"
              style={{ filter: "invert(1) brightness(0.7) sepia(1) hue-rotate(180deg) saturate(3)" }}
            />
            <div className="text-xs text-blue-300/70 tracking-wide">Tap to Open</div>
          </div>
        </div>

        {/* Back - Desktop (Vertical) */}
        <div
          className={`
            absolute inset-0 rounded-xl hidden sm:flex
            bg-gradient-to-br from-blue-950 via-blue-900 to-slate-950
            border-2 border-blue-500/40 
            items-center justify-center
            shadow-lg shadow-blue-500/20
            ${cardState === "hidden" ? "animate-card-idle" : ""}
          `}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-center">
            <Image
              src="/summoner.svg"
              alt="Summoner"
              width={56}
              height={56}
              className="mx-auto mb-2 opacity-60"
              style={{ filter: "invert(1) brightness(0.7) sepia(1) hue-rotate(180deg) saturate(3)" }}
            />
            <div className="text-xs text-blue-300/70">Tap to Open</div>
          </div>
          <div className="absolute inset-2 border border-blue-400/20 rounded-lg pointer-events-none" />
          <div className="absolute inset-4 border border-blue-400/10 rounded-md pointer-events-none" />
        </div>
      </button>
    </div>
  );
}
