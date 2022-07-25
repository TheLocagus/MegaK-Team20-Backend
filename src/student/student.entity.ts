import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Recruiter} from "../recruiter/recruiter.entity";
import {StudentInterface} from "../types/student";

export enum UserStatus {
    active = "active",
    inActive = "inActive",
    duringTalk = "duringTalk",
    employed = "employed",
}

export enum UserRole {
    admin = "admin",
    student = "student",
    recruiter = "recruiter",
}

export enum TypeWork {
    stationary = "stationary",
    readyToMove = "readyToMove",
    remotely = "remotely",
    hybrid = "hybrid",
    noPreference = "noPreference",
}

export enum ContractType {
    contractOfEmployment = "contractOfEmployment",
    b2b = "b2b",
    contractWorkOrContractOfMandate = "contractWorkOrContractOfMandate",
    noPreference = "noPreference",

}

@Entity()
export class Student extends BaseEntity implements StudentInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: "enum",
        enum: UserStatus,
    })
    status: UserStatus;

    @Column({
        type: "enum",
        enum: UserRole,
    })
    role: UserRole

    @Column()
    password: string;

    @ManyToOne(() => Recruiter, recruiter => recruiter.id)
    @JoinColumn({name : "recruiterId"})
    recruiterId: Recruiter;

    @Column({
        default: '',
    })
    telephone: string;

    @Column({
        length: 20,
    })
    firstName: string;

    @Column({
        length: 27,
    })
    lastName: string;

    @Column({
        length: 39,
        unique: true,
    })
    githubUsername: string;

    @Column({
        default: '',
    })
    portfolioUrls: string;

    @Column()
    projectUrls: string;

    @Column({
        length: 10000,
    })
    bio: string;

    @Column({
        type: "enum",
        enum: TypeWork,
    })
    expectedTypeWork: TypeWork

    @Column({
        length: 50,
    })
    targetWorkCity: string;

    @Column({
        type: "enum",
        enum: ContractType,
    })
    expectedContractType: ContractType

    @Column({
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
        type: "longtext"
    })
    education: string;

    @Column({
        type: "longtext",
        default: '',
    })
    workExperience: string;

    @Column({
        type: "longtext",
        default: '',
    })
    courses: string;

}
