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

  try {
    return NextResponse.json(await updateUser(body, id));
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}

async function updateUser(body: any, id: string) {
  const data: any = {};
  if (body.name) {
    if (body.name.length < 1 || body.name.length > 20) {
      throw new Error("名前は1文字以上20文字以下で入力してください");
    }
    data.name = body.name;
  }
  if (body.publicId) {
    // 文字数
    if (body.publicId.length < 5 || body.publicId.length > 20) {
      throw new Error("ユーザーIDは5文字以上20文字以下で入力してください");
    }
    // 形式 (半角英数字とアンダースコアのみ)
    if (!body.publicId.match(/^[a-zA-Z0-9_]+$/)) {
      throw new Error(
        "ユーザーIDは半角英数字とアンダースコアのみで入力してください"
      );
    }
    // 全て小文字に変換
    data.publicId = body.publicId.toLowerCase();
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
      isAdmin: true,
    },
  });
}
