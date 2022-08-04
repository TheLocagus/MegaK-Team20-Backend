import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Student } from '../student/student.entity';
import { AvailableStudentToListResponseInterface, StudentCvInterface } from '../types/student';
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
        courseEngagement: infoAboutStudent.studentImport.courseEngagement,
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

  async getOneStudentCv(id: string): Promise<StudentCvInterface> {
    const oneStudent = await this.dataSource
      .getRepository(Student)
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.studentImport', 'studentImport')
      .where('studentImport.id = :id', {id})
      .getOne();

    return {
        firstName: oneStudent.firstName,
        lastName: oneStudent.lastName,
        bio: oneStudent.bio,
        githubUsername: oneStudent.githubUsername,
        courseCompletion: oneStudent.studentImport.courseCompletion,
        courseEngagement: oneStudent.studentImport.courseEngagement,
        projectDegree: oneStudent.studentImport.projectDegree,
        teamProjectDegree: oneStudent.studentImport.projectDegree,
        bonusProjectUrls: oneStudent.studentImport.bonusProjectsUrls,
        projectUrls: oneStudent.projectUrls,
        portfolioUrls: oneStudent.portfolioUrls,
        expectedTypeWork: oneStudent.expectedTypeWork,
        targetWorkCity: oneStudent.targetWorkCity,
        expectedContractType: oneStudent.expectedTypeWork,
        expectedSalary: oneStudent.expectedSalary,
        canTakeApprenticeship: oneStudent.canTakeApprenticeship,
        monthsOfCommercialExp: oneStudent.monthsOfCommercialExp,
        education: oneStudent.education,
        workExperience: oneStudent.workExperience,
      };
  }
}
