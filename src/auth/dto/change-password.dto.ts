import { IsString, IsUUID } from 'class-validator';

export class ChangePasswordDto {
  @IsUUID()
  id: string;
  @IsString()
  token: string;
  @IsString()
  role: string;
  @IsString()
  pwd: string;
}
