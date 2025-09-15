-- CreateTable
CREATE TABLE "BookingAppointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "durationId" TEXT,
    "staffId" TEXT,
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'booked',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BookingAppointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookingAppointment_durationId_fkey" FOREIGN KEY ("durationId") REFERENCES "ServiceDuration" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BookingAppointment_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "BookingAppointment_serviceId_idx" ON "BookingAppointment"("serviceId");

-- CreateIndex
CREATE INDEX "BookingAppointment_staffId_idx" ON "BookingAppointment"("staffId");

-- CreateIndex
CREATE INDEX "BookingAppointment_startsAt_idx" ON "BookingAppointment"("startsAt");
