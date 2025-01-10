import type {
  LeaderboardEntry,
  LeaderboardEntryArgs,
} from "@/types/leaderboard";
import type { Difficulty } from "@/hooks/use-minesweeper";

export async function getLeaderboard(
  difficulty: Difficulty,
  boardSize: number
): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch(
      `/api/leaderboard?difficulty=${difficulty}&boardSize=${boardSize}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

export async function addLeaderboardEntry(
  entry: LeaderboardEntryArgs
): Promise<LeaderboardEntry | null> {
  try {
    const response = await fetch("/api/leaderboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error("Failed to add leaderboard entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding leaderboard entry:", error);
    return null;
  }
}
