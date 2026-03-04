import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import type { AIProvider } from './ai-provider.interface';

@Injectable()
export class GeminiProvider implements AIProvider {
  private model: GenerativeModel;

  constructor() {
    const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    this.model = genAi.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });
  }

  async generate({
    prompt,
    temperature = 0.7,
  }: {
    prompt: string;
    temperature?: number;
  }): Promise<string> {
    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature },
    });
    const response = result.response;
    return response.text();
  }
}
