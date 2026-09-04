import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateObservationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsDateString()
  observedAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
