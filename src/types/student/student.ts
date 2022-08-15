export interface StudentInterface {
  id: string;
  status: string;
  pwdHash: string;
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
  bonusProjectUrls: string;
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

export enum StudentTypeOfWorkEnum {
  naMiejscu = 'Na miejscu',
  gotowoscDoPrzeprowadzki = 'Gotowość do przeprowadzki',
  wylacznieZdalnie = 'Wyłącznie zdalnie',
  hybrydowo = 'Hybrydowo',
  bezZnaczenia = 'Bez znaczenia',
}

export enum ContractType {
  contractOfEmployment = 'contractOfEmployment',
  b2b = 'b2b',
  contractWork = 'contractWork',
  contractOfMandate = 'contractOfMandate',
  noPreference = 'noPreference',
}

export enum TypeWork {
  stationary = 'stationary',
  readyToMove = 'readyToMove',
  remotely = 'remotely',
  hybrid = 'hybrid',
  noPreference = 'noPreference',
}
