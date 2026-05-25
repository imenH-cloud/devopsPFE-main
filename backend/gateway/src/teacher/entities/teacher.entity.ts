import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    indexNumber: string;

    @Column()
    cin: string;

    @Column()
    firstName: string;

    @Column()
    surname: string;

    @Column()
    gender: string;

    @Column()
    address: string;

    @Column()
    telephone: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    facebook: string;

    @Column({ nullable: true })
    instagram: string;

    @Column({ nullable: true })
    linkedin: string;

    @Column()
    specialization: string;

    @Column()
    profileImage: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column()
    dateOfMandate:Date
}