/*
  Warnings:

  - You are about to drop the column `dpId` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `dpId` on the `maintenanceplan` table. All the data in the column will be lost.
  - You are about to drop the column `dpId` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the `dp` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `Contact_dpId_fkey`;

-- DropForeignKey
ALTER TABLE `maintenanceplan` DROP FOREIGN KEY `MaintenancePlan_dpId_fkey`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_dpId_fkey`;

-- DropIndex
DROP INDEX `Contact_dpId_fkey` ON `contact`;

-- DropIndex
DROP INDEX `MaintenancePlan_dpId_fkey` ON `maintenanceplan`;

-- DropIndex
DROP INDEX `Profile_dpId_fkey` ON `profile`;

-- AlterTable
ALTER TABLE `contact` DROP COLUMN `dpId`,
    ADD COLUMN `projectId` INTEGER NULL;

-- AlterTable
ALTER TABLE `maintenanceplan` DROP COLUMN `dpId`,
    ADD COLUMN `projectId` INTEGER NULL;

-- AlterTable
ALTER TABLE `profile` DROP COLUMN `dpId`,
    ADD COLUMN `projectId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `dp`;

-- CreateTable
CREATE TABLE `Project` (
    `projectId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `nickName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Project_name_key`(`name`),
    UNIQUE INDEX `Project_nickName_key`(`nickName`),
    PRIMARY KEY (`projectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`projectId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`projectId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenancePlan` ADD CONSTRAINT `MaintenancePlan_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`projectId`) ON DELETE SET NULL ON UPDATE CASCADE;
