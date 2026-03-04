import { Injectable } from '@nestjs/common';
import type { AIProvider } from './ai-provider.interface';

@Injectable()
export class MockProvider implements AIProvider {
  async generate({
    prompt,
    temperature,
  }: {
    prompt: string;
    temperature?: number;
  }): Promise<string> {
    // Mock response based on prompt keywords
    console.log(`[MOCK] Generating with temperature: ${temperature}`);
    console.log(`[MOCK] Prompt: ${prompt.substring(0, 100)}...`);

    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    return `[MOCK RESPONSE] This is a simulated AI response for your prompt. Temperature: ${temperature}. In production, this would be replaced with actual Gemini API responses.`;
  }
}
