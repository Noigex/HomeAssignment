-- CreateTable
CREATE TABLE "Student" (
    "student_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "Course" (
    "course_name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_course_name_key" ON "Course"("course_name");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;
