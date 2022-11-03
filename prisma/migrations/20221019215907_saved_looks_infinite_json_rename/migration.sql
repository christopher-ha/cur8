/*
  Warnings:

  - You are about to drop the column `accessoriesId` on the `SavedLooks` table. All the data in the column will be lost.
  - You are about to drop the column `bottomsId` on the `SavedLooks` table. All the data in the column will be lost.
  - You are about to drop the column `modelId` on the `SavedLooks` table. All the data in the column will be lost.
  - You are about to drop the column `shoesId` on the `SavedLooks` table. All the data in the column will be lost.
  - You are about to drop the column `topsId` on the `SavedLooks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SavedLooks" DROP CONSTRAINT "SavedLooks_modelId_fkey";

-- AlterTable
ALTER TABLE "SavedLooks" DROP COLUMN "accessoriesId",
DROP COLUMN "bottomsId",
DROP COLUMN "modelId",
DROP COLUMN "shoesId",
DROP COLUMN "topsId",
ADD COLUMN     "accessories" JSONB,
ADD COLUMN     "bottoms" JSONB,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "shoes" JSONB,
ADD COLUMN     "tops" JSONB;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_model_fkey" FOREIGN KEY ("model") REFERENCES "Models"("id") ON DELETE CASCADE ON UPDATE CASCADE;
