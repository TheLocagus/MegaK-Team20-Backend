import { ContractType, StudentTypeOfWorkEnum } from '../enums/student.enum';

export class StudentDto {
  id?: string;
  token: string;
  isActive: boolean;
  status: boolean;
  // role: Student
  email: string;
  tel: string;
  firstName: string;
  lastName: string;
  githubUsername: string;
  portfolioUrls: string;
  projectUrls: string;
  bio: string;
  expectedTypeWork: StudentTypeOfWorkEnum;
  targetWorkCity: string;
  expectedContractType: ContractType;
  expectedSalary: string;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
  education: string;
  workExperience: string;
  courses: string;
}
