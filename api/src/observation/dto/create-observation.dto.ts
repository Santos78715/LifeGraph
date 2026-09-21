import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateObservationDto {
  @ApiPropertyOptional({ description: 'Related entity ID' })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiProperty({ description: 'Observation type', example: 'weight' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Observed value', example: 75.5 })
  @IsNumber()
  value: number;

  @ApiPropertyOptional({ description: 'Unit of measurement', example: 'kg' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'When the observation was made' })
  @IsOptional()
  @IsDateString()
  observedAt?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
