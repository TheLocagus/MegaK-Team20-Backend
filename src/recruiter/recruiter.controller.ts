import {Controller, Get} from '@nestjs/common';
import {RecruiterService} from "./recruiter.service";
import {StudentsDataHrView} from "../types";

@Controller('/recruiter')
export class RecruiterController {
    constructor(private readonly recruiterService: RecruiterService){}

    @Get()
    async getStudents(): Promise<StudentsDataHrView[]> {
        return this.recruiterService.getStudents();
    }
}
