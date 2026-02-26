import { IsString, MinLength } from 'class-validator';

export class CreateVersionDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  content: string;
}
