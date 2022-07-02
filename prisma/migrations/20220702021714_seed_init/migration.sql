/*
  Warnings:

  - You are about to drop the `Campaign` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CallSheet" DROP CONSTRAINT "CallSheet_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "Models" DROP CONSTRAINT "Models_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "Moodboards" DROP CONSTRAINT "Moodboards_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "SavedLooks" DROP CONSTRAINT "SavedLooks_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "Wardrobe" DROP CONSTRAINT "Wardrobe_campaignId_fkey";

-- DropTable
DROP TABLE "Campaign";

-- CreateTable
CREATE TABLE "Campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "date" DATE,

    CONSTRAINT "Campaigns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallSheet" ADD CONSTRAINT "CallSheet_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wardrobe" ADD CONSTRAINT "Wardrobe_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moodboards" ADD CONSTRAINT "Moodboards_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Models" ADD CONSTRAINT "Models_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
