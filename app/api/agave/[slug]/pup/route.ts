import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ChangeEvent } from "react";
const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const agaves = await getAgavesByParentSlug(params.slug);
  return NextResponse.json(agaves);
}

async function getAgavesByParentSlug(slug: string) {
  return await prisma.agave.findUniqueOrThrow({
    where: {
      slug: slug,
    },
    select: {
      pups: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}
