import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Deck } from '../../decks/entities/deck.entity';
import { StudyStats } from 'src/decks/entities/studyStats.entity';
import { StudyActivity } from 'src/decks/entities/studyActivity.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255, default: '/placeholder.svg' })
  avatar: string;

  @Column({ default: 0 })
  xp: number;

  @Column({ default: 1 })
  level: number;

  @Column({ name: 'xp_to_next_level', default: 1000 })
  xpToNextLevel: number;

  @Column({ default: 0 })
  streak: number;

  @Column({ name: 'total_lessons', default: 0 })
  totalLessons: number;

  @Column({ name: 'completed_lessons', default: 0 })
  completedLessons: number;

  @Column({ name: 'badges_earned', default: 0 })
  badgesEarned: number;

  @Column({ length: 50, default: 'student' })
  role: string;

  @Column({
    type: 'enum',
    enum: ['active', 'banned', 'inactive'],
    default: 'active',
  })
  status: string;

  @Column({ length: 50, default: 'local' })
  provider: string;

  @Column({ name: 'email_verified', type: 'tinyint', width: 1, default: 0 })
  emailVerified: boolean;

  @Column({ name: 'last_active', type: 'timestamp', nullable: true })
  lastActive: Date;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Deck, (deck) => deck.user)
  decks: Deck[];

  @OneToMany(() => StudyStats, (study) => study.user)
  studyStats: StudyStats[];

  @OneToMany(() => StudyActivity, (study) => study.user)
  studyActivities: StudyActivity[];
}
