import { ContractType, TypeWork } from '../../enums/student.enum';

export interface StudentInterface {
  id: string;
  status: string;
  pwdHash: string;
  currentTokenId: string | null;
  recruiterId: object;
  telephone: string;
  firstName: string;
  lastName: string;
  githubUsername: string;
  portfolioUrls: string;
  projectUrls: string;
  bio: string;
  expectedTypeWork: string;
  expectedSalary: number;
  targetWorkCity: string;
  expectedContractType: string;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
  education: string;
  workExperience: string;
  courses: string;
  studentImport: object;
  endOfReservation: Date | null;
}

export interface GetOneStudentResponseInterface {
  bio: string;
  canTakeApprenticeship: boolean;
  courses: string;
  education: string;
  expectedContractType: string;
  expectedSalary: number;
  expectedTypeWork: string;
  firstName: string;
  githubUsername: string;
  lastName: string;
  monthsOfCommercialExp: number;
  portfolioUrls: string;
  targetWorkCity: string;
  telephone: string;
  workExperience: string;
  projectUrls: string;
  teamProjectDegree: number;
  projectDegree: number;
  courseEngagement: number;
  courseCompletion: number;
}

export interface AvailableStudentToListResponseInterface {
  id: string;
  status: string;
  firstName: string;
  lastName: string;
  expectedTypeWork: string;
  targetWorkCity: string;
  expectedContractType: string;
  expectedSalary: number;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
}

export interface StudentCvInterface {
  firstName: string;
  lastName: string;
  bio: string;
  githubUsername: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: string;
  projectUrls: string;
  portfolioUrls: string | null;
  expectedTypeWork: string;
  targetWorkCity: string;
  expectedContractType: string;
  expectedSalary: string | number;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
  education: string;
  workExperience: string;
  courses: string;
  email: string;
  telephone: string;
}
export interface ForInterviewStudentToListResponseInterface {
  id: string;
  firstName: string;
  lastName: string;
  expectedTypeWork: string;
  targetWorkCity: string;
  expectedContractType: string;
  expectedSalary: number;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
  courseCompletion: number;
  courseEngagment: number;
  projectDegree: number;
  teamProjectDegree: number;
  githubUsername: string;
  endOfReservation: Date;
  avatarUrl: string;
}

export interface CreateStudentResponse {
  pwdHash: string;
  bio: string;
  canTakeApprenticeship: boolean;
  courses: string;
  education: string;
  expectedContractType: ContractType;
  expectedSalary: number;
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

export type ICheckStudentIfExist =
  | {
      success: true;
      id: string;
      registerToken: string;
      role: 'student';
    }
  | {
      success: false;
    };
