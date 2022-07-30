import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { RecruiterInterface } from '../types/recruiter';

@Entity()
export class Recruiter extends BaseEntity implements RecruiterInterface {
  @PrimaryGeneratedColumn('uuid')
  @OneToMany(() => Student, (student) => student.recruiterId)
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
}
