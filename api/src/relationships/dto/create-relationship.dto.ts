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
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  sourceEntityId: string;

  @IsString()
  @IsNotEmpty()
  targetEntityId: string;

  @IsEnum(RelationshipType)
  relationshipType: RelationshipType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
