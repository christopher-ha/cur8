/*
  Warnings:

  - The `shoesId` column on the `SavedLooks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `accessoriesId` column on the `SavedLooks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bottomsId` column on the `SavedLooks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `topsId` column on the `SavedLooks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SavedLooks" DROP COLUMN "shoesId",
ADD COLUMN     "shoesId" JSONB,
DROP COLUMN "accessoriesId",
ADD COLUMN     "accessoriesId" JSONB,
DROP COLUMN "bottomsId",
ADD COLUMN     "bottomsId" JSONB,
DROP COLUMN "topsId",
ADD COLUMN     "topsId" JSONB;
