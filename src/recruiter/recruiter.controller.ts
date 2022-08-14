import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RecruiterService } from './recruiter.service';
import { FiltersDto } from '../dto/recruiter.dto';
import {
  IAvailableStudentToListResponse,
  ICheckRecruiterIfExist,
  ISingleStudentCvResponse,
  RecruiterActionsOfStatusEnum,
} from '../types';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user-obj.decorator';
import { Recruiter } from './recruiter.entity';

export interface StatusResponse {
  status: RecruiterActionsOfStatusEnum;
}

@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @Get('/all/:pageNumber')
  @UseGuards(AuthGuard('recruiter'))
  getAllStudents(
    @UserObj() recruiter: Recruiter,
    @Param('pageNumber')
    pageNumber: string,
  ): Promise<IAvailableStudentToListResponse> {
    return this.recruiterService.getAllStudents(
      recruiter.id,
      Number(pageNumber),
    );
  }

  @Get('/for-interview')
  @UseGuards(AuthGuard('recruiter'))
  getForInterviewStudents(@UserObj() recruiter: Recruiter) {
    return this.recruiterService.getForInterviewStudents(recruiter.id);
  }

  @Post('/:numberOfPage/filter')
  @UseGuards(AuthGuard('recruiter'))
  filterListWithAllStudents(
    @Body() filters: FiltersDto,
    @Param('numberOfPage') numberOfPage: number,
  ) {
    return this.recruiterService.filterListWithAllStudents(
      filters,
      numberOfPage,
    );
  }

  @Get('/cv/:id')
  @UseGuards(AuthGuard('recruiter'))
  getOneStudentCv(
    @UserObj() recruiter: Recruiter,
    @Param('id')
    id: string,
  ): Promise<ISingleStudentCvResponse> {
    return this.recruiterService.getOneStudentCv(recruiter.id, id);
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

  @Get('/data')
  @UseGuards(AuthGuard('recruiter'))
  getDataOfLoggedRecruiter(@UserObj() recruiter: Recruiter) {
    return this.recruiterService.getDataOfLoggedRecruiter(recruiter.id);
  }

  @Patch('/status/:studentId')
  @UseGuards(AuthGuard('recruiter'))
  changeStatus(
    @Param('studentId')
    studentId: string,
    @UserObj() recruiter: Recruiter,
    @Body()
    status: StatusResponse,
  ) {
    return this.recruiterService.changeStatus(
      studentId,
      recruiter.id,
      status.status,
    );
  }

  @Get('/:numberOfPage/:searchedPhrase')
  @UseGuards(AuthGuard('recruiter'))
  getAllWithSearchedPhrase(
    @UserObj() recruiter: Recruiter,
    @Param('searchedPhrase')
    searchedPhrase: string,
    @Param('numberOfPage')
    numberOfPage: number,
  ) {
    return this.recruiterService.getAllWithSearchedPhrase(
      recruiter.id,
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
