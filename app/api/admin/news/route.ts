import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  const news = await prisma.news.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return new NextResponse(JSON.stringify(news));
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(nextAuthOptions);
  if (!session?.user?.id) {
    return new NextResponse(null, { status: 403 });
  }
  const isAdmin = (await getUser(session?.user?.id)).isAdmin;
  if (!isAdmin) {
    return new NextResponse(null, { status: 403 });
  }
  const body = await request.json();
  return new NextResponse(JSON.stringify(await createNews(body)));
}

async function getUser(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      isAdmin: true,
    },
  });
  return user;
}

async function createNews(body: any) {
  const news = await prisma.news.create({
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return news;
}
