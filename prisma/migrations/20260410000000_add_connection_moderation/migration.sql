-- Drop gamification tables/enums no longer in schema
DROP TABLE IF EXISTS "PointTransaction";
DROP TYPE IF EXISTS "PointActionType";

-- Remove gamification columns from User
ALTER TABLE "User" DROP COLUMN IF EXISTS "xp";
ALTER TABLE "User" DROP COLUMN IF EXISTS "level";
DROP INDEX IF EXISTS "User_xp_idx";
DROP INDEX IF EXISTS "User_level_idx";

-- CreateEnum: ConnectionStatus
CREATE TYPE "ConnectionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum: ModerationAction
CREATE TYPE "ModerationAction" AS ENUM ('FLAG_CREATED', 'FLAG_RESOLVED', 'CONTENT_DELETED');

-- CreateTable: Connection
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ModerationLog
CREATE TABLE "ModerationLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" "ModerationAction" NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "reason" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_senderId_recipientId_key" ON "Connection"("senderId", "recipientId");
CREATE INDEX "Connection_senderId_idx" ON "Connection"("senderId");
CREATE INDEX "Connection_recipientId_idx" ON "Connection"("recipientId");
CREATE INDEX "Connection_status_idx" ON "Connection"("status");
CREATE INDEX "ModerationLog_actorId_action_createdAt_idx" ON "ModerationLog"("actorId", "action", "createdAt");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ModerationLog" ADD CONSTRAINT "ModerationLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
