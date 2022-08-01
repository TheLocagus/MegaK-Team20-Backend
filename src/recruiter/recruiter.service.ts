import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Student } from '../student/student.entity';
import { AvailableStudentToListResponseInterface } from '../types/student';
import { Recruiter } from './recruiter.entity';

@Injectable()
export class RecruiterService {
  @Inject(forwardRef(() => DataSource)) private dataSource: DataSource;

  async getAllStudents() {
    const infoAboutStudents = await this.dataSource
      .getRepository(Student)
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.studentImport', 'studentImport')
      .where('studentImport.isActive = :isActive', { isActive: true })
      .getMany();

    const dataToResponse: AvailableStudentToListResponseInterface[] = [];

    for (const infoAboutStudent of infoAboutStudents) {
      const dataAboutOneStudent: AvailableStudentToListResponseInterface = {
        id: infoAboutStudent.studentImport.id,
        courseCompletion: infoAboutStudent.studentImport.courseCompletion,
        courseEngagment: infoAboutStudent.studentImport.courseEngagement,
        teamProjectDegree: infoAboutStudent.studentImport.teamProjectDegree,
        projectDegree: infoAboutStudent.studentImport.projectDegree,
        canTakeApprenticeship: infoAboutStudent.canTakeApprenticeship,
        expectedContractType: infoAboutStudent.expectedContractType,
        expectedSalary: infoAboutStudent.expectedSalary,
        expectedTypeWork: infoAboutStudent.expectedTypeWork,
        firstName: infoAboutStudent.firstName,
        lastName: `${infoAboutStudent.lastName[0]}.`,
        monthsOfCommercialExp: infoAboutStudent.monthsOfCommercialExp,
        targetWorkCity: infoAboutStudent.targetWorkCity,
        status: infoAboutStudent.status,
      };
      dataToResponse.push(dataAboutOneStudent);
    }
    return dataToResponse;
  }

  async getOneRecruiterAndCompareToken(id: string, registerToken: string) {
    const oneRecruiter = await this.dataSource
      .getRepository(Recruiter)
      .createQueryBuilder('recruiter')
      .where('recruiter.id = :id', {id})
      .andWhere('recruiter.registerToken = :registerToken', {registerToken})
      .getOne();

      return oneRecruiter ? {
        isOk: true,
        id: oneRecruiter.id,
        role: 'Recruiter',

      } : {
        isOk: false,
      };
  }
}
