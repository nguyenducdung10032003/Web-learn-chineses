// dto/create-deck.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFlashcardDto {
  @IsNotEmpty()
  @IsString()
  chinese: string;

  @IsOptional()
  @IsString()
  pinyin?: string;

  @IsNotEmpty()
  @IsString()
  vietnamese: string;
}

export class CreateDeckDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  flashcards?: CreateFlashcardDto[];
}
