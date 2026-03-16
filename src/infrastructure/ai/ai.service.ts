import { Injectable } from '@nestjs/common';
import { GeminiProvider } from './providers/gemini.provider';
import { IdeaVaultService } from '../../features/idea-vault/idea-vault.service';

interface GenerateOptions {
  prompt: string;
  temperature?: number;
  model?: string;
}

@Injectable()
export class AiService {
  constructor(
    private readonly provider: GeminiProvider,
    private readonly ideaVaultService: IdeaVaultService,
  ) {}

  async generate(options: GenerateOptions): Promise<string> {
    const { prompt, temperature = 0.5 } = options;

    return await this.provider.generate({
      prompt,
      temperature,
    });
  }

  async runTool(toolName: string, prompt: string, ideaVersionId: string) {
    const aiOutput = await this.generate({ prompt });

    await this.ideaVaultService.saveAIResult(ideaVersionId, toolName, {
      content: aiOutput,
    });

    return aiOutput;
  }
}
