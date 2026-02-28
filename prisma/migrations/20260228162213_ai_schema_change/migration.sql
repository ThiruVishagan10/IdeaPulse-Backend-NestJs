/*
  Warnings:

  - You are about to drop the column `prompt` on the `AIResult` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `AIResult` table. All the data in the column will be lost.
  - Added the required column `domain` to the `AIResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tool` to the `AIResult` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `response` on the `AIResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AIDomain" AS ENUM ('IDEA_STUDIO', 'ANALYZER', 'MOODBOARD');

-- AlterTable
ALTER TABLE "AIResult" DROP COLUMN "prompt",
DROP COLUMN "type",
ADD COLUMN     "domain" "AIDomain" NOT NULL,
ADD COLUMN     "ideaId" TEXT,
ADD COLUMN     "input" JSONB,
ADD COLUMN     "modelUsed" TEXT,
ADD COLUMN     "temperature" DOUBLE PRECISION,
ADD COLUMN     "tool" TEXT NOT NULL,
ALTER COLUMN "ideaVersionId" DROP NOT NULL,
DROP COLUMN "response",
ADD COLUMN     "response" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "AIResultType";

-- CreateIndex
CREATE INDEX "AIResult_ideaId_idx" ON "AIResult"("ideaId");

-- CreateIndex
CREATE INDEX "AIResult_domain_idx" ON "AIResult"("domain");

-- CreateIndex
CREATE INDEX "Idea_status_idx" ON "Idea"("status");

-- AddForeignKey
ALTER TABLE "AIResult" ADD CONSTRAINT "AIResult_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
