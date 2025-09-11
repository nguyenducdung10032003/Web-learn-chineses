import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,JoinColumn
} from 'typeorm';
import { Deck } from './deck.entity';

@Entity('flashcards')
export class Flashcard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Deck, (deck) => deck.flashcards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deck_id' })
  deck: Deck;

  @Column({ name: 'deck_id' })
  deckId: number
  
  @Column({ type: 'varchar', length: 100 })
  chinese: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pinyin: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  vietnamese: string;

  @Column({
    type: 'enum',
    enum: ['new', 'learning', 'review'],
    default: 'new',
  })
  difficulty: 'new' | 'learning' | 'review';

  @Column({ type: 'varchar', length: 255, nullable: true })
  audio: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
