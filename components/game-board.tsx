"use client";

import { useEffect, useState } from "react";
import { Cell } from "@/components/cell";
import { Button } from "@/components/ui/button";
import { useMinesweeper, Difficulty } from "@/hooks/use-minesweeper";
import { GameResult } from "./game-result";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  size: number;
  difficulty: Difficulty;
  onNewGame: () => void;
}

export function GameBoard({ size, difficulty, onNewGame }: GameBoardProps) {
  const {
    board,
    revealed,
    flagged,
    gameOver,
    win,
    initializeGame,
    revealCell,
    toggleFlag,
  } = useMinesweeper(size, difficulty);

  // Show dialog when game ends
  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        setShowResult(true);
      }, 500); // Small delay to show the final board state
      return () => clearTimeout(timer);
    }
  }, [gameOver]);

  const [showResult, setShowResult] = useState(false);

  const handleNewGame = () => {
    setShowResult(false);
    initializeGame();
  };

  const handleMainMenu = () => {
    setShowResult(false);
    onNewGame();
  };

  // Calculate gap size based on board size
  const gapSize = size <= 10 ? "1%" : "0.5%";

  // Calculate max width based on board size
  const getMaxWidth = () => {
    if (size <= 10) return "max-w-[400px]";
    if (size <= 12) return "max-w-[500px]";
    return "max-w-[600px]";
  };

  return (
    <div className={cn("flex flex-col items-center gap-4 w-full", getMaxWidth())}>
      <div className="flex gap-4 mb-4 items-center">
        <Button onClick={handleMainMenu} variant="outline">
          Main Menu
        </Button>
      </div>

      <div className="w-full aspect-square relative">
        <div className="absolute inset-0 bg-secondary rounded-lg shadow-lg p-1.5">
          <div
            className="grid h-full"
            style={{
              gridTemplateColumns: `repeat(${size}, 1fr)`,
              gap: gapSize,
            }}
          >
            {board.map((row, y) =>
              row.map((cell, x) => (
                <Cell
                  key={`${y}-${x}`}
                  value={cell}
                  revealed={revealed[y][x]}
                  flagged={flagged[y][x]}
                  onReveal={() => revealCell(y, x)}
                  onFlag={(e) => {
                    e.preventDefault();
                    toggleFlag(y, x);
                  }}
                  size={size}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <GameResult
        open={showResult}
        onOpenChange={setShowResult}
        isWin={win}
        onNewGame={handleNewGame}
        onMainMenu={handleMainMenu}
        difficulty={difficulty}
      />
    </div>
  );
}
