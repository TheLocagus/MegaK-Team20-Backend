import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recruiter } from './recruiter.entity';
import { StudentImport } from '../studentImport/studentImport.entity';

@Entity()
export class RecruiterToStudent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  recruiterToStudentId: string;
  @Column()
  recruiterId: string;
  @Column()
  studentImportId: string;
  @Column({
    type: 'date',
    default: null,
  })
  endOfReservation: Date | null;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.recruiterToStudents)
  recruiter: Recruiter;

  @ManyToOne(
    () => StudentImport,
    (studentImport) => studentImport.recruiterToStudents,
  )
  studentImport: StudentImport;
}
