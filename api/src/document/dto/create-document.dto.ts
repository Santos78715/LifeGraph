import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Document name', example: 'meeting-notes.md' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'MIME type', example: 'text/markdown' })
  @IsString()
  @Matches(/^(text\/.+|application\/(json|markdown))$/)
  mimeType: string;

  @ApiProperty({ description: 'Document text content (max 100K chars)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100_000)
  content: string;
}
