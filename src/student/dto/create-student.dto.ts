import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ContractType, TypeWork } from '../../types';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  pwd?: string;
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
  @IsString()
  projectUrls: string;
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
}
