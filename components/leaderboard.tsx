"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";

import { Trophy } from "lucide-react";
import type { Difficulty } from "@/hooks/use-minesweeper";
import { Board } from "@/components/board";
import { getLeaderboard } from "@/actions/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";

interface LeaderboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Leaderboard({ open, onOpenChange }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");
  const [selectedSize, setSelectedSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    async function fetchLeaderboard() {
      if (!open) return;

      setIsLoading(true);
      try {
        const data = await getLeaderboard(selectedDifficulty, selectedSize);
        setEntries(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, [open, selectedDifficulty, selectedSize]);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Leaderboard
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4">
            <Board
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              entries={entries}
              isLoading={isLoading}
            />
          </div>
          <DrawerFooter className="pt-2">
            <button
              onClick={() => onOpenChange(false)}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Close
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Leaderboard
          </DialogTitle>
        </DialogHeader>
        <Board
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          entries={entries}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
