import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; image: string } }
) {
  console.log(params);
  const detail = await geImage(params.image);
  return NextResponse.json(detail);
}

async function geImage(image: string) {
  return await prisma.agaveImage.findUniqueOrThrow({
    where: {
      url: "agave/" + image + ".jpg",
    },
    include: {
      agave: true,
    },
  });
}
