import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ description: 'Message role', example: 'user', enum: ['user', 'assistant', 'system'] })
  @IsString()
  @IsIn(['user', 'assistant', 'system'])
  role: string;

  @ApiProperty({ description: 'Message content', example: 'Hello, how are you?' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
