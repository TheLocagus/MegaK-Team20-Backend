import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContractType, StudentInterface, TypeWork } from '../types';
import { StudentImport } from '../studentImport/studentImport.entity';

export enum UserStatus {
  active = 'active',
  employed = 'employed',
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

  @Column({
    default: '',
  })
  telephone: string;

  @Column({
    length: 30,
    nullable: false,
  })
  firstName: string;

  @Column({
    length: 50,
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
    type: 'longtext',
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
  })
  expectedSalary: number;

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
}
