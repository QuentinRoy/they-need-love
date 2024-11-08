-- AlterTable
ALTER TABLE "Operation" ADD COLUMN     "creatorId" TEXT;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
