import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Student, UserStatus } from '../student/student.entity';
import {
  AvailableStudentToListResponseInterface,
  ForInterviewStudentToListResponseInterface,
  StudentCvInterface,
} from '../types/student';
import { Recruiter } from './recruiter.entity';
import { StudentImport } from '../studentImport/studentImport.entity';

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
      .where('recruiter.id = :id', { id })
      .andWhere('recruiter.registerToken = :registerToken', { registerToken })
      .getOne();

    return oneRecruiter
      ? {
          isOk: true,
          id: oneRecruiter.id,
          role: 'Recruiter',
        }
      : {
          isOk: false,
        };
  }

  async changeStatus(id: string, status: string) {
    //@TODO ewentualna zmiana nazewnictwa w case'ach
    //@TODO lepsza walidacja błędów

    const foundStudent = await Student.findOne({
      where: {
        studentImport: {
          id,
        },
      },
    });

    try {
      switch (status) {
        case 'duringTalk': {
          const reservationTimestamp =
            new Date().getTime() + 10 * 24 * 60 * 60 * 1000;

          foundStudent.endOfReservation = new Date(reservationTimestamp);
          foundStudent.status = UserStatus.duringTalk;
          await foundStudent.save();
          break;
        }
        case 'noInterested': {
          foundStudent.endOfReservation
            ? (foundStudent.endOfReservation = null)
            : null;
          foundStudent.status = UserStatus.active;
          await foundStudent.save();
          break;
        }
        case 'employed': {
          foundStudent.status = UserStatus.employed;

          foundStudent.endOfReservation
            ? (foundStudent.endOfReservation = null)
            : null;
          //@TODO tu jest ok, natomiast żeby cała funkcjonalność działała, kursant musi samodzielnie potwierdzić w profilu że został zatrudniony
          await foundStudent.save();
          break;
        }
        default: {
          throw new Error('Something went wrong.');
        }
      }
      return {
        message: 'Status changed correctly',
        status: 'Ok',
      };
    } catch (e) {
      return {
        message: 'Something went wrong. Try again later.',
      };
    }
  }

  async getForInterviewStudents() {
    const students = await this.dataSource
      .getRepository(Student)
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.studentImport', 'studentImport')
      .where('student.status = :status', { status: UserStatus.duringTalk })
      .getMany();

    const dataToResponse: ForInterviewStudentToListResponseInterface[] = [];

    for (const student of students) {
      const studentInfo: ForInterviewStudentToListResponseInterface = {
        id: student.studentImport.id,
        courseCompletion: student.studentImport.courseCompletion,
        courseEngagment: student.studentImport.courseEngagement,
        projectDegree: student.studentImport.projectDegree,
        teamProjectDegree: student.studentImport.teamProjectDegree,
        firstName: student.firstName,
        lastName: student.lastName,
        githubUsername: student.githubUsername,
        targetWorkCity: student.targetWorkCity,
        expectedTypeWork: student.expectedTypeWork,
        expectedSalary: student.expectedSalary,
        expectedContractType: student.expectedContractType,
        monthsOfCommercialExp: student.monthsOfCommercialExp,
        canTakeApprenticeship: student.canTakeApprenticeship,
        endOfReservation: student.endOfReservation,
      };
      dataToResponse.push(studentInfo);
    }
    return dataToResponse;
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
