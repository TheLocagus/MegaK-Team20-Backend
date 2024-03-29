import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { MailService } from '../mail/mail.service';
import { registeredStudentInfoEmailTemplate } from '../templates/email/registered-student-info';
import { AddRecruiterDto } from './dto/add-recruiter.dto';
import { Recruiter } from '../recruiter/recruiter.entity';
import { MulterDiskUploadedFiles } from '../interfaces/files';
import * as fs from 'fs/promises';
import * as path from 'path';
import { storageDir } from '../utils/storage';
import { StudentToImport } from '../interfaces/student-to-import';
import { isStudentToImport } from '../utils/is-student-to-import';
import { StudentImport } from '../studentImport/studentImport.entity';
import { DataSource } from 'typeorm';
import { registeredRecruiterInfoEmailTemplate } from '../templates/email/registered-recruiter-info';

@Injectable()
export class AdminService {
  constructor(
    @Inject(MailService) private mailService: MailService,
    @Inject(forwardRef(() => DataSource)) private dataSource: DataSource,
  ) {}

  async importStudents(files: MulterDiskUploadedFiles) {
    const fileProperty = files?.file?.[0] ?? null;
    const students: StudentToImport[] = [];
    let modifiedImportedStudents = 0;
    let newImportedStudents = 0;
    let errorImportedStudents = 0;

    try {
      if (
        fileProperty === null ||
        fileProperty.mimetype !== 'application/json'
      ) {
        throw new Error('No file or file format is different then JSON.');
      }
      const data = JSON.parse(
        await fs.readFile(
          path.join(storageDir(), 'students-list', fileProperty.filename),
          'utf-8',
        ),
      );

      data.forEach((element) => {
        if (isStudentToImport(element)) {
          students.push(element);
        } else {
          errorImportedStudents++;
        }
      });

      for (const student of students) {
        const checkEmail = await StudentImport.findOne({
          where: { email: student.email },
        });
        if (!checkEmail) {
          const importedStudent = new StudentImport();
          const token = uuid();
          importedStudent.id = uuid();
          importedStudent.email = student.email;
          importedStudent.bonusProjectsUrls = student.bonusProjectUrls;
          importedStudent.courseCompletion = student.courseCompletion;
          importedStudent.courseEngagement = student.courseEngagment;
          importedStudent.projectDegree = student.projectDegree;
          importedStudent.teamProjectDegree = student.teamProjectDegree;
          importedStudent.isActive = false;
          importedStudent.registerToken = token;

          await this.mailService.sendMail(
            importedStudent.email,
            'Aktywacja konta MegaK Head Hunters',
            registeredStudentInfoEmailTemplate(importedStudent.id, token),
          );
          newImportedStudents++;
          await importedStudent.save();
        } else {
          await this.dataSource
            .createQueryBuilder()
            .update(StudentImport)
            .set({
              bonusProjectsUrls: student.bonusProjectUrls,
              courseCompletion: student.courseCompletion,
              courseEngagement: student.courseEngagment,
              projectDegree: student.projectDegree,
              teamProjectDegree: student.teamProjectDegree,
            })
            .where('email = :email', { email: student.email })
            .execute();
          modifiedImportedStudents++;
        }
      }

      await fs.unlink(
        path.join(storageDir(), 'students-list', fileProperty.filename),
      );

      return {
        success: true,
        message: 'Importing students finished successfully',
        newImportedStudents,
        modifiedImportedStudents,
        errorImportedStudents,
      };
    } catch (error) {
      try {
        if (fileProperty) {
          await fs.unlink(
            path.join(storageDir(), 'students-list', fileProperty.filename),
          );
        }
      } catch (subError) {}

      throw error;
    }
  }

  async importRecruiters(recruiter: AddRecruiterDto) {
    const recruiterFromDB = await Recruiter.findOne({
      where: { email: recruiter.email },
    });
    if (!recruiterFromDB) {
      const importedRecruiter = new Recruiter();
      const token = uuid();
      //Dodać isActive do rekrutera w bazie danych
      importedRecruiter.id = uuid();
      importedRecruiter.email = recruiter.email;
      importedRecruiter.registerToken = token;
      importedRecruiter.fullName = recruiter.fullName;
      importedRecruiter.company = recruiter.company;
      importedRecruiter.maxReservedStudents = recruiter.maxReservedStudents;
      importedRecruiter.isActive = false;

      await this.mailService.sendMail(
        importedRecruiter.email,
        'Aktywacja konta MegaK Head Hunters',
        registeredRecruiterInfoEmailTemplate(importedRecruiter.id, token),
      );
      await importedRecruiter.save();

      return {
        success: true,
        message: 'Recruiter saved successfully',
      };
    } else {
      await this.dataSource
        .createQueryBuilder()
        .update(Recruiter)
        .set({
          fullName: recruiter.fullName,
          company: recruiter.company,
          maxReservedStudents: recruiter.maxReservedStudents,
        })
        .where('email = :email', { email: recruiter.email })
        .execute();
      return {
        success: true,
        message: 'Recruiter modified',
      };
    }
  }
}
