/*
  Warnings:

  - You are about to alter the column `requirementType` on the `requestdetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - A unique constraint covering the columns `[scheduleId]` on the table `Calibration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[calibrationId]` on the table `History` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `Calibration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `RequestList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `calibration` ADD COLUMN `scheduleId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `history` ADD COLUMN `calibrationId` INTEGER NULL;

-- AlterTable
ALTER TABLE `requestdetail` MODIFY `requirementType` ENUM('CAL', 'PM') NOT NULL;

-- AlterTable
ALTER TABLE `requestlist` ADD COLUMN `projectId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Calibration_scheduleId_key` ON `Calibration`(`scheduleId`);

-- CreateIndex
CREATE UNIQUE INDEX `History_calibrationId_key` ON `History`(`calibrationId`);

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_calibrationId_fkey` FOREIGN KEY (`calibrationId`) REFERENCES `Calibration`(`calibrationId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestList` ADD CONSTRAINT `RequestList_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`projectId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Calibration` ADD CONSTRAINT `Calibration_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`scheduleId`) ON DELETE RESTRICT ON UPDATE CASCADE;
