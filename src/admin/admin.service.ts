import { Injectable } from '@nestjs/common';
import { StudentToImportDto } from '../dto/student-to-import.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AdminService {
  async importStudents(students: StudentToImportDto[]) {
    for (const student of students) {
      const importedStudent = new ImportedStudent();
      if (!student.id) {
        importedStudent.id = uuid();
      } else {
        importedStudent.id = student.id;
      }
      importedStudent.email = student.email;
      importedStudent.bonusProjectUrls = student.bonusProjectUrls;
      importedStudent.courseCompletion = student.courseCompletion;
      importedStudent.courseEngagment = student.courseEngagment;
      importedStudent.projectDegree = student.projectDegree;
      importedStudent.teamProjectDegree = student.teamProjectDegree;
      await importedStudent.save();

      const studentDatas = new Student();
      studentDatas.email = student.email;
      studentDatas.isAvctive = false;
    }
    return {
      success: true,
      message: 'Importing students finished successfully',
    };
  }
}
