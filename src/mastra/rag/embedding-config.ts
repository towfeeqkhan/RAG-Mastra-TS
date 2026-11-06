export const EMBEDDING_MODEL = "gemini-embedding-2";

// Asymmetric retrieval format recommended for gemini-embedding-2
export const formatQuery = (query: string) =>
  `task: search result | query: ${query}`;

export const formatDocument = (text: string, title = "none") =>
  `title: ${title} | text: ${text}`;
