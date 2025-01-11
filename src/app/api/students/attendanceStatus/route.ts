import { connectDB } from '@/lib/connectDB';
import Attendance from '@/schemas/attendance';
import Courses from '@/schemas/courses';
import Students from '@/schemas/students';
import { NextResponse, NextRequest } from 'next/server';

type StudentStatus = {
  attendanceId: string | null;
  studentId: string;
  name: string;
  regNo: string;
  status: string;
};

async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const attendanceDate = searchParams.get('attendanceDate');

    await connectDB();

    if (!courseId) {
      return NextResponse.json({ message: 'CourseId or AttendanceId is not given' }, { status: 500 });
    }

    const course = await Courses.findById(courseId).populate('semester');
    const students = await Students.find({ semester: course.semester });
    const studentStatus: StudentStatus[] = [];

    const attendances = await Attendance.find({
      course: courseId,
      date: attendanceDate,
      student: { $in: students.map((student) => student._id) },
    }).populate('student');

    const attendanceMap = new Map(attendances.map((attendance) => [attendance.student._id, attendance.status]));

    students.map((student) => {
      const attendanceStatus = attendanceMap.get(student._id);
      studentStatus.push({
        attendanceId: attendanceStatus ? student._id : null,
        studentId: student._id,
        name: student.name,
        regNo: student.regNo,
        status: attendanceStatus || 'absent',
      });
    });

    return NextResponse.json({ studentStatusList: studentStatus, course }, { status: 200 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

async function POST() {}

export { GET, POST };
