export const refinePrompt = (content: string) => `
You are a structured AI writing assistant.

Refine the following idea for clarity, coherence, and structure.
Do NOT change the core meaning.
Do NOT introduce new concepts.
Preserve the original intent.

Return only the improved version as plain text.

Idea content:
${content}
`;
