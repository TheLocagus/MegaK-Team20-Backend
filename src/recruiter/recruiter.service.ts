import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Student, UserStatus } from '../student/student.entity';
import { ContractType, ISingleStudentCvResponse, TypeWork } from '../types';
import { Recruiter } from './recruiter.entity';
import { FiltersDto } from '../dto/recruiter.dto';
import { StudentImport } from '../studentImport/studentImport.entity';
import { HttpService } from '@nestjs/axios';

import { firstValueFrom } from 'rxjs';
import {
  AvailableStudentToListResponseInterface,
  ForInterviewStudentToListResponseInterface,
  IAvailableStudentToListResponse,
  RecruiterActionsOfStatusEnum,
} from '../types';

const MAX_PER_PAGE = 1;

@Injectable()
export class RecruiterService {
  constructor(private readonly httpService: HttpService) {}
  @Inject(forwardRef(() => DataSource)) private dataSource: DataSource;

  async getAllStudents(
    currentPage = 1,
  ): Promise<IAvailableStudentToListResponse> {
    const maxPerPage = MAX_PER_PAGE;

    const [items, count] = await Student.findAndCount({
      relations: {
        studentImport: true,
      },
      select: {
        id: true,
        status: true,
        firstName: true,
        lastName: true,
        expectedTypeWork: true,
        targetWorkCity: true,
        expectedContractType: true,
        expectedSalary: true,
        canTakeApprenticeship: true,
        monthsOfCommercialExp: true,
        studentImport: {
          courseCompletion: true,
          courseEngagement: true,
          projectDegree: true,
          teamProjectDegree: true,
          id: true,
        },
      },
      where: {
        status: UserStatus.active,
        studentImport: {
          isActive: true,
        },
      },
      skip: maxPerPage * (currentPage - 1),
      take: maxPerPage,
    });

    const availableStudents: AvailableStudentToListResponseInterface[] =
      items.map((student) => {
        return {
          id: student.studentImport.id,
          firstName: student.firstName,
          lastName: `${student.lastName[0]}.`,
          expectedTypeWork: student.expectedTypeWork,
          targetWorkCity: student.targetWorkCity,
          expectedContractType: student.expectedContractType,
          expectedSalary: student.expectedSalary,
          canTakeApprenticeship: student.canTakeApprenticeship,
          monthsOfCommercialExp: student.monthsOfCommercialExp,
          courseCompletion: student.studentImport.courseCompletion,
          courseEngagement: student.studentImport.courseEngagement,
          projectDegree: student.studentImport.projectDegree,
          teamProjectDegree: student.studentImport.teamProjectDegree,
        };
      });

    const totalPages = Math.ceil(count / maxPerPage);
    return { availableStudents, count, totalPages };
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
          success: true,
          id: oneRecruiter.id,
          role: 'recruiter',
        }
      : {
          success: false,
        };
  }

  async changeStatus(id: string, status: RecruiterActionsOfStatusEnum) {
    //@TODO lepsza walidacja błędów
    const foundStudentImport = await StudentImport.findOneBy({ id });
    const foundStudent = await Student.findOne({
      where: {
        studentImport: {
          id,
        },
      },
    });

    try {
      switch (status) {
        case `${RecruiterActionsOfStatusEnum.forInterview}`: {
          console.log(foundStudent);
          const reservationTimestamp =
            new Date().getTime() + 10 * 24 * 60 * 60 * 1000;

          foundStudent.endOfReservation = new Date(reservationTimestamp);
          foundStudent.status = UserStatus.duringTalk;
          await foundStudent.save();
          break;
        }
        case `${RecruiterActionsOfStatusEnum.noInterested}`: {
          foundStudent.endOfReservation
            ? (foundStudent.endOfReservation = null)
            : null;
          foundStudent.status = UserStatus.active;
          await foundStudent.save();
          break;
        }
        case `${RecruiterActionsOfStatusEnum.employed}`: {
          foundStudent.status = UserStatus.employed;
          foundStudentImport.isActive = false;
          foundStudent.endOfReservation
            ? (foundStudent.endOfReservation = null)
            : null;
          await foundStudent.save();
          await foundStudentImport.save();
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
      // fetch
      let avatarUrl = '';
      try {
        const avatarData = await firstValueFrom(
          this.httpService.get(
            `https://api.github.com/users/${student.githubUsername}`,
          ),
        );
        avatarUrl = avatarData.data.avatar_url;
      } catch (e) {
        avatarUrl = '';
      }
      const studentInfo: ForInterviewStudentToListResponseInterface = {
        id: student.studentImport.id,
        courseCompletion: student.studentImport.courseCompletion,
        courseEngagement: student.studentImport.courseEngagement,
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

  async getOneStudentCv(id: string): Promise<ISingleStudentCvResponse> {
    const oneStudent = await this.dataSource
      .getRepository(Student)
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.studentImport', 'studentImport')
      .where('studentImport.id = :id', { id })
      .getOne();
    console.log('TRUBDINDPUNDPNDSJNOJSOJDO()I@(I@@');
    return {
      firstName: oneStudent.firstName,
      lastName: oneStudent.lastName,
      bio: oneStudent.bio,
      githubUsername: oneStudent.githubUsername,
      courseCompletion: oneStudent.studentImport.courseCompletion,
      courseEngagement: oneStudent.studentImport.courseEngagement,
      projectDegree: oneStudent.studentImport.projectDegree,
      teamProjectDegree: oneStudent.studentImport.projectDegree,
      bonusProjectUrls: JSON.parse(oneStudent.studentImport.bonusProjectsUrls),
      projectUrls: JSON.parse(oneStudent.projectUrls),
      portfolioUrls: JSON.parse(oneStudent.portfolioUrls),
      expectedTypeWork: oneStudent.expectedTypeWork,
      expectedContractType: oneStudent.expectedContractType,
      targetWorkCity: oneStudent.targetWorkCity,
      expectedSalary: oneStudent.expectedSalary,
      canTakeApprenticeship: oneStudent.canTakeApprenticeship,
      monthsOfCommercialExp: oneStudent.monthsOfCommercialExp,
      education: oneStudent.education,
      workExperience: oneStudent.workExperience,
      courses: oneStudent.courses,
      email: oneStudent.studentImport.email,
      telephone: oneStudent.telephone,
    };
  }

  async getAllWithSearchedPhrase(searchedPhrase: string, numberOfPage: number) {
    const maxPerPage = MAX_PER_PAGE;

    const [items, count] = await Student.findAndCount({
      relations: {
        studentImport: true,
      },
      select: {
        id: true,
        status: true,
        firstName: true,
        lastName: true,
        expectedTypeWork: true,
        targetWorkCity: true,
        expectedContractType: true,
        expectedSalary: true,
        canTakeApprenticeship: true,
        monthsOfCommercialExp: true,
        studentImport: {
          courseCompletion: true,
          courseEngagement: true,
          projectDegree: true,
          teamProjectDegree: true,
          id: true,
        },
      },
      where: {
        status: UserStatus.active,
        targetWorkCity: searchedPhrase,
        studentImport: {
          isActive: true,
        },
      },
      skip: maxPerPage * (numberOfPage - 1),
      take: maxPerPage,
    });

    const availableStudents: AvailableStudentToListResponseInterface[] =
      items.map((student) => {
        return {
          id: student.studentImport.id,
          firstName: student.firstName,
          lastName: `${student.lastName[0]}.`,
          expectedTypeWork: student.expectedTypeWork,
          targetWorkCity: student.targetWorkCity,
          expectedContractType: student.expectedContractType,
          expectedSalary: student.expectedSalary,
          canTakeApprenticeship: student.canTakeApprenticeship,
          monthsOfCommercialExp: student.monthsOfCommercialExp,
          courseCompletion: student.studentImport.courseCompletion,
          courseEngagement: student.studentImport.courseEngagement,
          projectDegree: student.studentImport.projectDegree,
          teamProjectDegree: student.studentImport.teamProjectDegree,
        };
      });

    const totalPages = Math.ceil(count / maxPerPage);
    return { count, availableStudents, totalPages };
  }

  async filterListWithAllStudents(filters: FiltersDto) {
    const maxPerPage = MAX_PER_PAGE;
    const {
      contractType,
      codeRate,
      courseRate,
      internship,
      teamWorkRate,
      workPlace,
      experience,
      salary,
      activityRate,
    } = filters;

    const ifNoFilteredRatios = [1, 2, 3, 4, 5];
    const ifNoFilteredOrSignedAllContractType: ContractType[] = [
      ContractType.b2b,
      ContractType.contractOfEmployment,
      ContractType.contractOfMandate,
      ContractType.contractWork,
      ContractType.noPreference,
    ];
    const noFilteredOrAllSignedTypeWork: TypeWork[] = [
      TypeWork.stationary,
      TypeWork.readyToMove,
      TypeWork.hybrid,
      TypeWork.remotely,
      TypeWork.noPreference,
    ];
    const items = await this.dataSource
      .getRepository(Student)
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.studentImport', 'studentImport')
      .where('studentImport.isActive = :isActive', { isActive: true })
      .andWhere('student.expectedContractType IN (:...contractType)', {
        contractType:
          contractType.length !== 0
            ? contractType.length === 4
              ? ifNoFilteredOrSignedAllContractType
              : [...contractType, TypeWork.noPreference]
            : ifNoFilteredOrSignedAllContractType,
      })
      .andWhere('studentImport.projectDegree IN (:...codeRate)', {
        codeRate: codeRate.length !== 0 ? codeRate : ifNoFilteredRatios,
      })
      .andWhere('studentImport.courseCompletion IN (:...courseRate)', {
        courseRate: courseRate.length !== 0 ? courseRate : ifNoFilteredRatios,
      })
      .andWhere('student.canTakeApprenticeship IN (:...internship)', {
        internship: internship !== null ? [internship] : [true, false],
      })
      .andWhere('studentImport.teamProjectDegree IN (:...teamWorkRate)', {
        teamWorkRate:
          teamWorkRate.length !== 0 ? teamWorkRate : ifNoFilteredRatios,
      })
      .andWhere('student.expectedTypeWork IN (:...workPlace)', {
        workPlace:
          workPlace.length !== 0
            ? workPlace.length === 2
              ? noFilteredOrAllSignedTypeWork
              : workPlace[0] === 'stationary'
              ? [
                  TypeWork.stationary,
                  TypeWork.readyToMove,
                  TypeWork.hybrid,
                  TypeWork.noPreference,
                ]
              : [TypeWork.hybrid, TypeWork.remotely, TypeWork.noPreference]
            : noFilteredOrAllSignedTypeWork,
      })
      .andWhere('student.monthsOfCommercialExp >= :experience', {
        experience: experience !== null ? experience : 0,
      })
      .andWhere('student.expectedSalary >= :salaryLow', {
        salaryLow: salary[0] ? salary[0] : 0,
      })
      .andWhere('student.expectedSalary <= :salaryHigh', {
        salaryHigh: salary[1] ? salary[1] : 99999999,
      })
      .andWhere('studentImport.courseEngagement IN (:...activityRate)', {
        activityRate:
          activityRate.length !== 0 ? activityRate : ifNoFilteredRatios,
      })
      // .take(maxPerPage)
      // .skip(maxPerPage * (currentPage - 1))
      .getMany();

    // const count = items.length;
    // const totalPages = Math.ceil(count / maxPerPage);
    // return { count, items, totalPages };
    return items;
  }
}
