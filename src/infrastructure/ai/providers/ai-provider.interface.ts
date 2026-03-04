export interface AIProvider {
  generate(input: { prompt: string; temperature?: number }): Promise<string>;
}
