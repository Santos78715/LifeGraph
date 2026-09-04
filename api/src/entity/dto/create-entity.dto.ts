import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { LifeEntityType } from '../../../generated/prisma/client';

export class CreateEntityDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(LifeEntityType)
  type: LifeEntityType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
