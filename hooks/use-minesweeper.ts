"use client";

import { useState, useEffect } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "impossible";

interface GameState {
  board: number[][];
  revealed: boolean[][];
  flagged: boolean[][];
  gameOver: boolean;
  win: boolean;
}

export function getDifficultySettings(difficulty: Difficulty, size: number) {
  const settings = {
    easy: Math.floor(size * size * 0.1), // 10% of cells are mines
    medium: Math.floor(size * size * 0.15), // 15% of cells are mines
    hard: Math.floor(size * size * 0.2), // 20% of cells are mines
    impossible: Math.floor(size * size * 0.25), // 25% of cells are mines
  };
  return settings[difficulty];
}

export function useMinesweeper(size: number, difficulty: Difficulty) {
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    revealed: [],
    flagged: [],
    gameOver: false,
    win: false,
  });

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, difficulty]);

  function initializeGame() {
    const mines = getDifficultySettings(difficulty, size);
    // Create empty board
    const board = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0));
    const revealed = Array(size)
      .fill(null)
      .map(() => Array(size).fill(false));
    const flagged = Array(size)
      .fill(null)
      .map(() => Array(size).fill(false));

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (board[y][x] !== -1) {
        board[y][x] = -1;
        minesPlaced++;
      }
    }

    // Calculate numbers
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (board[y][x] === -1) continue;
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (
              ny >= 0 &&
              ny < size &&
              nx >= 0 &&
              nx < size &&
              board[ny][nx] === -1
            ) {
              count++;
            }
          }
        }
        board[y][x] = count;
      }
    }

    setGameState({
      board,
      revealed,
      flagged,
      gameOver: false,
      win: false,
    });
  }

  function revealCell(y: number, x: number) {
    if (
      gameState.gameOver ||
      gameState.flagged[y][x] ||
      gameState.revealed[y][x]
    )
      return;

    const newRevealed = [...gameState.revealed.map((row) => [...row])];

    if (gameState.board[y][x] === -1) {
      // Hit a mine
      setGameState((prev) => ({
        ...prev,
        revealed: Array(size)
          .fill(null)
          .map(() => Array(size).fill(true)),
        gameOver: true,
      }));
      return;
    }

    function floodFill(y: number, x: number) {
      if (
        y < 0 ||
        y >= size ||
        x < 0 ||
        x >= size ||
        newRevealed[y][x] ||
        gameState.flagged[y][x]
      )
        return;

      newRevealed[y][x] = true;

      if (gameState.board[y][x] === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            floodFill(y + dy, x + dx);
          }
        }
      }
    }

    floodFill(y, x);

    const newState = {
      ...gameState,
      revealed: newRevealed,
    };

    // Check win condition
    let win = true;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (gameState.board[y][x] !== -1 && !newRevealed[y][x]) {
          win = false;
          break;
        }
      }
      if (!win) break;
    }

    if (win) {
      newState.win = true;
      newState.gameOver = true;
    }

    setGameState(newState);
  }

  function toggleFlag(y: number, x: number) {
    if (gameState.gameOver || gameState.revealed[y][x]) return;

    const newFlagged = [...gameState.flagged.map((row) => [...row])];
    newFlagged[y][x] = !newFlagged[y][x];

    setGameState((prev) => ({
      ...prev,
      flagged: newFlagged,
    }));
  }

  return {
    ...gameState,
    initializeGame,
    revealCell,
    toggleFlag,
  };
}
