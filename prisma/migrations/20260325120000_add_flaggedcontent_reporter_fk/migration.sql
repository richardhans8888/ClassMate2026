-- AddForeignKey
ALTER TABLE "FlaggedContent" ADD CONSTRAINT "FlaggedContent_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
