import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AgaveType } from "@/app/type/AgaveType";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = session.user.id;
  const body = await request.json();
  return NextResponse.json(await registerAgave(body, id));
}

async function registerAgave(data: AgaveType, id: string) {
  if (!data.images) {
    throw "image is required.";
  }
  const agave = await prisma.agave.findUniqueOrThrow({
    where: {
      id: data.id,
      ownerId: id,
    },
  });
  for (const image of data.images) {
    await prisma.agaveImage.create({
      data: {
        url: image,
        agaveId: agave.id,
      },
    });
  }
  return agave;
}

async function authorized(userId: string, agaveId: number) {}
