import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { StudentImportInterface } from '../types/student-import';

@Entity()
export class StudentImport
  extends BaseEntity
  implements StudentImportInterface
{
  @PrimaryColumn()
  @OneToOne(() => Student, (student) => student.id)
  @JoinColumn({
    name: 'id',
  })
  id: Student;

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
}
