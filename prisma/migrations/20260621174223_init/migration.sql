-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dp` (
    `dpId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Dp_name_key`(`name`),
    PRIMARY KEY (`dpId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `departmentId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Department_name_key`(`name`),
    PRIMARY KEY (`departmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `contactId` INTEGER NOT NULL AUTO_INCREMENT,
    `departmentId` INTEGER NULL,
    `dpId` INTEGER NULL,
    `contactType` VARCHAR(191) NOT NULL,
    `contactValue` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`contactId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `registrationNumber` VARCHAR(50) NOT NULL,
    `dpId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NULL,
    `serialNo` VARCHAR(191) NULL,
    `manufacturer` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `price` DECIMAL(15, 2) NOT NULL,
    `initialCondition` VARCHAR(191) NOT NULL,
    `fundingType` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `receivedDate` DATETIME(3) NOT NULL,
    `activeDate` DATETIME(3) NOT NULL,
    `withdrawalDocumentNo` VARCHAR(191) NOT NULL,
    `disposed` BOOLEAN NOT NULL DEFAULT false,
    `disposedDate` DATETIME(3) NULL,
    `disposalDocument` VARCHAR(191) NULL,
    `disposalApproveDate` DATETIME(3) NULL,
    `remark` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`registrationNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfileSaver` (
    `profileSaverId` INTEGER NOT NULL AUTO_INCREMENT,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `savedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`profileSaverId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpecialCharacteristic` (
    `registrationNumber` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `remark` VARCHAR(191) NULL,

    PRIMARY KEY (`registrationNumber`, `type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `History` (
    `historyId` INTEGER NOT NULL AUTO_INCREMENT,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `actionDate` DATETIME(3) NOT NULL,
    `actionType` ENUM('CAL', 'PM', 'TRANSFER', 'MANUAL') NOT NULL,
    `detail` TEXT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `remark` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`historyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestList` (
    `requestListId` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`requestListId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestDetail` (
    `requestDetailId` INTEGER NOT NULL AUTO_INCREMENT,
    `requestListId` INTEGER NOT NULL,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `requirementType` VARCHAR(191) NOT NULL,
    `frequency` INTEGER NOT NULL,
    `usagePeriod` VARCHAR(191) NOT NULL,
    `acceptableTolerance` DECIMAL(8, 2) NOT NULL,
    `remark` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`requestDetailId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaintenancePlan` (
    `maintenancePlanId` INTEGER NOT NULL AUTO_INCREMENT,
    `requestListId` INTEGER NULL,
    `dpId` INTEGER NULL,
    `year` INTEGER NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `reviewer` VARCHAR(191) NULL,
    `approvalStatus` VARCHAR(191) NOT NULL,
    `hiringStatus` VARCHAR(191) NOT NULL,
    `processStatus` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`maintenancePlanId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaintenanceDetail` (
    `maintenanceDetailId` INTEGER NOT NULL AUTO_INCREMENT,
    `maintenancePlanId` INTEGER NOT NULL,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `departmentId` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL,
    `detail` VARCHAR(191) NOT NULL,
    `remark` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`maintenanceDetailId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `scheduleId` INTEGER NOT NULL AUTO_INCREMENT,
    `maintenanceDetailId` INTEGER NOT NULL,
    `round` INTEGER NOT NULL,
    `scheduledDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`scheduleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpecialSituation` (
    `specialSituationId` INTEGER NOT NULL AUTO_INCREMENT,
    `datetime` DATETIME(3) NOT NULL,
    `situation` TEXT NOT NULL,
    `reason` TEXT NULL,
    `recorder` VARCHAR(191) NOT NULL,
    `recorderContact` VARCHAR(191) NOT NULL,
    `remark` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`specialSituationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CollaborationHistory` (
    `collaborationHistoryId` INTEGER NOT NULL AUTO_INCREMENT,
    `departmentId` INTEGER NOT NULL,
    `collaborationDate` DATETIME(3) NOT NULL,
    `detail` TEXT NULL,
    `result` TEXT NULL,
    `operator` VARCHAR(191) NULL,
    `remark` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`collaborationHistoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`departmentId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_dpId_fkey` FOREIGN KEY (`dpId`) REFERENCES `Dp`(`dpId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_dpId_fkey` FOREIGN KEY (`dpId`) REFERENCES `Dp`(`dpId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfileSaver` ADD CONSTRAINT `ProfileSaver_registrationNumber_fkey` FOREIGN KEY (`registrationNumber`) REFERENCES `Profile`(`registrationNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfileSaver` ADD CONSTRAINT `ProfileSaver_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpecialCharacteristic` ADD CONSTRAINT `SpecialCharacteristic_registrationNumber_fkey` FOREIGN KEY (`registrationNumber`) REFERENCES `Profile`(`registrationNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_registrationNumber_fkey` FOREIGN KEY (`registrationNumber`) REFERENCES `Profile`(`registrationNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestDetail` ADD CONSTRAINT `RequestDetail_requestListId_fkey` FOREIGN KEY (`requestListId`) REFERENCES `RequestList`(`requestListId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestDetail` ADD CONSTRAINT `RequestDetail_registrationNumber_fkey` FOREIGN KEY (`registrationNumber`) REFERENCES `Profile`(`registrationNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenancePlan` ADD CONSTRAINT `MaintenancePlan_requestListId_fkey` FOREIGN KEY (`requestListId`) REFERENCES `RequestList`(`requestListId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenancePlan` ADD CONSTRAINT `MaintenancePlan_dpId_fkey` FOREIGN KEY (`dpId`) REFERENCES `Dp`(`dpId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceDetail` ADD CONSTRAINT `MaintenanceDetail_maintenancePlanId_fkey` FOREIGN KEY (`maintenancePlanId`) REFERENCES `MaintenancePlan`(`maintenancePlanId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceDetail` ADD CONSTRAINT `MaintenanceDetail_registrationNumber_fkey` FOREIGN KEY (`registrationNumber`) REFERENCES `Profile`(`registrationNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceDetail` ADD CONSTRAINT `MaintenanceDetail_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`departmentId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_maintenanceDetailId_fkey` FOREIGN KEY (`maintenanceDetailId`) REFERENCES `MaintenanceDetail`(`maintenanceDetailId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CollaborationHistory` ADD CONSTRAINT `CollaborationHistory_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`departmentId`) ON DELETE RESTRICT ON UPDATE CASCADE;
