import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = session.user.id;
  const body = await request.json();
  return NextResponse.json(await deleteAgave(params.slug, id, body.image));
}

async function deleteAgave(slug: string, id: string, image: string) {
  const updatedAgave = await prisma.agave.update({
    where: {
      slug: slug,
      ownerId: id,
      deleted: false,
    },
    data: {
      iconUrl: image,
    },
  });
  if (!updatedAgave) {
    throw new Error("Agave not found");
  }
  return updatedAgave;
}
