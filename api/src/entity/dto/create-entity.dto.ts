import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { LifeEntityType } from '../../../generated/prisma/client';

export class CreateEntityDto {
  @ApiProperty({ enum: LifeEntityType, description: 'Entity type' })
  @IsEnum(LifeEntityType)
  type: LifeEntityType;

  @ApiProperty({ description: 'Entity name', example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Entity description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
