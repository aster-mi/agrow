import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const agaves = await getAllAgaves();
  return NextResponse.json(agaves);
}

async function getAllAgaves() {
  return await prisma.agave.findMany({
    include: {
      owner: {
        select: {
          name: true, // ownerモデルから名前を選択
        },
      },
    },
  });
}
