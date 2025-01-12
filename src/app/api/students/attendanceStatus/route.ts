import { connectDB } from '@/lib/connectDB';
import { Attendances, Courses, Semesters, Students } from '@/schemas';
import { Types } from 'mongoose';
import { NextResponse, NextRequest } from 'next/server';

type StudentStatus = {
  attendanceId: string | null;
  studentId: string;
  name: string;
  regNo: string;
  status: 'Present' | 'Absent';
};

async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const attendanceDate = searchParams.get('attendanceDate');

    await connectDB();

    if (!courseId) return NextResponse.json({ message: 'CourseId or AttendanceId is not given' }, { status: 500 });

    await Semesters.findById(courseId);
    const course = await Courses.findById(courseId).populate('semester');
    const students = await Students.find({ semester: course?.semester });
    const studentStatus: StudentStatus[] = [];

    const attendances = await Attendances.find({
      course: courseId,
      date: attendanceDate,
      student: { $in: students.map((student) => student._id) },
    }).populate('student');

    const attendanceMap = new Map(
      attendances.map((attendance) => [
        attendance.student._id.toString(),
        { id: attendance._id, status: attendance.status },
      ])
    );

    students.map((student) => {
      const attendanceIdStatus = attendanceMap.get((student._id as Types.ObjectId).toString());
      studentStatus.push({
        attendanceId: attendanceIdStatus ? (attendanceIdStatus.id as Types.ObjectId).toString() : null,
        studentId: (student._id as Types.ObjectId).toString(),
        name: student.name,
        regNo: student.regNo,
        status: attendanceIdStatus?.status || 'Absent',
      });
    });

    return NextResponse.json({ studentStatusList: studentStatus, course }, { status: 200 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const attendanceDate = searchParams.get('attendanceDate');

    if (!courseId) return NextResponse.json({ message: 'CourseId or AttendanceId is not given' }, { status: 500 });

    const studentStatusList: StudentStatus[] = await req.json();

    await connectDB();

    const newAttendances = [];
    const updates: Record<string, string[]> = {};

    for (const studentStatus of studentStatusList) {
      if (!studentStatus.attendanceId) {
        newAttendances.push({
          course: courseId,
          date: attendanceDate,
          student: studentStatus.studentId,
          status: studentStatus.status,
        });
      } else {
        if (!updates[studentStatus.status]) {
          updates[studentStatus.status] = [];
        }
        updates[studentStatus.status].push(studentStatus.attendanceId);
      }
    }

    if (newAttendances.length > 0) {
      await Attendances.insertMany(newAttendances);
    }

    for (const [status, attendanceIds] of Object.entries(updates)) {
      await Attendances.updateMany({ _id: { $in: attendanceIds } }, { $set: { status } });
    }

    return NextResponse.json({ message: `New:${newAttendances.length}, Updated:${updates.length}` }, { status: 200 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

export { GET, POST };
