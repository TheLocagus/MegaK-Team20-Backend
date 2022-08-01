import {Body, Controller, Get, Inject, Param, Patch, Post} from '@nestjs/common';
import {StudentService} from "./student.service";
import {GetOneStudentResponseInterface} from "../types/student";
import {CreateStudentDto} from "../dto/create-student.dto";

@Controller('student')
export class StudentController {

    constructor(
        @Inject(StudentService) private studentService: StudentService,
    ) {

}

    @Get('/:id')
    getOneStudent(
        @Param('id') id: string,
    ): Promise<GetOneStudentResponseInterface> {
        return this.studentService.getOneStudent(id)
    }

    @Get('/register/:id/:registerToken')
    getOneStudentAndCompareToken(
        @Param('id') id: string,
        @Param('registerToken') registerToken: string,
    ) {
        return this.studentService.getOneStudentAndCompareToken(id, registerToken)
    }

    @Post('/register/:id')
    createStudent(
        @Param('id') id: string,
        @Body() createStudentDto: CreateStudentDto) {
        return this.studentService.createStudent(id, createStudentDto)
    }

    @Patch('/:id')
    patchStudent(
        @Param('id') id: string,
        @Body() createStudentDto: CreateStudentDto) {
        return this.studentService.createStudent(id, createStudentDto)
    }

}
