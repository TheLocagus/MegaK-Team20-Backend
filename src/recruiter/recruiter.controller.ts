import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { StudentCvInterface, StudentProfileForRecruiterInterface } from '../types/student';

@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @Get('/students')
  getAllStudents() {
    return this.recruiterService.getAllStudents();
  }

  @Get('/for-interview')
  getForInterviewStudents() {
    return this.recruiterService.getForInterviewStudents();
  }

  @Post('/register/:id/:registerToken')
  getOneRecruiterAndCompareToken(
    @Param('id') id: string,
    @Param('registerToken') registerToken: string,
  ) {
    return this.recruiterService.getOneRecruiterAndCompareToken(
      id,
      registerToken,
    );
  }

  @Patch('/:id')
  changeStatus(@Param('id') id: string, @Body() status: { status: string }) {
    return this.recruiterService.changeStatus(id, status.status);
  }

  @Get('/cv/:id')
  getOneStudentCv(
    @Param('id') id: string
  ): Promise<StudentCvInterface> {
    return this.recruiterService.getOneStudentCv(id);
  }

  @Get('/:userId')
  getDataStudentProfileForRecruiter(
    @Param('userId') userId: string
  ): Promise<StudentProfileForRecruiterInterface> {
    return this.recruiterService.getDataStudentProfileForRecruiter(userId);
  }
}
