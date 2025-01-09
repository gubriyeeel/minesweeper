"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Difficulty } from "@/hooks/use-minesweeper";

export interface LeaderboardEntry {
  id: string;
  name: string;
  time: number;
  difficulty: Difficulty;
  boardSize: number;
  date: string;
}

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export async function addLeaderboardEntry(
  entry: Omit<LeaderboardEntry, "id" | "date">
) {
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

interface LeaderboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Leaderboard({ open, onOpenChange }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchLeaderboard() {
      if (!open) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/leaderboard?difficulty=${selectedDifficulty}`
        );
        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, [open, selectedDifficulty]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Leaderboard 🏆</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {["easy", "medium", "hard", "impossible"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff as Difficulty)}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedDifficulty === diff
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : entries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Board Size</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-center font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{formatTime(entry.time)}</TableCell>
                    <TableCell>
                      {entry.boardSize}x{entry.boardSize}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Date(entry.date).toLocaleDateString() +
                        ", " +
                        new Date(entry.date).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No scores yet for {selectedDifficulty} difficulty. Keep playing to
              set some records!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
