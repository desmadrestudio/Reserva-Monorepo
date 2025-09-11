/*
  Warnings:

  - You are about to drop the column `service` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `Service` table. All the data in the column will be lost.
  - Added the required column `serviceId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotalCents` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxCents` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCents` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseMinutes` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basePrice` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "AddOn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "minutes" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "AppointmentAddOn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appointmentId" TEXT NOT NULL,
    "addOnId" TEXT NOT NULL,
    CONSTRAINT "AppointmentAddOn_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AppointmentAddOn_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "AddOn" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Modifier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ServiceAddons" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ServiceAddons_A_fkey" FOREIGN KEY ("A") REFERENCES "AddOn" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ServiceAddons_B_fkey" FOREIGN KEY ("B") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotalCents" INTEGER NOT NULL,
    "taxCents" INTEGER NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'PAY_AT_SPA',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "Appointment_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("createdAt", "customer", "date", "id", "notes", "providerId", "shop", "time") SELECT "createdAt", "customer", "date", "id", "notes", "providerId", "shop", "time" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE TABLE "new_Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "baseMinutes" INTEGER NOT NULL,
    "category" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Service" ("id", "name", "notes") SELECT "id", "name", "notes" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentAddOn_appointmentId_addOnId_key" ON "AppointmentAddOn"("appointmentId", "addOnId");

-- CreateIndex
CREATE UNIQUE INDEX "_ServiceAddons_AB_unique" ON "_ServiceAddons"("A", "B");

-- CreateIndex
CREATE INDEX "_ServiceAddons_B_index" ON "_ServiceAddons"("B");
