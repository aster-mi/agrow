import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const agave = await getAgave(params.slug);
  return NextResponse.json(agave);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = session.user.id;
  return NextResponse.json(await registerAgave(params.slug, id));
}

async function getAgave(slug: string) {
  const agave = await prisma.agave.findUniqueOrThrow({
    where: {
      slug: slug,
      deleted: false,
    },
    include: {
      owner: {
        select: {
          name: true,
        },
      },
      tags: true,
      agaveImages: true,
      shortLink: true,
      parent: true,
    },
  });
  if (agave.agaveImages) {
    agave.agaveImages.reverse();
  }
  return agave;
}

async function registerAgave(slug: string, id: string) {
  const deletedAgave = await prisma.agave.update({
    where: {
      slug: slug,
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
