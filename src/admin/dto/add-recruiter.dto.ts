import {
  IsEmail,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class AddRecruiterDto {
  @IsEmail()
  // @MaxLength(100)
  email: string;
  @IsString()
  @MaxLength(100)
  fullName: string;
  @IsString()
  @MaxLength(100)
  company: string;
  @IsNumber()
  @Min(0)
  @Max(999)
  maxReservedStudents: number;
}
