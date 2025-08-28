import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Question } from './question.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  icon: string;

  @Column({
    type: 'enum',
    enum: ['Dễ', 'Trung bình', 'Khó'],
    default: 'Dễ',
  })
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';

  @Column({ type: 'int', default: 0 })
  xp_reward: number;

  @Column({ type: 'int', default: 10 })
  time_limit: number;

  @Column({ length: 50, nullable: true })
  color: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Question, (question) => question.game)
  questions: Question[];
}
