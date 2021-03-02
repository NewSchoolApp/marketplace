/*
  Warnings:

  - Added the required column `points` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `item` ADD COLUMN     `points` INTEGER NOT NULL;
