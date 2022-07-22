import { Controller, Post, Body, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { StudentToImportDto } from "../dto/student-to-import.dto";

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  welcome() {
    return this.adminService.hello();
  }

  @Post('/import')
  importStudents(@Body() studentsToImport: StudentToImportDto[]) {
    return this.adminService.importStudents(studentsToImport);
  }
}
