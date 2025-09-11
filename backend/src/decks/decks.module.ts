import { Module } from '@nestjs/common';
import { DecksService } from './decks.service';
import { DecksController } from './decks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deck } from './entities/deck.entity';
import { Flashcard } from './entities/flashcard.entity';
import { StudyActivity } from './entities/studyActivity.entity';
import { StudyStats } from './entities/studyStats.entity';
import { UserDeck } from './entities/user-deck.entity'
import { UserActivity } from 'src/users/entities/user-activity.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deck, Flashcard, StudyStats, StudyActivity, UserDeck, UserActivity, User ])],
  controllers: [DecksController],
  providers: [DecksService],
})
export class DecksModule {}
