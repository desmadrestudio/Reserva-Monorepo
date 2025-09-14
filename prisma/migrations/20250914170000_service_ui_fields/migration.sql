-- Align Service table with UI fields used by services pages
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

-- Add new columns to Service
ALTER TABLE "Service" ADD COLUMN "processingMinutes" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Service" ADD COLUMN "blockExtraMinutes" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Service" ADD COLUMN "displayPriceNote" TEXT;
ALTER TABLE "Service" ADD COLUMN "taxable" BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE "Service" ADD COLUMN "imageUrl" TEXT;

COMMIT;
PRAGMA foreign_keys=ON;

