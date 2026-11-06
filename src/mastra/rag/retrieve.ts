import "dotenv/config";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embed } from "ai";
import { EMBEDDING_DIMENSIONS, INDEX_NAME, vectorStore } from "./vector-store";
import { EMBEDDING_MODEL, formatQuery } from "./embedding-config";

const google = createGoogleGenerativeAI();

export async function retrieveRelevantChunks(question: string) {
  const { embedding } = await embed({
    model: google.embedding(EMBEDDING_MODEL),
    value: formatQuery(question),
    dimensions: EMBEDDING_DIMENSIONS,
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
