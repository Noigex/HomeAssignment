import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  first_name?: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  last_name?: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;
}
