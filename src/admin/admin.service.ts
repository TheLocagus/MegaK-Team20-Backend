import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { MailService } from '../mail/mail.service';
import { registeredStudentInfoEmailTemplate } from '../templates/email/registered-student-info';
import { AddRecruiterDto } from './dto/add-recruiter.dto';
import { Recruiter } from '../recruiter/recruiter.entity';
import { MulterDiskUploadedFiles } from '../interfaces/files';
import * as fs from 'fs';
import * as path from 'path';
import { storageDir } from '../utils/storage';
import { StudentToImport } from '../interfaces/student-to-import';
import { isStudentToImport } from '../utils/is-student-to-import';
import { StudentImport } from '../studentImport/studentImport.entity';

@Injectable()
export class AdminService {
  constructor(@Inject(MailService) private mailService: MailService) {}

  async importStudents(files: MulterDiskUploadedFiles) {
    const fileProperty = files?.testData?.[0] ?? null;
    const students: StudentToImport[] = [];

    try {
      if (
        fileProperty === null ||
        fileProperty.mimetype !== 'application/json'
      ) {
        throw new Error('No file or file format is different then JSON.');
      }
      const data = JSON.parse(
        fs.readFileSync(
          path.join(storageDir(), 'students-list', fileProperty.filename),
          'utf8',
        ),
      );

      data.forEach((element) => {
        if (isStudentToImport(element)) {
          students.push(element);
        } else {
          throw new Error('File has not proper data');
        }
      });

      for (const student of students) {
        const checkEmail = await StudentImport.findOne({
          where: { email: student.email },
        });
        if (!checkEmail) {
          const importedStudent = new StudentImport();
          const token = uuid();
          importedStudent.email = student.email;
          importedStudent.bonusProjectsUrls = student.bonusProjectUrls;
          importedStudent.courseCompletion = student.courseCompletion;
          importedStudent.courseEngagement = student.courseEngagment;
          importedStudent.projectDegree = student.projectDegree;
          importedStudent.teamProjectDegree = student.teamProjectDegree;
          importedStudent.isActive = true; //true dla testów
          importedStudent.registerToken = token;
          await importedStudent.save();

          await this.mailService.sendMail(
            importedStudent.email,
            'Aktywacja konta MegaK Head Hunters',
            registeredStudentInfoEmailTemplate(
              importedStudent.id,
              token,
              'Kursancie',
            ),
          );
        }
      }

      fs.unlinkSync(
        path.join(storageDir(), 'students-list', fileProperty.filename),
      );

      return {
        success: true,
        message: 'Importing students finished successfully',
      };
    } catch (error) {
      try {
        if (fileProperty) {
          fs.unlinkSync(
            path.join(storageDir(), 'students-list', fileProperty.filename),
          );
        }
      } catch (subError) {}

      throw error;
    }
  }

  async importRecruiters(recruiter: AddRecruiterDto) {
    const checkEmail = await Recruiter.findOne({
      where: { email: recruiter.email },
    });
    if (!checkEmail) {
      const importedRecruiter = new Recruiter();
      const token = uuid();
      //Dodać isActive do rekrutera w bazie danych
      importedRecruiter.email = recruiter.email;
      importedRecruiter.fullName = recruiter.fullName;
      importedRecruiter.company = recruiter.company;
      importedRecruiter.maxReservedStudents = recruiter.maxReservedStudents;
      importedRecruiter.isActive = false;
      await importedRecruiter.save();

      await this.mailService.sendMail(
        importedRecruiter.email,
        'Aktywacja konta MegaK Head Hunters',
        registeredStudentInfoEmailTemplate(
          importedRecruiter.id,
          token,
          'Rekruterze',
        ),
      );
      return {
        success: true,
        message: 'Recruiter saved successfully',
      };
    } else {
      return { success: false };
    }
  }
}
