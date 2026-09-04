import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { MemorySourceType, MemoryType } from '../../../generated/prisma/client';

export class CreateMemoryDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(MemoryType)
  type: MemoryType;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  importance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @IsOptional()
  @IsEnum(MemorySourceType)
  sourceType?: MemorySourceType;

  @IsOptional()
  @IsString()
  sourceId?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
