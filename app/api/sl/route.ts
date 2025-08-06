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
  return NextResponse.json(
    await updateShortLink(body.link, body.agaveSlug, id)
  );
}

const updateShortLink = async (
  link: string,
  agaveSlug: string,
  ownerId: string
) => {
  const agave = await prisma.agave.findUniqueOrThrow({
    where: {
      ownerId: ownerId,
      slug: agaveSlug,
    },
  });
  const shortLink = await prisma.shortLink.update({
    where: {
      link: link,
    },
    data: {
      agaveSlug: agaveSlug,
    },
  });
  return shortLink;
};
