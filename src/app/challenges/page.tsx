"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { Player } from "@/types/player";
import { getAllPlayers } from "@/lib/gacha";
import { getCollection } from "@/lib/collection";
import { CHALLENGES } from "@/lib/challenges";

export default function ChallengesPage() {
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const allPlayers = useMemo(() => getAllPlayers(), []);

  useEffect(() => {
    const state = getCollection();
    setCollected(state.collected);
  }, []);

  const challengeStatus = useMemo(() => {
    return CHALLENGES.map((challenge) => ({
      ...challenge,
      completed: challenge.requirement(collected, allPlayers),
      progress: challenge.progress(collected, allPlayers),
    }));
  }, [collected, allPlayers]);

  const completedCount = challengeStatus.filter((c) => c.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-5 py-10">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <Link
            href="/"
            className="text-gray-400 hover:text-white text-sm mb-4 inline-block"
          >
            ← 뽑기로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            드림팀 챌린지
          </h1>
          <p className="text-gray-400 text-sm">
            {completedCount}/{CHALLENGES.length} 챌린지 완료
          </p>
        </header>

        <div className="w-full bg-slate-800 rounded-full h-3 mb-8">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / CHALLENGES.length) * 100}%` }}
          />
        </div>

        <div className="space-y-4">
          {challengeStatus.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-5 rounded-xl border-2 transition-all ${
                challenge.completed
                  ? "bg-slate-800/50 border-yellow-500/50"
                  : "bg-slate-800/30 border-slate-700"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`text-4xl ${
                    challenge.completed ? "" : "grayscale opacity-50"
                  }`}
                >
                  {challenge.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-bold text-lg ${
                        challenge.completed ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      {challenge.name}
                    </h3>
                    {challenge.completed && (
                      <span className="text-green-400 text-sm">✓ 완료</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {challenge.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          challenge.completed
                            ? "bg-yellow-500"
                            : "bg-slate-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            (challenge.progress.current / challenge.progress.total) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-16 text-right">
                      {challenge.progress.current}/{challenge.progress.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
