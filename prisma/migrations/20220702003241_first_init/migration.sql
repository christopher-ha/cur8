-- AlterTable
ALTER TABLE "User" ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "number" BIGINT;

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "date" DATE,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "permissions" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallSheet" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "time" TIME NOT NULL,
    "task" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "CallSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wardrobe" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "size" TEXT,

    CONSTRAINT "Wardrobe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Moodboards" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Moodboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" TEXT NOT NULL,
    "moodboardId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Models" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "urlFace" TEXT NOT NULL,
    "urlBody" TEXT NOT NULL,
    "instagram" TEXT,
    "agency" TEXT,
    "contact" TEXT NOT NULL,

    CONSTRAINT "Models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedLooks" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "topId" TEXT NOT NULL,
    "bottomId" TEXT NOT NULL,
    "shoesId" TEXT NOT NULL,
    "accessory1Id" TEXT NOT NULL,
    "accessory2Id" TEXT NOT NULL,

    CONSTRAINT "SavedLooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_campaignId_key" ON "Team"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_userId_key" ON "Team"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CallSheet_campaignId_key" ON "CallSheet"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Wardrobe_campaignId_key" ON "Wardrobe"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Moodboards_campaignId_key" ON "Moodboards"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Images_moodboardId_key" ON "Images"("moodboardId");

-- CreateIndex
CREATE UNIQUE INDEX "Models_campaignId_key" ON "Models"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedLooks_campaignId_key" ON "SavedLooks"("campaignId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallSheet" ADD CONSTRAINT "CallSheet_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wardrobe" ADD CONSTRAINT "Wardrobe_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moodboards" ADD CONSTRAINT "Moodboards_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_moodboardId_fkey" FOREIGN KEY ("moodboardId") REFERENCES "Moodboards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Models" ADD CONSTRAINT "Models_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_topId_fkey" FOREIGN KEY ("topId") REFERENCES "Wardrobe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_bottomId_fkey" FOREIGN KEY ("bottomId") REFERENCES "Wardrobe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_shoesId_fkey" FOREIGN KEY ("shoesId") REFERENCES "Wardrobe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_accessory1Id_fkey" FOREIGN KEY ("accessory1Id") REFERENCES "Wardrobe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_accessory2Id_fkey" FOREIGN KEY ("accessory2Id") REFERENCES "Wardrobe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
