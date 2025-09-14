/*
  Warnings:

  - A unique constraint covering the columns `[providerId,dayOfWeek]` on the table `Availability` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `AddOn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Provider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AddOn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "minutes" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AddOn" ("active", "id", "minutes", "name", "price") SELECT "active", "id", "minutes", "name", "price" FROM "AddOn";
DROP TABLE "AddOn";
ALTER TABLE "new_AddOn" RENAME TO "AddOn";
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Appointment_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("createdAt", "customer", "date", "id", "notes", "paymentMethod", "paymentStatus", "providerId", "serviceId", "shop", "subtotalCents", "taxCents", "time", "totalCents") SELECT "createdAt", "customer", "date", "id", "notes", "paymentMethod", "paymentStatus", "providerId", "serviceId", "shop", "subtotalCents", "taxCents", "time", "totalCents" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE INDEX "Appointment_providerId_date_idx" ON "Appointment"("providerId", "date");
CREATE INDEX "Appointment_serviceId_idx" ON "Appointment"("serviceId");
CREATE TABLE "new_AppointmentAddOn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appointmentId" TEXT NOT NULL,
    "addOnId" TEXT NOT NULL,
    CONSTRAINT "AppointmentAddOn_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AppointmentAddOn_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "AddOn" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AppointmentAddOn" ("addOnId", "appointmentId", "id") SELECT "addOnId", "appointmentId", "id" FROM "AppointmentAddOn";
DROP TABLE "AppointmentAddOn";
ALTER TABLE "new_AppointmentAddOn" RENAME TO "AppointmentAddOn";
CREATE UNIQUE INDEX "AppointmentAddOn_appointmentId_addOnId_key" ON "AppointmentAddOn"("appointmentId", "addOnId");
CREATE TABLE "new_Provider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Provider" ("id", "name") SELECT "id", "name" FROM "Provider";
DROP TABLE "Provider";
ALTER TABLE "new_Provider" RENAME TO "Provider";
CREATE TABLE "new_Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "baseMinutes" INTEGER NOT NULL,
    "category" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Service" ("active", "baseMinutes", "basePrice", "category", "id", "name", "notes") SELECT "active", "baseMinutes", "basePrice", "category", "id", "name", "notes" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Availability_providerId_dayOfWeek_key" ON "Availability"("providerId", "dayOfWeek");
