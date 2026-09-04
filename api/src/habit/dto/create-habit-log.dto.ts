import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateHabitLogDto {
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @IsDateString()
  date: string;
}
