import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Classroom } from '../shared/entities/classroom.entity';
import { Parent } from '../shared/entities/parent.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  numeroInscriptio: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  phoneNumber: string;

  @Column()
  address: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date' })
  enrollmentDate: Date;

  @ManyToOne(() => Parent, (parent) => parent.students)
  @JoinColumn({ name: 'parentId' })
  parent: Parent;

  // @Column()
  // parentId: number;

  @ManyToOne(() => Classroom, (classroom) => classroom.students)
  @JoinColumn({ name: 'classroomId' })
  classroom: Classroom;

  // @Column()
  // classroomId: number;
}
