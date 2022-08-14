import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Student, UserStatus } from '../student/student.entity';
import {
  ContractType,
  ICheckRecruiterIfExist,
  ISingleStudentCvResponse,
  TypeWork,
} from '../types';
import { Recruiter } from './recruiter.entity';
import { FiltersDto } from '../dto/recruiter.dto';
import { StudentImport } from '../studentImport/studentImport.entity';
import { HttpService } from '@nestjs/axios';
import { count, firstValueFrom, map, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';

import {
  AvailableStudentToListResponseInterface,
  ForInterviewStudentToListResponseInterface,
  IAvailableStudentToListResponse,
  IForInterviewStudentToListResponse,
  RecruiterActionsOfStatusEnum,
} from '../types';
import { RecruiterToStudent } from './recruiterToStudent.entity';
import { hashPwd } from '../utils/hash-pwd';

const MAX_PER_PAGE = 5;

@Injectable()
export class RecruiterService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => DataSource)) private dataSource: DataSource,
  ) {}

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

  async changeStatus(
    studentImportId: string,
    recruiterId: string,
    status: RecruiterActionsOfStatusEnum,
  ) {
    //@TODO lepsza walidacja błędów
    const foundStudentImport = await StudentImport.findOneBy({
      id: studentImportId,
    });
    const foundStudent = await Student.findOne({
      where: {
        studentImport: {
          id: studentImportId,
        },
      },
    });
    const recruiter = await Recruiter.findOneBy({
      id: recruiterId,
    });

    if (!foundStudent && !foundStudentImport && !recruiter) {
      throw new Error('There is no student or no recruiter found');
    }

    switch (status) {
      case `${RecruiterActionsOfStatusEnum.forInterview}`: {
        console.log({ foundStudent });
        const reservationTimestamp =
          new Date().getTime() + 10 * 24 * 60 * 60 * 1000;

        let recruiterToStudent = await RecruiterToStudent.findOne({
          where: {
            // recruiterId,
            // studentImportId: foundStudent.id,
            recruiterId,
            studentImportId: foundStudentImport.id,
          },
        });
        if (!recruiterToStudent) {
          recruiterToStudent = new RecruiterToStudent();
          recruiterToStudent.recruiterToStudentId = uuid();
          recruiterToStudent.endOfReservation = new Date(reservationTimestamp);
          recruiterToStudent.recruiter = recruiter;
          recruiterToStudent.studentImport = foundStudentImport;
          await recruiterToStudent.save();
          return {
            success: true,
          };
        } else {
          throw new Error('You have added student to in talk');
        }
      }
      case `${RecruiterActionsOfStatusEnum.noInterested}`: {
        const recruiterToStudentToDelete = await RecruiterToStudent.findOne({
          where: {
            recruiterId,
            studentImportId: foundStudentImport.id,
          },
        });
        if (recruiterToStudentToDelete) {
          await recruiterToStudentToDelete.remove();
          return {
            success: true,
          };
        } else {
          throw new Error('Can not change status to not interested');
        }
      }
      case `${RecruiterActionsOfStatusEnum.employed}`: {
        foundStudent.status = UserStatus.employed;
        foundStudentImport.isActive = false;
        await foundStudent.save();
        await foundStudentImport.save();
        console.log(foundStudent);
        const recruiterToStudentToDelete = await RecruiterToStudent.findOne({
          where: {
            recruiterId,
            studentImportId: foundStudentImport.id,
          },
        });
        if (recruiterToStudentToDelete) {
          await recruiterToStudentToDelete.remove();
          return {
            success: true,
          };
        } else {
          throw new Error('Can not change status to employed');
        }
      }
      default: {
        throw new Error('Something went wrong.');
      }
    }
  }

  async getForInterviewStudents(recruiterId: string) {
    // const students = await this.dataSource
    //   .getRepository(Student)
    //   .createQueryBuilder('student')
    //   .leftJoinAndSelect('student.studentImport', 'studentImport')
    //   .where('student.status = :status', { status: UserStatus.duringTalk })
    //   .getMany();

    const recruiter = await Recruiter.findOne({
      where: {
        id: recruiterId,
      },
    });

    if (recruiter) {
      const studentsImportIds = await RecruiterToStudent.find({
        where: {
          recruiterId: recruiter.id,
        },
      });
      console.log('zczytał recruiter');
      if (studentsImportIds) {
        const students = await Promise.all(
          studentsImportIds.map(async (studentId) => {
            const studentImport = await StudentImport.findOne({
              where: {
                id: studentId.studentImportId,
              },
            });
            const student = await Student.findOne({
              where: {
                studentImport: {
                  id: studentId.studentImportId,
                },
              },
            });
            student.studentImport = studentImport;

            if (student) {
              return {
                ...student,
                ['endOfReservation']: studentId.endOfReservation,
              };
            }
          }),
        );
        console.log('zczytał studentsids');
        const dataToResponse: ForInterviewStudentToListResponseInterface[] = [];

        for (const student of students) {
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
      } else {
        throw new Error('No students to talk with');
      }
    } else {
      throw new Error('Recruiter not found');
    }
  }

  async getOneStudentCv(
    recruiterId: string,
    id: string,
  ): Promise<ISingleStudentCvResponse> {
    try {
      // const isStudentForInterview = await RecruiterToStudent.findOne({
      //   where: { recruiterId: recruiterId, studentImportId: id },
      // });
      //
      // if (!isStudentForInterview) {
      //   throw new Error('Brak dostępu lub błędne dane');
      // }

      const oneStudent = await this.dataSource
        .getRepository(Student)
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.studentImport', 'studentImport')
        .where('studentImport.id = :id', { id })
        .getOne();

      return {
        firstName: oneStudent.firstName,
        lastName: oneStudent.lastName,
        bio: oneStudent.bio,
        githubUsername: oneStudent.githubUsername,
        courseCompletion: oneStudent.studentImport.courseCompletion,
        courseEngagement: oneStudent.studentImport.courseEngagement,
        projectDegree: oneStudent.studentImport.projectDegree,
        teamProjectDegree: oneStudent.studentImport.teamProjectDegree,
        bonusProjectUrls: JSON.parse(
          oneStudent.studentImport.bonusProjectsUrls,
        ),
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
    } catch (e) {
      console.log(e);
    }
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

  async filterListWithAllStudents(filters: FiltersDto, numberOfPage: number) {
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
    // const [availableStudents, count] = await Student.findAndCount({
    //   relations: {
    //     studentImport: true,
    //   },
    //   select: {
    //     id: true,
    //     status: true,
    //     firstName: true,
    //     lastName: true,
    //     expectedTypeWork: true,
    //     targetWorkCity: true,
    //     expectedContractType: true,
    //     expectedSalary: true,
    //     canTakeApprenticeship: true,
    //     monthsOfCommercialExp: true,
    //     studentImport: {
    //       courseCompletion: true,
    //       courseEngagement: true,
    //       projectDegree: true,
    //       teamProjectDegree: true,
    //       id: true,
    //     },
    //   },
    //   where: {
    //     status: UserStatus.active,
    //     expectedContractType: In(
    //       contractType.length !== 0
    //         ? contractType.length === 4
    //           ? ifNoFilteredOrSignedAllContractType
    //           : [...contractType, TypeWork.noPreference]
    //         : ifNoFilteredOrSignedAllContractType,
    //     ),
    //     canTakeApprenticeship: In(
    //       internship !== null ? [internship] : [true, false],
    //     ),
    //     expectedTypeWork: In(
    //       workPlace.length !== 0
    //         ? workPlace.length === 2
    //           ? noFilteredOrAllSignedTypeWork
    //           : workPlace[0] === 'stationary'
    //           ? [
    //               TypeWork.stationary,
    //               TypeWork.readyToMove,
    //               TypeWork.hybrid,
    //               TypeWork.noPreference,
    //             ]
    //           : [TypeWork.hybrid, TypeWork.remotely, TypeWork.noPreference]
    //         : noFilteredOrAllSignedTypeWork,
    //     ),
    //     monthsOfCommercialExp: experience !== null ? experience : 0,
    //
    //     studentImport: {
    //       isActive: true,
    //       projectDegree: In(
    //         codeRate.length !== 0 ? codeRate : ifNoFilteredRatios,
    //       ),
    //       courseCompletion: In(
    //         courseRate.length !== 0 ? courseRate : ifNoFilteredRatios,
    //       ),
    //       teamProjectDegree: In(
    //         teamWorkRate.length !== 0 ? teamWorkRate : ifNoFilteredRatios,
    //       ),
    //     },
    //   },
    //
    //   skip: maxPerPage * (numberOfPage - 1),
    //   take: maxPerPage,
    // });

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
      .take(maxPerPage)
      .skip(maxPerPage * (numberOfPage - 1))
      .getMany();

    const availableStudents: AvailableStudentToListResponseInterface[] =
      items.map((student) => {
        return {
          id: student.studentImport.id,
          firstName: student.firstName,
          lastName: student.lastName,
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
    const data = await this.dataSource
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
      .getMany();

    const count = data.length;
    // const totalPages = Math.ceil(count / maxPerPage);
    // return { count, items, totalPages };
    console.log(availableStudents);
    const totalPages = Math.ceil(count / maxPerPage);
    return { count, availableStudents, totalPages };
  }

  async setRecruiterPassword(
    recruiterId: string,
    recruiterToken: string,
    password: { password: string },
  ) {
    const recruiter = await Recruiter.findOneOrFail({
      where: {
        id: recruiterId,
        registerToken: recruiterToken,
      },
    });

    recruiter.pwdHash = hashPwd(password.password);
    recruiter.registerToken = null;
    recruiter.isActive = true;
    await recruiter.save();

    return { success: true };
  }

  async getDataOfLoggedRecruiter(recruiterId: string) {
    const recruiter = await Recruiter.findOneOrFail({
      where: {
        id: recruiterId,
        isActive: true,
      },
    });

    const { id, fullName } = recruiter;

    const recruitersStudents = await RecruiterToStudent.findBy({
      recruiterId: id,
    });

    const studentsReserved = recruitersStudents.map((item) => ({
      studentId: item.studentImportId,
      endOfReservation: item.endOfReservation,
    }));

    return { id, fullName, studentsReserved };
  }
}
