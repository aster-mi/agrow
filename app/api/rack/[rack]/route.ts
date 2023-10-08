import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { rack: string } }
) {
  const session = await getServerSession(nextAuthOptions);
  return NextResponse.json(await getRack(params.rack));
}

async function getRack(rackCode: string) {
  return await prisma.rack.findUniqueOrThrow({
    where: {
      code: rackCode,
      deleted: false,
    },
    include: {
      agaves: true,
    },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { rack: string } }
) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = session.user.id;
  const body = await request.json();
  return NextResponse.json(await updateRack(params.rack, body, id));
}

async function updateRack(rackCode: string, body: any, userId: string) {
  return await prisma.rack.update({
    where: {
      code: rackCode,
      ownerId: userId,
    },
    data: {
      ...body,
    },
  });
}
