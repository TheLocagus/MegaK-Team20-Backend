import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { RecruiterService } from './recruiter.service';
import { FiltersDto } from '../dto/recruiter.dto';
import {
  IAvailableStudentToListResponse,
  ICheckRecruiterIfExist,
  ISingleStudentCvResponse,
  RecruiterActionsOfStatusEnum,
} from '../types';

export interface StatusResponse {
  status: RecruiterActionsOfStatusEnum;
}

@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @Get('/all/:recruiterId/:pageNumber')
  getAllStudents(
    @Param('recruiterId') recruiterId: string,
    @Param('pageNumber')
    pageNumber: string,
  ): Promise<IAvailableStudentToListResponse> {
    return this.recruiterService.getAllStudents(
      recruiterId,
      Number(pageNumber),
    );
  }

  @Get('/:recruiterId/for-interview')
  getForInterviewStudents(@Param('recruiterId') recruiterId: string) {
    return this.recruiterService.getForInterviewStudents(recruiterId);
  }

  @Post('/:numberOfPage/filter')
  filterListWithAllStudents(
    @Body() filters: FiltersDto,
    @Param('numberOfPage') numberOfPage: number,
  ) {
    return this.recruiterService.filterListWithAllStudents(
      filters,
      numberOfPage,
    );
  }

  @Get('/:recruiterId/cv/:id')
  getOneStudentCv(
    @Param('recruiterId') recruiterId: string,
    @Param('id')
    id: string,
  ): Promise<ISingleStudentCvResponse> {
    return this.recruiterService.getOneStudentCv(recruiterId, id);
  }

  @Get('/register/:id/:registerToken')
  getOneRecruiterAndCompareToken(
    @Param('id')
    id: string,
    @Param('registerToken')
    registerToken: string,
  ): Promise<ICheckRecruiterIfExist> {
    return this.recruiterService.getOneRecruiterAndCompareToken(
      id,
      registerToken,
    );
  }

  @Get('/:recruiterId/data')
  getDataOfLoggedRecruiter(@Param('recruiterId') recruiterId: string) {
    return this.recruiterService.getDataOfLoggedRecruiter(recruiterId);
  }

  @Patch('/status/:recruiterId/:studentId')
  changeStatus(
    @Param('studentId')
    studentId: string,
    @Param('recruiterId')
    recruiterId: string,
    @Body()
    status: StatusResponse,
  ) {
    return this.recruiterService.changeStatus(
      studentId,
      recruiterId,
      status.status,
    );
  }

  @Get('/:recruiterId/:numberOfPage/:searchedPhrase')
  getAllWithSearchedPhrase(
    @Param('recruiterId') recruiterId: string,
    @Param('searchedPhrase')
    searchedPhrase: string,
    @Param('numberOfPage')
    numberOfPage: number,
  ) {
    return this.recruiterService.getAllWithSearchedPhrase(
      recruiterId,
      searchedPhrase,
      numberOfPage,
    );
  }

  @Patch('/register/:recruiterId/:recruiterToken/')
  setRecruiterPassword(
    @Param('recruiterId') recruiterId: string,
    @Param('recruiterToken') recruiterToken: string,
    @Body() password: { password: string },
  ) {
    return this.recruiterService.setRecruiterPassword(
      recruiterId,
      recruiterToken,
      password,
    );
  }
}
