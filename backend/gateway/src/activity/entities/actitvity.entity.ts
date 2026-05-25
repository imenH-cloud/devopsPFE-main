import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';

export enum ActivityType {
  ACADEMIC = 'academic',
  SPORTS = 'sports',
  CULTURAL = 'cultural',
  CLUB = 'club',
  OTHER = 'other'
}

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ActivityType,
    default: ActivityType.OTHER
  })
  type: ActivityType;

  @Column()
  description: string;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn()
  date: Date;

  @Column()
  duration: number; // in minutes

  @Column({ default: false })
  isCompleted: boolean;

  @ManyToOne(() => Classroom, classroom => classroom.activities)
  classroom: Classroom;

  @Column({ type: 'simple-json', nullable: true })
  metadata: {
    resources?: string[];
    attachments?: string[];
    comments?: string;
  };
}