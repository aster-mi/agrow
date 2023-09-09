/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AgaveImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `AgaveImage` DROP COLUMN `createdAt`,
    ADD COLUMN `shotDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
