import { connectDB } from '@/lib/connectDB';
import Attendance from '@/schemas/attendance';
import { NextResponse, NextRequest } from 'next/server';

async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const attendanceDate = searchParams.get('attendanceDate');

    await connectDB();

    if (!courseId || !attendanceDate) {
      return NextResponse.json({ message: 'CourseId or AttendanceId is not given' }, { status: 500 });
    }

    const attendances = await Attendance.find({ course: courseId, date: attendanceDate });

    if (attendances.length > 0)
      return NextResponse.json({ message: 'Attendance already exist', attendances }, { status: 200 });

    return NextResponse.json({ message: `Attendance doesn't exist` }, { status: 200 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

export { GET };
