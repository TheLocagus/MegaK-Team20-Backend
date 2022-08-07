import { IsArray, IsBoolean, IsNumber } from 'class-validator';

export class FiltersDto {
  @IsArray()
  activityRate: number[];

  @IsArray()
  codeRate: number[];

  @IsArray()
  contractType: string[];

  @IsArray()
  courseRate: number[];

  @IsNumber()
  experience: number;

  @IsBoolean()
  internship: boolean;

  @IsArray()
  salary: number[];

  @IsArray()
  teamWorkRate: number[];

  @IsArray()
  workPlace: string[];
}
