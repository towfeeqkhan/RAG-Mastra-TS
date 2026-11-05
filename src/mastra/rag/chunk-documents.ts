import { MDocument } from "@mastra/rag";
import { knowledgeDocuments } from "./knowledge-base";

export async function chunkKnowledgeDocuments() {
  const allChunks = [];

  for (const source of knowledgeDocuments) {
    const document = MDocument.fromText(source.content);

    const chunks = await document.chunk({
      strategy: "recursive",
      maxSize: 300,
      overlap: 50,
    });

    const sourceChunks = chunks.map((chunk, index) => ({
      id: `${source.id}-chunk-${index}`,
      text: chunk.text,
      metadata: {
        sourceId: source.id,
        title: source.title,
      },
    }));

    allChunks.push(...sourceChunks);
  }

  return allChunks;
}
