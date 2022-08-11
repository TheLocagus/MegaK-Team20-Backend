import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { StudentCvInterface } from '../types/student';
import { FiltersDto } from '../dto/recruiter.dto';
import { RecruiterActionsOfStatusEnum } from '../enums/student.enum';

export interface StatusResponse {
  status: RecruiterActionsOfStatusEnum;
}

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

  @Get('/filter')
  filterListWithAllStudents(@Body() filters: FiltersDto) {
    return this.recruiterService.filterListWithAllStudents(filters);
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
  changeStatus(@Param('id') id: string, @Body() status: StatusResponse) {
    return this.recruiterService.changeStatus(id, status.status);
  }

  @Get('/cv/:id')
  getOneStudentCv(@Param('id') id: string): Promise<StudentCvInterface> {
    return this.recruiterService.getOneStudentCv(id);
  }

  @Get('/students/:searchedPhrase')
  getAllWithSearchedPhrase(
    @Param('searchedPhrase') searchedPhrase: string | number
  ) {
    return this.recruiterService.getAllWithSearchedPhrase(searchedPhrase);
  }
}
