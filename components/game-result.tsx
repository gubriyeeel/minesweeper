"use client";

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

const getResultMessage = (isWin: boolean, difficulty: Difficulty) => {
  if (isWin) {
    switch (difficulty) {
      case "easy":
        return {
          title: "Baby Steps! 👶",
          description:
            "Well done... on the easiest difficulty. Ready to take off the training wheels?",
        };
      case "medium":
        return {
          title: "Not Bad! 😎",
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
            "It's called 'Easy' for a reason... Maybe try Solitaire?",
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
}

export function GameResult({
  open,
  onOpenChange,
  isWin,
  onNewGame,
  onMainMenu,
  difficulty,
}: GameResultProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const resultMessage = getResultMessage(isWin, difficulty);

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
        </div>
        <div className="flex gap-2">
          <Button onClick={onNewGame} variant="secondary">
            Try Again
          </Button>
          <Button onClick={onMainMenu}>Main Menu</Button>
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center"></DialogTitle>
            <DialogDescription className="text-center"></DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
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
  );
}
