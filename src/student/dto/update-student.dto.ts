import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends CreateStudentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
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
