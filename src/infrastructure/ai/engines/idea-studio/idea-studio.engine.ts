import { Injectable } from '@nestjs/common';
import { buildIdeaStuioPrompt } from './idea-studio.prompt';
import { toolTemperatureMap } from './idea-studio.config';
import { GeminiProvider } from '../../providers/gemini.provider';

@Injectable()
export class IdeaStudioEngine {
  constructor(private readonly provider: GeminiProvider) {}

  async run({
    content,
    tools,
    tone,
  }: {
    content: string;
    tools: string[];
    tone?: string;
  }) {
    let workingContent = content;
    const steps: Array<{ tool: string; output: string }> = [];

    for (const tool of tools) {
      const prompt = buildIdeaStuioPrompt(tool, workingContent, tone);
      const temperature = toolTemperatureMap[tool] ?? 0.5;

      const result = await this.provider.generate({
        prompt,
        temperature,
      });

      steps.push({ tool, output: result });
      workingContent = result;
    }

    return {
      finalOutput: workingContent,
      steps,
    };
  }
}
