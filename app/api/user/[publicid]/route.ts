import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { publicid: string } }
) {
  const session = await getServerSession(nextAuthOptions);
  return NextResponse.json(await getUser(params.publicid));
}

async function getUser(publicId: string) {
  return await prisma.user.findUnique({
    where: {
      publicId: publicId,
    },
    select: {
      id: true,
      name: true,
      publicId: true,
      image: true,
    },
  });
}
