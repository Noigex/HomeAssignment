import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { UpdateStudentDto, CreateStudentDto } from './dto';

@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get('/')
  getStudents(
    @Query('year', new DefaultValuePipe(0), ParseIntPipe) year?: number,
  ) {
    return this.studentsService.getStudents(year);
  }

  @Get(':student_id')
  getSpecificStudent(
    @Param('student_id', ParseIntPipe) student_id: number,
    @Query('year', new DefaultValuePipe(0), ParseIntPipe) year?: number,
  ) {
    return this.studentsService.getSpecificStudent(student_id, year);
  }

  @Post('/')
  createStudent(@Body() dto: CreateStudentDto) {
    return this.studentsService.createStudent(dto);
  }

  @Put(':student_id')
  updateStudent(
    @Param('student_id', ParseIntPipe) student_id: number,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.updateStudent(student_id, dto);
  }

  @Delete(':student_id')
  deleteStudent(@Param('student_id', ParseIntPipe) student_id: number) {
    return this.studentsService.deleteStudent(student_id);
  }
}
