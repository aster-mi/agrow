import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../../../auth/[...nextauth]/route";
import pup from "@/public/pup.png";

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
  });
}
