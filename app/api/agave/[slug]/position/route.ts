import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = session.user.id;
  const body = await request.json();
  return NextResponse.json(
    await updatePosition(params.slug, id, body.rackCode, body.rackPosition)
  );
}

async function updatePosition(
  slug: string,
  id: string,
  rackCode: string,
  rackPosition: number
) {
  if (!rackCode || !rackPosition) {
    throw new Error("Param not found");
  }
  const deletedAgave = await prisma.agave.update({
    where: {
      slug: slug,
      ownerId: id,
    },
    data: {
      rackCode: rackCode,
      rackPosition: rackPosition,
    },
  });
  if (!deletedAgave) {
    throw new Error("Agave not found");
  }
  return deletedAgave;
}
