import { Student } from 'src/shared/entities/student.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Parent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;
    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string
    @Column()
    phoneNumber: string;
   @Column({ nullable: true })
    NCIN: string
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
