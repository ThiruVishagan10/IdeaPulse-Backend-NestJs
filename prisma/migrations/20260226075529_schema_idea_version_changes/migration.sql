/*
  Warnings:

  - You are about to drop the column `isCurrent` on the `IdeaVersion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ideaId,version]` on the table `IdeaVersion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `IdeaVersion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `IdeaVersion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Idea" DROP CONSTRAINT "Idea_userId_fkey";

-- DropForeignKey
ALTER TABLE "IdeaVersion" DROP CONSTRAINT "IdeaVersion_ideaId_fkey";

-- DropIndex
DROP INDEX "IdeaVersion_ideaId_idx";

-- DropIndex
DROP INDEX "IdeaVersion_isCurrent_idx";

-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "currentVersion" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "IdeaVersion" DROP COLUMN "isCurrent",
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "IdeaVersion_ideaId_version_idx" ON "IdeaVersion"("ideaId", "version" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "IdeaVersion_ideaId_version_key" ON "IdeaVersion"("ideaId", "version");

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdeaVersion" ADD CONSTRAINT "IdeaVersion_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
