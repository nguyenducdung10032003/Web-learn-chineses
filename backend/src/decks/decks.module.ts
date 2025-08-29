import { Module } from '@nestjs/common';
import { DecksService } from './decks.service';
import { DecksController } from './decks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deck } from './entities/deck.entity';
import { Flashcard } from './entities/flashcard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deck, Flashcard])],
  controllers: [DecksController],
  providers: [DecksService],
})
export class DecksModule {}
