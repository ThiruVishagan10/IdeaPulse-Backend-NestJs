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
    const results: Record<string, any> = {};

    for (const tool of tools) {
      const prompt = buildIdeaStuioPrompt(tool, content, tone);
      const temperature = toolTemperatureMap[tool] ?? 0.5;

      const result = await this.provider.generate({
        prompt,
        temperature,
      });

      results[tool] = {
        content: result,
        metadata: {
          model: 'gemini-pro',
          timestamp: new Date().toISOString(),
        },
      };
    }

    return { results };
  }
}
