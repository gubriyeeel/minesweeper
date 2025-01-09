"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn } from "@/lib/utils";

const TUTORIAL_STEPS = [
  {
    title: "Welcome to Minesweeper!",
    description: "Let's learn how to play this classic game.",
    content: (
      <div className="space-y-4">
        <p>Your goal is to clear all cells without hitting any mines.</p>
        <p>The numbers show how many mines are adjacent to each cell.</p>
      </div>
    ),
  },
  {
    title: "Controls",
    description: "Here's how to interact with the game.",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span>🖱️</span>
          <p>Left click to reveal a cell</p>
        </div>
        <div className="flex items-center gap-2">
          <span>🚩</span>
          <p>Right click to place/remove a flag on suspected mines</p>
        </div>
      </div>
    ),
  },
  {
    title: "Difficulty Levels",
    description: "Choose your challenge.",
    content: (
      <div className="space-y-4">
        <p className="flex items-center gap-2">
          <span>👶</span>
          <span>
            <strong>Easy:</strong> 10% mines - Perfect for beginners
          </span>
        </p>
        <p className="flex items-center gap-2">
          <span>😎</span>
          <span>
            <strong>Medium:</strong> 15% mines - For experienced players
          </span>
        </p>
        <p className="flex items-center gap-2">
          <span>🔥</span>
          <span>
            <strong>Hard:</strong> 20% mines - For the brave
          </span>
        </p>
        <p className="flex items-center gap-2">
          <span>💀</span>
          <span>
            <strong>Impossible:</strong> 25% mines - For true masters
          </span>
        </p>
      </div>
    ),
  },
];

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TutorialDialog({ open, onOpenChange }: TutorialDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("minesweeper-tutorial-completed") === "true";
    }
    return false;
  });
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("minesweeper-tutorial-completed", "true");
    }
    onOpenChange(false);
    setCurrentStep(0);
  };

  const currentTutorial = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const content = (
    <div className="grid gap-4 py-4">
      {currentTutorial.content}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="dont-show"
          checked={dontShowAgain}
          onCheckedChange={(checked) => {
            setDontShowAgain(checked === true);
            if (checked) {
              localStorage.setItem("minesweeper-tutorial-completed", "true");
            } else {
              localStorage.removeItem("minesweeper-tutorial-completed");
            }
          }}
        />
        <label
          htmlFor="dont-show"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Don&apos;t show this again
        </label>
      </div>
      <div className="flex justify-between">
        <div className={cn(currentStep > 0 && "hidden")} />

        <Button
          className={cn(currentStep === 0 && "hidden")}
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button onClick={handleNext}>
          {isLastStep ? "Start Playing" : "Next"}
        </Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentTutorial.title}</DialogTitle>
            <DialogDescription>{currentTutorial.description}</DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{currentTutorial.title}</DrawerTitle>
          <DrawerDescription>{currentTutorial.description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{content}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
