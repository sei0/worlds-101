"use client";

import { Button } from "@base-ui/react/button";

interface GachaButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function GachaButton({ onClick, disabled }: GachaButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`px-12 py-5 text-xl font-bold text-white rounded-xl
                  transition-all duration-200 shadow-lg
                  ${disabled 
                    ? "bg-gray-600 cursor-not-allowed" 
                    : "bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 hover:shadow-pink-500/50 active:scale-95 cursor-pointer"
                  }`}
    >
      🎰 5연차 뽑기!
    </Button>
  );
}
