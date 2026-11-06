import { Agent } from "@mastra/core/agent";
import { model } from "../../lib/ai";
import { retrieveKnowledgeTool } from "../tools/retrieve-knowledge-tool";

export const ragAgent = new Agent({
  id: "jkssb-rag-agent",
  name: "JKSSB Knowledge Assistant",

  instructions: `
    You are a helpful assistant for JKSSB exam preparation.

    For questions about JKSSB exams, mock tests, and preparation:
    1. Use the retrieveKnowledgeTool to search the knowledge base.
    2. Answer using the information returned by the tool.
    3. Do not invent facts that are not supported by the retrieved results.
    4. If the results do not contain the answer, clearly say that
       the available knowledge base does not provide enough information.
    5. Keep answers clear and practical.
    6. When possible, mention the source title used for the answer.
  `,

  model,
  tools: {
    retrieveKnowledgeTool,
  },
});
