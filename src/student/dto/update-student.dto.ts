import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ContractType, TypeWork } from '../../types';

export class UpdateStudentDto {
  @IsOptional()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  @MaxLength(30)
  firstName: string;
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName: string;
  @IsOptional()
  @IsString()
  @MaxLength(39)
  githubUsername: string;
  @IsOptional()
  @IsString()
  projectUrls: string;
  @IsOptional()
  @IsEnum(TypeWork)
  expectedTypeWork: TypeWork;
  @IsOptional()
  @IsEnum(ContractType)
  expectedContractType: ContractType;
  @IsOptional()
  @IsBoolean()
  canTakeApprenticeship: boolean;
  @IsOptional()
  @IsNumber()
  monthsOfCommercialExp: number;
  @IsOptional()
  @IsPhoneNumber()
  telephone: string;
  @IsOptional()
  @IsString()
  portfolioUrls: string;
  @IsOptional()
  @IsString()
  bio: string;
  @IsOptional()
  @IsString()
  targetWorkCity: string;
  @IsOptional()
  @IsNumber()
  expectedSalary: number;
  @IsOptional()
  @IsString()
  education: string;
  @IsOptional()
  @IsString()
  workExperience: string;
  @IsOptional()
  @IsString()
  courses: string;
}
