import { IsNotEmpty, IsString } from 'class-validator';

export class QueryAiDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
