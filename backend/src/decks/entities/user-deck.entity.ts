import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Deck } from '../entities/deck.entity';

@Entity('user_decks')
@Unique(['user', 'deck']) // mỗi user chỉ có 1 bản ghi cho 1 deck
export class UserDeck {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userDecks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Deck, (deck) => deck.userDecks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deck_id' })
  deck: Deck;
  @Column({ name: 'deck_id' })
  deckId: number;
  @Column({ name: 'studied_cards', type: 'int', default: 0 })
  studiedCards: number;

  @Column({ name: 'mastered_cards', type: 'int', default: 0 })
  masteredCards: number;

  @Column({ type: 'int', default: 0 })
  streak: number;

  @Column({ name: 'last_studied', type: 'datetime', nullable: true })
  lastStudied: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
