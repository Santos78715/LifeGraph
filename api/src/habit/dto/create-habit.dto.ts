import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { HabitStatus } from '../../../generated/prisma/client';

export class CreateHabitDto {
  @ApiProperty({ description: 'Habit name', example: 'Meditate daily' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Habit description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Frequency pattern', example: 'daily' })
  @IsString()
  @IsNotEmpty()
  frequency: string;

  @ApiPropertyOptional({ description: 'Target value', example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  target?: number;

  @ApiPropertyOptional({ enum: HabitStatus, description: 'Habit status' })
  @IsOptional()
  @IsEnum(HabitStatus)
  status?: HabitStatus;
}
