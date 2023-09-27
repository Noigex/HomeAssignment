import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStudentDto, CreateStudentDto } from './dto';

@Injectable()
export class StudentsService {
  constructor(private prismaService: PrismaService) {}

  // Error handling is done globally in "prisma-client-exception.filter.ts" to avoid bloated service's code

  // GET '/students'

  async getStudents(year: number) {
    //  if query params 'year' is not provided on the request, its value is set to 0 (default) and the code will not execute filtering.
    //  If query params 'year' is provided on the request the code will execute filtering.

    const queryDetails = {
      include: {
        _count: {
          select: {
            courses: year === 0 ? true : { where: { year: year } },
          },
        },
      },
    };
    const allStudents = await this.prismaService.student.findMany(queryDetails);
    return allStudents;
  }

  // GET '/students/student_id'

  async getSpecificStudent(student_id: number, year: number) {
    //  if query params 'year' is not provided by the user, its value is set to 0 (default) and the code will not execute filtering.
    //  If query params 'year' is provided by the user the code will execute filtering.

    const queryDetails = {
      where: { student_id: student_id },
      include: {
        _count: {
          select: {
            courses: year === 0 ? true : { where: { year: year } },
          },
        },
      },
    };
    const student = await this.prismaService.student.findUnique(queryDetails);
    if (!student) {
      throw new NotFoundException(`Student id of ${student_id} not found`);
    }
    return student;
  }

  // POST '/students'

  async createStudent(dto: CreateStudentDto) {
    const newStudent = await this.prismaService.student.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        address: dto.address,
      },
    });
    if (!newStudent) {
      throw new NotFoundException(`Couldn't create a student`);
    }
    return newStudent;
  }

  // PUT '/students/student_id'

  async updateStudent(student_id: number, dto: UpdateStudentDto) {
    const updatedStudent = await this.prismaService.student.update({
      where: { student_id: student_id },
      data: { ...dto },
    });
    if (!updatedStudent) {
      throw new NotFoundException(`Student id of ${student_id} not found`);
    }
    return updatedStudent;
  }

  // DELETE '/students/student_id'

  async deleteStudent(student_id: number) {
    const AmountOfDeletedCourses = await this.prismaService.course.deleteMany({
      where: { studentId: student_id },
    });

    const deletedStudent = await this.prismaService.student.delete({
      where: { student_id: student_id },
    });
    if (!deletedStudent) {
      throw new NotFoundException(`Student id of ${student_id} not found`);
    }
    return {
      data: {
        deletedStudent,
        deletedCoursesAmount: AmountOfDeletedCourses?.count,
      },
    };
  }
}
