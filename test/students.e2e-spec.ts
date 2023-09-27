import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClientExceptionFilter } from '../src/prisma-client-exception/prisma-client-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { CreateStudentDto, UpdateStudentDto } from '../src/students/dto/index';

describe('StudentsController (e2e)', () => {
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

  describe('Get all students GET /students', () => {
    it('should return students', async () => {
      const expectedResponseBody = expect.arrayContaining([
        expect.objectContaining({
          student_id: expect.any(Number),
          first_name: expect.any(String),
          last_name: expect.any(String),
          address: expect.any(String),
          _count: expect.objectContaining({ courses: expect.any(Number) }),
        }),
      ]);

      const response = await request(app.getHttpServer())
        .get('/students')
        .expect(200);

      expect(response.body).toEqual(expectedResponseBody);
    });
  });

  describe('Get a specific student GET /students/:student_id', () => {
    it('Should return a student based on student_id params', async () => {
      const expectedResponseBody = {
        student_id: 1,
        first_name: 'seed-first-name',
        last_name: 'seed-last-name',
        address: 'seed-address',
        _count: { courses: 1 },
      };

      const response = await request(app.getHttpServer())
        .get(`/students/${1}`)
        .expect(200);

      expect(response.body).toEqual(expectedResponseBody);
    });

    it("Should return a 404 if student of student_id doesn't exist", async () => {
      return await request(app.getHttpServer())
        .get(`/students/${200}`)
        .expect(404);
    });
  });

  describe('Creating a new student POST /students', () => {
    it('Should create a new student', async () => {
      const payload: CreateStudentDto = {
        address: 'test-address',
        first_name: 'test-first-name',
        last_name: 'test-last-name',
      };
      const response = await request(app.getHttpServer())
        .post('/students')
        .send(payload)
        .expect(201);

      expect(response.body.first_name).toBe('test-first-name');
      expect(response.body.last_name).toBe('test-last-name');
      expect(response.body.address).toBe('test-address');
      expect(response.body.student_id).toStrictEqual(expect.any(Number));
    });

    it('Should return a 400 when first_name is undefined', async () => {
      const payload: CreateStudentDto = {
        address: 'test-address',
        first_name: '',
        last_name: 'test-last-name',
      };
      return await request(app.getHttpServer())
        .post('/students')
        .send(payload)
        .expect(400);
    });

    it('Should return a 400 when first_name is not a string', async () => {
      const payload = {
        address: 'test-address',
        first_name: 1,
        last_name: 'test-last-name',
      };
      return await request(app.getHttpServer())
        .post('/students')
        .send(payload)
        .expect(400);
    });

    it('Should return a 400 when last_name is undefined', async () => {
      const payload: CreateStudentDto = {
        address: 'test-address',
        first_name: 'test-first-name',
        last_name: '',
      };
      return await request(app.getHttpServer())
        .post('/students')
        .send(payload)
        .expect(400);
    });
    it('Should return a 400 when last_name is not a string', async () => {
      const payload = {
        address: 'test-address',
        first_name: 'test-first-name',
        last_name: 1,
      };
      return await request(app.getHttpServer())
        .post('/students')
        .send(payload)
        .expect(400);
    });

    it('Should return a 400 when address is undefined', async () => {
      const payload: CreateStudentDto = {
        address: '',
        first_name: 'test-first-name',
        last_name: 'test-last-name',
      };
      return await request(app.getHttpServer())
        .post('/students')
        .send(payload)
        .expect(400);
    });
    it('Should return a 400 when address is not a string', async () => {
      const payload = {
        address: 1,
        first_name: 'test-first-name',
        last_name: 'test-last-name',
      };
      return await request(app.getHttpServer())
        .post('/students')
        .send(payload)
        .expect(400);
    });
  });

  describe('Update a student PUT /students/:student_id', () => {
    it('Should update a student', async () => {
      const payload: UpdateStudentDto = {
        first_name: 'changed-first-name',
        last_name: 'changed-last-name',
        address: 'changed-address',
      };

      const response = await request(app.getHttpServer())
        .put(`/students/${1}`)
        .send(payload)
        .expect(200);

      expect(response.body.first_name).toBe('changed-first-name');
      expect(response.body.last_name).toBe('changed-last-name');
      expect(response.body.address).toBe('changed-address');
      expect(response.body.student_id).toBe(1);
    });
    it('Should return a 400 when first_name is undefined', async () => {
      const payload: UpdateStudentDto = {
        address: 'test-address',
        first_name: '',
        last_name: 'test-last-name',
      };
      return await request(app.getHttpServer())
        .put(`/students/${1}`)
        .send(payload)
        .expect(400);
    });
    it('Should return a 400 when first_name is not a string', async () => {
      const payload = {
        address: 'test-address',
        first_name: 1,
        last_name: 'test-last-name',
      };
      return await request(app.getHttpServer())
        .put(`/students/${1}`)
        .send(payload)
        .expect(400);
    });

    it('Should return a 400 when last_name is undefined', async () => {
      const payload: UpdateStudentDto = {
        address: 'test-address',
        first_name: 'test-first-name',
        last_name: '',
      };
      return await request(app.getHttpServer())
        .put(`/students/${1}`)
        .send(payload)
        .expect(400);
    });
    it('Should return a 400 when last_name is not a string', async () => {
      const payload = {
        address: 'test-address',
        first_name: 'test-first-name',
        last_name: 2,
      };
      return await request(app.getHttpServer())
        .put(`/students/${1}`)
        .send(payload)
        .expect(400);
    });

    it('Should return a 400 when address is undefined', async () => {
      const payload: UpdateStudentDto = {
        address: '',
        first_name: 'test-first-name',
        last_name: 'test-last-name',
      };
      return await request(app.getHttpServer())
        .put(`/students/${1}`)
        .send(payload)
        .expect(400);
    });
    it('Should return a 400 when address is not a string', async () => {
      const payload = {
        address: 1,
        first_name: 'test-first-name',
        last_name: 'test-last-name',
      };
      return await request(app.getHttpServer())
        .put(`/students/${1}`)
        .send(payload)
        .expect(400);
    });
    it("Should return a 404 if student of student_id doesn't exist", async () => {
      return await request(app.getHttpServer())
        .put(`/students/${200}`)
        .expect(404);
    });
  });

  describe('Delete a student DELETE /students/:student_id', () => {
    it('Should delete a student and its courses', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/students/${1}`)
        .expect(200);
      expect(response.body).toEqual({
        data: {
          deletedStudent: {
            student_id: 1,
            first_name: 'changed-first-name',
            last_name: 'changed-last-name',
            address: 'changed-address',
          },
          deletedCoursesAmount: 1,
        },
      });
    });
    it("Should return a 404 if student of student_id doesn't exist", async () => {
      return await request(app.getHttpServer())
        .delete(`/students/${200}`)
        .expect(404);
    });
  });
});
