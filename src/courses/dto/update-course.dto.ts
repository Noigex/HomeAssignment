import { IsInt, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  course_name?: string;
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  year?: number;
}
