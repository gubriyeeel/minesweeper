"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { Difficulty } from "@/hooks/use-minesweeper";
import { Leaderboard } from "./leaderboard";

const getResultMessage = (isWin: boolean, difficulty: Difficulty) => {
  if (isWin) {
    switch (difficulty) {
      case "easy":
        return {
          title: "Baby steps! 👶",
          description:
            "Well done... on the easiest difficulty. Ready to take off the training wheels?",
        };
      case "medium":
        return {
          title: "Not bad! 😎",
          description:
            "You're getting there! Time to step up to the real challenge?",
        };
      case "hard":
        return {
          title: "Impressive! 🔥",
          description:
            "Now we're talking! You've proven you're not just clicking randomly.",
        };
      case "impossible":
        return {
          title: "LEGENDARY! 🏆",
          description:
            "We bow before your minesweeping mastery! Touch grass maybe?",
        };
    }
  } else {
    switch (difficulty) {
      case "easy":
        return {
          title: "Really? 😅",
          description:
            "It's called 'easy' for a reason... Maybe try solitaire?",
        };
      case "medium":
        return {
          title: "Close...ish? 🤔",
          description:
            "Medium difficulty living up to its name. You'll get there!",
        };
      case "hard":
        return {
          title: "Nice try! 💪",
          description:
            "Hard mode claims another victim. At least you had the courage to try!",
        };
      case "impossible":
        return {
          title: "As expected... ☠️",
          description:
            "Did you really think you could beat impossible mode? Adorable.",
        };
    }
  }
};

interface GameResultProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isWin: boolean;
  onNewGame: () => void;
  onMainMenu: () => void;
  difficulty: Difficulty;
  time: number;
}

export function GameResult({
  open,
  onOpenChange,
  isWin,
  onNewGame,
  onMainMenu,
  difficulty,
  time,
}: GameResultProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const resultMessage = getResultMessage(isWin, difficulty);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  function formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const content = (
    <div className="grid gap-4 py-4">
      <div className="flex flex-col items-center gap-4 px-4">
        <div className="text-6xl">{isWin ? "🎉" : "💥"}</div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-semibold text-center">
            {resultMessage.title}
          </h2>
          <p className="text-center text-muted-foreground">
            {resultMessage.description}
          </p>
          {isWin && (
            <p className="text-lg font-mono mt-2">Time: {formatTime(time)}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={onNewGame} variant="secondary">
            Try Again
          </Button>
          <Button onClick={onMainMenu}>Main Menu</Button>
        </div>
        {isWin && (
          <Button
            onClick={() => setShowLeaderboard(true)}
            variant="outline"
            className="mt-2"
          >
            View Leaderboard
          </Button>
        )}
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center"></DialogTitle>
              <DialogDescription className="text-center"></DialogDescription>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>

        <Leaderboard open={showLeaderboard} onOpenChange={setShowLeaderboard} />
      </>
    );
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          {content}
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline" onClick={onMainMenu}>
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Leaderboard open={showLeaderboard} onOpenChange={setShowLeaderboard} />
    </>
  );
}
