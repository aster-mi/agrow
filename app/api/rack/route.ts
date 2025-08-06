import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AgaveType } from "@/app/type/AgaveType";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../auth/[...nextauth]/route";
import { RackPlanType } from "@/app/type/RackPlanType";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = session.user.id;
  const body = await request.json();
  return NextResponse.json(await registerAgave(body, id));
}

async function registerAgave(rackPlanId: number, userId: string) {
  // TODO stripe実装まではadmin以外は登録できないようにする
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      isAdmin: true,
    },
  });
  if (!user.isAdmin) {
    throw "bad request";
  }

  if (!rackPlanId || !userId) {
    throw "bad request";
  }
  const rackPlan = await prisma.rackPlan.findUniqueOrThrow({
    where: {
      id: rackPlanId,
    },
    select: {
      name: true,
      size: true,
      monthlyFee: true,
      _count: true,
    },
  });

  // TODO free trial check

  const rack = await prisma.rack.create({
    data: {
      name: rackPlan.name + (rackPlan._count.racks + 1),
      ownerId: userId,
      rackPlanId: rackPlanId,
      size: rackPlan.size,
      monthlyFee: rackPlan.monthlyFee,
    },
  });
  return rack.code;
}
