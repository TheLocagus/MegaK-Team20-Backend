import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class FiltersDto {
  @IsArray()
  @IsOptional()
  activityRate: number[];

  @IsArray()
  @IsOptional()
  codeRate: number[] | [];

  @IsArray()
  @IsOptional()
  contractType: string[];

  @IsArray()
  @IsOptional()
  courseRate: number[];

  @IsNumber()
  @IsOptional()
  experience: number | null;

  @IsBoolean()
  @IsOptional()
  internship: boolean;

  @IsArray()
  @IsOptional()
  salary: number[];

  @IsArray()
  @IsOptional()
  teamWorkRate: number[];

  @IsArray()
  @IsOptional()
  workPlace: string[];
}
