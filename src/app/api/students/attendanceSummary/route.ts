import { connectDB } from '@/lib/connectDB';
import { Attendances, Courses, Students } from '@/schemas';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

type StudentStatus = {
  name: string;
  regNo: string;
  present: number;
  total: number;
};

async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    await connectDB();

    if (!courseId) return NextResponse.json({ message: 'CourseId is not given' }, { status: 500 });

    const course = await Courses.findById(courseId).populate('semester');
    const students = await Students.find({ semester: course?.semester });
    if (students.length < 1) return NextResponse.json({ message: 'No students found in this course' }, { status: 404 });

    const attendances = await Attendances.find({
      course: courseId,
      student: { $in: students.map((student) => student._id) },
    }).populate('student');

    const attendanceSummaryMap = new Map(
      attendances.map((attendance) => {
        return [attendance.student._id.toString(), 0];
      })
    );

    const tempStudent = (students[0]._id as Types.ObjectId).toString();
    let total = 0;

    attendances.forEach((attendance) => {
      if (attendance.student._id.toString() === tempStudent) {
        total++;
      }
      if (attendance.status !== 'Present') return;

      const presentStatus = attendanceSummaryMap.get(attendance.student._id.toString());

      if (presentStatus) {
        attendanceSummaryMap.set(attendance.student._id.toString(), presentStatus + 1);
      } else if (!presentStatus) {
        attendanceSummaryMap.set(attendance.student._id.toString(), 1);
      }
    });

    const studentStatus: StudentStatus[] = [];
    students.forEach((student) => {
      studentStatus.push({
        name: student.name,
        regNo: student.regNo,
        present: attendanceSummaryMap.get((student._id as Types.ObjectId).toString()) || 0,
        total: total,
      });
    });

    return NextResponse.json(
      { students: studentStatus.sort((a, b) => a.regNo.localeCompare(b.regNo)) },
      { status: 200 }
    );
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    console.log(message);
    return NextResponse.json({ message }, { status: 500 });
  }
}

export { GET };
