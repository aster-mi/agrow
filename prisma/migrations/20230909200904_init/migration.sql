/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Agave` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Agave_id_key` ON `Agave`(`id`);
