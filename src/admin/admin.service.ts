import { Inject, Injectable } from '@nestjs/common';
import { StudentToImportDto } from '../dto/student-to-import.dto';
import { v4 as uuid } from 'uuid';
import { MailService } from '../mail/mail.service';
import { registeredStudentInfoEmailTemplate } from '../templates/email/registered-student-info';
import { AddRecruiterDto } from '../dto/add-recruiter.dto';

@Injectable()
export class AdminService {
  constructor(@Inject(MailService) private mailService: MailService) {}

  async importStudents(students: StudentToImportDto[]) {
    for (const student of students) {
      // const importedStudent = new ImportedStudent();
      const importedStudent = new StudentImport();
      const token = uuid();

      importedStudent.email = student.email;
      importedStudent.bonusProjectUrls = JSON.stringify(
        student.bonusProjectUrls,
      );
      importedStudent.courseCompletion = student.courseCompletion;
      importedStudent.courseEngagement = student.courseEngagment;
      importedStudent.projectDegree = student.projectDegree;
      importedStudent.teamProjectDegree = student.teamProjectDegree;
      importedStudent.isActive = false;
      importedStudent.token = token;
      await importedStudent.save();

      const studentDatas = new Student();

      studentDatas.studentImport = importedStudent;
      await studentDatas.save();

      await this.mailService.sendMail(
        importedStudent.email,
        'Aktywacja konta MegaK Head Hunters',
        registeredStudentInfoEmailTemplate(importedStudent.id, token),
      );
    }

    return {
      success: true,
      message: 'Importing students finished successfully',
    };
  }

  async importRecruiters(recruiter: AddRecruiterDto) {
    const importedRecruiter: any = new Recruiter();
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
      registeredStudentInfoEmailTemplate(importedRecruiter.id, token),
    );
  }
}
