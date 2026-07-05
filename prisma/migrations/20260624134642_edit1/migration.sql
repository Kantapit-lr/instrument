/*
  Warnings:

  - You are about to alter the column `type` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Added the required column `recordedBy` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profile` ADD COLUMN `recordedBy` VARCHAR(191) NOT NULL,
    MODIFY `type` ENUM('BALANCE', 'TEMPERATURE', 'PIPETTE') NOT NULL;
