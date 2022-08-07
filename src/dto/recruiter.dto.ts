import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class FiltersDto {
  @IsArray()
  activityRate: number[];

  @IsArray()
  codeRate: number[] | [];

  @IsArray()
  contractType: string[];

  @IsArray()
  courseRate: number[];

  @IsNumber()
  @IsOptional()
  experience: number | null;

  @IsBoolean()
  internship: boolean;

  @IsArray()
  salary: number[];

  @IsArray()
  teamWorkRate: number[];

  @IsArray()
  workPlace: string[];
}
