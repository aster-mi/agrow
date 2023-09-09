/*
  Warnings:

  - A unique constraint covering the columns `[agaveId]` on the table `QrCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `QrCode_agaveId_key` ON `QrCode`(`agaveId`);
