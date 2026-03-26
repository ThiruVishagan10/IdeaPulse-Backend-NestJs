-- CreateEnum
CREATE TYPE "AITool" AS ENUM ('EXPAND', 'SUMMARIZE', 'USE_CASES', 'TECHNICAL', 'MARKET_POSITIONING', 'ROADMAP', 'CHAIN');

-- AlterTable
ALTER TABLE "AIResult" ALTER COLUMN "tool" TYPE "AITool" USING "tool"::"AITool";

-- AlterTable
ALTER TABLE "Idea" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "VersionTool" (
    "id" TEXT NOT NULL,
    "ideaVersionId" TEXT NOT NULL,
    "tool" "AITool" NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VersionTool_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VersionTool_ideaVersionId_idx" ON "VersionTool"("ideaVersionId");

-- AddForeignKey
ALTER TABLE "VersionTool" ADD CONSTRAINT "VersionTool_ideaVersionId_fkey" FOREIGN KEY ("ideaVersionId") REFERENCES "IdeaVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
