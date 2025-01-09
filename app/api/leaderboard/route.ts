import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { z } from "zod";

const LeaderboardEntrySchema = z.object({
  name: z.string().min(1),
  time: z.number().min(0),
  difficulty: z.enum(["easy", "medium", "hard", "impossible"]),
  boardSize: z.number().min(8).max(16),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");

    const entries = await prisma.leaderboard.findMany({
      where: difficulty ? { difficulty } : undefined,
      orderBy: { time: "asc" },
      take: 10,
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = LeaderboardEntrySchema.parse(body);

    const entry = await prisma.leaderboard.create({
      data: {
        ...validatedData,
        date: new Date(),
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error creating leaderboard entry:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data format", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create leaderboard entry" },
      { status: 500 }
    );
  }
}
