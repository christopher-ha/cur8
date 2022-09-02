-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "instagram" TEXT,
    "number" TEXT,
    "role" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "date" DATE,

    CONSTRAINT "Campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teams" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT,
    "permissions" TEXT NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id")
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
    "url" TEXT,
    "text" TEXT,

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
    "contact" TEXT,
    "height" INTEGER,
    "bust" INTEGER,
    "waist" INTEGER,
    "hip" INTEGER,
    "shoe" INTEGER,
    "dress" INTEGER,
    "hair" TEXT,
    "eyes" TEXT,

    CONSTRAINT "Models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedLooks" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "topId" TEXT NOT NULL,
    "top2Id" TEXT NOT NULL,
    "bottomId" TEXT NOT NULL,
    "shoesId" TEXT NOT NULL,
    "accessory1Id" TEXT NOT NULL,
    "accessory2Id" TEXT NOT NULL,
    "accessory3Id" TEXT NOT NULL,
    "accessory4Id" TEXT NOT NULL,

    CONSTRAINT "SavedLooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Teams_campaignId_key" ON "Teams"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "CallSheet_campaignId_key" ON "CallSheet"("campaignId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallSheet" ADD CONSTRAINT "CallSheet_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wardrobe" ADD CONSTRAINT "Wardrobe_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moodboards" ADD CONSTRAINT "Moodboards_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_moodboardId_fkey" FOREIGN KEY ("moodboardId") REFERENCES "Moodboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Models" ADD CONSTRAINT "Models_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_topId_fkey" FOREIGN KEY ("topId") REFERENCES "Wardrobe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_top2Id_fkey" FOREIGN KEY ("top2Id") REFERENCES "Wardrobe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_bottomId_fkey" FOREIGN KEY ("bottomId") REFERENCES "Wardrobe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_shoesId_fkey" FOREIGN KEY ("shoesId") REFERENCES "Wardrobe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_accessory1Id_fkey" FOREIGN KEY ("accessory1Id") REFERENCES "Wardrobe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_accessory2Id_fkey" FOREIGN KEY ("accessory2Id") REFERENCES "Wardrobe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_accessory3Id_fkey" FOREIGN KEY ("accessory3Id") REFERENCES "Wardrobe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_accessory4Id_fkey" FOREIGN KEY ("accessory4Id") REFERENCES "Wardrobe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLooks" ADD CONSTRAINT "SavedLooks_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Models"("id") ON DELETE CASCADE ON UPDATE CASCADE;
