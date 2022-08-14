import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { StudentImportInterface } from '../types/student-import';
import { RecruiterToStudent } from '../recruiter/recruiterToStudent.entity';

@Entity()
export class StudentImport
  extends BaseEntity
  implements StudentImportInterface
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  isActive: boolean;

  @Column({
    nullable: false,
  })
  registerToken: string;

  @Column({
    nullable: true,
    default: null,
  })
  currentTokenId: string | null;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    type: 'tinyint',
    unsigned: true,
  })
  courseCompletion: number;

  @Column({
    nullable: false,
    type: 'tinyint',
    unsigned: true,
  })
  courseEngagement: number;

  @Column({
    nullable: false,
    type: 'tinyint',
    unsigned: true,
  })
  projectDegree: number;

  @Column({
    nullable: false,
    type: 'tinyint',
    unsigned: true,
  })
  teamProjectDegree: number;

  @Column({
    nullable: false,
  })
  bonusProjectsUrls: string;

  @OneToOne(() => Student)
  student: Student;

  @OneToMany(
    () => RecruiterToStudent,
    (recruiterToStudent) => recruiterToStudent.studentImport,
  )
  public recruiterToStudents: RecruiterToStudent[];
}
