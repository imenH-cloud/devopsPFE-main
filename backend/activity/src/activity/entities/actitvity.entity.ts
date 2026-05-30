import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Classroom } from '../../shared/entities/classroom.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column()
  date: Date;

  @Column()
  duration: number;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ name: 'classroomid', nullable: true })
  classroomId: number;

  @Column({ type: 'simple-json', nullable: true })
  metadata: {
    resources?: string[];
    attachments?: string[];
    comments?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Classroom, classroom => classroom.activities, { nullable: true })
  @JoinColumn({ name: 'classroomid' })
  classroom: Classroom;
}
