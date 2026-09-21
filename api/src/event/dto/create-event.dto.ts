import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { LifeEventType } from '../../../generated/prisma/client';

export class CreateEventDto {
  @ApiProperty({ description: 'Event title', example: 'Started new job at Google' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Event description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: LifeEventType, description: 'Type of life event' })
  @IsEnum(LifeEventType)
  type: LifeEventType;

  @ApiProperty({ description: 'Start date/time', example: '2026-09-01T00:00:00Z' })
  @IsDateString()
  startAt: string;

  @ApiPropertyOptional({ description: 'End date/time' })
  @IsOptional()
  @IsDateString()
  endAt?: string;

  @ApiPropertyOptional({ description: 'Location entity ID' })
  @IsOptional()
  @IsString()
  locationId?: string;
}
