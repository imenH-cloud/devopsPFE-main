import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Activity } from 'src/activity/entities/actitvity.entity';

@Entity()
export class Classroom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    capacity: number;

    @Column()
    grade: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    academicYear: string;

    @Column({ default: true })
    isActive: boolean;
@OneToMany(() => Activity, activity => activity.classroom)
activities:Activity[]
    @Column({ type: 'varchar', length: 50 })
    location: string;
    @Column()
    Specialization:string
    @OneToMany(() => Student, student => student.classroom)
    students: Student[];
}
