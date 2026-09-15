-- Cosine-distance ANN index used by the RAG memory search endpoint.
CREATE INDEX IF NOT EXISTS "Embedding_embedding_hnsw_idx"
  ON "Embedding" USING hnsw ("embedding" vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
