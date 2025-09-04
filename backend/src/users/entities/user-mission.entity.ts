import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';

import { Mission } from './missions.entity';
import { User } from './user.entity';

@Entity('user_missions')
@Unique(['user', 'mission'])
export class UserMission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userMissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Mission, (mission) => mission.userMissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mission_id' })
  mission: Mission;

  @Column({ default: 0 })
  progress: number;

  @Column({ default: 0 })
  completed: boolean;

  @Column({ default: 0 })
  claimed: boolean;

  @Column({ name: 'time_left', nullable: true })
  timeLeft: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
