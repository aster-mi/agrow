import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // delete all
  await prisma.agave.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.tagsOnAgaves.deleteMany();
  await prisma.qrCode.deleteMany();
  await prisma.user.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.agaveImage.deleteMany();
  await prisma.post.deleteMany();
  await prisma.postsOnAgaveImages.deleteMany();
  await prisma.like.deleteMany();

  try {
    // ユーザーデータの追加
    // XXX
    console.log("サンプルデータの追加が完了しました");
  } catch (error) {
    console.error("データの追加中にエラーが発生しました:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("エラーが発生しました:", error);
});
