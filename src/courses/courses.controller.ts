import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get('/')
  getCourses() {
    return this.coursesService.getCourses();
  }

  @Get('/:course_name')
  getSpecificCourse(@Param('course_name') course_name: string) {
    return this.coursesService.getSpecificCourse(course_name);
  }

  @Post('/')
  createCourse(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  @Put('/:course_name')
  updateCourse(
    @Param('course_name') course_name: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(course_name, dto);
  }

  @Delete('/:course_name')
  deleteCourse(@Param('course_name') course_name: string) {
    return this.coursesService.deleteCourse(course_name);
  }
}
