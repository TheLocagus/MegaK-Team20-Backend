import {
  IsEmail,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class AddRecruiterDto {
  @IsEmail({
    message: () => {
      throw new Error('Invalid email address');
    },
  })
  @MaxLength(128, {
    message: 'Max length must be less than 100 characters',
  })
  email: string;
  @IsString({
    message: 'It is not a string',
  })
  @MaxLength(100, {
    message: 'Max length must be less than 100 characters',
  })
  fullName: string;
  @IsString({
    message: 'It is not a string',
  })
  @MaxLength(100, {
    message: 'Max length must be less than 100 characters',
  })
  company: string;
  @IsNumber()
  @Min(1, {
    message: 'Min number of reserved students for recruiter must be 1',
  })
  @Max(999, {
    message: 'Max number of reserved students for recruiter must be 999',
  })
  maxReservedStudents: number;
}
