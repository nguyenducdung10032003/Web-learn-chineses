import { Module } from '@nestjs/common';
import { DecksService } from './decks.service';
import { DecksController } from './decks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deck } from './entities/deck.entity';
import { Flashcard } from './entities/flashcard.entity';
import { StudyActivity } from './entities/studyActivity.entity';
import { StudyStats } from './entities/studyStats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deck, Flashcard, StudyStats, StudyActivity])],
  controllers: [DecksController],
  providers: [DecksService],
})
export class DecksModule {}
