import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('courses') // tên bảng trong MySQL
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 50, nullable: true })
  level: string;

  @Column({ name: 'level_text', length: 100, nullable: true })
  levelText: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'total_lessons', type: 'int', default: 0 })
  totalLessons: number;

  @Column({ name: 'completed_lessons', type: 'int', default: 0 })
  completedLessons: number;

  @Column({ length: 50, nullable: true })
  duration: string;

  @Column({ type: 'int', default: 0 })
  students: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  rating: number;

  @Column({ length: 150, nullable: true })
  instructor: string;

  @Column({ length: 255, nullable: true })
  image: string;

  @Column({ length: 50, nullable: true })
  color: string;

  @Column({ type: 'tinyint', default: 1 })
  unlocked: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
