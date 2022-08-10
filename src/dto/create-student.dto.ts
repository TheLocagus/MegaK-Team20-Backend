
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {ContractType, TypeWork} from "../enums/student.enum";

export class CreateStudentDto {
  @IsString()
  pwdHash: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsBoolean()
  canTakeApprenticeship: boolean;

  @IsOptional()
  @IsString()
  courses: string;

  @IsOptional()
  @IsString()
  education: string;

  @IsEnum(ContractType)
  expectedContractType: ContractType;

  @IsOptional()
  @IsNumber()
  expectedSalary: number;

  @IsEnum(TypeWork)
  expectedTypeWork: TypeWork;

  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  githubUsername: string;

  @IsString()
  lastName: string;

  @IsNumber()
  monthsOfCommercialExp: number;

  @IsOptional()
  @IsArray()
  projectUrls: string[];

  @IsOptional()
  @IsArray()
  portfolioUrls: string[];

  @IsOptional()
  @IsString()
  targetWorkCity: string;

  @IsOptional()
  @IsString()
  telephone: string;

  @IsOptional()
  @IsString()
  workExperience: string;
}

export class UpdateStudentDto {
  @IsString()
  bio: string;

  @IsBoolean()
  canTakeApprenticeship: boolean;

  @IsString()
  courses: string;

  @IsString()
  education: string;

  @IsOptional()
  @IsEnum(ContractType)
  expectedContractType: ContractType;

  @IsNumber()
  expectedSalary: number;

  @IsOptional()
  @IsEnum(TypeWork)
  expectedTypeWork: TypeWork;

  @IsString()
  firstName: string;

  @IsString()
  githubUsername: string;

  @IsString()
  lastName: string;

  @IsNumber()
  monthsOfCommercialExp: number;

  @IsArray()
  projectUrls: string[];

  @IsArray()
  portfolioUrls: string[];

  @IsString()
  targetWorkCity: string;

  @IsString()
  telephone: string;

  @IsString()
  workExperience: string;
}
