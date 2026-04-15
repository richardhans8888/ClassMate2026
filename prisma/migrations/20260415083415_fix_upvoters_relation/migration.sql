/*
  Warnings:

  - You are about to drop the `_upvoters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_upvoters" DROP CONSTRAINT "_upvoters_A_fkey";

-- DropForeignKey
ALTER TABLE "_upvoters" DROP CONSTRAINT "_upvoters_B_fkey";

-- DropTable
DROP TABLE "_upvoters";

-- CreateTable
CREATE TABLE "_postUpvoters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_postUpvoters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_replyUpvoters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_replyUpvoters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_postUpvoters_B_index" ON "_postUpvoters"("B");

-- CreateIndex
CREATE INDEX "_replyUpvoters_B_index" ON "_replyUpvoters"("B");

-- AddForeignKey
ALTER TABLE "_postUpvoters" ADD CONSTRAINT "_postUpvoters_A_fkey" FOREIGN KEY ("A") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_postUpvoters" ADD CONSTRAINT "_postUpvoters_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_replyUpvoters" ADD CONSTRAINT "_replyUpvoters_A_fkey" FOREIGN KEY ("A") REFERENCES "ForumReply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_replyUpvoters" ADD CONSTRAINT "_replyUpvoters_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
