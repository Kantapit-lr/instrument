-- AlterTable
ALTER TABLE `profile` ADD COLUMN `fundingTypeRemark` VARCHAR(191) NULL,
    ADD COLUMN `vendor` VARCHAR(200) NULL;

-- CreateTable
CREATE TABLE `Calibration` (
    `calibrationId` INTEGER NOT NULL AUTO_INCREMENT,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `maintenancePlanId` INTEGER NOT NULL,
    `certificateNo` VARCHAR(100) NOT NULL,
    `calibrationDate` DATETIME(3) NOT NULL,
    `isAccurate` BOOLEAN NOT NULL,
    `isDocumentComplete` BOOLEAN NOT NULL,
    `isInstrumentComplete` BOOLEAN NOT NULL,
    `instrumentValue` VARCHAR(100) NOT NULL,
    `mpe` VARCHAR(100) NOT NULL,
    `summaryResult` ENUM('PASS', 'NOT_PASS') NOT NULL,
    `operator` VARCHAR(100) NULL,
    `operatedAt` DATETIME(3) NULL,
    `reviewer` VARCHAR(100) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `certificatePath` VARCHAR(200) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`calibrationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResultBalance` (
    `resultBalanceId` INTEGER NOT NULL AUTO_INCREMENT,
    `calibrationId` INTEGER NOT NULL,
    `appliedWeight` DECIMAL(10, 4) NOT NULL,
    `balanceReading` DECIMAL(10, 4) NOT NULL,
    `unit` VARCHAR(100) NOT NULL,
    `correction` DECIMAL(10, 4) NOT NULL,
    `mu` DECIMAL(10, 4) NOT NULL,
    `totalErrorMinus` DECIMAL(10, 4) NOT NULL,
    `totalErrorPlus` DECIMAL(10, 4) NOT NULL,
    `status` ENUM('PASS', 'NOT_PASS') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`resultBalanceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResultTemperatureSource` (
    `resultTemperatureId` INTEGER NOT NULL AUTO_INCREMENT,
    `calibrationId` INTEGER NOT NULL,
    `position` VARCHAR(100) NOT NULL,
    `standardReading` DECIMAL(10, 4) NOT NULL,
    `unit` VARCHAR(100) NOT NULL,
    `mu` DECIMAL(10, 4) NOT NULL,
    `averageStandardReadingMc` DECIMAL(10, 4) NOT NULL,
    `status` ENUM('PASS', 'NOT_PASS') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`resultTemperatureId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResultPipette` (
    `resultPipetteId` INTEGER NOT NULL AUTO_INCREMENT,
    `calibrationId` INTEGER NOT NULL,
    `parameter` VARCHAR(100) NOT NULL,
    `pointOfCalibration` VARCHAR(100) NOT NULL,
    `unit` VARCHAR(100) NOT NULL,
    `mpePercent` DECIMAL(10, 4) NOT NULL,
    `error` DECIMAL(10, 4) NOT NULL,
    `ms` DECIMAL(10, 4) NOT NULL,
    `totalError` DECIMAL(10, 4) NOT NULL,
    `status` ENUM('PASS', 'NOT_PASS') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`resultPipetteId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Calibration` ADD CONSTRAINT `Calibration_registrationNumber_fkey` FOREIGN KEY (`registrationNumber`) REFERENCES `Profile`(`registrationNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Calibration` ADD CONSTRAINT `Calibration_maintenancePlanId_fkey` FOREIGN KEY (`maintenancePlanId`) REFERENCES `MaintenancePlan`(`maintenancePlanId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResultBalance` ADD CONSTRAINT `ResultBalance_calibrationId_fkey` FOREIGN KEY (`calibrationId`) REFERENCES `Calibration`(`calibrationId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResultTemperatureSource` ADD CONSTRAINT `ResultTemperatureSource_calibrationId_fkey` FOREIGN KEY (`calibrationId`) REFERENCES `Calibration`(`calibrationId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResultPipette` ADD CONSTRAINT `ResultPipette_calibrationId_fkey` FOREIGN KEY (`calibrationId`) REFERENCES `Calibration`(`calibrationId`) ON DELETE RESTRICT ON UPDATE CASCADE;
