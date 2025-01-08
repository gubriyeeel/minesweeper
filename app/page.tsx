"use client";

import { useState, useEffect } from "react";
import { GameBoard } from "@/components/game-board";
import type { Difficulty } from "@/hooks/use-minesweeper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TutorialDialog } from "@/components/tutorial-dialog";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [size, setSize] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if the user has completed the tutorial before
    const tutorialCompleted = localStorage.getItem(
      "minesweeper-tutorial-completed"
    );
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <ThemeToggle />

        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-4xl text-center">Minesweeper</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Board Size</label>
              <Select
                value={size.toString()}
                onValueChange={(value) => setSize(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select board size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">Small (8x8)</SelectItem>
                  <SelectItem value="10">Medium (10x10)</SelectItem>
                  <SelectItem value="12">Large (12x12)</SelectItem>
                  <SelectItem value="16">Extra Large (16x16)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select
                value={difficulty}
                onValueChange={(value) => setDifficulty(value as Difficulty)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="impossible">Impossible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setGameStarted(true)}
                className="w-full"
                size="lg"
              >
                Start Game
              </Button>
              <Button
                onClick={() => setShowTutorial(true)}
                variant="outline"
                className="w-full"
              >
                How to Play
              </Button>
            </div>
          </CardContent>
        </Card>

        <TutorialDialog open={showTutorial} onOpenChange={setShowTutorial} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <GameBoard
        size={size}
        difficulty={difficulty}
        onNewGame={() => setGameStarted(false)}
      />
    </div>
  );
}
