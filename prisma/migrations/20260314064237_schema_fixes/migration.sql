-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PointActionType" ADD VALUE 'STUDY_GROUP_JOINED';
ALTER TYPE "PointActionType" ADD VALUE 'BOOKING_CREATED';
ALTER TYPE "PointActionType" ADD VALUE 'BOOKING_SESSION_COMPLETED';
ALTER TYPE "PointActionType" ADD VALUE 'TUTOR_SESSION_REWARDED';

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "hourlyRate" SET DEFAULT 0,
ALTER COLUMN "totalPrice" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE "StudyGroup" ADD COLUMN     "inviteCode" TEXT;
