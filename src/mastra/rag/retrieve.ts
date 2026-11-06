import "dotenv/config";
import { createVoyage } from "@ai-sdk/voyage";
import { embed } from "ai";
import { INDEX_NAME, vectorStore } from "./vector-store";

const voyage = createVoyage({
  apiKey: process.env.VOYAGE_API_KEY,
});

export async function retrieveRelevantChunks(question: string) {
  const { embedding } = await embed({
    model: voyage.embedding("voyage-4-large"),
    value: question,
  });

  const results = await vectorStore.query({
    indexName: INDEX_NAME,
    queryVector: embedding,
    topK: 3,
  });

  return results.map((result) => ({
    id: result.id,
    score: result.score,
    text: result.metadata?.text,
    title: result.metadata?.title,
    sourceId: result.metadata?.sourceId,
  }));
}
