import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../student/student.entity";
import {RecruiterInterface} from "../types/recruiter";

@Entity()
export class Recruiter extends BaseEntity implements RecruiterInterface {
    @PrimaryGeneratedColumn('uuid')
    @OneToMany(() => Student, student => student.recruiterId)
    id: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column({
        nullable: false,
    })
    fullName: string;

    @Column({
        nullable: false,
    })
    company: string;

    @Column()
    maxReservedStudents: number;
}



