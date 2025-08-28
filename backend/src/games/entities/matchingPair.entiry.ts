import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity('matching_pairs')
export class MatchingPair {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chinese_text: string;

  @Column()
  vietnamese_text: string;

  @Column()
  pair_index: number;

  @ManyToOne(() => Question, (question) => question.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
