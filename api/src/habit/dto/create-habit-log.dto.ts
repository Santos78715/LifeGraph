import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateHabitLogDto {
  @ApiPropertyOptional({ description: 'Whether the habit was completed', example: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional({ description: 'Quantitative value', example: 20 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @ApiProperty({ description: 'Date of the log entry', example: '2026-09-21' })
  @IsDateString()
  date: string;
}
