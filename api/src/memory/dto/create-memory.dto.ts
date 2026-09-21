import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ enum: MemoryType, description: 'Type of memory' })
  @IsEnum(MemoryType)
  type: MemoryType;

  @ApiProperty({ description: 'Memory content', example: 'I learned that TypeScript is great' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Importance score 0-1', example: 0.7 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  importance?: number;

  @ApiPropertyOptional({ description: 'Confidence score 0-1', example: 0.8 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @ApiPropertyOptional({ enum: MemorySourceType, description: 'Source type' })
  @IsOptional()
  @IsEnum(MemorySourceType)
  sourceType?: MemorySourceType;

  @ApiPropertyOptional({ description: 'Source ID reference' })
  @IsOptional()
  @IsString()
  sourceId?: string;

  @ApiPropertyOptional({ description: 'Expiration date', example: '2027-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
