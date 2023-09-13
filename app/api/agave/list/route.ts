import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await getServerSession(nextAuthOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const publicId = session.user.publicId;

  const agaves = await getAgaves(publicId);
  return NextResponse.json(agaves);
}

async function getAgaves(publicId: string) {
  return await prisma.user.findUnique({
    select: {
      ownedAgaves: {
        select: {
          name: true,
          description: true,
          slug: true,
        },
      },
      name: true,
      publicId: true,
    },
    where: {
      publicId: publicId,
    },
  });
}
