import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecruiterInterface } from '../types';
import { RecruiterToStudent } from './recruiterToStudent.entity';

@Entity()
export class Recruiter extends BaseEntity implements RecruiterInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  isActive: boolean;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    default: null,
  })
  @Column({
    default: null,
  })
  pwdHash: string;

  @Column({
    nullable: true,
    default: null,
  })
  currentTokenId: string | null;

  @Column({
    nullable: false,
  })
  fullName: string;

  @Column({
    nullable: false,
  })
  company: string;

  @Column({
    nullable: false,
    type: 'smallint',
    unsigned: true,
  })
  maxReservedStudents: number;

  @Column({
    default: null,
  })
  registerToken: string | null;

  @OneToMany(
    () => RecruiterToStudent,
    (recruiterToStudent) => recruiterToStudent.recruiter,
  )
  public recruiterToStudents: RecruiterToStudent[];
}
