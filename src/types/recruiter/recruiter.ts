export interface RecruiterInterface {
  id: string;
  email: string;
  fullName: string;
  company: string;
  maxReservedStudents: number;
}

export interface AvailableStudentToListResponseInterface {
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
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
}

export interface IAvailableStudentToListResponse {
  availableStudents: AvailableStudentToListResponseInterface[];
  count: number;
  totalPages: number;
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
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  githubUsername: string;
  endOfReservation: Date;
}

export interface IForInterviewStudentToListResponse {
  studentsToTalk: ForInterviewStudentToListResponseInterface[];
  count: number;
  totalPages: number;
}

export interface ISingleStudentCvResponse {
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

export type ICheckRecruiterIfExist =
  | {
      success: true;
      id: string;
      role: 'recruiter';
    }
  | {
      success: false;
    };

export enum RecruiterActionsOfStatusEnum {
  noInterested = 'no-interested',
  forInterview = 'for-interview',
  employed = 'employed',
}
