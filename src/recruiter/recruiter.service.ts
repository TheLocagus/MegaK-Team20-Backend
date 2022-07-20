import { Injectable } from '@nestjs/common';
import * as STUDENTS_RESPONSE from '../utils/students/students-for-hr-view.json'
import {StudentsDataHrView} from "../types";

@Injectable()
export class RecruiterService {
    getStudents(): StudentsDataHrView[] {
        return STUDENTS_RESPONSE;
    }
}
