import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recruiter } from './recruiter.entity';
import { Student } from '../student/student.entity';

@Entity()
export class RecruiterToStudent {
  @PrimaryGeneratedColumn('uuid')
  recruiterToStudentId: string;
  @Column()
  recruiterId: string;
  @Column()
  studentId: string;
  @Column({
    type: 'date',
    default: null,
  })
  endOfReservation: Date | null;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.recruiterToStudents)
  recruiter!: Recruiter;

  @ManyToOne(() => Student, (student) => student.recruiterToStudents)
  student!: Student;
}
