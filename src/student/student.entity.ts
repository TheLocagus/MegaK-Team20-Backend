import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recruiter } from '../recruiter/recruiter.entity';
import { StudentInterface } from '../types/student';
import { StudentImport } from '../studentImport/studentImport.entity';

export enum UserStatus {
  active = 'active',
  duringTalk = 'duringTalk',
  employed = 'employed',
}

export enum TypeWork {
  stationary = 'stationary',
  readyToMove = 'readyToMove',
  remotely = 'remotely',
  hybrid = 'hybrid',
  noPreference = 'noPreference',
}

export enum ContractType {
  contractOfEmployment = 'contractOfEmployment',
  b2b = 'b2b',
  contractWorkOrContractOfMandate = 'contractWorkOrContractOfMandate',
  noPreference = 'noPreference',
}

@Entity()
export class Student extends BaseEntity implements StudentInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
  })
  status: UserStatus;

  @Column({
    nullable: false,
  })
  pwdHash: string;

  @Column({
    nullable: true,
    default: null,
  })
  currentTokenId: string | null;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.id)
  @JoinColumn({ name: 'recruiterId' })
  recruiterId: Recruiter;

  @Column({
    default: '',
  })
  telephone: string;

  @Column({
    length: 20,
    nullable: false,
  })
  firstName: string;

  @Column({
    length: 27,
    nullable: false,
  })
  lastName: string;

  @Column({
    length: 39,
    nullable: false,
  })
  githubUsername: string;

  @Column({
    default: '',
  })
  portfolioUrls: string;

  @Column({
    nullable: false,
  })
  projectUrls: string;

  @Column({
    length: 10000,
  })
  bio: string;

  @Column({
    type: 'enum',
    enum: TypeWork,
  })
  expectedTypeWork: TypeWork;

  @Column({
    length: 50,
  })
  targetWorkCity: string;

  @Column({
    type: 'enum',
    enum: ContractType,
  })
  expectedContractType: ContractType;

  @Column({
    default: 0,
    length: 6,
  })
  expectedSalary: string;

  @Column()
  canTakeApprenticeship: boolean;

  @Column({
    default: 0,
  })
  monthsOfCommercialExp: number;

  @Column({
    type: 'longtext',
  })
  education: string;

  @Column({
    type: 'longtext',
  })
  workExperience: string;

  @Column({
    type: 'longtext',
  })
  courses: string;

  @OneToOne(() => StudentImport)
  @JoinColumn()
  studentImport: StudentImport;

  @Column({
    type: 'datetime',
    default: null,
  })
  endOfReservation: Date | null;
}
