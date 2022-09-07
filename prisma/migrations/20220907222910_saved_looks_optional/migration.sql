/*
  Warnings:

  - You are about to drop the column `topId` on the `SavedLooks` table. All the data in the column will be lost.
  - Added the required column `top1Id` to the `SavedLooks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SavedLooks" DROP CONSTRAINT "SavedLooks_topId_fkey";

-- AlterTable
ALTER TABLE "SavedLooks" DROP COLUMN "topId",
ADD COLUMN     "top1Id" TEXT NOT NULL,
ALTER COLUMN "modelId" DROP NOT NULL,
ALTER COLUMN "top2Id" DROP NOT NULL,
ALTER COLUMN "accessory1Id" DROP NOT NULL,
ALTER COLUMN "accessory2Id" DROP NOT NULL,
ALTER COLUMN "accessory3Id" DROP NOT NULL,
ALTER COLUMN "accessory4Id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_top1Id_fkey" FOREIGN KEY ("top1Id") REFERENCES "Wardrobe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
