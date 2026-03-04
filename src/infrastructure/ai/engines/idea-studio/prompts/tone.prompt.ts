export const tonePrompt = (content: string, tone: string) => `
You are an AI rewriting assistant.

Rewrite the following idea in a ${tone} tone.
Do NOT change the core meaning.
Preserve the original concept.

Return only the rewritten version.

Idea content:
${content}
`;
