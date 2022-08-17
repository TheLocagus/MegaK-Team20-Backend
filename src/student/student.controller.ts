import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { GetOneStudentResponseInterface, ICheckStudentIfExist } from '../types';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user-obj.decorator';
import { Student } from './student.entity';

@Controller('api/student')
export class StudentController {
  constructor(@Inject(StudentService) private studentService: StudentService) {}

  @Get('/')
  @UseGuards(AuthGuard('student'))
  getOneStudent(
    @UserObj() student: Student,
  ): Promise<GetOneStudentResponseInterface> {
    return this.studentService.getOneStudent(student.id);
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

  @Patch('/')
  @UseGuards(AuthGuard('student'))
  patchStudent(
    @UserObj() student: Student,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.patchStudent(student.id, updateStudentDto);
  }
}
