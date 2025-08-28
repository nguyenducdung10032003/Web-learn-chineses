import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Game } from './entities/game.entity';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';
import { MatchingPair } from './entities/matchingPair.entiry';
import { WordOrder } from './entities/wordOrder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Question, Option, MatchingPair, WordOrder])],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
