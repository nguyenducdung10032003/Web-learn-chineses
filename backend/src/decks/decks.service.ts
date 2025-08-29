import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deck } from './entities/deck.entity';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';

@Injectable()
export class DecksService {
  constructor(
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
  ) {}

  create(createDeckDto: CreateDeckDto) {
    const deck = this.deckRepository.create(createDeckDto);
    return this.deckRepository.save(deck);
  }

  findAll() {
    return this.deckRepository.find({
      relations: ['flashcards']
    });
  }

  findOne(id: number) {
    return this.deckRepository.findOneBy({ id });
  }

  update(id: number, updateDeckDto: UpdateDeckDto) {
    return this.deckRepository.update(id, updateDeckDto);
  }

  remove(id: number) {
    return this.deckRepository.delete(id);
  }
}
