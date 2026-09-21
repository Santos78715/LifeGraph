import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { RelationshipType } from '../../../generated/prisma/client';

export class CreateRelationshipDto {
  @ApiProperty({ description: 'Source entity ID' })
  @IsString()
  @IsNotEmpty()
  sourceEntityId: string;

  @ApiProperty({ description: 'Target entity ID' })
  @IsString()
  @IsNotEmpty()
  targetEntityId: string;

  @ApiProperty({ enum: RelationshipType, description: 'Type of relationship' })
  @IsEnum(RelationshipType)
  relationshipType: RelationshipType;

  @ApiPropertyOptional({ description: 'Relationship weight', example: 1.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ description: 'Confidence score 0-1', example: 0.8 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
