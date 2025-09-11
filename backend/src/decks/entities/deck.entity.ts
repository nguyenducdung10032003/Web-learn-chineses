import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Flashcard } from './flashcard.entity';
import { StudyActivity } from './studyActivity.entity';
import { UserDeck } from './user-deck.entity';

@Entity('decks')
export class Deck {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.decks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'total_cards', default: 0 })
  totalCards: number;

  @Column({ length: 100, nullable: true })
  level: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ nullable: true })
  image: string;

  @Column({ length: 50, nullable: true })
  color: string;

  @Column({ name: 'is_personal', type: 'tinyint', default: 0 })
  isPersonal: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Flashcard, (flashcard) => flashcard.deck)
  flashcards: Flashcard[];

  @OneToMany(() => StudyActivity, (study) => study.deck)
  studyActivities: StudyActivity[];

  @OneToMany(() => UserDeck, (userDeck) => userDeck.deck)
  userDecks: UserDeck[];
}
