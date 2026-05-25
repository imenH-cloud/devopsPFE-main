import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from '../../student/entities/student.entity';

@Entity()
export class Parent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phoneNumber: string;
@Column()
NCIN:number
    @Column()
    address: string;
    @Column()
    typeInsurance:string
    @Column()
    Numeroinsurance:string
    @Column()
    job:string
    @OneToMany(() => Student, student => student.parent)
    students: Student[];
}
