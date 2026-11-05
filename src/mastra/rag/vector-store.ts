import { LibSQLVector } from "@mastra/libsql";

export const vectorStore = new LibSQLVector({
  id: "jkssb-knowledge-vectors",
  url: "file:./knowledge.db",
});

export const INDEX_NAME = "jkssb_knowledge";
export const EMBEDDING_DIMENSIONS = 1024;
