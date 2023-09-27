import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@Injectable()
export class CoursesService {
  constructor(private prismaService: PrismaService) {}

  // Error handling is done globally in "prisma-client-exception.filter.ts" to avoid bloated service's code

  // GET '/courses'

  async getCourses() {
    const allCourses = await this.prismaService.course.findMany();
    return allCourses;
  }

  // GET '/courses/course_name'

  async getSpecificCourse(course_name: string) {
    const specificCourse = await this.prismaService.course.findUnique({
      where: { course_name: course_name },
    });
    if (!specificCourse) {
      throw new NotFoundException(
        `Course name of the name: ${course_name} not found`,
      );
    }
    return specificCourse;
  }

  // POST '/courses'

  async createCourse(dto: CreateCourseDto) {
    const newCourse = await this.prismaService.course.create({
      data: {
        course_name: dto.course_name,
        year: dto.year,
        studentId: dto.studentId,
      },
    });
    if (!newCourse) {
      throw new NotFoundException(`Couldn't create a course`);
    }
    return newCourse;
  }

  // PUT '/courses/course_name'

  async updateCourse(course_name: string, dto: UpdateCourseDto) {
    const updatedCourse = await this.prismaService.course.update({
      where: { course_name: course_name },
      data: { ...dto },
    });
    if (!updatedCourse) {
      throw new NotFoundException(
        `Course name of the name: ${course_name} not found`,
      );
    }
    return updatedCourse;
  }

  // DELETE '/courses/course_name

  async deleteCourse(course_name: string) {
    const deletedCourse = await this.prismaService.course.delete({
      where: { course_name: course_name },
    });
    if (!deletedCourse) {
      throw new NotFoundException(
        `Course name of the name: ${course_name} not found`,
      );
    }
    return deletedCourse;
  }
}
