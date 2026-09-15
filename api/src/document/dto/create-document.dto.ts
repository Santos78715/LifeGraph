import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @Matches(/^(text\/.+|application\/(json|markdown))$/)
  mimeType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100_000)
  content: string;
}
