-- CreateTable
CREATE TABLE "FlaggedContent" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "resolvedBy" TEXT,
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "FlaggedContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FlaggedContent_reporterId_idx" ON "FlaggedContent"("reporterId");

-- CreateIndex
CREATE INDEX "FlaggedContent_contentType_contentId_idx" ON "FlaggedContent"("contentType", "contentId");

-- CreateIndex
CREATE INDEX "FlaggedContent_status_idx" ON "FlaggedContent"("status");

-- CreateIndex
CREATE INDEX "FlaggedContent_createdAt_idx" ON "FlaggedContent"("createdAt");
