-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.

CREATE EXTENSION IF NOT EXISTS vector;
ALTER TYPE "MemorySourceType" ADD VALUE 'GOAL';
ALTER TYPE "MemorySourceType" ADD VALUE 'DOCUMENT';
ALTER TYPE "MemorySourceType" ADD VALUE 'ENTITY';

-- CreateTable
CREATE TABLE "Embedding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceType" "MemorySourceType" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(768) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Embedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIInteraction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT,
    "model" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "latencyMs" INTEGER,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceReference" (
    "id" TEXT NOT NULL,
    "aiInteractionId" TEXT NOT NULL,
    "sourceType" "MemorySourceType" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "relevanceScore" DOUBLE PRECISION,

    CONSTRAINT "SourceReference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Embedding_userId_sourceType_idx" ON "Embedding"("userId", "sourceType");

-- CreateIndex
CREATE INDEX "Embedding_sourceType_sourceId_idx" ON "Embedding"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "AIInteraction_userId_createdAt_idx" ON "AIInteraction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AIInteraction_conversationId_idx" ON "AIInteraction"("conversationId");

-- CreateIndex
CREATE INDEX "AIInteraction_provider_model_idx" ON "AIInteraction"("provider", "model");

-- CreateIndex
CREATE INDEX "Conversation_userId_updatedAt_idx" ON "Conversation"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "SourceReference_aiInteractionId_idx" ON "SourceReference"("aiInteractionId");

-- CreateIndex
CREATE INDEX "SourceReference_sourceType_sourceId_idx" ON "SourceReference"("sourceType", "sourceId");

-- AddForeignKey
ALTER TABLE "Embedding" ADD CONSTRAINT "Embedding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIInteraction" ADD CONSTRAINT "AIInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIInteraction" ADD CONSTRAINT "AIInteraction_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceReference" ADD CONSTRAINT "SourceReference_aiInteractionId_fkey" FOREIGN KEY ("aiInteractionId") REFERENCES "AIInteraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
