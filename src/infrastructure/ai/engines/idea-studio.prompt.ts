export function buildIdeaStudioPrompt(
  tool: string,
  content: string,
  tone?: string,
): string {
  switch (tool) {
    case 'REFINE':
      return `
You are a structured AI writing assistant.

Refine the following idea for clarity, coherence, and structure.
Do NOT change the core meaning.
Do NOT introduce new concepts.
Preserve the original intent.

Return only the improved version as plain text.

Idea content:
${content}
`;

    case 'EXPAND':
      return `
You are an AI creative expansion assistant.

Expand the following idea into a deeper explanation.
Add supporting reasoning, motivations, use cases, and examples.
Do NOT change the core concept.
Avoid unnecessary technical details unless implied.

Return only the expanded version as plain text.

Idea content:
${content}
`;

    case 'SUMMARIZE':
      return `
You are an AI summarization assistant.

Summarize the following idea clearly in 1–3 concise sentences.
Preserve the main meaning and intent.
Avoid adding new interpretation.

Return only the summary.

Idea content:
${content}
`;

    case 'TONE':
      if (!tone) {
        throw new Error('Tone is required for TONE transformation');
      }

      return `
You are an AI rewriting assistant.

Rewrite the following idea in a ${tone} tone.
Do NOT change the core meaning.
Preserve the original concept.

Return only the rewritten version.

Idea content:
${content}
`;

    case 'STRUCTURE':
      return `
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

    case 'GENERATE_TAGS':
      return `
You are an AI tagging assistant.

Identify 3–8 concise, descriptive tags for the idea.
Each tag should be 1–3 words.
Avoid generic tags like "idea" or "project".

Return the result as a JSON array of strings.

Idea content:
${content}
`;

    default:
      throw new Error(`Unsupported tool: ${tool}`);
  }
}
