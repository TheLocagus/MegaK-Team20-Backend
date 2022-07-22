import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import {Student} from "../student/student.entity";
import {StudentImportInterface} from "../types/student-import";

@Entity()
export class StudentImport extends BaseEntity implements StudentImportInterface {
    @PrimaryColumn()
    @OneToOne( type => Student)
    @JoinColumn({
        referencedColumnName: 'email',
        name: 'email',
    })
    email: Student;

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
