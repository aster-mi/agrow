import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await getServerSession(nextAuthOptions);
  const id = session!.user!.id;
  const agaves = await getAgaves(id);
  return NextResponse.json(agaves);
}

async function getAgaves(id: string) {
  const result = await prisma.user.findUniqueOrThrow({
    select: {
      ownedAgaves: {
        orderBy: [
          {
            rackPosition: "desc",
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
          rack: true,
        },
      },
      name: true,
      publicId: true,
    },
    where: {
      id: id,
    },
  });
  return result;
}
