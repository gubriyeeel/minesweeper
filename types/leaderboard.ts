import type { Difficulty } from "@/hooks/use-minesweeper";

export interface LeaderboardEntry {
  id: string;
  name: string;
  time: number;
  difficulty: Difficulty;
  boardSize: number;
  date: string;
}

export interface LeaderboardEntryArgs {
  name: string;
  time: number;
  difficulty: Difficulty;
  boardSize: number;
}
