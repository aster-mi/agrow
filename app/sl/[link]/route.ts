import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { link: string } }
) {
  try {
    const slug = await getSlug(params.link);
    const path = new URL("/agave/" + slug, request.url);
    return NextResponse.redirect(path);
  } catch (e) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

async function getSlug(link: string) {
  const shortLink = await prisma.shortLink.findUniqueOrThrow({
    where: {
      link: link,
    },
    include: {
      agave: {
        select: {
          slug: true,
        },
      },
    },
  });
  return shortLink.agave.slug;
}
