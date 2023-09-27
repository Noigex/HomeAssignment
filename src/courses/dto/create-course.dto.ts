import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  course_name: string;
  @IsNotEmpty()
  @IsInt()
  year: number;
  @IsNotEmpty()
  @IsInt()
  studentId: number;
}
