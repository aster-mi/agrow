import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  return NextResponse.json(await getAllAgaves());
}

async function getAllAgaves() {
  const agaves = await prisma.agave.findMany({
    include: {
      owner: {
        select: {
          name: true, // ownerモデルから名前を選択
        },
      },
    },
  });

  // ownerの名前を含むAgaveデータを返す
  return agaves;
}
