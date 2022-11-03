/*
  Warnings:

  - You are about to drop the column `accessory1Id` on the `SavedLooks` table. All the data in the column will be lost.
  - You are about to drop the column `accessory2Id` on the `SavedLooks` table. All the data in the column will be lost.
  - You are about to drop the column `accessory3Id` on the `SavedLooks` table. All the data in the column will be lost.
  - You are about to drop the column `accessory4Id` on the `SavedLooks` table. All the data in the column will be lost.
  - You are about to drop the column `bottomId` on the `SavedLooks` table. All the data in the column will be lost.
  - You are about to drop the column `top1Id` on the `SavedLooks` table. All the data in the column will be lost.
  - You are about to drop the column `top2Id` on the `SavedLooks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SavedLooks" DROP CONSTRAINT "SavedLooks_accessory1Id_fkey";

-- DropForeignKey
ALTER TABLE "SavedLooks" DROP CONSTRAINT "SavedLooks_accessory2Id_fkey";

-- DropForeignKey
ALTER TABLE "SavedLooks" DROP CONSTRAINT "SavedLooks_accessory3Id_fkey";

-- DropForeignKey
ALTER TABLE "SavedLooks" DROP CONSTRAINT "SavedLooks_accessory4Id_fkey";

-- DropForeignKey
ALTER TABLE "SavedLooks" DROP CONSTRAINT "SavedLooks_bottomId_fkey";

-- DropForeignKey
ALTER TABLE "SavedLooks" DROP CONSTRAINT "SavedLooks_shoesId_fkey";

-- DropForeignKey
ALTER TABLE "SavedLooks" DROP CONSTRAINT "SavedLooks_top1Id_fkey";

-- DropForeignKey
ALTER TABLE "SavedLooks" DROP CONSTRAINT "SavedLooks_top2Id_fkey";

-- AlterTable
ALTER TABLE "SavedLooks" DROP COLUMN "accessory1Id",
DROP COLUMN "accessory2Id",
DROP COLUMN "accessory3Id",
DROP COLUMN "accessory4Id",
DROP COLUMN "bottomId",
DROP COLUMN "top1Id",
DROP COLUMN "top2Id",
ADD COLUMN     "accessoriesId" TEXT[],
ADD COLUMN     "bottomsId" TEXT[],
ADD COLUMN     "topsId" TEXT[];
