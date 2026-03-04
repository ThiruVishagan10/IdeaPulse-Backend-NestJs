import { Injectable } from '@nestjs/common';
import { GeminiProvider } from './providers/gemini.provider';

interface GenerateOptions {
  prompt: string;
  temperature?: number;
  model?: string;
}

@Injectable()
export class AiService {
  constructor(private readonly provider: GeminiProvider) {}

  async generate(options: GenerateOptions): Promise<string> {
    const { prompt, temperature = 0.5 } = options;

    return await this.provider.generate({
      prompt,
      temperature,
    });
  }
}
