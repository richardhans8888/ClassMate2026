-- AlterTable
ALTER TABLE "StudyMaterial" DROP COLUMN "rating",
DROP COLUMN "reviewCount";

-- DropIndex
DROP INDEX IF EXISTS "StudyMaterial_rating_idx";
