import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const agaves = await getAgaves(params.slug);
  return NextResponse.json(agaves);
}

async function getAgaves(slug: string) {
  const parent = await prisma.agave.findUniqueOrThrow({
    where: {
      slug: slug,
    },
  });
  return await prisma.agave.findMany({
    where: {
      parentId: parent.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
