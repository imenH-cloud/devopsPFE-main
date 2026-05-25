// Importer les entités correctement (ajuster les chemins si nécessaire)
// import { Activity } from '../../shared/entities/actitvity.entity';
// import { Student } from '../../shared/entities/student.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

    @Column({ type: 'varchar', length: 50 })
    location: string;

    @Column()
    Specialization: string;

    // Relations temporairement désactivées pour résoudre l'erreur TypeORM
    // @OneToMany(() => Activity, activity => activity.classroom)
    // activities: Activity[];

    // @OneToMany(() => Student, student => student.classroom)
    // students: Student[];
}