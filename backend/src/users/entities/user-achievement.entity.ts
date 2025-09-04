import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Achievement } from './achievements.entity';

@Entity('user_achievements')
@Unique(['user', 'achievement'])
export class UserAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userAchievements, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Achievement, (achievement) => achievement.userAchievements, {
    onDelete: 'CASCADE',
  })
  achievement: Achievement;

  @Column({ default: 0 })
  progress: number;

  @Column({ default: false })
  earned: boolean;

  @Column({ name: 'earned_at', type: 'datetime', nullable: true })
  earnedAt: Date | null;
}
