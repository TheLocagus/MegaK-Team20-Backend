import {ContractType, TypeWork} from "../student/student.entity";

export class CreateStudentDto {
    pwdHash: string;
    bio: string;
    canTakeApprenticeship: boolean;
    courses: string;
    education: string;
    expectedContractType: ContractType;
    expectedSalary: string;
    expectedTypeWork: TypeWork;
    firstName: string;
    githubUsername: string;
    lastName: string;
    monthsOfCommercialExp: number;
    projectUrls: string;
    portfolioUrls: string;
    targetWorkCity: string;
    telephone: string;
    workExperience: string;
}

export type UpdateStudentDto = CreateStudentDto;
