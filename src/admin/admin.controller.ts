import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { StudentToImportDto } from '../dto/student-to-import.dto';
import { AddRecruiterDto } from '../dto/add-recruiter.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/import-students')
  importStudents(@Body() studentsToImport: StudentToImportDto[]) {
    return this.adminService.importStudents(studentsToImport);
  }

  @Post('/import-recruiters')
  importRecruiters(@Body() recruitersToImport: AddRecruiterDto) {
    return this.adminService.importRecruiters(recruitersToImport);
  }
}
