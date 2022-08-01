import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {Student} from "./student.entity";
import {GetOneStudentResponseInterface} from "../types/student";
import {DataSource, Repository} from "typeorm";
import {CreateStudentDto} from "../dto/create-student.dto";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class StudentService {
    constructor(@InjectRepository(Student) private studentRepository: Repository<Student>) {

    }
    @Inject(forwardRef(() => DataSource)) private dataSource: DataSource;



    async getOneStudent(id: string): Promise<GetOneStudentResponseInterface> {
        const oneStudent = await this.dataSource
            .getRepository(Student)
            .createQueryBuilder('student')
            .where('student.id = :id', {id: id})
            .getOne()

        return {
            bio: oneStudent.bio,
            canTakeApprenticeship: oneStudent.canTakeApprenticeship,
            courses: oneStudent.courses,
            education: oneStudent.education,
            expectedContractType: oneStudent.expectedContractType,
            expectedSalary: oneStudent.expectedSalary,
            expectedTypeWork: oneStudent.expectedTypeWork,
            firstName: oneStudent.firstName,
            githubUsername: oneStudent.githubUsername,
            lastName: oneStudent.lastName,
            monthsOfCommercialExp: oneStudent.monthsOfCommercialExp,
            portfolioUrls: oneStudent.portfolioUrls,
            projectUrls: oneStudent.projectUrls,
            targetWorkCity: oneStudent.targetWorkCity,
            telephone: oneStudent.telephone,
            workExperience: oneStudent.workExperience
        };

    }

    async getOneStudentAndCompareToken(id: string, registerToken: string) {
        const oneStudent = await this.dataSource
            .getRepository(Student)
            .createQueryBuilder('student')
            .where('student.id = :id', {id})
            .andWhere('student.registerToken = :registerToken', {registerToken})
            .getOne()

        return oneStudent ? {
            isOk: true,
            id: oneStudent.id,
            registerToken: oneStudent.registerToken
        } : {
            isOk: false,
        }
    }

    async createStudent(id: string, createStudentDto: CreateStudentDto) {
        const student = new Student();
        await this.dataSource
            .createQueryBuilder()
            .update(Student)
            .set({
                id: student.id,
                currentTokenId: '',
                password: createStudentDto.password,
                bio: createStudentDto. bio,
                canTakeApprenticeship: createStudentDto.canTakeApprenticeship,
                courses: createStudentDto.courses,
                education: createStudentDto.education,
                expectedContractType: createStudentDto.expectedContractType,
                expectedSalary: createStudentDto.expectedSalary,
                expectedTypeWork: createStudentDto.expectedTypeWork,
                firstName: createStudentDto.firstName,
                githubUsername: createStudentDto.githubUsername,
                lastName: createStudentDto.lastName,
                monthsOfCommercialExp: createStudentDto.monthsOfCommercialExp,
                portfolioUrls: createStudentDto.portfolioUrls,
                targetWorkCity: createStudentDto.targetWorkCity,
                telephone: createStudentDto.telephone,
                workExperience: createStudentDto.workExperience,
            })
            .where('student.id = :id', {id})
            .execute()
    }

    async patchStudent(id: string, createStudentDto: CreateStudentDto) {
        await this.createStudent(id, createStudentDto)
    }

}
