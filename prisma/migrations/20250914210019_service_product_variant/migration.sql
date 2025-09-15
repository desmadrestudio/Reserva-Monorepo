/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN "productId" TEXT;

-- AlterTable
ALTER TABLE "ServiceDuration" ADD COLUMN "variantId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Service_productId_key" ON "Service"("productId");
