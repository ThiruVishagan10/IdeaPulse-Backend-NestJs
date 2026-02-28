export interface AIProvider {
  generate(input: {
    title: string;
    content: string;
    type: string;
  }): Promise<string>;
}
