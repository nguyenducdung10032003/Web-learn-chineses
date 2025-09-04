import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { UserMission } from './user-mission.entity';


@Entity('missions')
export class Mission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['daily', 'weekly', 'special'],
  })
  type: 'daily' | 'weekly' | 'special';

  @Column({ name: 'max_progress', default: 1 })
  maxProgress: number;

  @Column({ name: 'xp_reward', default: 0 })
  xpReward: number;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: 0 })
  special: boolean;

  @Column({ name: 'start_time', type: 'timestamp', nullable: true })
  startTime: Date | null;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => UserMission, (um) => um.mission)
  userMissions: UserMission[];
}
