import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { Question } from './entities/question.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gamesRepository: Repository<Game>,

    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    
  ) {}

  create(createGameDto: CreateGameDto) {
    const game = this.gamesRepository.create(createGameDto);
    return this.gamesRepository.save(game);
  }

  findAll() {
    return this.gamesRepository.find({
      relations: ['questions', 'questions.options', 'questions.matching_pairs', 'questions.word_order']
    });
  }

  findOne(id: number) {
    return this.gamesRepository.findOneBy({ id });
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return this.gamesRepository.update(id, updateGameDto);
  }

  remove(id: number) {
    return this.gamesRepository.delete(id);
  }
}
