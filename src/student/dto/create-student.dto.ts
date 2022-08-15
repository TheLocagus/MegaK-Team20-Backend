import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ContractType, TypeWork } from '../../types';

export class CreateStudentDto {
  @IsUUID('4')
  id: string;
  @IsNotEmpty()
  @IsString()
  registerToken: string;
  @IsNotEmpty()
  @IsString()
  pwd: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  firstName: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(39)
  githubUsername: string;
  @IsNotEmpty()
  @IsArray()
  projectUrls: string[];
  @IsNotEmpty()
  @IsEnum(TypeWork)
  expectedTypeWork: TypeWork;
  @IsNotEmpty()
  @IsEnum(ContractType)
  expectedContractType: ContractType;
  @IsNotEmpty()
  @IsBoolean()
  canTakeApprenticeship: boolean;
  @IsNotEmpty()
  @IsNumber()
  monthsOfCommercialExp: number;

  @IsString()
  @IsOptional()
  telephone: string;

  @IsArray()
  @IsOptional()
  portfolioUrls: string[];

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  targetWorkCity: string;

  @IsNumber()
  @IsOptional()
  expectedSalary: number;

  @IsString()
  @IsOptional()
  education: string;

  @IsString()
  @IsOptional()
  workExperience: string;

  @IsString()
  @IsOptional()
  courses: string;
}
