import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { IdeaStudioTool } from '../enums/idea-studio-tool.enum';

export class GenerateIdeaDto {
  @IsString()
  content: string;

  @IsArray()
  @IsEnum(IdeaStudioTool, { each: true })
  tools: IdeaStudioTool[];

  @IsOptional()
  @IsString()
  tone?: string;
}
