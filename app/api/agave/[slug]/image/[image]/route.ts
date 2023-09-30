import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; image: string } }
) {
  const detail = await getImage(params.image);
  return NextResponse.json(detail);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; image: string } }
) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = session.user.id;
  return NextResponse.json(await deleteImage(params.image, id));
}

async function getImage(image: string) {
  return await prisma.agaveImage.findUniqueOrThrow({
    where: {
      url: "agave/" + image + ".jpg",
      deleted: false,
    },
    include: {
      agave: true,
    },
  });
}

async function deleteImage(image: string, id: string) {
  const deletedAgave = await prisma.agaveImage.update({
    where: {
      url: "agave/" + image + ".jpg",
      ownerId: id,
    },
    data: {
      deleted: true,
    },
  });
  if (!deletedAgave) {
    throw new Error("Agave not found");
  }
  return deletedAgave;
}
