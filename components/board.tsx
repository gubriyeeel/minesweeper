"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { Difficulty } from "@/hooks/use-minesweeper";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { formatTime } from "@/lib/utils";

interface BoardProps {
  selectedDifficulty: Difficulty;
  setSelectedDifficulty: (difficulty: Difficulty) => void;
  selectedSize: number;
  setSelectedSize: (size: number) => void;
  entries: LeaderboardEntry[];
  isLoading: boolean;
}

export function Board({
  selectedDifficulty,
  setSelectedDifficulty,
  selectedSize,
  setSelectedSize,
  entries,
  isLoading,
}: BoardProps) {
  const boardSizes = [8, 10, 12, 16];
  const difficulties: Difficulty[] = ["easy", "medium", "hard", "impossible"];

  return (
    <>
      <Card className="border-none">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-sm font-medium">Filters</CardTitle>
          <CardDescription>
            Select difficulty and board size to view scores
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 p-0">
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedDifficulty === diff
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary hover:bg-secondary/80 hover:shadow-sm"
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Board Size</label>
            <div className="flex flex-wrap gap-2">
              {boardSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary hover:bg-secondary/80 hover:shadow-sm"
                  }`}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 border-none">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-sm font-medium">
            Top 10 Scores -{" "}
            {selectedDifficulty.charAt(0).toUpperCase() +
              selectedDifficulty.slice(1)}{" "}
            ({selectedSize}x{selectedSize})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px] pr-4">
            {isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-6 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[60px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-[140px] ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : entries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry, index) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-center font-medium">
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : "#" + (index + 1)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.name}
                      </TableCell>
                      <TableCell>{formatTime(entry.time)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString() +
                          ", " +
                          new Date(entry.date).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No scores yet for this board. Time to set some records! 🎮
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
