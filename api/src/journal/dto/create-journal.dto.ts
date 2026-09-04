import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateJournalDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  mood?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  energy?: number;
}
