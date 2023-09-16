import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AgaveType } from "@/app/type/AgaveType";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../auth/[...nextauth]/route";

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
  if (!data.name) {
    throw "name is required.";
  }
  const agave = await prisma.agave.create({
    data: {
      name: data.name,
      description: data.description,
      ownerId: id,
      parentId: data.parentId,
    },
  });
  return agave;
}
