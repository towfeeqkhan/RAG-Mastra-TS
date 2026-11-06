import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import { retrieveRelevantChunks } from "../rag/retrieve";

export const retrieveKnowledgeTool = createTool({
  id: "retrieve-knowledge",
  description:
    "Search the JKSSB knowledge base for relevant information. " +
    "Use this tool before answering questions about JKSSB exam " +
    "preparation, mock tests, or the stored knowledge.",

  inputSchema: z.object({
    question: z.string().describe("The user's question"),
  }),

  execute: async ({ question }) => {
    const chunks = await retrieveRelevantChunks(question);

    return {
      results: chunks.map((chunk) => ({
        title: chunk.title,
        sourceId: chunk.sourceId,
        text: chunk.text,
        score: chunk.score,
      })),
    };
  },
});
