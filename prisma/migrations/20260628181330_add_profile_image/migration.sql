-- CreateTable
CREATE TABLE `ProfileImage` (
    `profileImageId` INTEGER NOT NULL AUTO_INCREMENT,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`profileImageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProfileImage` ADD CONSTRAINT `ProfileImage_registrationNumber_fkey` FOREIGN KEY (`registrationNumber`) REFERENCES `Profile`(`registrationNumber`) ON DELETE CASCADE ON UPDATE CASCADE;
