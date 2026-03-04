import { refinePrompt } from './prompts/refine.prompt';
import { tonePrompt } from './prompts/tone.prompt';
import { summarizePrompt } from './prompts/summarize.prompt';
import { expandPrompt } from './prompts/expand.prompt';
import { structurePrompt } from './prompts/structure.prompt';
import { generatePropmt } from './prompts/generate.prompt';

type PromptBuilder = (content: string, tone?: string) => string;

const PromptMap: Record<string, PromptBuilder> = {
  REFINE: (content) => refinePrompt(content),
  TONE: (content, tone) => {
    if (!tone) throw new Error('Tone is required for Tone tool');
    return tonePrompt(content, tone);
  },
  SUMMARIZE: (content) => summarizePrompt(content),
  EXPAND: (content) => expandPrompt(content),
  STRUCTURE: (content) => structurePrompt(content),
  GENERATE_TAGS: (content) => generatePropmt(content),
};

export function buildIdeaStuioPrompt(
  tool: string,
  content: string,
  tone?: string,
): string {
  const builder = PromptMap[tool];

  if (!builder) throw new Error('Unsupported Tool used');

  return builder(content, tone);
}
