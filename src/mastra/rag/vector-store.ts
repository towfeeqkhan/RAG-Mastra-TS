import "dotenv/config";
import { LibSQLVector } from "@mastra/libsql";

const DB_PATH = process.env.KNOWLEDGE_DB_PATH;

if (!DB_PATH) {
  throw new Error(
    "KNOWLEDGE_DB_PATH is not set. Add it to .env as an absolute path.",
  );
}

export const vectorStore = new LibSQLVector({
  id: "jkssb-knowledge-vectors",
  url: `file:${DB_PATH}`,
});

export const INDEX_NAME = "jkssb_knowledge";
export const EMBEDDING_DIMENSIONS = 768;
