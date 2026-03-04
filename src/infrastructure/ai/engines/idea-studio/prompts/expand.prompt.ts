export const expandPrompt = (content: string) => `
You are an AI creative expansion assistant.

Expand the following idea into a deeper explanation.
Add supporting reasoning, motivations, use cases, and examples.
Do NOT change the core concept.
Avoid unnecessary technical details unless implied.

Return only the expanded version as plain text.

Idea content:
${content}
`;
