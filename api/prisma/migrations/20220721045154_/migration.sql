/*
  Warnings:

  - You are about to drop the column `comment` on the `room_user` table. All the data in the column will be lost.
  - You are about to drop the column `stateId` on the `state_data` table. All the data in the column will be lost.
  - Added the required column `stateDataId` to the `states` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `state_data` DROP FOREIGN KEY `state_data_stateId_fkey`;

-- AlterTable
ALTER TABLE `room_user` DROP COLUMN `comment`;

-- AlterTable
ALTER TABLE `state_data` DROP COLUMN `stateId`;

-- AlterTable
ALTER TABLE `states` ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `stateDataId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `states` ADD CONSTRAINT `states_stateDataId_fkey` FOREIGN KEY (`stateDataId`) REFERENCES `state_data`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
