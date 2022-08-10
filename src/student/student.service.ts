import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Student } from './student.entity';
import { GetOneStudentResponseInterface } from '../types/student';
import { DataSource, Repository } from 'typeorm';
import { CreateStudentDto, UpdateStudentDto } from '../dto/create-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPwd } from '../utils/hash-pwd';
import { v4 as uuidv4 } from 'uuid';
import { StudentImport } from '../studentImport/studentImport.entity';

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
  }

  async getOneStudentAndCompareToken(id: string, registerToken: string) {
    const oneStudent = await this.dataSource
      .getRepository(StudentImport)
      .createQueryBuilder('studentImport')
      .where('studentImport.id = :id', { id })
      .andWhere('studentImport.registerToken = :registerToken', {
        registerToken,
      })
      .getOne();
    return oneStudent
      ? {
          isOk: true,
          id: oneStudent.id,
          registerToken: oneStudent.registerToken,
        }
      : {
          isOk: false,
        };
  }

  async createStudent(id: string, createStudentDto: CreateStudentDto) {
    try {
      const student = new Student();
      student.studentImport = await StudentImport.findOneBy({
        id,
      });
      student.id = uuidv4();
      student.pwdHash = hashPwd(createStudentDto.pwdHash);
      student.expectedContractType = createStudentDto.expectedContractType;
      student.expectedTypeWork = createStudentDto.expectedTypeWork;
      student.bio = createStudentDto.bio;
      student.courses = createStudentDto.courses;
      student.canTakeApprenticeship = createStudentDto.canTakeApprenticeship;
      student.education = createStudentDto.education;
      student.expectedSalary = createStudentDto.expectedSalary;
      student.projectUrls = JSON.stringify(createStudentDto.projectUrls);
      student.firstName = createStudentDto.firstName;
      student.githubUsername = createStudentDto.githubUsername;
      student.lastName = createStudentDto.lastName;
      student.monthsOfCommercialExp = createStudentDto.monthsOfCommercialExp;
      student.portfolioUrls = JSON.stringify(createStudentDto.portfolioUrls);
      student.targetWorkCity = createStudentDto.targetWorkCity;
      student.telephone = createStudentDto.telephone;
      student.workExperience = createStudentDto.workExperience;
      await student.save();

      const studentImport = await StudentImport.findOneBy({ id });
      studentImport.isActive = true;
      studentImport.registerToken = null;
      await studentImport.save();

      //@TODO jakaś lepsza walidacja? sprawdzenie czy faktycznie kursant został dodany?
      return {
        isOk: true,
        message: 'Student added correctly.',
      };
    } catch (e) {
      return {
        isOk: false,
        message: 'get catched',
      };
    }
  }

  async patchStudent(id: string, updateStudentDto: UpdateStudentDto) {
    await this.dataSource
      .createQueryBuilder()
      .update(Student)
      .set({
        bio: updateStudentDto.bio,
        canTakeApprenticeship: updateStudentDto.canTakeApprenticeship,
        courses: updateStudentDto.courses,
        education: updateStudentDto.education,
        expectedContractType: updateStudentDto.expectedContractType,
        expectedSalary: updateStudentDto.expectedSalary,
        expectedTypeWork: updateStudentDto.expectedTypeWork,
        projectUrls: JSON.stringify(updateStudentDto.projectUrls),
        firstName: updateStudentDto.firstName,
        githubUsername: updateStudentDto.githubUsername,
        lastName: updateStudentDto.lastName,
        monthsOfCommercialExp: updateStudentDto.monthsOfCommercialExp,
        portfolioUrls: JSON.stringify(updateStudentDto.portfolioUrls),
        targetWorkCity: updateStudentDto.targetWorkCity,
        telephone: updateStudentDto.telephone,
        workExperience: updateStudentDto.workExperience,
      })
      .where('studentImport.id = :id', { id })
      .execute();
  }
}
