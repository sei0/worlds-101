"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Player } from "@/types/player";
import { pullGacha, getAllCards } from "@/lib/gacha";
import { addToCollection, getCollection } from "@/lib/collection";
import { GachaResult } from "@/components/GachaResult";
import { MeshBackground } from "@/components/MeshBackground";

const TOTAL_CARDS = getAllCards().length;

export default function Home() {
  const [team, setTeam] = useState<Player[] | null>(null);
  const [collectionSize, setCollectionSize] = useState(0);
  const [pullCount, setPullCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const doPull = useCallback(() => {
    const newTeam = pullGacha();
    const state = addToCollection(newTeam);
    setCollectionSize(state.collected.size);
    setPullCount(state.pullCount);
    setTeam(newTeam);
  }, []);

  useEffect(() => {
    const state = getCollection();
    setCollectionSize(state.collected.size);
    setPullCount(state.pullCount);
    
    doPull();
    setIsInitialized(true);
  }, [doPull]);

  const handleReset = () => {
    setTeam(null);
    setTimeout(() => doPull(), 100);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <MeshBackground />
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🎰</div>
          <p className="text-gray-400">카드를 섞는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 py-10 relative">
      <MeshBackground />
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-white">
            LoL Worlds Gacha
          </h1>
          <p className="text-gray-400 text-sm">
            2013-2024 월드 챔피언십 역대 선수 가챠
          </p>
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <Link
              href="/collection"
              className="text-indigo-400 hover:text-indigo-300 text-sm underline"
            >
              📖 도감 ({collectionSize}/{TOTAL_CARDS})
            </Link>
            <Link
              href="/battle"
              className="text-red-400 hover:text-red-300 text-sm underline"
            >
              ⚔️ 배틀
            </Link>
            <Link
              href="/challenges"
              className="text-yellow-400 hover:text-yellow-300 text-sm underline"
            >
              🏆 챌린지
            </Link>
            <span className="text-gray-500 text-sm">
              🎰 {pullCount}회 뽑기
            </span>
          </div>
        </header>

        <main className="text-center">
          {team && <GachaResult team={team} onReset={handleReset} />}
        </main>

        <footer className="mt-16 text-center text-gray-600 text-xs">
          Data from Leaguepedia • {TOTAL_CARDS} Cards • 2013-2025
        </footer>
      </div>
    </div>
  );
}
