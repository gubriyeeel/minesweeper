"use client";

import { useEffect, useState, useRef } from "react";
import { Cell } from "@/components/cell";
import { Button } from "@/components/ui/button";
import { useMinesweeper, Difficulty } from "@/hooks/use-minesweeper";
import { GameResult } from "./game-result";
import { cn } from "@/lib/utils";
import { addLeaderboardEntry } from "@/actions/leaderboard";

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

  const [showResult, setShowResult] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>(null);

  // Start timer on first move
  useEffect(() => {
    const hasStarted = revealed.some((row) => row.some((cell) => cell));
    if (hasStarted && !gameOver && !isPlaying) {
      setIsPlaying(true);
    }
  }, [revealed, gameOver, isPlaying]);

  // Handle timer
  useEffect(() => {
    if (isPlaying && !gameOver) {
      timerRef.current = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, gameOver]);

  // Show dialog when game ends
  useEffect(() => {
    if (gameOver) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // If won, add to leaderboard
      if (win) {
        const playerName =
          localStorage.getItem("minesweeper-player-name") || "Anonymous";
        addLeaderboardEntry({
          name: playerName,
          time: gameTime,
          difficulty,
          boardSize: size,
        });
      }

      const timer = setTimeout(() => {
        setShowResult(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameOver, win, gameTime, difficulty, size]);

  const handleNewGame = () => {
    setShowResult(false);
    setGameTime(0);
    setIsPlaying(false);
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

  function formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  return (
    <div
      className={cn("flex flex-col items-center gap-4 w-full", getMaxWidth())}
    >
      <div className="flex justify-between w-full items-center">
        <Button onClick={handleMainMenu} variant="outline">
          Main Menu
        </Button>
        <div className="text-lg font-mono">{formatTime(gameTime)}</div>
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
        time={gameTime}
      />
    </div>
  );
}
