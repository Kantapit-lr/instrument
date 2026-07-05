/*
  Warnings:

  - A unique constraint covering the columns `[nickName]` on the table `Dp` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nickName` to the `Dp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dp` ADD COLUMN `nickName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Dp_nickName_key` ON `Dp`(`nickName`);
