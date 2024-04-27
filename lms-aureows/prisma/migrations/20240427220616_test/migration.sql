/*
  Warnings:

  - You are about to drop the column `descriptio` on the `Chapter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Chapter` DROP COLUMN `descriptio`,
    ADD COLUMN `description` TEXT NULL;
