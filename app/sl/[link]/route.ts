import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { link: string } }
) {
  try {
    const slug = await getSlug(params.link);
    if (slug === undefined || slug === null) {
      // アガベ未登録
      return NextResponse.redirect(
        new URL(`/sl/${params.link}/set`, request.url)
      );
    }
    // 登録済みのアガベ
    return NextResponse.redirect(new URL("/agave/" + slug, request.url));
  } catch (e) {
    console.log(e);
    // 無効なshortLink
    return NextResponse.redirect(new URL("/", request.url));
  }
}

async function getSlug(link: string) {
  const shortLink = await prisma.shortLink.findUniqueOrThrow({
    where: {
      link: link,
    },
    select: {
      agave: {
        select: {
          slug: true,
        },
      },
    },
  });
  return shortLink.agave?.slug;
}
