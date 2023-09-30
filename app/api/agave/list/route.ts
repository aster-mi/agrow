import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await getServerSession(nextAuthOptions);
  const publicId = session!.user!.publicId;
  const agaves = await getAgaves(publicId);
  return NextResponse.json(agaves);
}

async function getAgaves(publicId: string) {
  const result = await prisma.user.findUnique({
    select: {
      ownedAgaves: {
        orderBy: [
          {
            createdAt: "asc",
          },
        ],
        where: {
          deleted: false,
        },
        select: {
          name: true,
          description: true,
          slug: true,
          iconUrl: true,
        },
      },
      name: true,
      publicId: true,
    },
    where: {
      publicId: publicId,
    },
  });
  return result;
}
