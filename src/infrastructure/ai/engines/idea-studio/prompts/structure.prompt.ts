export const structurePrompt = (content: string) => `
You are an AI structuring assistant.

Break the following idea into structured sections:

- Problem
- Solution Concept
- Target Users
- Key Features
- Expected Outcomes

Use bullet points.
Do NOT add information not present in the idea.

Return only the structured content.

Idea content:
${content}
`;
