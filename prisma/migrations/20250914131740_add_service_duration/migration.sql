-- CreateTable
CREATE TABLE "ServiceDuration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "label" TEXT,
    "priceDelta" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServiceDuration_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ServiceDuration_serviceId_minutes_idx" ON "ServiceDuration"("serviceId", "minutes");
