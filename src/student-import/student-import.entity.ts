import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { StudentImportInterface } from '../types/student-import';

@Entity()
export class StudentImport
  extends BaseEntity
  implements StudentImportInterface
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isActive: boolean;

  @Column()
  registerToken: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  courseCompletion: number;

  @Column()
  courseEngagement: number;

  @Column()
  projectDegree: number;

  @Column()
  teamProjectDegree: number;

  @Column()
  bonusProjectsUrls: string;

  @OneToOne(() => Student)
  student: Student;
}
