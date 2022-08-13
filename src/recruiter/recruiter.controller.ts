
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Redirect,
} from '@nestjs/common';

import { Body, Controller, Get, Param, Patch, Query, Post,
  Redirect } from '@nestjs/common';

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


  @Get('/for-interview')
  getForInterviewStudents() {
    return this.recruiterService.getForInterviewStudents();
  }

  @Get('/:numberOfPage/filter')
  filterListWithAllStudents(@Body() filters: FiltersDto) {
    return this.recruiterService.filterListWithAllStudents(filters);


  @Get('/:numberOfPage/:searchedPhrase')
  getAllWithSearchedPhrase(
    @Param('searchedPhrase') searchedPhrase: string,
    @Param('numberOfPage') numberOfPage: number,
  ) {
    return this.recruiterService.getAllWithSearchedPhrase(
      searchedPhrase,
      numberOfPage,
    );
  }

  @Get('/for-interview')
  getForInterviewStudents() {
    return this.recruiterService.getForInterviewStudents();
  }

  @Get('/cv/:id')
  getOneStudentCv(@Param('id') id: string): Promise<ISingleStudentCvResponse> {
    return this.recruiterService.getOneStudentCv(id);
  }

  @Get('/:pageNumber')
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

  @Patch('/:id')
  changeStatus(@Param('id') id: string, @Body() status: StatusResponse) {
    return this.recruiterService.changeStatus(id, status.status);
  }
}
