-- CreateEnum
CREATE TYPE "Action" AS ENUM ('Activate', 'Recovery');

-- CreateTable
CREATE TABLE "UserCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "Action" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCode_id_key" ON "UserCode"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserCode_action_userId_key" ON "UserCode"("action", "userId");

-- AddForeignKey
ALTER TABLE "UserCode" ADD CONSTRAINT "UserCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
