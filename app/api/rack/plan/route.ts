import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AgaveType } from "@/app/type/AgaveType";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await getServerSession(nextAuthOptions);
  return NextResponse.json(await getRackPlans());
}

async function getRackPlans() {
  return await prisma.rackPlan.findMany({});
}
