import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AgaveType } from "@/app/type/AgaveType";
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
