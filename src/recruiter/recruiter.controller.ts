import { Body, Controller, Get } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';

@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @Get('/all')
  getAllStudents() {
    return this.recruiterService.getAllStudents();
  }
}
