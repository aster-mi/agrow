import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await getServerSession(nextAuthOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id = session.user.id;
  return NextResponse.json(await getRacks(id));
}

async function getRacks(userId: string) {
  const racks = await prisma.rack.findMany({
    where: {
      ownerId: userId,
      deleted: false,
    },
    select: {
      name: true,
      size: true,
      code: true,
      design: true,
      _count: true,
      agaves: {
        select: {
          rackPosition: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
  if (racks.length === 0) {
    return await createFreeRack(userId);
  }
  return racks;
}

async function createFreeRack(userId: string) {
  const rackPlan = await prisma.rackPlan.findFirst({
    where: {
      size: 9,
    },
  });

  if (!rackPlan) {
    throw "bad request";
  }

  const rack = await prisma.rack.create({
    data: {
      name: "お試しラック",
      ownerId: userId,
      rackPlanId: rackPlan.id,
      size: rackPlan.size,
      monthlyFee: rackPlan.monthlyFee,
    },
  });
  return [rack];
}
