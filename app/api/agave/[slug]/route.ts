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
  return NextResponse.json(await deleteAgave(params.slug, id));
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
          id: true,
        },
      },
      tags: true,
      agaveImages: {
        where: {
          deleted: false,
        },
        orderBy: {
          shotDate: "desc",
        },
      },
      parent: true,
      pups: true,
    },
  });
  return agave;
}

async function deleteAgave(slug: string, id: string) {
  const deletedAgave = await prisma.agave.update({
    where: {
      slug: slug,
      ownerId: id,
    },
    data: {
      deleted: true,
      rackCode: null,
      rackPosition: null,
    },
  });
  if (!deletedAgave) {
    throw new Error("Agave not found");
  }
  return deletedAgave;
}
