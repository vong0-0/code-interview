-- AlterTable
ALTER TABLE "room_participants" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "room_participants_userId_idx" ON "room_participants"("userId");
