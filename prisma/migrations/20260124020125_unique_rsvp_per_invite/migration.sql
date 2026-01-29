/*
  Warnings:

  - A unique constraint covering the columns `[inviteId,name]` on the table `RSVP` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RSVP_inviteId_name_key" ON "RSVP"("inviteId", "name");
