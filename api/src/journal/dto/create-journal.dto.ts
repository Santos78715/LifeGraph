import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateJournalDto {
  @ApiProperty({ description: 'Journal entry title', example: 'A productive day' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Journal content', example: 'Today I worked on the LifeGraph project...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Mood score 1-10', example: 7 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  mood?: number;

  @ApiPropertyOptional({ description: 'Energy level 1-10', example: 8 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  energy?: number;
}
