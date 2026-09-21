import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ description: 'Conversation title', example: 'My first chat' })
  @IsString()
  @IsNotEmpty()
  title: string;
}
