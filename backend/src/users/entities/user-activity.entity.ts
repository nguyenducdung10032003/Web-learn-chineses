import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export type ActivityType = 'lesson' | 'flashcard' | 'quiz' | 'game';

@Entity('user_activities')
export class UserActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    type: 'enum',
    enum: ['lesson', 'flashcard', 'quiz', 'game'],
  })
  type: ActivityType;

  @Column({ length: 255 })
  title: string;

  @Column({ default: 0 })
  xp: number;

  @Column({
    name: 'activity_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  activityTime: Date;
}
