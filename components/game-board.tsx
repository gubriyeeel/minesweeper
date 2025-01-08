"use client";

import { useEffect, useState } from "react";
import { Cell } from "@/components/cell";
import { Button } from "@/components/ui/button";
import { useMinesweeper, Difficulty } from "@/hooks/use-minesweeper";
import { GameResult } from "./game-result";

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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4 mb-4 items-center">
        <Button
          onClick={handleMainMenu}
          variant="outline"
        >
          Main Menu
        </Button>
      </div>
      <div
        className="grid gap-1 p-4 bg-secondary rounded-lg shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
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
            />
          ))
        )}
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
