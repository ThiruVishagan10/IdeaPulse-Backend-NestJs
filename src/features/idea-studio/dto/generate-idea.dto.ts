import { IsEnum } from 'class-validator';
import { IdeaStudioTool } from '../enums/idea-studio-tool.enum';

export class GenerateIdeaDto {
  content: string;

  @IsEnum(IdeaStudioTool, { each: true })
  tools: IdeaStudioTool[];
}
