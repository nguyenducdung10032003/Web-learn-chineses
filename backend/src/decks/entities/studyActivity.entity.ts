import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Deck } from './deck.entity';

@Entity('study_activity')
export class StudyActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.studyActivities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'deck_id' })
  deckId: number;

  @ManyToOne(() => Deck, (deck) => deck.studyActivities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deck_id' })
  deck: Deck;

  @Column({ type: 'int' })
  cards: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  accuracy: number;

  @Column({ type: 'int', default: 0 })
  xp: number;

  @CreateDateColumn({ name: 'activity_time', type: 'timestamp' })
  activityTime: Date;
}
