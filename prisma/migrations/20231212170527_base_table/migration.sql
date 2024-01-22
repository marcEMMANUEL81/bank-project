/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone_number]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstname` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `id_user` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `lastname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `email`,
    DROP COLUMN `id`,
    DROP COLUMN `name`,
    DROP COLUMN `role`,
    ADD COLUMN `firstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_user` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_user`);

-- CreateTable
CREATE TABLE `Card` (
    `id_card` VARCHAR(191) NOT NULL,
    `card_number` VARCHAR(191) NOT NULL,
    `card_validity` DATETIME(3) NOT NULL,
    `card_cvv` VARCHAR(191) NOT NULL,
    `isLock` BOOLEAN NOT NULL,
    `isValid` BOOLEAN NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Card_card_number_key`(`card_number`),
    UNIQUE INDEX `Card_card_cvv_key`(`card_cvv`),
    PRIMARY KEY (`id_card`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_number_key` ON `User`(`phone_number`);

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
