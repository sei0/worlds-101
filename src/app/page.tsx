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
    doPull();
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <MeshBackground />
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🎰</div>
          <p className="text-gray-400">Shuffling cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 py-10 relative">
      <MeshBackground />
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-white font-[family-name:var(--font-title)]">
            LOL WORLDS GACHA
          </h1>
          <p className="text-gray-400 text-sm">
            Collect cards from Worlds 2013-2024
          </p>
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <Link
              href="/collection"
              className="text-indigo-400 hover:text-indigo-300 text-sm underline"
            >
              📖 Collection ({collectionSize}/{TOTAL_CARDS})
            </Link>
            <Link
              href="/battle"
              className="text-red-400 hover:text-red-300 text-sm underline"
            >
              ⚔️ Battle
            </Link>
            <Link
              href="/challenges"
              className="text-yellow-400 hover:text-yellow-300 text-sm underline"
            >
              🏆 Challenges
            </Link>
            <span className="text-gray-500 text-sm">
              🎰 {pullCount} Pulls
            </span>
          </div>
        </header>

        <main className="text-center">
          {team && <GachaResult team={team} onReset={handleReset} />}
        </main>

        <footer className="mt-16 text-center text-gray-600 text-xs">
          Data from Leaguepedia • {TOTAL_CARDS} Cards • 2013-2025
          <br />  
          Made with ❤️ by Faker fan Sei
        </footer>
      </div>
    </div>
  );
}
