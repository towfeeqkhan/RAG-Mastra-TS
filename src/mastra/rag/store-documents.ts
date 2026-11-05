import "dotenv/config";
import { embedMany } from "ai";
import { createVoyage } from "@ai-sdk/voyage";

import { chunkKnowledgeDocuments } from "./chunk-documents";
import { vectorStore, INDEX_NAME, EMBEDDING_DIMENSIONS } from "./vector-store";

const voyage = createVoyage({
  apiKey: process.env.VOYAGE_API_KEY,
});

async function main() {
  // 1. Prepare the chunks.
  const chunks = await chunkKnowledgeDocuments();

  // 2. Generate embeddings using Voyage.
  const { embeddings } = await embedMany({
    model: voyage.embedding("voyage-4-large"),
    values: chunks.map((chunk) => chunk.text),
  });

  // 3. Verify that every vector has the expected dimensions.
  if (
    embeddings.length !== chunks.length ||
    embeddings.some((embedding) => embedding.length !== EMBEDDING_DIMENSIONS)
  ) {
    throw new Error("Chunk and embedding counts or dimensions do not match.");
  }

  // 4. Create the index only if it doesn't already exist.
  const indexes = await vectorStore.listIndexes();

  if (!indexes.includes(INDEX_NAME)) {
    await vectorStore.createIndex({
      indexName: INDEX_NAME,
      dimension: EMBEDDING_DIMENSIONS,
      metric: "cosine",
    });

    console.log("Created vector index:", INDEX_NAME);
  }

  // 5. Store vectors and their associated metadata.
  await vectorStore.upsert({
    indexName: INDEX_NAME,
    vectors: embeddings,
    ids: chunks.map((chunk) => chunk.id),
    metadata: chunks.map((chunk) => ({
      text: chunk.text,
      sourceId: chunk.metadata.sourceId,
      title: chunk.metadata.title,
    })),
  });

  // 6. Verify the index.
  const stats = await vectorStore.describeIndex({
    indexName: INDEX_NAME,
  });

  console.log("✅ Documents stored successfully!");
  console.log("Vectors processed:", embeddings.length);
  console.log("Index dimensions:", stats.dimension);
  console.log("Total vectors in index:", stats.count);
}

main().catch((error) => {
  console.error("Failed to store documents:", error);
  process.exitCode = 1;
});
