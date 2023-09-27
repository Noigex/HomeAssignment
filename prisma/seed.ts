import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const seedStudent1 = await prisma.student.upsert({
    where: { student_id: 1 },
    update: {},
    create: {
      first_name: 'seed-first-name',
      last_name: 'seed-last-name',
      address: 'seed-address',
      courses: {
        create: {
          course_name: 'seed-course-name',
          year: 2023,
        },
      },
    },
  });

  const seedStudent2 = await prisma.student.upsert({
    where: { student_id: 2 },
    update: {},
    create: {
      first_name: 'seed2-first-name',
      last_name: 'seed2-last-name',
      address: 'seed2-address',
      courses: {
        create: {
          course_name: 'seed2-course-name',
          year: 2023,
        },
      },
    },
  });

  console.log({ seedStudent1, seedStudent2 });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
