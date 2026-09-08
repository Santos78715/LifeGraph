-- Make journal extraction retry-safe and allow embeddings to identify memories.
ALTER TYPE "MemorySourceType" ADD VALUE IF NOT EXISTS 'MEMORY';

CREATE UNIQUE INDEX "LifeEntity_userId_type_name_key"
  ON "LifeEntity"("userId", "type", "name");

CREATE UNIQUE INDEX "Memory_sourceType_sourceId_content_key"
  ON "Memory"("sourceType", "sourceId", "content");

CREATE UNIQUE INDEX "Embedding_userId_sourceType_sourceId_key"
  ON "Embedding"("userId", "sourceType", "sourceId");
