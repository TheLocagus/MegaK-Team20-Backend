import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { FiltersDto } from '../dto/recruiter.dto';
import {
  IAvailableStudentToListResponse,
  ICheckRecruiterIfExist,
  IForInterviewStudentToListResponse,
  ISingleStudentCvResponse,
  RecruiterActionsOfStatusEnum,
} from '../types';

export interface StatusResponse {
  status: RecruiterActionsOfStatusEnum;
}

@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}


  @Get('/students/filter')
  filterListWithAllStudents(@Query() filters: FiltersDto) {
    return this.recruiterService.filterListWithAllStudents(filters);
  }

  @Get('/students/search/:searchedPhrase')
  getAllWithSearchedPhrase(
    @Param('searchedPhrase') searchedPhrase: string | number,
  ) {
    return this.recruiterService.getAllWithSearchedPhrase(searchedPhrase);
  }

  @Get('/students/for-interview/:pageNumber')
  getForInterviewStudents(
    @Param('pageNumber') pageNumber: string,
  ): Promise<IForInterviewStudentToListResponse> {
    return this.recruiterService.getForInterviewStudents(Number(pageNumber));
  }

  @Get('/students/cv/:id')
  getOneStudentCv(@Param('id') id: string): Promise<ISingleStudentCvResponse> {
    return this.recruiterService.getOneStudentCv(id);
  }

  @Get('/students/:pageNumber')
  getAllStudents(
    @Param('pageNumber') pageNumber: string,
  ): Promise<IAvailableStudentToListResponse> {
    return this.recruiterService.getAllStudents(Number(pageNumber));
  }

  @Get('/register/:id/:registerToken')
  getOneRecruiterAndCompareToken(
    @Param('id') id: string,
    @Param('registerToken') registerToken: string,
  ): Promise<ICheckRecruiterIfExist> {
    return this.recruiterService.getOneRecruiterAndCompareToken(
      id,
      registerToken,
    );
  }

  @Patch('/students/:id')
  changeStatus(@Param('id') id: string, @Body() status: StatusResponse) {
    return this.recruiterService.changeStatus(id, status.status);
  }
}
