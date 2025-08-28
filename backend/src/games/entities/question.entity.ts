import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Game } from './game.entity';
import { Option } from './option.entity';
import { MatchingPair } from './matchingPair.entiry';
import { WordOrder } from './wordOrder.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type', type: 'enum', enum: ['multiple-choice', 'fill-blank', 'matching', 'word-order', 'grammar-fix'] })
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'word-order' | 'grammar-fix';

  @Column({ name: 'question_text', type: 'text' })
  questionText: string;

  @Column({ type: 'text', nullable: true })
  sentence: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  blank: string;

  @Column({ name: 'incorrect_sentence', type: 'text', nullable: true })
  incorrectSentence: string;

  @Column({ name: 'correct_sentence', type: 'text', nullable: true })
  correctSentence: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @ManyToOne(() => Game, (game) => game.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @OneToMany(() => Option, (option) => option.question, { cascade: true })
  options: Option[];

  @OneToMany(() => MatchingPair, (matching) => matching.question, { cascade: true })
  matching_pairs: MatchingPair[];

  @OneToMany(() => WordOrder, (word) => word.question, { cascade: true })
  word_order: WordOrder[];
}
