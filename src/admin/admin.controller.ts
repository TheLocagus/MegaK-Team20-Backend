import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddRecruiterDto } from './dto/add-recruiter.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storageDir } from '../utils/storage';
import * as path from 'path';
import { MulterDiskUploadedFiles } from '../interfaces/files';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/import-students')
  @UseGuards(AuthGuard('admin'))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'file',
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
  @UseGuards(AuthGuard('admin'))
  importRecruiters(@Body() recruitersToImport: AddRecruiterDto) {
    return this.adminService.importRecruiters(recruitersToImport);
  }
}
