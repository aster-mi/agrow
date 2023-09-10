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
    await prisma.user.createMany({
      data: [
        {
          name: "user1",
          email: "user1@example.com",
        },
        {
          name: "user2",
          email: "user2@example.com",
        },
      ],
    });

    // Agaveデータの追加
    await prisma.agave.createMany({
      data: [
        {
          name: "Agave 1",
          description: "This is Agave 1",
          ownerId: 1, // user1のIDを指定
        },
        {
          name: "Agave 2",
          description: "This is Agave 2",
          ownerId: 2, // user2のIDを指定
        },
      ],
    });

    // Tagデータの追加
    await prisma.tag.createMany({
      data: [
        {
          name: "Tag 1",
        },
        {
          name: "Tag 2",
        },
      ],
    });

    // TagsOnAgavesデータの追加 (AgaveとTagの関連付け)
    await prisma.tagsOnAgaves.createMany({
      data: [
        {
          agaveId: 1, // Agave 1とTag 1の関連付け
          tagId: 1,
        },
        {
          agaveId: 2, // Agave 2とTag 2の関連付け
          tagId: 2,
        },
      ],
    });

    // フォロー関係データの追加
    await prisma.follow.createMany({
      data: [
        {
          followerId: 1, // user1がuser2をフォロー
          followedId: 2,
        },
        {
          followerId: 2, // user2がuser1をフォロー
          followedId: 1,
        },
      ],
    });

    // AgaveImageデータの追加
    await prisma.agaveImage.createMany({
      data: [
        {
          url: "https://example.com/agave1.jpg",
          agaveId: 1, // Agave 1に関連付け
        },
        {
          url: "https://example.com/agave2.jpg",
          agaveId: 2, // Agave 2に関連付け
        },
      ],
    });

    // Postデータの追加
    await prisma.post.createMany({
      data: [
        {
          content: "This is the first post",
          authorId: 1, // user1が投稿
        },
        {
          content: "This is the second post",
          authorId: 2, // user2が投稿
        },
      ],
    });

    // Likeデータの追加
    await prisma.like.createMany({
      data: [
        {
          postId: 1, // Post 1にいいね (user1)
          userId: 1,
        },
        {
          postId: 2, // Post 2にいいね (user2)
          userId: 2,
        },
      ],
    });

    // QrCodeデータの追加
    await prisma.qrCode.createMany({
      data: [
        {
          code: "AAAA",
          agaveId: 1, // Agave 1に関連付け
        },
        {
          code: "BBBB",
          agaveId: 2, // Agave 2に関連付け
        },
      ],
    });

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
