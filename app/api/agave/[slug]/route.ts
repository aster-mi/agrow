import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const agave = await getAgave(params.slug);
  return NextResponse.json(agave);
}

async function getAgave(slug: string) {
  const agave = await prisma.agave.findUnique({
    where: {
      slug: slug,
    },
    include: {
      owner: {
        select: {
          name: true,
        },
      },
      tags: true,
      agaveImages: true,
      children: true,
      qrCode: true,
      parent: true,
    },
  });
  return agave;
}
