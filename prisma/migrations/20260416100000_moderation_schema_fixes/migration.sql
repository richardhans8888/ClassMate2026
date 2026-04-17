-- CreateEnum
CREATE TYPE "FlagStatus" AS ENUM ('pending', 'dismissed', 'resolved');

-- CreateEnum
CREATE TYPE "ModerationTargetType" AS ENUM ('post', 'reply', 'material', 'ForumPost', 'ForumReply', 'StudyMaterial', 'FlaggedContent');

-- AlterTable: FlaggedContent.status String -> FlagStatus
-- Convert existing values and change column type
ALTER TABLE "FlaggedContent"
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "FlagStatus" USING (
    CASE "status"
      WHEN 'pending'   THEN 'pending'::"FlagStatus"
      WHEN 'dismissed' THEN 'dismissed'::"FlagStatus"
      WHEN 'resolved'  THEN 'resolved'::"FlagStatus"
      ELSE 'pending'::"FlagStatus"
    END
  ),
  ALTER COLUMN "status" SET DEFAULT 'pending'::"FlagStatus";

-- AlterTable: FlaggedContent add resolver FK
ALTER TABLE "FlaggedContent"
  ADD COLUMN IF NOT EXISTS "resolvedBy" TEXT;

-- AlterTable: ModerationLog.targetType String -> ModerationTargetType
ALTER TABLE "ModerationLog"
  ALTER COLUMN "targetType" TYPE "ModerationTargetType" USING (
    CASE "targetType"
      WHEN 'post'           THEN 'post'::"ModerationTargetType"
      WHEN 'reply'          THEN 'reply'::"ModerationTargetType"
      WHEN 'material'       THEN 'material'::"ModerationTargetType"
      WHEN 'ForumPost'      THEN 'ForumPost'::"ModerationTargetType"
      WHEN 'ForumReply'     THEN 'ForumReply'::"ModerationTargetType"
      WHEN 'StudyMaterial'  THEN 'StudyMaterial'::"ModerationTargetType"
      WHEN 'FlaggedContent' THEN 'FlaggedContent'::"ModerationTargetType"
      ELSE 'post'::"ModerationTargetType"
    END
  );

-- AddForeignKey: FlaggedContent.resolvedBy -> User.id
ALTER TABLE "FlaggedContent"
  ADD CONSTRAINT "FlaggedContent_resolvedBy_fkey"
  FOREIGN KEY ("resolvedBy") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: Notification
CREATE TABLE "Notification" (
    "id"        TEXT        NOT NULL,
    "userId"    TEXT        NOT NULL,
    "type"      TEXT        NOT NULL,
    "message"   TEXT        NOT NULL,
    "isRead"    BOOLEAN     NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey: Notification.userId -> User.id
ALTER TABLE "Notification"
  ADD CONSTRAINT "Notification_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");
