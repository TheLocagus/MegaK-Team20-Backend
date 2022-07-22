import { Injectable } from '@nestjs/common';
import { StudentToImportDto } from '../dto/student-to-import.dto';

@Injectable()
export class AdminService {
  async importStudents(students: StudentToImportDto[]) {
    for (const student of students) {
      const importedStudent = new ImportedStudent();
      importedStudent.id = student.id;
      importedStudent.email = student.email;
      importedStudent.bonusProjectUrls = student.bonusProjectUrls;
      importedStudent.courseCompletion = student.courseCompletion;
      importedStudent.courseEngagment = student.courseEngagment;
      importedStudent.projectDegree = student.projectDegree;
      importedStudent.teamProjectDegree = student.teamProjectDegree;
      await importedStudent.save();
    }
    return {
      success: true,
      message: 'Importing students finished successfully',
    };
  }
}
