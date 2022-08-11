import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { GetOneStudentResponseInterface, ICheckStudentIfExist } from '../types';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('student')
export class StudentController {
  constructor(@Inject(StudentService) private studentService: StudentService) {}

  @Get('/:id')
  getOneStudent(
    @Param('id') id: string,
  ): Promise<GetOneStudentResponseInterface> {
    return this.studentService.getOneStudent(id);
  }

  @Get('/register/:id/:registerToken')
  getOneStudentAndCompareToken(
    @Param('id') id: string,
    @Param('registerToken') registerToken: string,
  ): Promise<ICheckStudentIfExist> {
    return this.studentService.getOneStudentAndCompareToken(id, registerToken);
  }

  @Post('/')
  createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.createStudent(createStudentDto);
  }

  @Patch('/:id')
  patchStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.patchStudent(id, updateStudentDto);
  }
}
