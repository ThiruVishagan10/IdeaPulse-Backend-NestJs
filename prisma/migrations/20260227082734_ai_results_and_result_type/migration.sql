-- CreateEnum
CREATE TYPE "VersionSource" AS ENUM ('USER', 'AI');

-- CreateEnum
CREATE TYPE "AIResultType" AS ENUM ('SUGGESTION', 'SUMMARY', 'ENHANCEMENT', 'ANALYSIS');

-- AlterTable
ALTER TABLE "IdeaVersion" ADD COLUMN     "aiResultId" TEXT,
ADD COLUMN     "parentVersionId" TEXT,
ADD COLUMN     "sourceType" "VersionSource" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "AIResult" (
    "id" TEXT NOT NULL,
    "ideaVersionId" TEXT NOT NULL,
    "type" "AIResultType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIResult_ideaVersionId_idx" ON "AIResult"("ideaVersionId");

-- AddForeignKey
ALTER TABLE "AIResult" ADD CONSTRAINT "AIResult_ideaVersionId_fkey" FOREIGN KEY ("ideaVersionId") REFERENCES "IdeaVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
