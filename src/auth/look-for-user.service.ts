import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Admin } from '../admin/admin.entity';
import { Student } from '../student/student.entity';
import { Recruiter } from '../recruiter/recruiter.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class LookForUser {
  constructor(
    @Inject(forwardRef(() => DataSource)) private dataSource: DataSource,
  ) {}
  async lookForUser(
    email: ForgotPasswordDto,
  ): Promise<Admin | Student | Recruiter | null> {
    let user: Admin | Student | Recruiter | null = null;

    const admin = await Admin.findOne({
      where: {
        email: email.email,
      },
    });
    if (admin) {
      user = admin;
    } else {
      const recruiter = await Recruiter.findOne({
        where: {
          email: email.email,
          isActive: true,
        },
      });
      if (recruiter) {
        user = recruiter;
      } else {
        const student = await this.dataSource
          .getRepository(Student)
          .createQueryBuilder('student')
          .leftJoinAndSelect('student.studentImport', 'studentImport')
          .where('studentImport.email = :email', {
            email: email.email,
          })
          .andWhere('studentImport.isActive = :isActive', {
            isActive: true,
          })
          .getOne();
        if (student) {
          user = student;
        }
      }
    }

    return user;
  }
}
