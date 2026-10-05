-- CreateEnum
CREATE TYPE "CheckStatus" AS ENUM ('created', 'processing', 'completed', 'failed');

-- CreateTable
CREATE TABLE "VehicleCheck" (
    "id" TEXT NOT NULL,
    "vin" CHAR(17) NOT NULL,
    "status" "CheckStatus" NOT NULL DEFAULT 'created',
    "make" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "owners" INTEGER,
    "hasAccident" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "VehicleCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VehicleCheck_createdAt_idx" ON "VehicleCheck"("createdAt");

-- CreateIndex
CREATE INDEX "VehicleCheck_vin_idx" ON "VehicleCheck"("vin");
