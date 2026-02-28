import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider } from './ai-provider.interface';
import { title } from 'process';

@Injectable()
export class GeminiProvider implements AIProvider {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  async generate(input: {
    title: string;
    content: string;
    type: string;
  }): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const prompt = this.buildPrompt(title, contentSecurityPolicy, type);

    const result = await model.generateContent(prompt);
    const reponse = await result.response;

    return reponse.text();
  }

  private buildPrompt(title: string, content: string, type: string){
    switch(type){
        case 'Summary'
    }
  }
}
