export const generatePropmt = (content: string) => `
You are an AI tagging assistant.

Identify 3–8 concise, descriptive tags for the idea.
Each tag should be 1–3 words.
Avoid generic tags like "idea" or "project".

Return the result as a JSON array of strings.

Idea content:
${content}
`;
