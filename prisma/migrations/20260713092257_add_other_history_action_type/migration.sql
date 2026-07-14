-- AlterTable
ALTER TABLE `history` MODIFY `actionType` ENUM('CAL', 'PM', 'TRANSFER', 'MANUAL', 'OTHER') NOT NULL;
