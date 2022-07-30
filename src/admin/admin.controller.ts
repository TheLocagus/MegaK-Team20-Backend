import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddRecruiterDto } from '../dto/add-recruiter.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storageDir } from '../utils/storage';
import * as path from 'path';
import { MulterDiskUploadedFiles } from '../interfaces/files';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/import-students')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'testData',
          maxCount: 1,
        },
      ],
      { dest: path.join(storageDir(), 'students-list') },
    ),
  )
  importStudents(@UploadedFiles() files: MulterDiskUploadedFiles) {
    return this.adminService.importStudents(files);
  }

  @Post('/import-recruiters')
  importRecruiters(@Body() recruitersToImport: AddRecruiterDto) {
    return this.adminService.importRecruiters(recruitersToImport);
  }
}
