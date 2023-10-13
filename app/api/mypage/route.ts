import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = session.user.id;
  const body = await request.json();
  const user = await updateUser(body, id);
  return NextResponse.json(user);
}

async function updateUser(body: any, id: string) {
  const data: any = {};
  if (body.name) {
    data.name = body.name;
  }
  if (body.publicId) {
    data.publicId = body.publicId;
  }
  if (body.image) {
    data.image = body.image;
  }
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: data,
  });
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = session.user.id;
  const user = await getUser(id);
  return NextResponse.json(user);
}

async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      publicId: true,
      image: true,
    },
  });
}
