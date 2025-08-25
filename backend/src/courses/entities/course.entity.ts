import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('courses') // tên bảng trong MySQL
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  level: string;

  @Column({ nullable: true })
  levelText: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  lessons: number;

  @Column({ default: 0 })
  completedLessons: number;

  @Column({ nullable: true })
  duration: string;

  @Column({ default: 0 })
  students: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  color: string;

  @Column({ default: true })
  unlocked: boolean;
}
