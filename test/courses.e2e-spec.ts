import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClientExceptionFilter } from '../src/prisma-client-exception/prisma-client-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { CreateCourseDto, UpdateCourseDto } from '../src/courses/dto/index';

describe('CoursesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Get all courses GET /courses', () => {
    it('should return courses', async () => {
      const expectedResponseBody = expect.arrayContaining([
        expect.objectContaining({
          studentId: expect.any(Number),
          course_name: expect.any(String),
          year: expect.any(Number),
        }),
      ]);

      const response = await request(app.getHttpServer())
        .get('/courses')
        .expect(200);

      expect(response.body).toEqual(expectedResponseBody);
    });
  });

  describe('Get a specific course GET /courses/:course_name', () => {
    it('Should return a course based on course_name params', async () => {
      const expectedResponseBody = {
        studentId: 2,
        course_name: 'seed2-course-name',
        year: 2023,
      };

      const response = await request(app.getHttpServer())
        .get(`/courses/seed2-course-name`)
        .expect(200);

      expect(response.body).toEqual(expectedResponseBody);
    });

    it("Should return a 404 if course of course_name doesn't exist", async () => {
      return await request(app.getHttpServer())
        .get(`/courses/courseThatDoesntExist`)
        .expect(404);
    });
  });

  describe('Creating a new course POST /courses', () => {
    it('Should create a new course', async () => {
      const payload: CreateCourseDto = {
        studentId: 2,
        course_name: 'test-course-name',
        year: 2016,
      };
      const response = await request(app.getHttpServer())
        .post('/courses')
        .send(payload)
        .expect(201);

      expect(response.body).toEqual(payload);
    });

    it('Should return a 400 when studentId is undefined', async () => {
      const payload = {
        studentId: '',
        course_name: 'test-course-name',
        year: 2023,
      };
      return await request(app.getHttpServer())
        .post('/courses')
        .send(payload)
        .expect(400);
    });

    it('Should return a 400 when studentId is not a number', async () => {
      const payload = {
        studentId: 'test',
        course_name: 'test-course-name',
        year: 2023,
      };
      return await request(app.getHttpServer())
        .post('/courses')
        .send(payload)
        .expect(400);
    });

    it('Should return a 400 when year is undefined', async () => {
      const payload = {
        studentId: 1,
        course_name: 'test-course-name',
        year: '',
      };
      return await request(app.getHttpServer())
        .post('/courses')
        .send(payload)
        .expect(400);
    });

    it('Should return a 400 when year is not a number', async () => {
      const payload = {
        studentId: 'test',
        course_name: 'test-course-name',
        year: 'test year',
      };
      return await request(app.getHttpServer())
        .post('/courses')
        .send(payload)
        .expect(400);
    });

    it('Should return a 400 when course_name is undefined', async () => {
      const payload = {
        studentId: 1,
        course_name: '',
        year: 2023,
      };
      return await request(app.getHttpServer())
        .post('/courses')
        .send(payload)
        .expect(400);
    });
    it('Should return a 400 when course_name is not a string', async () => {
      const payload = {
        studentId: 1,
        course_name: 3,
        year: 2023,
      };
      return await request(app.getHttpServer())
        .post('/courses')
        .send(payload)
        .expect(400);
    });
  });

  describe('Update a student PUT /courses/:course_name', () => {
    it('Should update a course based on course_name params', async () => {
      const payload: UpdateCourseDto = {
        course_name: 'changed-course-name',
        year: 2018,
      };

      const response = await request(app.getHttpServer())
        .put(`/courses/seed2-course-name`)
        .send(payload)
        .expect(200);

      expect(response.body.course_name).toBe('changed-course-name');
      expect(response.body.year).toBe(2018);
      expect(response.body.studentId).toBe(2);
    });
    it('Should return a 400 when year is undefined', async () => {
      const payload = {
        course_name: 'test-course-name',
        year: '',
      };
      return await request(app.getHttpServer())
        .post('/courses')
        .send(payload)
        .expect(400);
    });

    it('Should return a 400 when year is not a number', async () => {
      const payload = {
        course_name: 'test-course-name',
        year: 'test year',
      };
      return await request(app.getHttpServer())
        .post('/courses')
        .send(payload)
        .expect(400);
    });

    it('Should return a 400 when course_name is undefined', async () => {
      const payload = {
        course_name: '',
        year: 2023,
      };
      return await request(app.getHttpServer())
        .post('/courses')
        .send(payload)
        .expect(400);
    });
    it('Should return a 400 when course_name is not a string', async () => {
      const payload = {
        course_name: 3,
        year: 2023,
      };
      return await request(app.getHttpServer())
        .post('/courses')
        .send(payload)
        .expect(400);
    });
    it("Should return a 404 if course of course_name doesn't exist", async () => {
      return await request(app.getHttpServer())
        .get(`/courses/courseThatDoesntExist`)
        .expect(404);
    });
  });

  describe('Delete a student DELETE /courses/:course_name', () => {
    it('Should delete a course based on course_name params', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/courses/test-course-name`)
        .expect(200);
      expect(response.body).toEqual({
        course_name: 'test-course-name',
        year: 2016,
        studentId: 2,
      });
    });
    it("Should return a 404 if student of student_id doesn't exist", async () => {
      return await request(app.getHttpServer())
        .delete(`/courses/${200}`)
        .expect(404);
    });
  });
});
