import { Classroom } from 'src/shared/entities/classroom.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

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
  duration: number;
  @Column({ default: false })
  isCompleted: boolean;

@Column({ nullable: true })
classroom: number; 

  @Column({ type: 'simple-json', nullable: true })
  metadata: {
    resources?: string[];
    attachments?: string[];
    comments?: string;
  };
}