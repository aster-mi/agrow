import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await getServerSession(nextAuthOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id = session.user.id;
  return NextResponse.json(await getRacks(id));
}

async function getRacks(userId: string) {
  const racks = await prisma.rack.findMany({
    where: {
      ownerId: userId,
      deleted: false,
    },
    select: {
      name: true,
      size: true,
      code: true,
      design: true,
      _count: true,
      agaves: {
        select: {
          rackPosition: true,
        },
      },
    },
  });
  return racks;
}
