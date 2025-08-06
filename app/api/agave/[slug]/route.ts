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

async function updateTags(agaveId: number, tagNames: string[]) {
  // tagNamesをupsertする
  const query = tagNames.map((name) =>
    prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  );
  const tags = await prisma.$transaction([...query]);
  // TagsOnAgavesをdelete insertする
  await prisma.tagsOnAgaves.deleteMany({
    where: {
      agaveId: agaveId,
    },
  });
  const tagsOnAgaves = await prisma.tagsOnAgaves.createMany({
    data: tags.map((tag) => ({
      agaveId: agaveId,
      tagId: tag.id,
    })),
  });
  return tagsOnAgaves;
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { slug: string };
  }
) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body: { agave: { name: string; description: string; tags: string[] } } =
    await request.json();

  const id = session.user.id;
  const agave = await prisma.agave.update({
    where: {
      slug: params.slug,
      ownerId: id,
    },
    data: {
      name: body.agave.name,
      description: body.agave.description,
    },
  });
  await updateTags(agave.id, body.agave.tags);
  return NextResponse.json(agave);
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
          id: true,
          name: true,
          image: true,
          publicId: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      agaveImages: {
        where: {
          deleted: false,
        },
        orderBy: [{ shotDate: "desc" }, { createdAt: "desc" }],
      },
      parent: true,
      pups: {
        orderBy: [{ createdAt: "desc" }],
      },
      rack: true,
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
