import { IsNumber, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class RecordStudyDto {
  @IsNumber()
  deckId: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  flashcardIds?: number[];

  @IsBoolean()
  correct: boolean;

  @IsOptional()
  @IsNumber()
  timeSpent: number;
}

// import { IsNumber, IsBoolean, IsArray, ValidateNested, IsOptional } from 'class-validator';
// import { Type } from 'class-transformer';

// // 1. Định nghĩa class con cho từng flashcard
// export class FlashcardResult {
//   @IsNumber()
//   flashcardId: number;

//   @IsBoolean()
//   correct: boolean;
// }

// // 2. DTO chính
// export class RecordStudyDto {
//   @IsNumber()
//   deckId: number;

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => FlashcardResult)
//   flashcardResults?: FlashcardResult[];

//   @IsOptional()
//   @IsNumber()
//   timeSpent?: number;
// }
