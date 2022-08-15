import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Student } from './student.entity';
import { GetOneStudentResponseInterface, ICheckStudentIfExist } from '../types';
import { DataSource, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPwd } from '../utils/hash-pwd';
import { v4 as uuidv4 } from 'uuid';
import { StudentImport } from '../studentImport/studentImport.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}
  @Inject(forwardRef(() => DataSource)) private dataSource: DataSource;

  async getOneStudent(id: string): Promise<GetOneStudentResponseInterface> {
    const oneStudent = await this.dataSource
      .getRepository(Student)
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.studentImport', 'studentImport')
      .where('studentImport.id = :id', { id })
      .getOne();

    if (oneStudent) {
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
        workExperience: oneStudent.workExperience,
        teamProjectDegree: oneStudent.studentImport.teamProjectDegree,
        projectDegree: oneStudent.studentImport.projectDegree,
        courseEngagement: oneStudent.studentImport.courseEngagement,
        courseCompletion: oneStudent.studentImport.courseCompletion,
      };
    } else {
      throw new Error('Student does not exist');
    }
  }

  async getOneStudentAndCompareToken(
    id: string,
    registerToken: string,
  ): Promise<ICheckStudentIfExist> {
    const oneStudent = await StudentImport.findOneOrFail({
      where: {
        id,
        registerToken,
      },
    });

    return oneStudent
      ? {
          success: true,
          id: oneStudent.id,
          registerToken: oneStudent.registerToken,
          role: 'student',
        }
      : {
          success: false,
        };
  }

  async createStudent(createStudentDto: CreateStudentDto) {
    const oneStudent = await StudentImport.findOneOrFail({
      where: {
        id: createStudentDto.id,
        registerToken: createStudentDto.registerToken,
      },
    });

    if (oneStudent) {
      const student = new Student();
      student.studentImport = await StudentImport.findOneBy({
        id: createStudentDto.id,
      });
      student.id = uuidv4();
      student.pwdHash = hashPwd(createStudentDto.pwd);
      student.firstName = createStudentDto.firstName;
      student.lastName = createStudentDto.lastName;
      student.githubUsername = createStudentDto.githubUsername;
      student.projectUrls = JSON.stringify(createStudentDto.projectUrls);
      student.expectedTypeWork = createStudentDto.expectedTypeWork;
      student.expectedContractType = createStudentDto.expectedContractType;
      student.canTakeApprenticeship = createStudentDto.canTakeApprenticeship;
      student.monthsOfCommercialExp = createStudentDto.monthsOfCommercialExp;
      student.studentImport.isActive = true;
      student.studentImport.registerToken = null;
      student.bio = createStudentDto.bio;
      student.targetWorkCity = createStudentDto.targetWorkCity;
      student.portfolioUrls = JSON.stringify(createStudentDto.portfolioUrls);
      student.expectedSalary = createStudentDto.expectedSalary;
      student.education = createStudentDto.education;
      student.workExperience = createStudentDto.workExperience;
      student.courses = createStudentDto.courses;
      student.telephone = createStudentDto.telephone;
      await student.save();

      oneStudent.isActive = true;
      oneStudent.registerToken = null;
      await oneStudent.save();

      return {
        success: true,
      };
    } else {
      throw new Error('Can not create student');
    }
  }

  async patchStudent(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await Student.findOne({
      where: {
        studentImport: {
          id,
        },
      },
    });
    if (student) {
      const studentImport = await StudentImport.findOne({
        where: {
          id,
        },
      });
      if (studentImport) {
        const checkIfEmailAlreadyExist = await StudentImport.findOne({
          where: {
            id: Not(studentImport.id),
            email: updateStudentDto.email,
          },
        });
        if (checkIfEmailAlreadyExist) {
          throw new Error('You can not use this email address');
        }
        student.studentImport = studentImport;
        student.studentImport.email =
          updateStudentDto.email ?? student.studentImport.email;
        student.firstName = updateStudentDto.firstName ?? student.firstName;
        student.lastName = updateStudentDto.lastName ?? student.lastName;
        student.githubUsername =
          updateStudentDto.githubUsername ?? student.githubUsername;
        student.projectUrls =
          updateStudentDto.projectUrls ?? student.projectUrls;
        student.expectedTypeWork =
          updateStudentDto.expectedTypeWork ?? student.expectedTypeWork;
        student.expectedContractType =
          updateStudentDto.expectedContractType ?? student.expectedContractType;
        student.canTakeApprenticeship =
          updateStudentDto.canTakeApprenticeship ??
          student.canTakeApprenticeship;
        student.monthsOfCommercialExp =
          updateStudentDto.monthsOfCommercialExp ??
          student.monthsOfCommercialExp;
        student.telephone = updateStudentDto.telephone ?? student.telephone;
        student.portfolioUrls =
          updateStudentDto.portfolioUrls ?? student.portfolioUrls;
        student.bio = updateStudentDto.bio ?? student.bio;
        student.targetWorkCity =
          updateStudentDto.targetWorkCity ?? student.targetWorkCity;
        student.expectedSalary =
          updateStudentDto.expectedSalary ?? student.expectedSalary;
        student.education = updateStudentDto.education ?? student.education;
        student.workExperience =
          updateStudentDto.workExperience ?? student.workExperience;
        student.courses = updateStudentDto.courses ?? student.courses;
        await student.save();
        await studentImport.save();
        return {
          success: true,
        };
      }
    }
  }
}
