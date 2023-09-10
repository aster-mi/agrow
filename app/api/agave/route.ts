import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AgaveType } from "@/app/type/AgaveType";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json(await registerAgave(body));
}

async function registerAgave(data: AgaveType) {
  const agave = await prisma.agave.create({
    data: {
      name: data.name,
      description: data.description,
      ownerId: 1,
    },
  });
  return agave;
}
