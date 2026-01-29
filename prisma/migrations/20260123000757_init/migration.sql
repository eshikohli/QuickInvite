-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "style" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "publicSlug" TEXT NOT NULL,
    "hostSlug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RSVP" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inviteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RSVP_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "Invite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Invite_publicSlug_key" ON "Invite"("publicSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_hostSlug_key" ON "Invite"("hostSlug");
