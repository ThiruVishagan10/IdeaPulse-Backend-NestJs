-- CreateIndex
CREATE INDEX "Idea_userId_idx" ON "Idea"("userId");

-- CreateIndex
CREATE INDEX "IdeaVersion_ideaId_idx" ON "IdeaVersion"("ideaId");

-- CreateIndex
CREATE INDEX "IdeaVersion_isCurrent_idx" ON "IdeaVersion"("isCurrent");
