import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';

@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @Get('/students')
  getAllStudents() {
    return this.recruiterService.getAllStudents();
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
}
